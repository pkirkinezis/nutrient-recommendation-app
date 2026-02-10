import { buildKnowledgeArtifacts } from './knowledgeBuilder.mjs';

const normalize = (value) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\s+/g, ' ');

const tokenize = (value) => normalize(value).split(' ').filter(Boolean);

const safetyIntentTokens = new Set([
  'safe',
  'safety',
  'risk',
  'warning',
  'interaction',
  'interactions',
  'contraindication',
  'contraindications',
  'avoid',
  'pregnancy',
  'pregnant',
  'breastfeeding',
  'lactation',
]);

const levenshteinDistance = (a, b) => {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;
  const matrix = Array.from({ length: a.length + 1 }, () => Array(b.length + 1).fill(0));
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

const similarity = (a, b) => 1 - levenshteinDistance(a, b) / Math.max(a.length, b.length, 1);

const bestMatchScore = (query, values, weights) => {
  if (!query) return 0;
  const normalizedValues = values.map((value) => normalize(value)).filter(Boolean);
  if (normalizedValues.some((value) => value === query)) return weights.exact;
  if (normalizedValues.some((value) => value.startsWith(query))) return weights.prefix;
  if (normalizedValues.some((value) => value.includes(query))) return weights.contains;
  if (query.length >= 4) {
    let best = 0;
    for (const value of normalizedValues) {
      best = Math.max(best, similarity(query, value));
    }
    if (best >= 0.82) return weights.fuzzy;
  }
  return 0;
};

const search = (query, supplements, knowledgeMap) => {
  const normalizedQuery = normalize(query);
  const tokens = tokenize(query).filter((token) => token.length > 2);
  const safetyIntent = tokens.some((token) => safetyIntentTokens.has(token));
  const rows = [];

  for (const supplement of supplements) {
    const knowledge = knowledgeMap[supplement.id];
    const aliases = knowledge?.aliases || [];
    const benefitTerms = [
      supplement.name,
      supplement.description,
      ...(supplement.benefits || []),
      ...(supplement.goals || []),
      ...(knowledge?.typicalUseCases || []),
      knowledge?.evidenceSummary || '',
    ]
      .map(normalize)
      .filter(Boolean);
    const safetyTerms = safetyIntent
      ? [
          ...(knowledge?.safetyNotes || []),
          ...(knowledge?.safetyFlags || []),
          ...(supplement.cautions || []),
          ...(supplement.drugInteractions || []),
          ...(supplement.avoidIf || []),
        ]
          .map(normalize)
          .filter(Boolean)
      : [];

    let score = 0;
    score += bestMatchScore(normalizedQuery, [supplement.name, supplement.id.replace(/-/g, ' ')], {
      exact: 140,
      prefix: 108,
      contains: 80,
      fuzzy: 60,
    });
    score += bestMatchScore(normalizedQuery, aliases, {
      exact: 128,
      prefix: 96,
      contains: 70,
      fuzzy: 52,
    });

    for (const token of tokens) {
      if (benefitTerms.some((term) => term.includes(token))) score += 8;
      if (safetyTerms.some((term) => term.includes(token))) score += 8;
    }

    if (score > 0) {
      rows.push({ id: supplement.id, score });
    }
  }

  rows.sort((a, b) => b.score - a.score || a.id.localeCompare(b.id));
  return rows;
};

const suggest = (query, supplements, knowledgeMap) => {
  const normalizedQuery = normalize(query);
  if (!normalizedQuery || normalizedQuery.length < 3) return null;
  const candidates = new Set();
  for (const supplement of supplements) {
    candidates.add(supplement.name);
    candidates.add(supplement.id.replace(/-/g, ' '));
    const knowledge = knowledgeMap[supplement.id];
    for (const alias of knowledge?.aliases || []) {
      candidates.add(alias);
    }
  }
  let best = null;
  let bestScore = 0;
  for (const candidate of candidates) {
    const normalizedCandidate = normalize(candidate);
    if (!normalizedCandidate || normalizedCandidate === normalizedQuery) continue;
    const score = similarity(normalizedQuery, normalizedCandidate);
    if (score > bestScore || (score === bestScore && best && candidate.localeCompare(best) < 0)) {
      best = candidate;
      bestScore = score;
    }
  }
  if (!best || bestScore < 0.74) return null;
  return best;
};

const failures = [];

const artifacts = await buildKnowledgeArtifacts();
const { supplements, knowledgeMap } = artifacts;

const assert = (condition, message) => {
  if (!condition) failures.push(message);
};

const thiamine = search('thiamine', supplements, knowledgeMap)[0]?.id;
assert(thiamine === 'vitamin-b1', `Expected "thiamine" to rank vitamin-b1 first, got ${thiamine || 'none'}.`);

const ashwagandhaMisspelled = search('ashwaghanda', supplements, knowledgeMap)[0]?.id;
assert(
  ashwagandhaMisspelled === 'ashwagandha',
  `Expected "ashwaghanda" to rank ashwagandha first, got ${ashwagandhaMisspelled || 'none'}.`
);

const suggestion = suggest('thaimine', supplements, knowledgeMap);
assert(
  suggestion !== null && normalize(suggestion).includes('thiam'),
  `Expected typo suggestion for "thaimine" to point to thiamine-related term, got ${suggestion || 'none'}.`
);

const noSafetyIntent = search('warfarin', supplements, knowledgeMap).slice(0, 5);
assert(
  noSafetyIntent.length === 0,
  `Expected "warfarin" without safety intent token to avoid broad matches, got ${noSafetyIntent.length} hits.`
);

const safetyIntent = search('warfarin interaction', supplements, knowledgeMap).slice(0, 5);
assert(
  safetyIntent.length > 0,
  'Expected "warfarin interaction" to return safety-oriented matches.'
);

const firstRun = search('energy support', supplements, knowledgeMap).slice(0, 20).map((item) => item.id);
const secondRun = search('energy support', supplements, knowledgeMap).slice(0, 20).map((item) => item.id);
assert(
  JSON.stringify(firstRun) === JSON.stringify(secondRun),
  'Search ordering is not deterministic for "energy support".'
);

if (failures.length > 0) {
  console.error('Search checks failed:');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log('Search checks passed.');
console.log(`Supplements checked: ${supplements.length}`);
