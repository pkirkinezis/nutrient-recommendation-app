/**
 * NutriCompass Goal Analyzer
 * Improved parsing with negation handling, word boundaries, and comprehensive interaction detection
 */

import { Supplement, UserProfile, GoalAnalysis, RecommendedSupplement } from '../types';
import { 
  GOAL_CATEGORIES, 
  SYSTEM_DEFINITIONS,
  NEGATION_WORDS,
  NEGATION_WINDOW,
  SUPPLEMENT_ALIASES,
  HIGH_RISK_INTERACTIONS,
  normalizeSupplementName
} from '../constants/taxonomy';

// ============================================
// TOKENIZATION & PARSING
// ============================================

interface Token {
  word: string;
  index: number;
  isNegated: boolean;
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
    isNegated: isTokenNegated(tokens, index)
  }));
}

/**
 * Check if a keyword matches in the token list (with word boundaries)
 * Returns true only if found and NOT negated
 */
function matchKeyword(tokens: Token[], keyword: string): boolean {
  const keywordTokens = tokenize(keyword);
  
  for (let i = 0; i <= tokens.length - keywordTokens.length; i++) {
    let match = true;
    let anyNegated = false;
    
    for (let j = 0; j < keywordTokens.length; j++) {
      if (tokens[i + j].word !== keywordTokens[j]) {
        match = false;
        break;
      }
      if (tokens[i + j].isNegated) {
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
 */
function matchPartialKeyword(tokens: Token[], keyword: string): boolean {
  const keywordLower = keyword.toLowerCase();
  
  for (const token of tokens) {
    // Check if token contains keyword or keyword contains token
    if (token.word.includes(keywordLower) || keywordLower.includes(token.word)) {
      if (!token.isNegated) {
        return true;
      }
    }
  }
  
  return false;
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
 * Analyze input text to identify health goals
 */
function identifyGoals(tokens: Token[]): MatchedGoal[] {
  const goals: MatchedGoal[] = [];
  
  for (const category of GOAL_CATEGORIES) {
    const matchedKeywords: string[] = [];
    
    for (const keyword of category.keywords) {
      if (matchKeyword(tokens, keyword) || matchPartialKeyword(tokens, keyword)) {
        matchedKeywords.push(keyword);
      }
    }
    
    if (matchedKeywords.length > 0) {
      goals.push({
        id: category.id,
        label: category.label,
        score: matchedKeywords.length,
        matchedKeywords
      });
    }
  }
  
  // Sort by score (number of matched keywords)
  return goals.sort((a, b) => b.score - a.score);
}

/**
 * Analyze input text to identify body systems
 */
function identifySystems(tokens: Token[]): MatchedSystem[] {
  const systems: MatchedSystem[] = [];
  
  for (const system of SYSTEM_DEFINITIONS) {
    let score = 0;
    
    for (const keyword of system.keywords) {
      if (matchKeyword(tokens, keyword) || matchPartialKeyword(tokens, keyword)) {
        score++;
      }
    }
    
    if (score > 0) {
      systems.push({
        id: system.id,
        label: system.label,
        score
      });
    }
  }
  
  return systems.sort((a, b) => b.score - a.score);
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
  
  // Score based on goals
  for (const goal of matchedGoals) {
    if (supplement.goals?.includes(goal.id)) {
      score += goal.score * 10;
    }
    // Check benefits text for goal keywords
    for (const keyword of goal.matchedKeywords) {
      if (supplement.benefits?.some(b => b.toLowerCase().includes(keyword))) {
        score += 2;
      }
      if (supplement.description?.toLowerCase().includes(keyword)) {
        score += 1;
      }
    }
  }
  
  // Score based on systems
  for (const system of matchedSystems) {
    if (supplement.systems?.includes(system.id)) {
      score += system.score * 5;
    }
  }
  
  // Boost for evidence level
  if (supplement.evidence === 'strong') {
    score *= 1.3;
  } else if (supplement.evidence === 'moderate') {
    score *= 1.1;
  }
  
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
  
  // Find which goals this supplement addresses
  const addressedGoals = matchedGoals.filter(g => 
    supplement.goals?.includes(g.id) ||
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
    supplement.systems?.includes(s.id)
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
// PERSONALIZATION
// ============================================

/**
 * Apply user profile adjustments to supplement scoring
 */
function applyProfileAdjustments(
  supplements: { supplement: Supplement; score: number }[],
  profile?: UserProfile
): { supplement: Supplement; score: number }[] {
  if (!profile) return supplements;
  
  return supplements.map(({ supplement, score }) => {
    let adjustedScore = score;
    
    // Diet-based adjustments
    if (profile.diet === 'vegan') {
      if (['Vitamin B12', 'Omega-3', 'Iron', 'Zinc'].includes(supplement.name)) {
        adjustedScore *= 1.5;
      }
      // Exclude fish-based supplements
      if (supplement.name.includes('Fish') || supplement.description?.includes('fish-derived')) {
        adjustedScore = 0;
      }
    }
    
    if (profile.diet === 'vegetarian') {
      if (['Vitamin B12', 'Iron'].includes(supplement.name)) {
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
    // Also check aliases
    const aliases = Object.entries(SUPPLEMENT_ALIASES)
      .filter(([, canonical]) => canonical.toLowerCase() === normalizedName)
      .map(([alias]) => alias);
    
    return !normalizedCurrent.some(current => 
      normalizedName.includes(current) ||
      current.includes(normalizedName) ||
      aliases.some(alias => current.includes(alias))
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

/**
 * Check for interactions between selected supplements
 */
export function checkInteractions(selectedSupplements: Supplement[]): InteractionWarning[] {
  const warnings: InteractionWarning[] = [];
  const names = selectedSupplements.map(s => s.name);
  
  // Check predefined high-risk interactions
  for (const interaction of HIGH_RISK_INTERACTIONS) {
    const [supp1, supp2] = interaction.supplements;
    
    // Fuzzy match supplement names
    const hasSupp1 = names.some(n => 
      n.toLowerCase().includes(supp1.toLowerCase()) ||
      supp1.toLowerCase().includes(n.toLowerCase())
    );
    const hasSupp2 = names.some(n => 
      n.toLowerCase().includes(supp2.toLowerCase()) ||
      supp2.toLowerCase().includes(n.toLowerCase())
    );
    
    if (hasSupp1 && hasSupp2) {
      warnings.push({
        supplements: interaction.supplements,
        severity: interaction.severity,
        reason: interaction.reason,
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
  
  // Deduplicate warnings
  const uniqueWarnings = warnings.filter((warning, index, self) => 
    index === self.findIndex(w => 
      (w.supplements[0] === warning.supplements[0] && w.supplements[1] === warning.supplements[1]) ||
      (w.supplements[0] === warning.supplements[1] && w.supplements[1] === warning.supplements[0])
    )
  );
  
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
  profile?: UserProfile
): GoalAnalysis {
  // Parse input with negation awareness
  const tokens = parseInput(input);
  
  // Identify goals and systems
  const matchedGoals = identifyGoals(tokens);
  const matchedSystems = identifySystems(tokens);
  
  // Score all supplements
  let scoredSupplements = supplements.map(supplement => ({
    supplement,
    score: scoreSupplementForGoals(supplement, matchedGoals, matchedSystems)
  }));
  
  // Filter out zero scores
  scoredSupplements = scoredSupplements.filter(({ score }) => score > 0);
  
  // Apply profile adjustments
  scoredSupplements = applyProfileAdjustments(scoredSupplements, profile);
  
  // Filter out current supplements
  scoredSupplements = filterCurrentSupplements(scoredSupplements, profile?.currentSupplements);
  
  // Sort by score
  scoredSupplements.sort((a, b) => b.score - a.score);
  
  // Take top recommendations (limit to 6-8)
  const topSupplements = scoredSupplements.slice(0, 8);
  
  // Generate recommendations with reasons
  const recommendations: RecommendedSupplement[] = topSupplements.map(({ supplement, score }) => ({
    supplement,
    priority: determinePriority(score, supplement.evidence),
    reason: generateReason(supplement, matchedGoals, matchedSystems),
    relevanceScore: Math.min(100, Math.round(score))
  }));
  
  // Ensure we have a good mix of priorities
  const essential = recommendations.filter(r => r.priority === 'essential').slice(0, 2);
  const beneficial = recommendations.filter(r => r.priority === 'beneficial').slice(0, 3);
  const optional = recommendations.filter(r => r.priority === 'optional').slice(0, 2);
  
  const finalRecommendations = [...essential, ...beneficial, ...optional].slice(0, 6);
  
  return {
    query: input,
    identifiedGoals: matchedGoals.map(g => g.id),
    identifiedSystems: matchedSystems.map(s => s.id),
    recommendations: finalRecommendations,
    tips: generateTips(matchedGoals, profile)
  };
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
  
  for (const supplement of supplements) {
    const timing = supplement.timing?.toLowerCase() || '';
    const name = supplement.name.toLowerCase();
    
    // Determine time of day
    if (timing.includes('morning') || timing.includes('breakfast')) {
      schedule.morning.push(supplement);
    } else if (timing.includes('evening') || timing.includes('dinner')) {
      schedule.evening.push(supplement);
    } else if (timing.includes('bedtime') || timing.includes('before bed') || timing.includes('before sleep')) {
      schedule.bedtime.push(supplement);
    } else if (timing.includes('midday') || timing.includes('lunch') || timing.includes('afternoon')) {
      schedule.midday.push(supplement);
    } else {
      // Default based on supplement type/name
      if (['melatonin', 'valerian', 'glycine', 'gaba', 'magnesium'].some(s => name.includes(s))) {
        schedule.bedtime.push(supplement);
      } else if (['caffeine', 'vitamin d', 'b-complex', 'iron', 'cordyceps', 'ginseng', 'rhodiola'].some(s => name.includes(s))) {
        schedule.morning.push(supplement);
      } else if (['creatine', 'protein', 'bcaa', 'eaa', 'citrulline'].some(s => name.includes(s))) {
        schedule.midday.push(supplement); // Around workout
      } else {
        schedule.morning.push(supplement); // Default to morning
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
