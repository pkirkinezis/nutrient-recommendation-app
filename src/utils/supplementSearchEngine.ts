import { Supplement } from '../types';
import {
  getKnowledgeBenefitSearchTerms,
  getKnowledgeSafetySearchTerms,
  getSupplementKnowledgeById,
} from '../data/supplementKnowledge';
import { normalizeGoals, normalizeSystems } from './normalization';

export interface SupplementSearchOptions {
  gender?: 'male' | 'female' | 'other';
  goal?: string;
}

export interface SearchMatchReason {
  code: string;
  label: string;
}

export interface ScoredSupplementMatch {
  supplement: Supplement;
  score: number;
  reasons: SearchMatchReason[];
  textScore: number;
  goalScore: number;
}

const STOP_TOKENS = new Set([
  'and',
  'for',
  'the',
  'with',
  'from',
  'that',
  'this',
  'your',
  'my',
  'any',
  'all',
  'help',
  'support',
]);

const SAFETY_INTENT_TOKENS = new Set([
  'safe',
  'safety',
  'risk',
  'risky',
  'warning',
  'warnings',
  'contraindication',
  'contraindications',
  'interaction',
  'interactions',
  'avoid',
  'pregnancy',
  'pregnant',
  'breastfeeding',
  'lactation',
  'side',
  'effect',
  'effects',
]);

const FERTILITY_TOKENS = new Set([
  'fertility',
  'conception',
  'pregnancy',
  'pregnant',
  'ovulation',
  'sperm',
  'reproductive',
  'libido',
]);

const normalizeSearchText = (value: string): string =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\s+/g, ' ');

const tokenize = (value: string): string[] =>
  normalizeSearchText(value)
    .split(' ')
    .filter(Boolean);

const containsToken = (terms: string[], token: string): boolean =>
  terms.some((term) => term.includes(token));

const levenshteinDistance = (a: string, b: string): number => {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;

  const matrix = Array.from({ length: a.length + 1 }, () => Array<number>(b.length + 1).fill(0));
  for (let i = 0; i <= a.length; i++) matrix[i][0] = i;
  for (let j = 0; j <= b.length; j++) matrix[0][j] = j;

  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }

  return matrix[a.length][b.length];
};

const similarity = (a: string, b: string): number =>
  1 - levenshteinDistance(a, b) / Math.max(a.length, b.length, 1);

const addReason = (reasons: SearchMatchReason[], seen: Set<string>, code: string, label: string): void => {
  if (seen.has(code)) return;
  seen.add(code);
  reasons.push({ code, label });
};

export function isSafetyIntentQuery(query: string): boolean {
  const tokens = tokenize(query);
  return tokens.some((token) => SAFETY_INTENT_TOKENS.has(token));
}

export function getSupplementSearchCandidates(supplement: Supplement): string[] {
  const knowledge = getSupplementKnowledgeById(supplement.id);
  const candidates = new Set<string>();
  candidates.add(supplement.name.toLowerCase());
  candidates.add(supplement.id.toLowerCase().replace(/-/g, ' '));
  for (const alias of knowledge?.aliases || []) {
    candidates.add(alias.toLowerCase());
  }
  return Array.from(candidates);
}

const getBestTextMatch = (
  query: string,
  values: string[]
): { kind: 'exact' | 'prefix' | 'contains' | 'fuzzy' | 'none'; value: string } => {
  if (!query) return { kind: 'none', value: '' };
  const normalizedValues = values
    .map((value) => ({ raw: value, normalized: normalizeSearchText(value) }))
    .filter((value) => value.normalized.length > 0);

  const exact = normalizedValues.find((value) => value.normalized === query);
  if (exact) return { kind: 'exact', value: exact.raw };

  const prefix = normalizedValues.find((value) => value.normalized.startsWith(query));
  if (prefix) return { kind: 'prefix', value: prefix.raw };

  const contains = normalizedValues.find((value) => value.normalized.includes(query));
  if (contains) return { kind: 'contains', value: contains.raw };

  if (query.length < 4) return { kind: 'none', value: '' };

  let bestScore = 0;
  let bestValue = '';
  for (const value of normalizedValues) {
    const score = similarity(query, value.normalized);
    if (score > bestScore) {
      bestScore = score;
      bestValue = value.raw;
    }
  }

  if (bestScore >= 0.82) {
    return { kind: 'fuzzy', value: bestValue };
  }

  return { kind: 'none', value: '' };
};

const scoreTextMatch = (
  kind: 'exact' | 'prefix' | 'contains' | 'fuzzy' | 'none',
  weights: { exact: number; prefix: number; contains: number; fuzzy: number }
): number => {
  if (kind === 'exact') return weights.exact;
  if (kind === 'prefix') return weights.prefix;
  if (kind === 'contains') return weights.contains;
  if (kind === 'fuzzy') return weights.fuzzy;
  return 0;
};

const formatIdLabel = (value: string): string => value.replace(/-/g, ' ');

export function searchSupplementsWithScores(
  query: string,
  supplements: Supplement[],
  options: SupplementSearchOptions = {}
): ScoredSupplementMatch[] {
  const normalizedQuery = normalizeSearchText(query);
  const queryTokens = tokenize(query).filter((token) => token.length > 1 && !STOP_TOKENS.has(token));
  const queryGoalIds = normalizeGoals([...queryTokens, normalizedQuery].filter(Boolean));
  const querySystemIds = normalizeSystems([...queryTokens, normalizedQuery].filter(Boolean));
  const normalizedGoal = normalizeGoals(options.goal ? [options.goal] : [])[0];
  const rawGoalTokens = options.goal ? tokenize(options.goal) : [];
  const hasQuery = normalizedQuery.length > 0;
  const hasGoal = Boolean(normalizedGoal);
  const safetyIntent = isSafetyIntentQuery(query);

  const fertilitySignal = [...queryTokens, ...rawGoalTokens].some((token) => FERTILITY_TOKENS.has(token));

  const results: ScoredSupplementMatch[] = [];

  for (const supplement of supplements) {
    const knowledge = getSupplementKnowledgeById(supplement.id);
    const reasons: SearchMatchReason[] = [];
    const seenReasons = new Set<string>();
    let textScore = 0;
    let goalScore = 0;
    let matchedGoal = false;

    const nameCandidates = [supplement.name, supplement.id.replace(/-/g, ' ')];
    const aliasCandidates = knowledge?.aliases || [];
    const nameMatch = getBestTextMatch(normalizedQuery, nameCandidates);
    const aliasMatch = getBestTextMatch(normalizedQuery, aliasCandidates);

    if (hasQuery) {
      const nameWeight = scoreTextMatch(nameMatch.kind, {
        exact: 140,
        prefix: 108,
        contains: 80,
        fuzzy: 60,
      });
      if (nameWeight > 0) {
        textScore += nameWeight;
        addReason(reasons, seenReasons, `name-${nameMatch.kind}`, `Name match: ${nameMatch.value}`);
      }

      const aliasWeight = scoreTextMatch(aliasMatch.kind, {
        exact: 128,
        prefix: 96,
        contains: 70,
        fuzzy: 52,
      });
      if (aliasWeight > 0) {
        textScore += aliasWeight;
        addReason(reasons, seenReasons, `alias-${aliasMatch.kind}`, `Alias match: ${aliasMatch.value}`);
      }
    }

    const normalizedBenefits = supplement.benefits.map((benefit) => normalizeSearchText(benefit));
    const normalizedDescription = normalizeSearchText(supplement.description);
    const normalizedTraditionalUse = normalizeSearchText(supplement.traditionalUse || '');
    const normalizedGoals = normalizeGoals(supplement.goals);
    const normalizedSystems = normalizeSystems(supplement.systems);
    const normalizedKnowledgeGoals = normalizeGoals(knowledge?.typicalUseCases || []);
    const benefitTerms = knowledge ? getKnowledgeBenefitSearchTerms(knowledge).map(normalizeSearchText) : [];
    const safetyTerms = safetyIntent && knowledge
      ? getKnowledgeSafetySearchTerms(knowledge).map(normalizeSearchText)
      : [];

    for (const token of queryTokens) {
      if (token.length < 3) continue;

      if (containsToken(normalizedBenefits, token)) {
        textScore += 10;
        addReason(reasons, seenReasons, `benefit-${token}`, `Benefit: ${token}`);
      }

      if (normalizedDescription.includes(token) || normalizedTraditionalUse.includes(token)) {
        textScore += 5;
      }

      if (containsToken(benefitTerms, token)) {
        textScore += 8;
      }

      if (safetyIntent && containsToken(safetyTerms, token)) {
        textScore += 8;
        addReason(reasons, seenReasons, `safety-${token}`, `Safety: ${token}`);
      }
    }

    for (const goalId of queryGoalIds) {
      if (normalizedGoals.includes(goalId)) {
        goalScore += 30;
        matchedGoal = true;
        addReason(reasons, seenReasons, `goal-${goalId}`, `Goal: ${formatIdLabel(goalId)}`);
      }
      if (normalizedKnowledgeGoals.includes(goalId)) {
        goalScore += 24;
        matchedGoal = true;
        addReason(reasons, seenReasons, `use-case-${goalId}`, `Use-case: ${formatIdLabel(goalId)}`);
      }
    }

    for (const systemId of querySystemIds) {
      if (normalizedSystems.includes(systemId)) {
        textScore += 14;
        addReason(reasons, seenReasons, `system-${systemId}`, `System: ${formatIdLabel(systemId)}`);
      }
    }

    if (hasGoal && normalizedGoal) {
      if (normalizedGoals.includes(normalizedGoal)) {
        goalScore += 36;
        matchedGoal = true;
        addReason(reasons, seenReasons, `goal-filter-${normalizedGoal}`, `Goal: ${formatIdLabel(normalizedGoal)}`);
      } else if (normalizedKnowledgeGoals.includes(normalizedGoal)) {
        goalScore += 28;
        matchedGoal = true;
        addReason(
          reasons,
          seenReasons,
          `goal-filter-use-case-${normalizedGoal}`,
          `Use-case: ${formatIdLabel(normalizedGoal)}`
        );
      }
    }

    if (fertilitySignal && options.gender) {
      const isMaleSpecific = supplement.goals.some((goal) =>
        ['male-reproductive', 'sperm-quality', 'testosterone'].includes(goal)
      );
      const isFemaleSpecific = supplement.goals.some((goal) =>
        ['female-reproductive', 'ovulation', 'menstrual-health', 'pcos', 'menopause'].includes(goal)
      );

      if (options.gender === 'male' && isFemaleSpecific && !isMaleSpecific) {
        continue;
      }
      if (options.gender === 'female' && isMaleSpecific && !isFemaleSpecific) {
        continue;
      }
    }

    if (hasGoal && !matchedGoal) {
      continue;
    }

    const score = textScore + goalScore;
    if (hasQuery && score <= 0) {
      continue;
    }

    results.push({
      supplement,
      score,
      reasons: reasons.slice(0, 4),
      textScore,
      goalScore,
    });
  }

  results.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    if (b.goalScore !== a.goalScore) return b.goalScore - a.goalScore;
    if (b.textScore !== a.textScore) return b.textScore - a.textScore;
    return a.supplement.name.localeCompare(b.supplement.name);
  });

  return results;
}

export function suggestClosestSupplementTerm(query: string, supplements: Supplement[]): string | null {
  const normalizedQuery = normalizeSearchText(query);
  if (!normalizedQuery || normalizedQuery.length < 3) {
    return null;
  }

  const candidates = new Map<string, string>();
  for (const supplement of supplements) {
    candidates.set(normalizeSearchText(supplement.name), supplement.name);
    for (const alias of getSupplementSearchCandidates(supplement)) {
      candidates.set(normalizeSearchText(alias), alias);
    }
  }

  let bestValue: string | null = null;
  let bestScore = 0;
  for (const [normalizedCandidate, rawCandidate] of candidates.entries()) {
    if (!normalizedCandidate || normalizedCandidate === normalizedQuery) continue;
    if (Math.abs(normalizedCandidate.length - normalizedQuery.length) > 4) continue;
    const score = similarity(normalizedQuery, normalizedCandidate);
    if (score > bestScore) {
      bestScore = score;
      bestValue = rawCandidate;
    } else if (score === bestScore && bestValue && rawCandidate.localeCompare(bestValue) < 0) {
      bestValue = rawCandidate;
    }
  }

  if (!bestValue || bestScore < 0.74) {
    return null;
  }

  return bestValue;
}
