/**
 * NutriCompass Goal Analyzer
 * Improved parsing with negation handling, word boundaries, and comprehensive interaction detection
 */

import { useMemo } from 'react';
import { Supplement, SupplementStack, UserProfile, GoalAnalysis, RecommendedSupplement, TrackingData } from '../types';
import { 
  GOAL_CATEGORIES, 
  SEMANTIC_ASSOCIATIONS,
  SYSTEM_DEFINITIONS,
  NEGATION_WORDS,
  NEGATION_WINDOW,
  SUPPLEMENT_ALIASES,
  HIGH_RISK_INTERACTIONS,
  normalizeSupplementName
} from '../constants/taxonomy';
import { normalizeGoals, normalizeSystems } from './normalization';
import { buildNutrientTargets } from '../data/nutrientRequirements';
import { premadeStacks } from '../data/stacks';
import { semanticIntentDataset } from '../data/semanticIntents';
import { rankByCosineSimilarity } from './similarity';
import { getSupplementKnowledgeById } from '../data/supplementKnowledge';
import { getSupplementSearchCandidates, searchSupplementsWithScores } from './supplementSearchEngine';
import { choosePreferredCanonicalSupplement, dedupeSupplementsByCanonical, getCanonicalSupplementKey } from './supplementCanonical';
import {
  BREASTFEEDING_TEXT_PATTERN,
  PREGNANCY_TEXT_PATTERN,
  REPRODUCTIVE_GOAL_IDS,
  TTC_TEXT_PATTERN
} from '../constants/reproductiveScope';

// ============================================
// TOKENIZATION & PARSING
// ============================================

interface Token {
  word: string;
  index: number;
  isNegated: boolean;
  root: string;
}

interface DirectMatchResult {
  supplements: Supplement[];
  inferredGoals: string[];
  inferredSystems: string[];
}

interface SemanticMatchResult {
  supplements: Supplement[];
  inferredGoals: string[];
  inferredSystems: string[];
}

const INTIMACY_GOALS = new Set([
  'libido',
  'fertility',
  'hormones',
  'sexual-health',
  'sexual-function',
  'erectile-function',
  'semen-volume',
  'sperm-quality',
  'sperm-motility',
  'sperm-count',
  'male-reproductive',
  'female-reproductive',
  'reproductive',
  'women-health',
  'hormonal-balance',
  'testosterone',
  'sex-drive',
  'intimacy',
  'sexual'
]);

const STACK_GOAL_ALIASES: Record<string, string[]> = {
  'sexual-health': ['libido', 'fertility', 'hormones'],
  'sexual-function': ['libido', 'hormones'],
  'erectile-function': ['libido', 'hormones'],
  'semen-volume': ['fertility', 'hormones'],
  'sperm-quality': ['fertility', 'hormones'],
  'sperm-motility': ['fertility', 'hormones'],
  'sperm-count': ['fertility', 'hormones'],
  'male-reproductive': ['fertility', 'libido'],
  'female-reproductive': ['fertility', 'hormones'],
  'intimacy': ['libido', 'hormones'],
  'sexual': ['libido', 'hormones'],
  'sex-drive': ['libido', 'hormones']
};

export function getRecommendedStacks(profile?: UserProfile, goals: string[] = []): SupplementStack[] {
  const normalizedGoals = normalizeGoals(goals);
  const rawGoals = goals.map(goal => goal.toLowerCase());
  const targetGender = profile?.sex === 'male' ? 'men' : profile?.sex === 'female' ? 'women' : 'all';
  const availableStacks = premadeStacks.filter(stack => stack.targetGender === 'all' || stack.targetGender === targetGender);
  const hasRawIntimacyGoal = rawGoals.some(goal => INTIMACY_GOALS.has(goal));

  if (normalizedGoals.length === 0 && !hasRawIntimacyGoal) {
    return availableStacks;
  }

  const goalMatches = normalizedGoals.filter(goal => INTIMACY_GOALS.has(goal));
  if (goalMatches.length === 0 && hasRawIntimacyGoal) {
    goalMatches.push('hormones');
  }
  if (goalMatches.length === 0) {
    return availableStacks;
  }

  const expandedGoalMatches = new Set(goalMatches);
  goalMatches.forEach(goal => {
    STACK_GOAL_ALIASES[goal]?.forEach(alias => expandedGoalMatches.add(alias));
  });

  return availableStacks.filter(stack =>
    Array.from(expandedGoalMatches).some(goal =>
      stack.primaryGoal === goal || (goal === 'hormones' && stack.primaryGoal === 'fertility')
    )
  );
}

/**
 * Tokenize input text into words with position tracking
 */
function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\s'-]/g, ' ')  // Keep hyphens and apostrophes
    .split(/\s+/)
    .filter(word => word.length > 0);
}

const STEM_SUFFIXES = ['ing', 'ers', 'er', 'ed', 'es', 's'];

function stemWord(word: string): string {
  for (const suffix of STEM_SUFFIXES) {
    if (word.length > suffix.length + 2 && word.endsWith(suffix)) {
      return word.slice(0, -suffix.length);
    }
  }
  return word;
}

/**
 * Check if a token is negated by looking at preceding words
 */
function isTokenNegated(tokens: string[], tokenIndex: number): boolean {
  const startIndex = Math.max(0, tokenIndex - NEGATION_WINDOW);
  for (let i = startIndex; i < tokenIndex; i++) {
    if (NEGATION_WORDS.includes(tokens[i])) {
      return true;
    }
  }
  return false;
}

/**
 * Parse input into tokens with negation awareness
 */
function parseInput(text: string): Token[] {
  const tokens = tokenize(text);
  return tokens.map((word, index) => ({
    word,
    index,
    isNegated: isTokenNegated(tokens, index),
    root: stemWord(word)
  }));
}

/**
 * Minimum token length for partial matching to prevent false positives
 * Short tokens like "at", "or", "an" should not trigger partial matches
 */
const MIN_PARTIAL_MATCH_LENGTH = 4;

/**
 * Common stop words that should never trigger matches even if they appear in keywords
 */
const STOP_WORDS = new Set([
  'a', 'an', 'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with',
  'by', 'from', 'up', 'about', 'into', 'through', 'during', 'before', 'after',
  'above', 'below', 'between', 'under', 'again', 'further', 'then', 'once',
  'here', 'there', 'when', 'where', 'why', 'how', 'all', 'each', 'few', 'more',
  'most', 'other', 'some', 'such', 'only', 'own', 'same', 'so', 'than', 'too',
  'very', 'just', 'can', 'will', 'should', 'would', 'could', 'may', 'might',
  'must', 'shall', 'need', 'want', 'like', 'get', 'got', 'make', 'made', 'take',
  'took', 'come', 'came', 'go', 'went', 'see', 'saw', 'know', 'knew', 'think',
  'thought', 'feel', 'felt', 'find', 'found', 'give', 'gave', 'tell', 'told',
  'work', 'working', 'day', 'time', 'way', 'year', 'good', 'bad', 'new', 'old',
  'high', 'low', 'long', 'short', 'big', 'small', 'great', 'little', 'right',
  'left', 'first', 'last', 'next', 'early', 'late', 'hard', 'easy', 'best', 'worst',
  'have', 'has', 'had', 'having', 'do', 'does', 'did', 'doing', 'be', 'been', 'being',
  'am', 'is', 'are', 'was', 'were', 'i', 'me', 'my', 'we', 'us', 'our', 'you', 'your',
  'he', 'him', 'his', 'she', 'her', 'it', 'its', 'they', 'them', 'their', 'what',
  'which', 'who', 'whom', 'this', 'that', 'these', 'those', 'while', 'during'
]);

function levenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = Array.from({ length: a.length + 1 }, () => Array(b.length + 1).fill(0));

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
}

function fuzzyMatch(input: string, target: string, threshold = 0.7): boolean {
  if (!input || !target) return false;
  const normalizedInput = input.toLowerCase().trim();
  const normalizedTarget = target.toLowerCase().trim();
  if (normalizedInput === normalizedTarget) return true;
  if (normalizedTarget.includes(normalizedInput)) return true;

  const lengthDelta = Math.abs(normalizedInput.length - normalizedTarget.length);
  const maxLengthDelta = Math.max(4, Math.floor(Math.max(normalizedInput.length, normalizedTarget.length) * 0.45));
  if (lengthDelta > maxLengthDelta) return false;

  const distance = levenshteinDistance(normalizedInput, normalizedTarget);
  const similarity = 1 - distance / Math.max(normalizedInput.length, normalizedTarget.length, 1);
  return similarity >= threshold;
}

/**
 * Check if a keyword matches in the token list (with word boundaries)
 * Returns true only if found and NOT negated
 */
function matchKeyword(tokens: Token[], keyword: string): boolean {
  const keywordTokens = tokenize(keyword);
  const keywordRoots = keywordTokens.map(stemWord);
  
  for (let i = 0; i <= tokens.length - keywordTokens.length; i++) {
    let match = true;
    let anyNegated = false;
    
    for (let j = 0; j < keywordTokens.length; j++) {
      const token = tokens[i + j];
      const keywordToken = keywordTokens[j];
      const keywordRoot = keywordRoots[j];
      const tokenLength = token.word.length;
      const baseLength = Math.max(keywordToken.length, keywordRoot.length);
      const isExactMatch =
        token.word === keywordToken ||
        token.root === keywordToken ||
        token.word === keywordRoot ||
        token.root === keywordRoot;
      const isInflectedMatch =
        keywordToken.length >= MIN_PARTIAL_MATCH_LENGTH &&
        (token.word.startsWith(keywordToken) || token.word.startsWith(keywordRoot)) &&
        tokenLength >= baseLength &&
        tokenLength - baseLength <= 2;

      if (!isExactMatch && !isInflectedMatch) {
        match = false;
        break;
      }
      if (token.isNegated) {
        anyNegated = true;
      }
    }
    
    if (match && !anyNegated) {
      return true;
    }
  }
  
  return false;
}

/**
 * Check for partial keyword match (for compound words) with negation awareness
 * 
 * IMPROVED: No longer uses bidirectional matching (keyword.includes(token))
 * which caused false positives with short tokens like "at" matching "fatigue"
 * 
 * Now only allows:
 * 1. Token contains the keyword (e.g., "sleeplessness" contains "sleep")
 * 2. Token length must be >= MIN_PARTIAL_MATCH_LENGTH
 * 3. Token must not be a stop word
 */
function matchPartialKeyword(tokens: Token[], keyword: string): boolean {
  const keywordLower = keyword.toLowerCase();
  const keywordRoot = stemWord(keywordLower);
  
  // Skip very short keywords that could cause false positives
  if (keywordLower.length < 3) {
    return false;
  }
  
  for (const token of tokens) {
    // Skip stop words entirely
    if (STOP_WORDS.has(token.word)) {
      continue;
    }
    
    // Skip short tokens for partial matching
    if (token.word.length < MIN_PARTIAL_MATCH_LENGTH) {
      continue;
    }
    
    // Skip negated tokens
    if (token.isNegated) {
      continue;
    }
    
    // ONLY check if the token contains the keyword
    // Do NOT check if keyword contains token (this was the source of false positives)
    // e.g., "sleeplessness" contains "sleep" ✓
    // e.g., "fatigue" contains "at" ✗ (we removed this check)
    if (token.word.includes(keywordLower) || token.word.includes(keywordRoot)) {
      return true;
    }
    
    // Also allow keyword to contain token ONLY if token is long enough
    // and represents a meaningful root word (>= 5 chars)
    if (token.word.length >= 5 && (keywordLower.includes(token.word) || keywordRoot.includes(token.word))) {
      // Additional check: token should be a significant portion of the keyword
      // to avoid "focus" matching "refocus" when user meant something else
      const tokenRatio = token.word.length / keywordLower.length;
      if (tokenRatio >= 0.5) {
        return true;
      }
    }
  }
  
  return false;
}

function findSupplementByNameOrAlias(
  supplements: Supplement[],
  name: string
): Supplement | undefined {
  const normalizedName = name.toLowerCase();
  const alias = normalizeSupplementName(normalizedName).toLowerCase();
  return supplements.find(s => {
    const candidates = getSupplementMatchCandidates(s);
    return candidates.some(candidate =>
      candidate === normalizedName ||
      candidate === alias ||
      candidate.includes(normalizedName) ||
      candidate.includes(alias) ||
      fuzzyMatch(normalizedName, candidate, 0.78) ||
      fuzzyMatch(alias, candidate, 0.78)
    );
  });
}

function getSupplementMatchCandidates(supplement: Supplement): string[] {
  return getSupplementSearchCandidates(supplement);
}

function buildDirectQueryCandidates(input: string): string[] {
  const normalizedInput = input.toLowerCase().trim();
  const normalizedAliasInput = normalizeSupplementName(normalizedInput).toLowerCase().trim();
  const queryCandidates = new Set<string>();

  const addTokenPhrases = (tokens: string[]): void => {
    const maxPhraseLength = Math.min(5, tokens.length);
    for (let start = 0; start < tokens.length; start++) {
      for (let length = 1; length <= maxPhraseLength && start + length <= tokens.length; length++) {
        const phraseTokens = tokens.slice(start, start + length);
        if (length === 1) {
          const token = phraseTokens[0];
          if (token.length < 3 || STOP_WORDS.has(token)) continue;
        }
        const phrase = phraseTokens.join(' ').trim();
        if (phrase.length >= 3) {
          queryCandidates.add(phrase);
        }
      }
    }
  };

  if (normalizedInput.length >= 3) {
    queryCandidates.add(normalizedInput);
  }
  if (normalizedAliasInput.length >= 3) {
    queryCandidates.add(normalizedAliasInput);
  }

  addTokenPhrases(tokenize(normalizedInput));
  if (normalizedAliasInput !== normalizedInput) {
    addTokenPhrases(tokenize(normalizedAliasInput));
  }

  return Array.from(queryCandidates);
}

function isNegatedSupplementMatch(inputTokens: Token[], candidates: string[]): boolean {
  const targetTokens = new Set([
    ...candidates.flatMap(tokenize)
  ]);
  for (const token of inputTokens) {
    if (!token.isNegated) continue;
    if (targetTokens.has(token.word) || targetTokens.has(token.root)) {
      return true;
    }
  }
  return false;
}

function findDirectSupplementMatches(input: string, supplements: Supplement[]): DirectMatchResult {
  const normalizedInput = input.toLowerCase().trim();
  if (!normalizedInput || normalizedInput.length < 3) {
    return { supplements: [], inferredGoals: [], inferredSystems: [] };
  }

  const inputTokens = parseInput(input);
  const queryCandidates = buildDirectQueryCandidates(normalizedInput);
  const matches = supplements.filter(supplement => {
    const supplementCandidates = getSupplementMatchCandidates(supplement);
    if (isNegatedSupplementMatch(inputTokens, supplementCandidates)) {
      return false;
    }
    return queryCandidates.some(query =>
      supplementCandidates.some(candidate => fuzzyMatch(query, candidate, 0.78))
    );
  });
  const canonicalMatches = dedupeSupplementsByCanonical(matches);

  const inferredGoals = new Set<string>();
  const inferredSystems = new Set<string>();
  for (const match of canonicalMatches) {
    normalizeGoals(match.goals).forEach(goal => inferredGoals.add(goal));
    normalizeSystems(match.systems).forEach(system => inferredSystems.add(system));
  }

  return {
    supplements: canonicalMatches,
    inferredGoals: Array.from(inferredGoals),
    inferredSystems: Array.from(inferredSystems)
  };
}

function findSemanticMatches(supplements: Supplement[], tokens: Token[]): SemanticMatchResult {
  const matchedGoals = new Set<string>();
  const matchedSystems = new Set<string>();
  const matchedSupplements: Supplement[] = [];

  for (const association of Object.values(SEMANTIC_ASSOCIATIONS)) {
    const hasMatch = association.synonyms.some(synonym => matchKeyword(tokens, synonym));
    if (!hasMatch) continue;

    association.goals.forEach(goal => matchedGoals.add(goal));
    association.systems.forEach(system => matchedSystems.add(system));
    for (const supplementName of association.supplements) {
      const match = findSupplementByNameOrAlias(supplements, supplementName);
      if (match && !matchedSupplements.find(s => s.id === match.id)) {
        matchedSupplements.push(match);
      }
    }
  }

  return {
    supplements: dedupeSupplementsByCanonical(matchedSupplements),
    inferredGoals: normalizeGoals(Array.from(matchedGoals)),
    inferredSystems: normalizeSystems(Array.from(matchedSystems))
  };
}

function findIntentSimilarityMatches(input: string): { inferredGoals: string[]; inferredSystems: string[] } {
  const ranked = rankByCosineSimilarity(input, semanticIntentDataset, 2);
  if (ranked.length === 0 || ranked[0].score < 0.18) {
    return { inferredGoals: [], inferredSystems: [] };
  }

  const inferredGoals = new Set<string>();
  const inferredSystems = new Set<string>();
  for (const match of ranked) {
    if (match.score < 0.14) continue;
    match.item.goals.forEach(goal => inferredGoals.add(goal));
    match.item.systems.forEach(system => inferredSystems.add(system));
  }

  return {
    inferredGoals: normalizeGoals(Array.from(inferredGoals)),
    inferredSystems: normalizeSystems(Array.from(inferredSystems))
  };
}

// ============================================
// GOAL ANALYSIS
// ============================================

interface MatchedGoal {
  id: string;
  label: string;
  score: number;
  matchedKeywords: string[];
}

interface MatchedSystem {
  id: string;
  label: string;
  score: number;
}

/**
 * Weight for exact matches vs partial matches
 */
const EXACT_MATCH_WEIGHT = 3;
const PARTIAL_MATCH_WEIGHT = 1;
const SEMANTIC_MATCH_WEIGHT = 2;

const EVIDENCE_MULTIPLIERS: Record<string, number> = {
  strong: 1.3,
  moderate: 1.1,
  limited: 0.9
};

function getGoalEvidenceLevel(supplement: Supplement, goalId: string): string {
  return supplement.goalEvidence?.[goalId] || supplement.evidence;
}

/**
 * Minimum score threshold for a goal to be considered matched
 * This prevents single weak partial matches from adding goals
 */
const MIN_GOAL_SCORE = 2;

/**
 * Analyze input text to identify health goals
 * 
 * IMPROVED: 
 * - Uses weighted scoring (exact matches worth more than partial)
 * - Requires minimum score threshold to reduce noise
 * - Limits number of goals returned to prevent over-matching
 */
function identifyGoals(tokens: Token[]): MatchedGoal[] {
  const goals: MatchedGoal[] = [];
  const tokenSet = new Set(tokens.map(token => token.root));
  
  for (const category of GOAL_CATEGORIES) {
    const matchedKeywords: string[] = [];
    let score = 0;
    
    for (const keyword of category.keywords) {
      const exactMatch = matchKeyword(tokens, keyword);
      const partialMatch = !exactMatch && matchPartialKeyword(tokens, keyword);
      const keywordTokens = tokenize(keyword).map(stemWord);
      const hasSemanticOverlap = keywordTokens.some(token => tokenSet.has(token));
      
      if (exactMatch) {
        matchedKeywords.push(keyword);
        score += EXACT_MATCH_WEIGHT;
      } else if (partialMatch) {
        matchedKeywords.push(keyword);
        score += PARTIAL_MATCH_WEIGHT;
      } else if (hasSemanticOverlap) {
        score += SEMANTIC_MATCH_WEIGHT;
      }
    }
    
    // Only include goals that meet the minimum score threshold
    if (matchedKeywords.length > 0 && score >= MIN_GOAL_SCORE) {
      goals.push({
        id: category.id,
        label: category.label,
        score,
        matchedKeywords
      });
    }
  }
  
  // Sort by score and limit to top goals (prevent over-matching)
  return goals.sort((a, b) => b.score - a.score).slice(0, 4);
}

/**
 * Minimum score threshold for a system to be considered matched
 */
const MIN_SYSTEM_SCORE = 2;

/**
 * Analyze input text to identify body systems
 * 
 * IMPROVED:
 * - Uses weighted scoring (exact matches worth more)
 * - Requires minimum score threshold to reduce noise
 * - Limits number of systems returned
 */
function identifySystems(tokens: Token[]): MatchedSystem[] {
  const systems: MatchedSystem[] = [];
  const tokenSet = new Set(tokens.map(token => token.root));
  
  for (const system of SYSTEM_DEFINITIONS) {
    let score = 0;
    
    for (const keyword of system.keywords) {
      const exactMatch = matchKeyword(tokens, keyword);
      const partialMatch = !exactMatch && matchPartialKeyword(tokens, keyword);
      const keywordTokens = tokenize(keyword).map(stemWord);
      const hasSemanticOverlap = keywordTokens.some(token => tokenSet.has(token));
      
      if (exactMatch) {
        score += EXACT_MATCH_WEIGHT;
      } else if (partialMatch) {
        score += PARTIAL_MATCH_WEIGHT;
      } else if (hasSemanticOverlap) {
        score += SEMANTIC_MATCH_WEIGHT;
      }
    }
    
    // Only include systems that meet the minimum score threshold
    if (score >= MIN_SYSTEM_SCORE) {
      systems.push({
        id: system.id,
        label: system.label,
        score
      });
    }
  }
  
  // Sort by score and limit to top systems
  return systems.sort((a, b) => b.score - a.score).slice(0, 3);
}

function buildMatchedGoals(goalIds: string[]): MatchedGoal[] {
  return goalIds.map(goalId => {
    const category = GOAL_CATEGORIES.find(g => g.id === goalId);
    return {
      id: goalId,
      label: category?.label ?? goalId,
      score: 2,
      matchedKeywords: category?.keywords ?? [goalId]
    };
  });
}

function buildMatchedSystems(systemIds: string[]): MatchedSystem[] {
  return systemIds.map(systemId => ({
    id: systemId as MatchedSystem['id'],
    label: SYSTEM_DEFINITIONS.find(s => s.id === systemId)?.label ?? systemId,
    score: 2
  }));
}

function findRelatedSupplements(
  seeds: Supplement[],
  supplements: Supplement[]
): Supplement[] {
  const seedGoals = new Set(seeds.flatMap(s => normalizeGoals(s.goals)));
  if (seedGoals.size === 0) return [];

  return supplements
    .filter(s => !seeds.some(seed => seed.id === s.id))
    .map(s => {
      const sharedGoals = normalizeGoals(s.goals).filter(goal => seedGoals.has(goal)).length;
      return { supplement: s, sharedGoals };
    })
    .filter(item => item.sharedGoals > 0)
    .sort((a, b) => b.sharedGoals - a.sharedGoals)
    .slice(0, 6)
    .map(item => item.supplement);
}

// ============================================
// SUPPLEMENT MATCHING
// ============================================

/**
 * Score a supplement based on goal relevance
 */
function scoreSupplementForGoals(
  supplement: Supplement, 
  matchedGoals: MatchedGoal[],
  matchedSystems: MatchedSystem[]
): number {
  let score = 0;
  const normalizedGoals = normalizeGoals(supplement.goals);
  const normalizedSystems = normalizeSystems(supplement.systems);
  const knowledge = getSupplementKnowledgeById(supplement.id);
  const normalizedKnowledgeUseCases = normalizeGoals((knowledge?.typicalUseCases || []).map(useCase => useCase.toLowerCase()));
  
  // Score based on goals
  for (const goal of matchedGoals) {
    if (normalizedGoals.includes(goal.id)) {
      const evidenceLevel = getGoalEvidenceLevel(supplement, goal.id);
      const evidenceMultiplier = EVIDENCE_MULTIPLIERS[evidenceLevel] || 1;
      score += goal.score * 10 * evidenceMultiplier;
    }

    if (normalizedKnowledgeUseCases.includes(goal.id)) {
      score += goal.score * 6;
    }
    // Check benefits text for goal keywords
    for (const keyword of goal.matchedKeywords) {
      if (supplement.benefits?.some(b => b.toLowerCase().includes(keyword))) {
        score += 2;
      }
      if (supplement.description?.toLowerCase().includes(keyword)) {
        score += 1;
      }
      if (knowledge?.typicalUseCases.some(useCase => useCase.toLowerCase().includes(keyword))) {
        score += 1.5;
      }
    }
  }
  
  // Score based on systems
  for (const system of matchedSystems) {
    if (normalizedSystems.includes(system.id)) {
      score += system.score * 5;
    }
  }
  
  // Boost for evidence level
  const overallMultiplier = EVIDENCE_MULTIPLIERS[supplement.evidence] || 1;
  score *= overallMultiplier;
  
  return score;
}

/**
 * Determine priority level based on score and evidence
 */
function determinePriority(score: number, evidence: string): 'essential' | 'beneficial' | 'optional' {
  if (score >= 30 && evidence === 'strong') {
    return 'essential';
  } else if (score >= 15 || evidence === 'strong') {
    return 'beneficial';
  }
  return 'optional';
}

/**
 * Generate reason for recommendation
 */
function generateReason(
  supplement: Supplement,
  matchedGoals: MatchedGoal[],
  matchedSystems: MatchedSystem[]
): string {
  const reasons: string[] = [];
  const normalizedGoals = normalizeGoals(supplement.goals);
  const normalizedSystems = normalizeSystems(supplement.systems);
  
  // Find which goals this supplement addresses
  const addressedGoals = matchedGoals.filter(g => 
    normalizedGoals.includes(g.id) ||
    supplement.benefits?.some(b => 
      g.matchedKeywords.some(k => b.toLowerCase().includes(k))
    )
  );
  
  if (addressedGoals.length > 0) {
    const goalNames = addressedGoals.map(g => g.label).slice(0, 2);
    reasons.push(`Supports ${goalNames.join(' and ')}`);
  }
  
  // Add system-specific reason
  const addressedSystems = matchedSystems.filter(s => 
    normalizedSystems.includes(s.id)
  );
  
  if (addressedSystems.length > 0) {
    reasons.push(`Works on ${addressedSystems[0].label.toLowerCase()}`);
  }
  
  // Add evidence note
  if (supplement.evidence === 'strong') {
    reasons.push('Strong clinical evidence');
  }
  
  // Add specific benefit
  if (supplement.benefits && supplement.benefits.length > 0) {
    reasons.push(supplement.benefits[0]);
  }
  
  return reasons.slice(0, 2).join('. ') + '.';
}

// ============================================
// CONTEXT & SAFETY
// ============================================

type SeverityLevel = 'mild' | 'moderate' | 'severe';
type DurationLevel = 'acute' | 'chronic';

interface QueryContext {
  severity?: SeverityLevel;
  duration?: DurationLevel;
  avoidStimulating: boolean;
  avoidSedating: boolean;
  avoidHerbs: boolean;
  avoidHormonal: boolean;
}

const SEVERITY_KEYWORDS: Record<SeverityLevel, string[]> = {
  mild: ['mild', 'light', 'occasional'],
  moderate: ['moderate', 'medium'],
  severe: ['severe', 'intense', 'extreme', 'debilitating']
};

const DURATION_KEYWORDS: Record<DurationLevel, string[]> = {
  acute: ['recent', 'acute', 'sudden', 'short-term'],
  chronic: ['chronic', 'long-term', 'months', 'years', 'ongoing', 'persistent']
};

function extractQueryContext(input: string, profile?: UserProfile): QueryContext {
  const text = input.toLowerCase();
  const severity = (Object.keys(SEVERITY_KEYWORDS) as SeverityLevel[]).find(level =>
    SEVERITY_KEYWORDS[level].some(term => text.includes(term))
  );
  const duration = (Object.keys(DURATION_KEYWORDS) as DurationLevel[]).find(level =>
    DURATION_KEYWORDS[level].some(term => text.includes(term))
  );

  const avoidStimulating = /no stimulants?|avoid stimulants?|not stimulating|caffeine sensitive|sensitive to caffeine/.test(text)
    || profile?.caffeineIntake === 'high';
  const avoidSedating = /no sedat(ing|ive)|avoid sedat(ing|ive)|not sleepy|no drowsy/.test(text);
  const avoidHerbs = /no herbs?|avoid herbs?|no botanicals?|avoid botanicals?/.test(text);
  const avoidHormonal = /non[-\s]?hormonal|avoid hormones|no hormonal/.test(text);

  return { severity, duration, avoidStimulating, avoidSedating, avoidHerbs, avoidHormonal };
}

function isStimulatingSupplement(supplement: Supplement): boolean {
  const name = supplement.name.toLowerCase();
  const stimulantTerms = [
    'caffeine',
    'guarana',
    'green tea',
    'white tea',
    'black tea',
    'oolong',
    'yellow tea',
    'pu-erh',
    'matcha',
    'sencha',
    'earl grey',
    'english breakfast',
    'yerba',
    'ginseng',
    'rhodiola',
    'cordyceps',
  ];
  if (stimulantTerms.some(term => name.includes(term))) return true;
  const cautionText = [...(supplement.cautions || []), ...(supplement.drugInteractions || [])].join(' ').toLowerCase();
  if (cautionText.includes('caffeine')) return true;
  return supplement.benefits.some(benefit => benefit.toLowerCase().includes('energy') || benefit.toLowerCase().includes('alert'));
}

function isSedatingSupplement(supplement: Supplement): boolean {
  const name = supplement.name.toLowerCase();
  const sedatingTerms = ['melatonin', 'valerian', 'glycine', 'gaba', 'passionflower'];
  if (sedatingTerms.some(term => name.includes(term))) return true;
  return supplement.benefits.some(benefit => benefit.toLowerCase().includes('sleep') || benefit.toLowerCase().includes('calm'));
}

function applyContextAdjustments(
  supplements: { supplement: Supplement; score: number }[],
  context: QueryContext
): { supplement: Supplement; score: number }[] {
  return supplements.map(({ supplement, score }) => {
    let adjustedScore = score;

    if (context.avoidStimulating && isStimulatingSupplement(supplement)) {
      adjustedScore *= 0.6;
    }
    if (context.avoidSedating && isSedatingSupplement(supplement)) {
      adjustedScore *= 0.6;
    }
    if (context.avoidHerbs && ['herb', 'ayurvedic', 'mushroom'].includes(supplement.type)) {
      adjustedScore *= 0.5;
    }
    if (context.avoidHormonal && normalizeGoals(supplement.goals).includes('hormones')) {
      adjustedScore *= 0.6;
    }

    if (context.duration === 'chronic') {
      if (supplement.evidence === 'limited') {
        adjustedScore *= 0.85;
      }
    }
    if (context.severity === 'severe') {
      if (supplement.evidence === 'strong') {
        adjustedScore *= 1.1;
      } else if (supplement.evidence === 'limited') {
        adjustedScore *= 0.8;
      }
    }

    return { supplement, score: adjustedScore };
  });
}

export interface SafetyAssessment {
  flags: string[];
  cautionLevel?: 'high' | 'moderate' | 'low';
  scorePenalty: number;
  exclude: boolean;
}

const MEDICATION_CLASS_MATCHES: Record<string, string[]> = {
  'blood thinner': ['warfarin', 'coumadin', 'heparin', 'apixaban', 'rivaroxaban', 'dabigatran', 'edoxaban'],
  anticoagulant: ['anticoagulant', 'blood thinner'],
  antiplatelet: ['clopidogrel', 'prasugrel', 'ticagrelor', 'aspirin', 'antiplatelet'],
  ssri: ['sertraline', 'fluoxetine', 'citalopram', 'escitalopram', 'paroxetine', 'fluvoxamine'],
  snri: ['venlafaxine', 'desvenlafaxine', 'duloxetine', 'levomilnacipran'],
  maoi: ['maoi', 'phenelzine', 'tranylcypromine', 'isocarboxazid', 'selegiline'],
  triptan: ['sumatriptan', 'rizatriptan', 'zolmitriptan', 'eletriptan', 'triptan'],
  lithium: ['lithium'],
  linezolid: ['linezolid'],
  antidepressant: ['antidepressant', 'ssri', 'snri', 'maoi', 'bupropion'],
  sedative: ['benzodiazepine', 'diazepam', 'lorazepam', 'clonazepam', 'zolpidem', 'zopiclone'],
  'thyroid medication': ['levothyroxine', 'liothyronine', 'thyroid medication', 'thyroxine', 'synthroid'],
  'diabetes medication': ['metformin', 'insulin', 'glipizide', 'glyburide', 'semaglutide'],
  metformin: ['metformin'],
  "parkinson's medication": ['levodopa', 'carbidopa', 'pramipexole', 'ropinirole', 'parkinson']
};

const CONDITION_CLASS_MATCHES: Record<string, string[]> = {
  kidney: ['kidney', 'renal', 'ckd', 'dialysis'],
  liver: ['liver', 'hepatic', 'cirrhosis', 'hepatitis'],
  thyroid: ['thyroid', 'hypothyroid', 'hyperthyroid', 'hashimoto', 'graves'],
  bipolar: ['bipolar', 'mania', 'manic'],
  surgery: ['surgery', 'operation', 'pre-op', 'pre op', 'post-op', 'post op'],
  'bleeding-disorder': ['bleeding disorder', 'hemophilia'],
  autoimmune: ['autoimmune', 'lupus', 'rheumatoid', 'multiple sclerosis']
};

const HIGH_RISK_MEDICATION_CLASSES = new Set([
  'blood thinner',
  'anticoagulant',
  'antiplatelet',
  'maoi',
  'lithium',
  'linezolid',
  "parkinson's medication"
]);

const SEROTONERGIC_MEDICATION_CLASSES = new Set([
  'ssri',
  'snri',
  'maoi',
  'triptan',
  'lithium',
  'linezolid',
  'antidepressant'
]);

const BOTANICAL_TYPES = new Set<Supplement['type']>(['herb', 'ayurvedic', 'mushroom']);
const PRENATAL_ESSENTIAL_SUPPLEMENT_IDS = new Set(['folate', 'iodine', 'iron', 'choline', 'omega-3', 'vitamin-d3', 'vitamin-b12']);
const SEROTONERGIC_SUPPLEMENT_IDS = new Set(['5-htp', 'same', 'st-johns-wort', 'tryptophan']);
const THYROID_SPACING_SUPPLEMENT_IDS = new Set(['iron', 'calcium', 'magnesium']);
const KIDNEY_HIGH_RISK_SUPPLEMENT_IDS = new Set(['potassium', 'magnesium', 'calcium', 'creatine', 'iron']);
const LIVER_HIGH_RISK_SUPPLEMENT_IDS = new Set(['kava', 'green-tea-matcha', 'green-tea-sencha', 'black-tea-assam']);
const BIPOLAR_HIGH_RISK_SUPPLEMENT_IDS = new Set(['st-johns-wort', '5-htp', 'same', 'rhodiola', 'caffeine', 'mucuna']);

const BLEEDING_RISK_PATTERN = /bleed|blood thinner|anticoagul|antiplatelet/;
const SEROTONERGIC_PATTERN = /serotonin|ssri|snri|maoi|triptan|lithium|linezolid/;
const THYROID_PATTERN = /thyroid|levothyroxine|liothyronine|thyroxine/;

const CAUTION_LEVEL_ORDER: Record<NonNullable<SafetyAssessment['cautionLevel']>, number> = {
  low: 1,
  moderate: 2,
  high: 3
};

function normalizeSafetyText(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, ' ').replace(/\s+/g, ' ').trim();
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function containsNormalizedPhrase(text: string, phrase: string): boolean {
  const normalizedText = normalizeSafetyText(text);
  const normalizedPhrase = normalizeSafetyText(phrase);
  if (!normalizedText || !normalizedPhrase) return false;

  const phrasePattern = escapeRegExp(normalizedPhrase).replace(/\s+/g, '\\s+');
  const regex = new RegExp(`\\b${phrasePattern}\\b`);
  if (regex.test(normalizedText)) return true;

  const textTokens = normalizedText.split(' ').filter(Boolean);
  const phraseTokens = normalizedPhrase.split(' ').filter(Boolean);
  if (textTokens.length === 0 || phraseTokens.length === 0) return false;

  const tokenMatchesPattern = (textToken: string, patternToken: string): boolean => {
    if (textToken === patternToken) return true;
    // Support common pluralized short medication class acronyms (e.g., SSRI -> SSRIs).
    if (patternToken.length >= 4 && (textToken === `${patternToken}s` || textToken === `${patternToken}es`)) {
      return true;
    }
    // Support safe inflections (plural/suffix forms) for longer clinical terms.
    return patternToken.length >= 5 && textToken.startsWith(patternToken);
  };

  if (phraseTokens.length === 1) {
    return textTokens.some(token => tokenMatchesPattern(token, phraseTokens[0]));
  }

  for (let i = 0; i <= textTokens.length - phraseTokens.length; i++) {
    let allMatched = true;
    for (let j = 0; j < phraseTokens.length; j++) {
      if (!tokenMatchesPattern(textTokens[i + j], phraseTokens[j])) {
        allMatched = false;
        break;
      }
    }
    if (allMatched) {
      return true;
    }
  }

  return false;
}

function normalizedIncludes(a: string, b: string): boolean {
  const normalizedA = normalizeSafetyText(a);
  const normalizedB = normalizeSafetyText(b);
  if (!normalizedA || !normalizedB) return false;
  return containsNormalizedPhrase(normalizedA, normalizedB) || containsNormalizedPhrase(normalizedB, normalizedA);
}

function elevateCautionLevel(
  current: SafetyAssessment['cautionLevel'],
  candidate: NonNullable<SafetyAssessment['cautionLevel']>
): NonNullable<SafetyAssessment['cautionLevel']> {
  if (!current) return candidate;
  return CAUTION_LEVEL_ORDER[candidate] > CAUTION_LEVEL_ORDER[current] ? candidate : current;
}

function collectMatchedClasses(values: string[], classMap: Record<string, string[]>): Set<string> {
  const classes = new Set<string>();
  for (const value of values) {
    const normalizedValue = normalizeSafetyText(value);
    for (const [className, patterns] of Object.entries(classMap)) {
      if (patterns.some(pattern => containsNormalizedPhrase(normalizedValue, pattern))) {
        classes.add(className);
      }
    }
  }
  return classes;
}

function conditionMatchesText(conditions: string[], conditionClasses: Set<string>, text: string): boolean {
  const normalizedText = normalizeSafetyText(text);
  if (!normalizedText) return false;
  if (conditions.some(condition => containsNormalizedPhrase(normalizedText, condition) || containsNormalizedPhrase(condition, normalizedText))) {
    return true;
  }
  for (const className of conditionClasses) {
    if ((CONDITION_CLASS_MATCHES[className] || []).some(pattern => containsNormalizedPhrase(normalizedText, pattern))) {
      return true;
    }
  }
  return false;
}

function getMatchedMedicationClasses(text: string, medicationClasses: Set<string>): string[] {
  const normalizedText = normalizeSafetyText(text);
  if (!normalizedText) return [];
  return Array.from(medicationClasses).filter(className =>
    containsNormalizedPhrase(normalizedText, className) ||
    (MEDICATION_CLASS_MATCHES[className] || []).some(pattern => containsNormalizedPhrase(normalizedText, pattern))
  );
}

export function buildSupplementSafetyAssessment(supplement: Supplement, profile?: UserProfile): SafetyAssessment {
  if (!profile) {
    return { flags: [], scorePenalty: 0, exclude: false };
  }

  const knowledge = getSupplementKnowledgeById(supplement.id);
  const flags: string[] = [];
  let cautionLevel: SafetyAssessment['cautionLevel'];
  let scorePenalty = 0;
  let exclude = false;

  const conditions = (profile.healthConditions || []).map(condition => normalizeSafetyText(condition)).filter(Boolean);
  const meds = (profile.medications || []).map(med => normalizeSafetyText(med)).filter(Boolean);
  const conditionClasses = collectMatchedClasses(conditions, CONDITION_CLASS_MATCHES);
  const medicationClasses = collectMatchedClasses(meds, MEDICATION_CLASS_MATCHES);
  const combinedSafetyText = normalizeSafetyText([
    ...(supplement.avoidIf || []),
    ...(supplement.cautions || []),
    ...(supplement.drugInteractions || [])
  ].join(' '));
  const knowledgeFlags = new Set(knowledge?.safetyFlags || []);
  const normalizedGoals = normalizeGoals(supplement.goals || []);
  const hasReproductiveUnknown =
    (profile.pregnancyStatus ?? 'unknown') === 'unknown' ||
    (profile.breastfeedingStatus ?? 'unknown') === 'unknown' ||
    (profile.tryingToConceiveStatus ?? 'unknown') === 'unknown';
  const isBotanical = BOTANICAL_TYPES.has(supplement.type);
  const addressesReproductiveGoals = normalizedGoals.some(goal => REPRODUCTIVE_GOAL_IDS.has(goal));
  const hasExplicitReproductiveRiskSignal =
    knowledgeFlags.has('pregnancy') ||
    knowledgeFlags.has('breastfeeding') ||
    PREGNANCY_TEXT_PATTERN.test(combinedSafetyText) ||
    BREASTFEEDING_TEXT_PATTERN.test(combinedSafetyText) ||
    TTC_TEXT_PATTERN.test(combinedSafetyText);
  const hasBleedingRisk = knowledgeFlags.has('bleeding-risk') || BLEEDING_RISK_PATTERN.test(combinedSafetyText);
  const hasSerotonergicSignal = SEROTONERGIC_SUPPLEMENT_IDS.has(supplement.id) || SEROTONERGIC_PATTERN.test(combinedSafetyText);
  const hasThyroidSignal = knowledgeFlags.has('thyroid') || THYROID_PATTERN.test(combinedSafetyText);

  if (hasReproductiveUnknown && (addressesReproductiveGoals || hasExplicitReproductiveRiskSignal)) {
    flags.push('Safety intake incomplete: set pregnancy, breastfeeding, and trying-to-conceive status before using reproductive-risk recommendations.');
    cautionLevel = elevateCautionLevel(cautionLevel, 'high');
    scorePenalty += 1;
    exclude = true;
  }

  if ((profile.pregnancyStatus ?? 'unknown') === 'yes') {
    const isPrenatalEssential = PRENATAL_ESSENTIAL_SUPPLEMENT_IDS.has(supplement.id);
    if (!isPrenatalEssential || isBotanical || supplement.type === 'performance') {
      flags.push('Pregnancy: this supplement is not in the default prenatal-safe essentials list. Use clinician guidance.');
      cautionLevel = elevateCautionLevel(cautionLevel, 'high');
      scorePenalty += 1;
      exclude = true;
    } else {
      flags.push('Pregnancy: keep dosing clinician-guided and avoid combining overlapping products.');
      cautionLevel = elevateCautionLevel(cautionLevel, 'moderate');
      scorePenalty += 0.2;
    }
  }

  if ((profile.breastfeedingStatus ?? 'unknown') === 'yes' && isBotanical && supplement.evidence !== 'strong') {
    flags.push('Breastfeeding: limited-evidence botanicals are suppressed unless reviewed by a clinician.');
    cautionLevel = elevateCautionLevel(cautionLevel, 'high');
    scorePenalty += 0.8;
    exclude = true;
  }

  for (const avoid of supplement.avoidIf || []) {
    const avoidText = normalizeSafetyText(avoid);
    const mentionsPregnancy = PREGNANCY_TEXT_PATTERN.test(avoidText);
    const mentionsBreastfeeding = BREASTFEEDING_TEXT_PATTERN.test(avoidText);
    const mentionsTtc = TTC_TEXT_PATTERN.test(avoidText);

    if (mentionsPregnancy) {
      if ((profile.pregnancyStatus ?? 'unknown') === 'yes') {
        flags.push(`Avoid during pregnancy: ${avoid}`);
        cautionLevel = elevateCautionLevel(cautionLevel, 'high');
        scorePenalty += 1;
        exclude = true;
      } else if ((profile.pregnancyStatus ?? 'unknown') === 'unknown') {
        flags.push(`Pregnancy status required before considering this supplement: ${avoid}`);
        cautionLevel = elevateCautionLevel(cautionLevel, 'high');
        scorePenalty += 1;
        exclude = true;
      }
    }

    if (mentionsBreastfeeding) {
      if ((profile.breastfeedingStatus ?? 'unknown') === 'yes') {
        flags.push(`Avoid while breastfeeding: ${avoid}`);
        cautionLevel = elevateCautionLevel(cautionLevel, 'high');
        scorePenalty += 1;
        exclude = true;
      } else if ((profile.breastfeedingStatus ?? 'unknown') === 'unknown') {
        flags.push(`Breastfeeding status required before considering this supplement: ${avoid}`);
        cautionLevel = elevateCautionLevel(cautionLevel, 'high');
        scorePenalty += 1;
        exclude = true;
      }
    }

    if (mentionsTtc && (profile.tryingToConceiveStatus ?? 'unknown') === 'yes') {
      flags.push(`Avoid while trying to conceive: ${avoid}`);
      cautionLevel = elevateCautionLevel(cautionLevel, 'high');
      scorePenalty += 1;
      exclude = true;
    } else if (mentionsTtc && (profile.tryingToConceiveStatus ?? 'unknown') === 'unknown') {
      flags.push(`Trying-to-conceive status required before considering this supplement: ${avoid}`);
      cautionLevel = elevateCautionLevel(cautionLevel, 'high');
      scorePenalty += 1;
      exclude = true;
    }

    if (conditionMatchesText(conditions, conditionClasses, avoid)) {
      flags.push(`Avoid if ${avoid}`);
      cautionLevel = elevateCautionLevel(cautionLevel, 'high');
      scorePenalty += 1;
      exclude = true;
    }
  }

  for (const interaction of supplement.drugInteractions || []) {
    if (meds.some(med => normalizedIncludes(interaction, med))) {
      flags.push(`Drug interaction: ${interaction}`);
      cautionLevel = elevateCautionLevel(cautionLevel, 'high');
      scorePenalty += 0.6;
    }

    const matchedClasses = getMatchedMedicationClasses(interaction, medicationClasses);
    if (matchedClasses.length > 0) {
      for (const matchedClass of matchedClasses) {
        flags.push(`Drug interaction (${matchedClass}): ${interaction}`);
        cautionLevel = elevateCautionLevel(cautionLevel, HIGH_RISK_MEDICATION_CLASSES.has(matchedClass) ? 'high' : 'moderate');
        scorePenalty += HIGH_RISK_MEDICATION_CLASSES.has(matchedClass) ? 0.7 : 0.35;
      }
    }
  }

  for (const caution of supplement.cautions || []) {
    if (conditionMatchesText(conditions, conditionClasses, caution)) {
      flags.push(`Caution: ${caution}`);
      cautionLevel = elevateCautionLevel(cautionLevel, 'moderate');
      scorePenalty += 0.25;
    }
  }

  if (Array.from(medicationClasses).some(className => ['blood thinner', 'anticoagulant', 'antiplatelet'].includes(className)) && hasBleedingRisk) {
    flags.push('High-risk interaction: bleeding risk with anticoagulant/antiplatelet medication.');
    cautionLevel = elevateCautionLevel(cautionLevel, 'high');
    scorePenalty += 1;
    exclude = true;
  }

  if (Array.from(medicationClasses).some(className => SEROTONERGIC_MEDICATION_CLASSES.has(className)) && hasSerotonergicSignal) {
    flags.push('High-risk interaction: serotonergic medication overlap (risk of serotonin toxicity).');
    cautionLevel = elevateCautionLevel(cautionLevel, 'high');
    scorePenalty += 1;
    exclude = true;
  }

  if (medicationClasses.has('thyroid medication')) {
    if (THYROID_SPACING_SUPPLEMENT_IDS.has(supplement.id)) {
      flags.push('Thyroid medication: separate this supplement by at least 4 hours.');
      cautionLevel = elevateCautionLevel(cautionLevel, 'high');
      scorePenalty += 0.45;
    }
    if (hasThyroidSignal) {
      flags.push('Thyroid-active supplement: use clinician supervision with thyroid medication.');
      cautionLevel = elevateCautionLevel(cautionLevel, 'high');
      scorePenalty += 0.65;
    }
  }

  if (conditionClasses.has('kidney') && (KIDNEY_HIGH_RISK_SUPPLEMENT_IDS.has(supplement.id) || knowledgeFlags.has('kidney'))) {
    flags.push('Kidney condition: this supplement requires clinician review before use.');
    cautionLevel = elevateCautionLevel(cautionLevel, 'high');
    scorePenalty += 1;
    exclude = true;
  }

  if (conditionClasses.has('liver') && (LIVER_HIGH_RISK_SUPPLEMENT_IDS.has(supplement.id) || knowledgeFlags.has('liver'))) {
    flags.push('Liver condition: avoid hepatotoxic-risk supplements without medical sign-off.');
    cautionLevel = elevateCautionLevel(cautionLevel, 'high');
    scorePenalty += 1;
    exclude = true;
  }

  if (conditionClasses.has('bipolar') && (BIPOLAR_HIGH_RISK_SUPPLEMENT_IDS.has(supplement.id) || hasSerotonergicSignal || isStimulatingSupplement(supplement))) {
    flags.push('Bipolar/mania history: avoid stimulating or serotonergic supplements unless clinician-guided.');
    cautionLevel = elevateCautionLevel(cautionLevel, 'high');
    scorePenalty += 1;
    exclude = true;
  }

  if (conditionClasses.has('surgery') && (hasBleedingRisk || isSedatingSupplement(supplement))) {
    flags.push('Planned surgery: hold bleeding-risk or sedating supplements unless surgeon approves.');
    cautionLevel = elevateCautionLevel(cautionLevel, 'high');
    scorePenalty += 0.8;
    exclude = true;
  }

  return {
    flags: Array.from(new Set(flags)),
    cautionLevel,
    scorePenalty: Math.min(1, scorePenalty),
    exclude
  };
}

function applySafetyScreening(
  supplements: { supplement: Supplement; score: number }[],
  profile?: UserProfile
): { supplement: Supplement; score: number; safetyFlags: string[]; cautionLevel?: 'high' | 'moderate' | 'low' }[] {
  return supplements
    .map(({ supplement, score }) => {
      const assessment = buildSupplementSafetyAssessment(supplement, profile);
      let adjustedScore = score;
      if (assessment.scorePenalty > 0) {
        adjustedScore *= Math.max(0, 1 - assessment.scorePenalty);
      }
      if (assessment.exclude) {
        adjustedScore = 0;
      }
      return {
        supplement,
        score: adjustedScore,
        safetyFlags: assessment.flags,
        cautionLevel: assessment.cautionLevel
      };
    });
}

function applyTrackingAdjustments(
  supplements: { supplement: Supplement; score: number; safetyFlags: string[]; cautionLevel?: 'high' | 'moderate' | 'low' }[],
  trackingData?: TrackingData
): { supplement: Supplement; score: number; safetyFlags: string[]; cautionLevel?: 'high' | 'moderate' | 'low' }[] {
  if (!trackingData || trackingData.logs.length === 0) {
    return supplements;
  }

  const logs = trackingData.logs;
  const overallAverage = logs.reduce((sum, log) => {
    return sum + (log.sleepQuality + log.energyLevel + log.mood + log.focus + log.recovery) / 5;
  }, 0) / logs.length;

  const supplementScores = new Map<string, number[]>();
  for (const log of logs) {
    const logScore = (log.sleepQuality + log.energyLevel + log.mood + log.focus + log.recovery) / 5;
    for (const supplementName of log.supplementsTaken) {
      const normalized = normalizeSupplementName(supplementName).toLowerCase();
      if (!supplementScores.has(normalized)) {
        supplementScores.set(normalized, []);
      }
      supplementScores.get(normalized)?.push(logScore);
    }
  }

  return supplements.map((item) => {
    const normalized = normalizeSupplementName(item.supplement.name).toLowerCase();
    const scores = supplementScores.get(normalized);
    if (!scores || scores.length < 2) {
      return item;
    }
    const avg = scores.reduce((sum, value) => sum + value, 0) / scores.length;
    const delta = avg - overallAverage;
    let adjustedScore = item.score;
    if (delta >= 0.3) {
      adjustedScore *= 1.15;
    } else if (delta <= -0.3) {
      adjustedScore *= 0.85;
    }
    return { ...item, score: adjustedScore };
  });
}

function dedupeScoredSupplementsByCanonical<T extends { supplement: Supplement; score: number; safetyFlags?: string[]; cautionLevel?: 'high' | 'moderate' | 'low' }>(
  supplements: T[]
): T[] {
  const cautionOrder: Record<'high' | 'moderate' | 'low', number> = {
    high: 3,
    moderate: 2,
    low: 1
  };

  const deduped = new Map<string, T>();
  for (const candidate of supplements) {
    const key = getCanonicalSupplementKey(candidate.supplement);
    const existing = deduped.get(key);
    if (!existing) {
      deduped.set(key, {
        ...candidate,
        safetyFlags: Array.from(new Set(candidate.safetyFlags || []))
      } as T);
      continue;
    }

    const mergedFlags = Array.from(new Set([...(existing.safetyFlags || []), ...(candidate.safetyFlags || [])]));
    const existingCaution = existing.cautionLevel;
    const candidateCaution = candidate.cautionLevel;
    const mergedCaution = (() => {
      if (!existingCaution) return candidateCaution;
      if (!candidateCaution) return existingCaution;
      return cautionOrder[candidateCaution] > cautionOrder[existingCaution] ? candidateCaution : existingCaution;
    })();

    const shouldPreferCandidate = candidate.score > existing.score
      || (candidate.score === existing.score && choosePreferredCanonicalSupplement(existing.supplement, candidate.supplement).id === candidate.supplement.id);

    if (shouldPreferCandidate) {
      deduped.set(key, {
        ...candidate,
        safetyFlags: mergedFlags,
        cautionLevel: mergedCaution
      } as T);
    } else {
      deduped.set(key, {
        ...existing,
        safetyFlags: mergedFlags,
        cautionLevel: mergedCaution
      } as T);
    }
  }

  return Array.from(deduped.values());
}

function selectDiverseRecommendations(
  supplements: { supplement: Supplement; score: number; safetyFlags: string[]; cautionLevel?: 'high' | 'moderate' | 'low' }[],
  matchedGoals: MatchedGoal[],
  limit = 6
): { supplement: Supplement; score: number; safetyFlags: string[]; cautionLevel?: 'high' | 'moderate' | 'low' }[] {
  const selected: typeof supplements = [];
  const usedIds = new Set<string>();

  for (const goal of matchedGoals) {
    const candidate = supplements.find(item =>
      !usedIds.has(item.supplement.id) &&
      normalizeGoals(item.supplement.goals).includes(goal.id)
    );
    if (candidate) {
      selected.push(candidate);
      usedIds.add(candidate.supplement.id);
    }
    if (selected.length >= limit) {
      return selected;
    }
  }

  for (const item of supplements) {
    if (selected.length >= limit) break;
    if (!usedIds.has(item.supplement.id)) {
      selected.push(item);
      usedIds.add(item.supplement.id);
    }
  }

  return selected;
}

// ============================================
// PERSONALIZATION
// ============================================

const VEGAN_PRIORITY_SUPPLEMENT_IDS = new Set(['vitamin-b12', 'omega-3', 'iron', 'zinc', 'iodine']);
const VEGETARIAN_PRIORITY_SUPPLEMENT_IDS = new Set(['vitamin-b12', 'iron', 'zinc']);
const FISH_DERIVED_PATTERN = /fish|krill|anchovy|sardine|salmon|cod liver/;

/**
 * Apply user profile adjustments to supplement scoring
 */
function applyProfileAdjustments(
  supplements: { supplement: Supplement; score: number }[],
  profile?: UserProfile
): { supplement: Supplement; score: number }[] {
  if (!profile) return supplements;

  const nutrientPriorityMap = new Map<string, number>();
  for (const target of buildNutrientTargets(profile)) {
    const multiplier = target.priority === 'high' ? 1.35 : target.priority === 'medium' ? 1.2 : 1;
    for (const supplementId of target.supplementIds) {
      nutrientPriorityMap.set(supplementId, Math.max(nutrientPriorityMap.get(supplementId) || 1, multiplier));
    }
  }
  
  return supplements.map(({ supplement, score }) => {
    let adjustedScore = score;
    const normalizedName = normalizeSafetyText(supplement.name);
    const normalizedDescription = normalizeSafetyText(supplement.description || '');
    
    // Diet-based adjustments
    if (profile.diet === 'vegan') {
      if (
        VEGAN_PRIORITY_SUPPLEMENT_IDS.has(supplement.id) ||
        /\bvitamin b12\b|\bomega 3\b|\biron\b|\bzinc\b|\biodine\b/.test(normalizedName)
      ) {
        adjustedScore *= 1.5;
      }
      // Exclude animal-derived omega/fish products for vegan profiles.
      if (FISH_DERIVED_PATTERN.test(normalizedName) || FISH_DERIVED_PATTERN.test(normalizedDescription) || supplement.id === 'krill-oil') {
        adjustedScore = 0;
      }
    }
    
    if (profile.diet === 'vegetarian') {
      if (
        VEGETARIAN_PRIORITY_SUPPLEMENT_IDS.has(supplement.id) ||
        /\bvitamin b12\b|\biron\b|\bzinc\b/.test(normalizedName)
      ) {
        adjustedScore *= 1.3;
      }
    }
    
    // Training style adjustments
    if (profile.trainingStyle === 'strength') {
      if (['Creatine Monohydrate', 'Protein', 'Vitamin D3', 'Zinc', 'Magnesium'].some(n => 
        supplement.name.includes(n)
      )) {
        adjustedScore *= 1.4;
      }
    }
    
    if (profile.trainingStyle === 'endurance') {
      if (['Iron', 'Beetroot', 'L-Citrulline', 'Electrolytes', 'L-Carnitine'].some(n => 
        supplement.name.includes(n)
      )) {
        adjustedScore *= 1.4;
      }
    }
    
    // Age-based adjustments
    if (profile.age === '45-59' || profile.age === '60+') {
      if (['CoQ10', 'Vitamin D3', 'Omega-3', 'Vitamin B12', 'Collagen', 'Calcium'].some(n => 
        supplement.name.includes(n)
      )) {
        adjustedScore *= 1.3;
      }
    }
    
    // Sleep quality adjustments
    if (profile.sleepQuality === 'poor') {
      if (['Magnesium', 'Glycine', 'L-Theanine', 'Melatonin', 'Valerian'].some(n => 
        supplement.name.includes(n)
      )) {
        adjustedScore *= 1.4;
      }
    }
    
    // Stress level adjustments
    if (profile.stressLevel === 'high' || profile.stressLevel === 'very-high') {
      if (['Ashwagandha', 'Rhodiola', 'L-Theanine', 'Magnesium', 'Holy Basil'].some(n => 
        supplement.name.includes(n)
      )) {
        adjustedScore *= 1.4;
      }
    }

    // Caffeine sensitivity adjustments
    if (profile.caffeineIntake === 'high' && isStimulatingSupplement(supplement)) {
      adjustedScore *= 0.8;
    }

    const nutrientBoost = nutrientPriorityMap.get(supplement.id);
    if (nutrientBoost) {
      adjustedScore *= nutrientBoost;
    }

    // Budget/form preference adjustments
    if (profile.budgetLevel === 'budget' && supplement.formGuidance?.forms?.some(form => form.cost === 'high')) {
      adjustedScore *= 0.85;
    }
    if (profile.formPreference && profile.formPreference !== 'any') {
      const hasPreferredForm = supplement.formGuidance?.forms?.some(form =>
        form.name.toLowerCase().includes(profile.formPreference || '')
      );
      if (hasPreferredForm) {
        adjustedScore *= 1.1;
      }
    }
    
    return { supplement, score: adjustedScore };
  });
}

/**
 * Filter out supplements user is already taking
 */
function filterCurrentSupplements(
  supplements: { supplement: Supplement; score: number }[],
  currentSupplements?: string[]
): { supplement: Supplement; score: number }[] {
  if (!currentSupplements || currentSupplements.length === 0) {
    return supplements;
  }
  
  const normalizedCurrent = currentSupplements.map(s => normalizeSupplementName(s).toLowerCase());
  
  return supplements.filter(({ supplement }) => {
    const normalizedName = supplement.name.toLowerCase();
    const knowledgeAliases = (getSupplementKnowledgeById(supplement.id)?.aliases || []).map(alias => alias.toLowerCase());
    // Also check aliases
    const aliases = Object.entries(SUPPLEMENT_ALIASES)
      .filter(([, canonical]) => canonical.toLowerCase() === normalizedName)
      .map(([alias]) => alias);
    
    return !normalizedCurrent.some(current => 
      normalizedName.includes(current) ||
      current.includes(normalizedName) ||
      aliases.some(alias => current.includes(alias)) ||
      knowledgeAliases.some(alias => current.includes(alias) || alias.includes(current))
    );
  });
}

// ============================================
// INTERACTION DETECTION
// ============================================

export interface InteractionWarning {
  supplements: [string, string];
  severity: 'high' | 'moderate' | 'low';
  reason: string;
  recommendation: string;
}

interface InteractionEntityMatch {
  matched: boolean;
  viaSupplement: boolean;
  viaMedication: boolean;
}

const INTERACTION_ENTITY_MEDICATION_PATTERNS: Record<string, string[]> = {
  'thyroid medication': ['levothyroxine', 'liothyronine', 'thyroid', 'synthroid'],
  antidepressants: ['antidepressant', 'ssri', 'snri', 'maoi', 'sertraline', 'fluoxetine', 'venlafaxine'],
  'blood thinners': ['blood thinner', 'warfarin', 'coumadin', 'apixaban', 'rivaroxaban', 'dabigatran', 'heparin'],
  warfarin: ['warfarin', 'coumadin'],
  metformin: ['metformin'],
  maois: ['maoi', 'phenelzine', 'tranylcypromine', 'isocarboxazid'],
  'parkinson s medication': ['levodopa', 'carbidopa', 'pramipexole', 'ropinirole', 'parkinson']
};

function getMedicationPatternsForEntity(entity: string): string[] {
  const normalizedEntity = normalizeSafetyText(entity);
  const mappedPatterns = INTERACTION_ENTITY_MEDICATION_PATTERNS[normalizedEntity] || [];
  const classPatterns = MEDICATION_CLASS_MATCHES[normalizedEntity] || [];
  return Array.from(new Set([normalizedEntity, ...mappedPatterns, ...classPatterns].map(pattern => normalizeSafetyText(pattern)).filter(Boolean)));
}

function matchInteractionEntity(
  entity: string,
  selectedSupplements: Supplement[],
  normalizedMedications: string[]
): InteractionEntityMatch {
  const normalizedEntity = normalizeSafetyText(entity);
  const viaSupplement = selectedSupplements.some(supplement => {
    const normalizedName = normalizeSafetyText(supplement.name);
    const normalizedId = normalizeSafetyText(supplement.id);
    return normalizedIncludes(normalizedName, normalizedEntity) || normalizedIncludes(normalizedId, normalizedEntity);
  });
  const medicationPatterns = getMedicationPatternsForEntity(entity);
  const viaMedication = normalizedMedications.some(medication =>
    medicationPatterns.some(pattern => containsNormalizedPhrase(medication, pattern))
  );
  return {
    matched: viaSupplement || viaMedication,
    viaSupplement,
    viaMedication
  };
}

/**
 * Check for interactions between selected supplements
 */
export function checkInteractions(selectedSupplements: Supplement[], profile?: UserProfile): InteractionWarning[] {
  const warnings: InteractionWarning[] = [];
  const names = selectedSupplements.map(s => s.name);
  const normalizedMedications = (profile?.medications || []).map(medication => normalizeSafetyText(medication)).filter(Boolean);
  const medicationClasses = collectMatchedClasses(normalizedMedications, MEDICATION_CLASS_MATCHES);
  
  // Check predefined high-risk interactions
  for (const interaction of HIGH_RISK_INTERACTIONS) {
    const [entityA, entityB] = interaction.supplements;
    const matchA = matchInteractionEntity(entityA, selectedSupplements, normalizedMedications);
    const matchB = matchInteractionEntity(entityB, selectedSupplements, normalizedMedications);

    if (matchA.matched && matchB.matched && (matchA.viaSupplement || matchB.viaSupplement)) {
      const detectedFromMedication = matchA.viaMedication || matchB.viaMedication;
      warnings.push({
        supplements: interaction.supplements,
        severity: interaction.severity,
        reason: detectedFromMedication ? `${interaction.reason} (detected using your medication list)` : interaction.reason,
        recommendation: interaction.severity === 'high' 
          ? 'Avoid combining these supplements without medical supervision.'
          : 'Consider timing them apart or consult a healthcare provider.'
      });
    }
  }
  
  // Check supplement-specific drug interactions
  for (const supplement of selectedSupplements) {
    if (supplement.drugInteractions && supplement.drugInteractions.length > 0) {
      for (const interaction of supplement.drugInteractions) {
        const directMedicationMatch = normalizedMedications.find(medication => normalizedIncludes(interaction, medication));
        const matchedMedicationClasses = getMatchedMedicationClasses(interaction, medicationClasses);
        if (directMedicationMatch || matchedMedicationClasses.length > 0) {
          const highlightedMedication = directMedicationMatch || matchedMedicationClasses[0];
          const severeMedicationRisk =
            matchedMedicationClasses.some(className => HIGH_RISK_MEDICATION_CLASSES.has(className)) ||
            matchedMedicationClasses.some(className => SEROTONERGIC_MEDICATION_CLASSES.has(className));
          warnings.push({
            supplements: [supplement.name, highlightedMedication || 'Medication'],
            severity: severeMedicationRisk ? 'high' : 'moderate',
            reason: `${supplement.name}: ${interaction}`,
            recommendation: severeMedicationRisk
              ? 'Do not combine without clinician approval.'
              : 'Review this combination with a healthcare provider.'
          });
        }

        // Check if any other selected supplement might interact
        for (const otherSupplement of selectedSupplements) {
          if (otherSupplement.name === supplement.name) continue;
          
          // Check if the interaction mentions something related to the other supplement
          const interactionLower = interaction.toLowerCase();
          const otherNameLower = otherSupplement.name.toLowerCase();
          
          // Look for category matches
          if (
            (interactionLower.includes('blood thinner') && otherSupplement.cautions?.some(c => c.toLowerCase().includes('blood'))) ||
            (interactionLower.includes('sedative') && otherSupplement.goals?.includes('sleep')) ||
            (interactionLower.includes('antidepressant') && ['5-HTP', 'SAMe', 'St. John\'s Wort'].some(n => otherNameLower.includes(n.toLowerCase())))
          ) {
            warnings.push({
              supplements: [supplement.name, otherSupplement.name],
              severity: 'moderate',
              reason: `${supplement.name} interaction warning: ${interaction}`,
              recommendation: 'Review this combination with a healthcare provider.'
            });
          }
        }
      }
    }
  }
  
  // Check avoidIf conditions
  for (const supplement of selectedSupplements) {
    if (supplement.avoidIf && supplement.avoidIf.length > 0) {
      for (const avoidCondition of supplement.avoidIf) {
        // Check if any other supplement is contraindicated
        for (const otherSupplement of selectedSupplements) {
          if (otherSupplement.name === supplement.name) continue;
          
          const conditionLower = avoidCondition.toLowerCase();
          const otherNameLower = otherSupplement.name.toLowerCase();
          
          // Check for specific mentions
          if (conditionLower.includes(otherNameLower) || otherNameLower.includes(conditionLower.split(' ')[0])) {
            warnings.push({
              supplements: [supplement.name, otherSupplement.name],
              severity: 'moderate',
              reason: `${supplement.name}: ${avoidCondition}`,
              recommendation: 'Consider removing one of these from your stack.'
            });
          }
        }
      }
    }
  }
  
  // Check for mineral competition
  const mineralCompetition: { minerals: [string, string]; reason: string }[] = [
    { minerals: ['Iron', 'Calcium'], reason: 'Calcium blocks iron absorption. Take 2+ hours apart.' },
    { minerals: ['Iron', 'Zinc'], reason: 'Iron and zinc compete for absorption. Take at different meals.' },
    { minerals: ['Zinc', 'Copper'], reason: 'Long-term high-dose zinc can deplete copper. Consider copper supplementation.' },
    { minerals: ['Calcium', 'Magnesium'], reason: 'High doses may compete for absorption. Consider splitting doses.' },
  ];
  
  for (const comp of mineralCompetition) {
    const hasMineral1 = names.some(n => n.toLowerCase().includes(comp.minerals[0].toLowerCase()));
    const hasMineral2 = names.some(n => n.toLowerCase().includes(comp.minerals[1].toLowerCase()));
    
    if (hasMineral1 && hasMineral2) {
      // Check if not already warned
      if (!warnings.some(w => 
        (w.supplements[0].includes(comp.minerals[0]) && w.supplements[1].includes(comp.minerals[1])) ||
        (w.supplements[0].includes(comp.minerals[1]) && w.supplements[1].includes(comp.minerals[0]))
      )) {
        warnings.push({
          supplements: comp.minerals,
          severity: 'low',
          reason: comp.reason,
          recommendation: 'Space out these supplements by 2-4 hours for optimal absorption.'
        });
      }
    }
  }
  
  const sedativeSupplements = selectedSupplements.filter(isSedatingSupplement);
  if (sedativeSupplements.length > 2) {
    warnings.push({
      supplements: [sedativeSupplements[0].name, sedativeSupplements[1].name],
      severity: 'high',
      reason: `Stack contains ${sedativeSupplements.length} sedative-leaning supplements (${sedativeSupplements.map(item => item.name).join(', ')}).`,
      recommendation: 'Simplify the stack and avoid multiple sedatives unless specifically guided by a clinician.'
    });
  }

  const summarizeWarningText = (items: string[], maxItems = 2): string => {
    const normalizedSeen = new Set<string>();
    const uniqueItems: string[] = [];
    for (const item of items) {
      const key = normalizeSafetyText(item);
      if (!key || normalizedSeen.has(key)) continue;
      normalizedSeen.add(key);
      uniqueItems.push(item);
    }
    if (uniqueItems.length <= maxItems) {
      return uniqueItems.join('; ');
    }
    return `${uniqueItems.slice(0, maxItems).join('; ')} (+${uniqueItems.length - maxItems} more)`;
  };

  // Deduplicate warnings
  const uniqueWarningsMap = new Map<string, { warning: InteractionWarning; reasons: string[]; recommendations: string[] }>();
  for (const warning of warnings) {
    const pairKey = [normalizeSafetyText(warning.supplements[0]), normalizeSafetyText(warning.supplements[1])].sort().join('|');
    const key = `${pairKey}|${warning.severity}`;
    const existing = uniqueWarningsMap.get(key);
    if (!existing) {
      uniqueWarningsMap.set(key, {
        warning,
        reasons: [warning.reason],
        recommendations: [warning.recommendation]
      });
      continue;
    }
    if (!existing.reasons.some(reason => normalizeSafetyText(reason) === normalizeSafetyText(warning.reason))) {
      existing.reasons.push(warning.reason);
    }
    if (!existing.recommendations.some(rec => normalizeSafetyText(rec) === normalizeSafetyText(warning.recommendation))) {
      existing.recommendations.push(warning.recommendation);
    }
  }
  const uniqueWarnings = Array.from(uniqueWarningsMap.values()).map(({ warning, reasons, recommendations }) => ({
    ...warning,
    reason: summarizeWarningText(reasons),
    recommendation: summarizeWarningText(recommendations)
  }));
  
  // Sort by severity
  return uniqueWarnings.sort((a, b) => {
    const severityOrder = { high: 0, moderate: 1, low: 2 };
    return severityOrder[a.severity] - severityOrder[b.severity];
  });
}

/**
 * Check for redundancy in supplement stack
 */
export function checkRedundancy(selectedSupplements: Supplement[]): string[] {
  const redundancies: string[] = [];
  
  // Check for duplicate vitamins/minerals
  const vitaminMineralMap: Record<string, string[]> = {};
  
  for (const supplement of selectedSupplements) {
    // Check if it's a vitamin or mineral
    if (supplement.type === 'vitamin' || supplement.type === 'mineral') {
      const key = supplement.name.split(' ')[0]; // Get base name
      if (!vitaminMineralMap[key]) {
        vitaminMineralMap[key] = [];
      }
      vitaminMineralMap[key].push(supplement.name);
    }
    
    // Check if B-Complex covers individual B vitamins
    if (supplement.name === 'B-Complex') {
      const bVitamins = selectedSupplements.filter(s => 
        s.name.startsWith('Vitamin B') && s.name !== 'B-Complex'
      );
      if (bVitamins.length > 0) {
        redundancies.push(`B-Complex already contains ${bVitamins.map(b => b.name).join(', ')}. You may be doubling up.`);
      }
    }
    
    // Check if multivitamin covers individual supplements
    if (supplement.name.toLowerCase().includes('multivitamin')) {
      const coveredSupps = selectedSupplements.filter(s => 
        ['vitamin', 'mineral'].includes(s.type) && !s.name.includes('multivitamin')
      );
      if (coveredSupps.length > 0) {
        redundancies.push(`Your multivitamin may already contain ${coveredSupps.slice(0, 3).map(s => s.name).join(', ')}. Check labels to avoid overdosing.`);
      }
    }
  }
  
  // Check for similar adaptogens
  const adaptogens = selectedSupplements.filter(s => 
    ['Ashwagandha', 'Rhodiola Rosea', 'Panax Ginseng', 'Eleuthero', 'Holy Basil (Tulsi)', 'Schisandra'].some(a => 
      s.name.includes(a)
    )
  );
  
  if (adaptogens.length > 2) {
    redundancies.push(`You have ${adaptogens.length} adaptogens (${adaptogens.map(a => a.name).join(', ')}). Consider starting with 1-2 and adding more only if needed.`);
  }
  
  // Check for multiple sleep aids
  const sleepAids = selectedSupplements.filter(s => 
    s.goals?.includes('sleep') && 
    ['Melatonin', 'Valerian', 'Magnesium', 'Glycine', 'L-Theanine', 'GABA', 'Passionflower'].some(a => 
      s.name.includes(a)
    )
  );
  
  if (sleepAids.length > 3) {
    redundancies.push(`You have ${sleepAids.length} sleep-supporting supplements. Start with 1-2 to assess effectiveness before adding more.`);
  }
  
  return redundancies;
}

// ============================================
// MAIN ANALYSIS FUNCTION
// ============================================

/**
 * Analyze user goal and return recommendations
 */
export function analyzeGoal(
  input: string,
  supplements: Supplement[],
  profile?: UserProfile,
  trackingData?: TrackingData
): GoalAnalysis {
  // Parse input with negation awareness
  const tokens = parseInput(input);
  const context = extractQueryContext(input, profile);
  
  // Identify goals and systems
  let matchedGoals = identifyGoals(tokens);
  let matchedSystems = identifySystems(tokens);

  let matchType: GoalAnalysis['matchType'] = (matchedGoals.length || matchedSystems.length) ? 'keyword' : 'none';
  let directMatchIds: string[] = [];
  let relatedMatchIds: string[] = [];
  let inferredGoals: string[] = [];
  let inferredSystems: string[] = [];

  if (matchType === 'none') {
    const directMatches = findDirectSupplementMatches(input, supplements);
    if (directMatches.supplements.length > 0) {
      matchType = 'direct';
      directMatchIds = directMatches.supplements.map(s => s.id);
      inferredGoals = directMatches.inferredGoals;
      inferredSystems = directMatches.inferredSystems;
      matchedGoals = buildMatchedGoals(inferredGoals);
      matchedSystems = buildMatchedSystems(inferredSystems);
      relatedMatchIds = findRelatedSupplements(directMatches.supplements, supplements).map(s => s.id);
    }
  }

  if (matchType === 'none') {
    const semanticMatches = findSemanticMatches(supplements, tokens);
    if (semanticMatches.supplements.length > 0 || semanticMatches.inferredGoals.length > 0) {
      matchType = 'semantic';
      directMatchIds = semanticMatches.supplements.map(s => s.id);
      inferredGoals = semanticMatches.inferredGoals;
      inferredSystems = semanticMatches.inferredSystems;
      matchedGoals = buildMatchedGoals(inferredGoals);
      matchedSystems = buildMatchedSystems(inferredSystems);
      relatedMatchIds = findRelatedSupplements(semanticMatches.supplements, supplements).map(s => s.id);
    }
  }

  if (matchType === 'none') {
    const intentMatches = findIntentSimilarityMatches(input);
    if (intentMatches.inferredGoals.length > 0 || intentMatches.inferredSystems.length > 0) {
      matchType = 'semantic';
      inferredGoals = intentMatches.inferredGoals;
      inferredSystems = intentMatches.inferredSystems;
      matchedGoals = buildMatchedGoals(inferredGoals);
      matchedSystems = buildMatchedSystems(inferredSystems);
    }
  }

  const lexicalGoalHint = matchedGoals[0]?.id;
  const lexicalMatches = searchSupplementsWithScores(input, supplements, {
    gender: profile?.sex,
    goal: lexicalGoalHint,
  });
  const lexicalScoreById = new Map(lexicalMatches.map((entry) => [entry.supplement.id, entry.score]));
  
  // Score all supplements
  let scoredSupplements = supplements.map(supplement => {
    let score = scoreSupplementForGoals(supplement, matchedGoals, matchedSystems);
    const lexicalScore = lexicalScoreById.get(supplement.id) || 0;
    if (lexicalScore > 0) {
      // Keep lexical influence meaningful but lower than semantic/goal safety-aware ranking.
      const lexicalWeight = matchedGoals.length > 0 || matchedSystems.length > 0 ? 0.16 : 0.28;
      score += Math.min(45, lexicalScore * lexicalWeight);
    }
    if (matchType === 'direct' && directMatchIds.includes(supplement.id)) {
      score += 25;
    }
    if (matchType === 'semantic' && directMatchIds.includes(supplement.id)) {
      score += 18;
    }
    return { supplement, score };
  });
  
  // Filter out zero scores
  scoredSupplements = scoredSupplements.filter(({ score }) => score > 0);
  
  // Apply profile adjustments
  scoredSupplements = applyProfileAdjustments(scoredSupplements, profile);

  // Apply context adjustments
  scoredSupplements = applyContextAdjustments(scoredSupplements, context);
  
  // Filter out current supplements
  scoredSupplements = filterCurrentSupplements(scoredSupplements, profile?.currentSupplements);
  scoredSupplements = dedupeScoredSupplementsByCanonical(scoredSupplements);

  // Apply safety screening
  let screenedSupplements = applySafetyScreening(scoredSupplements, profile);

  // Apply tracking adjustments
  screenedSupplements = applyTrackingAdjustments(screenedSupplements, trackingData);
  screenedSupplements = dedupeScoredSupplementsByCanonical(screenedSupplements);

  // Filter out zero scores after adjustments
  screenedSupplements = screenedSupplements.filter(({ score }) => score > 0);
  
  // Sort by score
  screenedSupplements.sort((a, b) => b.score - a.score);
  
  // Take top recommendations (limit to 6-8)
  const topSupplements = selectDiverseRecommendations(screenedSupplements, matchedGoals, 8);

  const buildRecommendation = ({
    supplement,
    score,
    safetyFlags,
    cautionLevel
  }: {
    supplement: Supplement;
    score: number;
    safetyFlags?: string[];
    cautionLevel?: 'high' | 'moderate' | 'low';
  }): RecommendedSupplement => ({
    supplement,
    priority: determinePriority(score, supplement.evidence),
    reason: generateReason(supplement, matchedGoals, matchedSystems),
    relevanceScore: Math.min(100, Math.round(score)),
    safetyFlags: safetyFlags ?? [],
    cautionLevel
  });
  
  // Generate recommendations with reasons
  const recommendations: RecommendedSupplement[] = topSupplements.map((item) => buildRecommendation(item));
  
  // Ensure we have a good mix of priorities
  const essential = recommendations.filter(r => r.priority === 'essential').slice(0, 2);
  const beneficial = recommendations.filter(r => r.priority === 'beneficial').slice(0, 3);
  const optional = recommendations.filter(r => r.priority === 'optional').slice(0, 2);
  
  const desiredCount = 6;
  let finalRecommendations: RecommendedSupplement[] = [...essential, ...beneficial, ...optional].slice(0, desiredCount);
  if (finalRecommendations.length < desiredCount) {
    const selectedIds = new Set(finalRecommendations.map(r => r.supplement.id));
    for (const rec of recommendations) {
      if (finalRecommendations.length >= desiredCount) break;
      if (!selectedIds.has(rec.supplement.id)) {
        finalRecommendations.push(rec);
        selectedIds.add(rec.supplement.id);
      }
    }
  }

  if (matchedGoals.some(goal => goal.id === 'sleep')) {
    const sleepTargetIds = new Set<string>();
    if (profile) {
      for (const target of buildNutrientTargets(profile)) {
        if (target.rationale.some(item => item.toLowerCase().includes('sleep'))) {
          for (const supplementId of target.supplementIds) {
            sleepTargetIds.add(supplementId);
          }
        }
      }
    }

    const sleepCandidates = screenedSupplements
      .filter(({ supplement }) => normalizeGoals(supplement.goals).includes('sleep') || sleepTargetIds.has(supplement.id))
      .sort((a, b) => b.score - a.score);

    const sleepRecommendations = new Map<string, RecommendedSupplement>();
    for (const { supplement, score, safetyFlags, cautionLevel } of sleepCandidates) {
      if (!sleepRecommendations.has(supplement.id)) {
        sleepRecommendations.set(supplement.id, buildRecommendation({ supplement, score, safetyFlags, cautionLevel }));
      }
    }

    if (sleepRecommendations.size > 0) {
      const mergedRecommendations = new Map<string, RecommendedSupplement>();
      for (const rec of finalRecommendations) {
        mergedRecommendations.set(rec.supplement.id, rec);
      }
      for (const rec of sleepRecommendations.values()) {
        mergedRecommendations.set(rec.supplement.id, rec);
      }
      finalRecommendations = Array.from(mergedRecommendations.values());
    }
  }

  const screenedById = new Map(screenedSupplements.map((entry) => [entry.supplement.id, entry]));
  const lexicalAnchorIds = lexicalMatches
    .map((entry) => entry.supplement.id)
    .filter((id, index, ids) => ids.indexOf(id) === index && screenedById.has(id))
    .slice(0, 4);

  if (lexicalAnchorIds.length > 0) {
    const lexicalSet = new Set(lexicalAnchorIds);
    const targetLexicalCoverage = matchedGoals.length > 0 || matchedSystems.length > 0 ? 2 : 1;
    let lexicalCoverage = finalRecommendations.filter((rec) => lexicalSet.has(rec.supplement.id)).length;
    const selectedIds = new Set(finalRecommendations.map((rec) => rec.supplement.id));

    for (const lexicalId of lexicalAnchorIds) {
      if (lexicalCoverage >= targetLexicalCoverage) break;
      if (selectedIds.has(lexicalId)) continue;

      const candidate = screenedById.get(lexicalId);
      if (!candidate) continue;

      const replacementIndex = [...finalRecommendations]
        .map((rec, index) => ({ rec, index }))
        .reverse()
        .find(({ rec }) => !lexicalSet.has(rec.supplement.id))
        ?.index;

      if (replacementIndex === undefined && finalRecommendations.length >= desiredCount) {
        break;
      }

      const candidateRecommendation = buildRecommendation(candidate);
      if (replacementIndex === undefined) {
        finalRecommendations.push(candidateRecommendation);
      } else {
        const replacedId = finalRecommendations[replacementIndex].supplement.id;
        selectedIds.delete(replacedId);
        finalRecommendations[replacementIndex] = candidateRecommendation;
      }

      selectedIds.add(lexicalId);
      lexicalCoverage += 1;
    }
  }
  
  const matchTypeSignal: Record<NonNullable<GoalAnalysis['matchType']>, number> = {
    direct: 0.28,
    keyword: 0.24,
    semantic: 0.18,
    none: 0.05
  };
  const goalSignal = Math.min(0.35, matchedGoals.length * 0.09);
  const systemSignal = Math.min(0.2, matchedSystems.length * 0.06);
  const recommendationSignal = Math.min(0.2, finalRecommendations.length * 0.03);
  const highRiskPenalty = finalRecommendations.some(rec => rec.cautionLevel === 'high') ? 0.08 : 0;
  const confidence = Math.max(
    0.15,
    Math.min(
      0.95,
      matchTypeSignal[matchType ?? 'none'] + goalSignal + systemSignal + recommendationSignal - highRiskPenalty
    )
  );

  const recommendedStacks = getRecommendedStacks(profile, matchedGoals.map(goal => goal.id));
  const tips = generateTips(matchedGoals, profile);
  if (recommendedStacks.length > 0 && matchedGoals.some(goal => INTIMACY_GOALS.has(goal.id))) {
    tips.unshift('Consider a pre-made intimacy or reproductive health stack to combine synergistic nutrients and adaptogens.');
  }

  return {
    query: input,
    identifiedGoals: matchedGoals.map(g => g.id),
    identifiedSystems: matchedSystems.map(s => s.id),
    recommendations: finalRecommendations,
    tips,
    recommendedStacks,
    matchType,
    confidence,
    directSupplements: directMatchIds,
    relatedSupplements: relatedMatchIds,
    inferredGoals,
    inferredSystems
  };
}

export function useGoalAnalysis(
  input: string,
  supplements: Supplement[],
  profile?: UserProfile,
  trackingData?: TrackingData
): GoalAnalysis {
  return useMemo(
    () => analyzeGoal(input, supplements, profile, trackingData),
    [input, supplements, profile, trackingData]
  );
}

/**
 * Generate contextual tips based on goals and profile
 */
function generateTips(matchedGoals: MatchedGoal[], profile?: UserProfile): string[] {
  const tips: string[] = [];
  
  // Goal-specific tips
  for (const goal of matchedGoals.slice(0, 2)) {
    switch (goal.id) {
      case 'sleep':
        tips.push('For sleep: Avoid screens 1 hour before bed, keep bedroom cool (65-68°F), and maintain consistent sleep/wake times.');
        break;
      case 'stress':
        tips.push('For stress: Deep breathing, regular exercise, and limiting caffeine can enhance supplement effectiveness.');
        break;
      case 'energy':
        tips.push('For energy: Ensure adequate sleep, stay hydrated, and consider timing supplements in the morning.');
        break;
      case 'focus':
        tips.push('For focus: Minimize multitasking, take regular breaks, and consider time-blocking your work.');
        break;
      case 'digestion':
        tips.push('For digestion: Eat slowly, chew thoroughly, and consider spacing supplements away from meals if GI upset occurs.');
        break;
      case 'immunity':
        tips.push('For immunity: Prioritize sleep, manage stress, and maintain good hand hygiene alongside supplementation.');
        break;
      case 'fitness':
        tips.push('For fitness: Time protein/creatine around workouts, stay hydrated, and allow adequate recovery between sessions.');
        break;
      case 'metabolic':
        tips.push('For blood sugar: Balance meals with protein/fiber, reduce late-night sugar, and prioritize daily movement.');
        break;
      case 'detox':
        tips.push('For liver support: Limit alcohol, stay hydrated, and emphasize cruciferous vegetables.');
        break;
      case 'longevity':
        tips.push('For longevity: Focus on sleep, resistance training, and a nutrient-dense diet alongside supplements.');
        break;
    }
  }
  
  // Profile-specific tips
  if (profile) {
    if (profile.diet === 'vegan') {
      tips.push('As a vegan, pay special attention to B12, omega-3 (algae-based), iron, and zinc status.');
    }
    if (profile.sleepQuality === 'poor') {
      tips.push('With poor sleep, prioritize sleep hygiene alongside supplements. Magnesium and glycine work best with consistent sleep timing.');
    }
    if (profile.stressLevel === 'high' || profile.stressLevel === 'very-high') {
      tips.push('High stress increases nutrient depletion. Consider a B-complex and magnesium as foundational support.');
    }
  }
  
  // Add general tip
  tips.push('Start with 1-2 supplements, assess for 2-4 weeks, then add more if needed. More is not always better.');
  
  return tips.slice(0, 4);
}

// ============================================
// TIMING SUGGESTIONS
// ============================================

export interface TimingSchedule {
  morning: Supplement[];
  midday: Supplement[];
  evening: Supplement[];
  bedtime: Supplement[];
  withMeals: Supplement[];
  awayFromMeals: Supplement[];
}

/**
 * Generate optimal timing schedule for supplements
 */
export function generateTimingSchedule(supplements: Supplement[]): TimingSchedule {
  const schedule: TimingSchedule = {
    morning: [],
    midday: [],
    evening: [],
    bedtime: [],
    withMeals: [],
    awayFromMeals: []
  };

  const pushUnique = (list: Supplement[], supplement: Supplement) => {
    if (!list.some(item => item.id === supplement.id)) {
      list.push(supplement);
    }
  };

  const timingKeywords = {
    morning: ['morning', 'breakfast'],
    midday: ['midday', 'lunch', 'afternoon'],
    evening: ['evening', 'dinner'],
    bedtime: ['bedtime', 'before bed', 'before sleep']
  };

  for (const supplement of supplements) {
    const timing = supplement.timing?.toLowerCase() || '';
    const name = supplement.name.toLowerCase();

    const hasMorning = timingKeywords.morning.some(keyword => timing.includes(keyword));
    const hasMidday = timingKeywords.midday.some(keyword => timing.includes(keyword));
    const hasEvening = timingKeywords.evening.some(keyword => timing.includes(keyword));
    const hasBedtime = timingKeywords.bedtime.some(keyword => timing.includes(keyword));

    // Determine time of day (allow multiple matches)
    if (hasMorning) {
      pushUnique(schedule.morning, supplement);
    }
    if (hasMidday) {
      pushUnique(schedule.midday, supplement);
    }
    if (hasEvening) {
      pushUnique(schedule.evening, supplement);
    }
    if (hasBedtime) {
      pushUnique(schedule.bedtime, supplement);
    }

    if (!hasMorning && !hasMidday && !hasEvening && !hasBedtime) {
      // Default based on supplement type/name
      if (['melatonin', 'valerian', 'glycine', 'gaba', 'magnesium'].some(s => name.includes(s))) {
        pushUnique(schedule.bedtime, supplement);
      } else if (['caffeine', 'vitamin d', 'b-complex', 'iron', 'cordyceps', 'ginseng', 'rhodiola'].some(s => name.includes(s))) {
        pushUnique(schedule.morning, supplement);
      } else if (['creatine', 'protein', 'bcaa', 'eaa', 'citrulline'].some(s => name.includes(s))) {
        pushUnique(schedule.midday, supplement); // Around workout
      } else {
        pushUnique(schedule.morning, supplement); // Default to morning
      }
    }
    
    // Determine meal timing
    if (timing.includes('with food') || timing.includes('with meal') || timing.includes('with fat')) {
      schedule.withMeals.push(supplement);
    } else if (timing.includes('empty stomach') || timing.includes('without food') || timing.includes('away from')) {
      schedule.awayFromMeals.push(supplement);
    }
  }
  
  return schedule;
}
