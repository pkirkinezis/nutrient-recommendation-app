import { Supplement, Recommendation, AnalyzedGoal, UserProfile } from '../types/index';
import { supplements } from '../data/supplements';

// Keyword mappings for goal interpretation
const goalKeywords: Record<string, string[]> = {
  'stress': ['stress', 'stressed', 'cortisol', 'overwhelm', 'burnout', 'pressure', 'tense', 'tension'],
  'anxiety': ['anxiety', 'anxious', 'nervous', 'worry', 'worried', 'panic', 'calm', 'calming', 'relax'],
  'sleep': ['sleep', 'insomnia', 'tired', 'rest', 'restless', 'wake', 'waking', 'night', 'bed', 'morning'],
  'energy': ['energy', 'fatigue', 'exhausted', 'tired', 'vitality', 'vigor', 'stamina', 'lethargy', 'sluggish'],
  'focus': ['focus', 'concentration', 'attention', 'distract', 'adhd', 'brain fog', 'mental clarity', 'sharp'],
  'memory': ['memory', 'remember', 'forget', 'forgetful', 'recall', 'cognitive', 'brain', 'learning'],
  'mood': ['mood', 'depression', 'depressed', 'sad', 'happy', 'happiness', 'emotional', 'mental health'],
  'immunity': ['immune', 'immunity', 'cold', 'flu', 'sick', 'infection', 'illness', 'health'],
  'muscle': ['muscle', 'strength', 'gym', 'workout', 'exercise', 'gains', 'bodybuilding', 'lifting'],
  'recovery': ['recovery', 'recover', 'soreness', 'sore', 'doms', 'healing', 'repair'],
  'testosterone': ['testosterone', 'libido', 'sex', 'sexual', 'drive', 'hormone', 'hormonal', 'low t'],
  'digestion': ['digestion', 'digestive', 'gut', 'stomach', 'bloating', 'bloated', 'ibs', 'bowel'],
  'inflammation': ['inflammation', 'inflammatory', 'pain', 'joint', 'joints', 'arthritis', 'swelling'],
  'skin': ['skin', 'acne', 'wrinkles', 'aging', 'collagen', 'complexion', 'beauty', 'glow'],
  'hair': ['hair', 'hairloss', 'balding', 'thinning', 'growth'],
  'heart': ['heart', 'cardiovascular', 'blood pressure', 'cholesterol', 'circulation'],
  'liver': ['liver', 'detox', 'detoxification', 'cleanse', 'hangover', 'alcohol'],
  'longevity': ['longevity', 'aging', 'anti-aging', 'lifespan', 'healthspan'],
  'vegan': ['vegan', 'vegetarian', 'plant-based', 'b12'],
  'athletic': ['athletic', 'athlete', 'sports', 'performance', 'endurance', 'marathon', 'training'],
  'weight': ['weight', 'fat', 'metabolism', 'metabolic', 'obesity', 'lose weight', 'body composition'],
  'hormonal-balance': ['hormonal', 'hormone', 'pms', 'menopause', 'period', 'cycle', 'fertility'],
};

// System mappings
const systemKeywords: Record<string, string[]> = {
  'nervous': ['stress', 'anxiety', 'sleep', 'focus', 'memory', 'mood', 'brain', 'mental', 'cognitive', 'nervous', 'calm'],
  'endocrine': ['hormone', 'hormonal', 'testosterone', 'thyroid', 'cortisol', 'adrenal', 'libido', 'fertility'],
  'immune': ['immune', 'immunity', 'cold', 'flu', 'infection', 'sick', 'inflammation'],
  'cardiovascular': ['heart', 'blood pressure', 'cholesterol', 'circulation', 'cardiovascular'],
  'digestive': ['digestion', 'gut', 'stomach', 'bloating', 'ibs', 'bowel', 'digestive'],
  'muscular': ['muscle', 'strength', 'recovery', 'athletic', 'soreness', 'exercise'],
  'skeletal': ['bone', 'joint', 'arthritis', 'osteoporosis', 'skeleton'],
  'skin': ['skin', 'hair', 'nail', 'acne', 'wrinkle', 'beauty', 'collagen'],
  'hepatic': ['liver', 'detox', 'hangover', 'alcohol'],
  'respiratory': ['respiratory', 'lung', 'breathing', 'asthma'],
  'reproductive': ['fertility', 'libido', 'sexual', 'reproductive', 'menopause', 'pms'],
  'energy': ['energy', 'fatigue', 'tired', 'vitality', 'stamina', 'mitochondria'],
};

export function analyzeGoal(query: string, userProfile?: UserProfile): AnalyzedGoal {
  const lowerQuery = query.toLowerCase();
  
  // Identify goals from query
  const identifiedGoals: string[] = [];
  for (const [goal, keywords] of Object.entries(goalKeywords)) {
    if (keywords.some(kw => lowerQuery.includes(kw))) {
      identifiedGoals.push(goal);
    }
  }
  
  // Identify systems from query
  const identifiedSystems: string[] = [];
  for (const [system, keywords] of Object.entries(systemKeywords)) {
    if (keywords.some(kw => lowerQuery.includes(kw))) {
      identifiedSystems.push(system);
    }
  }
  
  // If no goals identified, try to extract general wellness intent
  if (identifiedGoals.length === 0) {
    if (lowerQuery.includes('health') || lowerQuery.includes('wellness') || lowerQuery.includes('better')) {
      identifiedGoals.push('energy', 'immunity');
    }
  }
  
  // Score and rank supplements
  const recommendations = getRecommendations(identifiedGoals, identifiedSystems, userProfile);
  
  return {
    originalQuery: query,
    identifiedGoals,
    identifiedSystems,
    recommendations,
  };
}

function getRecommendations(
  goals: string[], 
  systems: string[], 
  userProfile?: UserProfile
): Recommendation[] {
  const scoredSupplements: { supplement: Supplement; score: number; reasons: string[] }[] = [];
  
  for (const supplement of supplements) {
    let score = 0;
    const reasons: string[] = [];
    
    // Score based on goal matches
    for (const goal of goals) {
      const matchingGoals = supplement.goals.filter(g => 
        g.toLowerCase().includes(goal.toLowerCase()) || 
        goal.toLowerCase().includes(g.toLowerCase())
      );
      if (matchingGoals.length > 0) {
        score += 10 * matchingGoals.length;
        reasons.push(`Supports ${goal}`);
      }
    }
    
    // Score based on system matches
    for (const system of systems) {
      if (supplement.systems.includes(system)) {
        score += 5;
        reasons.push(`Supports ${system} system`);
      }
    }
    
    // Bonus for strong evidence
    if (supplement.evidence === 'strong') {
      score += 8;
    } else if (supplement.evidence === 'moderate') {
      score += 4;
    }
    
    // User profile adjustments
    if (userProfile) {
      // Vegan/vegetarian considerations
      if ((userProfile.dietType === 'vegan' || userProfile.dietType === 'vegetarian')) {
        if (supplement.goals.includes('vegan') || supplement.goals.includes('vegetarian')) {
          score += 5;
        }
        if (supplement.id === 'vitamin-b12' || supplement.id === 'omega-3') {
          score += 10; // Essential for plant-based diets
          reasons.push('Important for plant-based diet');
        }
      }
      
      // Age considerations
      if (userProfile.ageRange === 'over-60') {
        if (supplement.id === 'vitamin-d3' || supplement.id === 'vitamin-b12' || supplement.id === 'coq10') {
          score += 5;
        }
      }
      
      // Training style
      if (userProfile.trainingStyle === 'endurance') {
        if (supplement.id === 'cordyceps' || supplement.id === 'omega-3' || supplement.id === 'iron') {
          score += 5;
        }
      }
      if (userProfile.trainingStyle === 'strength') {
        if (supplement.id === 'creatine' || supplement.id === 'vitamin-d3' || supplement.id === 'zinc') {
          score += 5;
        }
      }
      
      // Check for current supplements to avoid redundancy
      if (userProfile.currentSupplements?.some(s => 
        s.toLowerCase().includes(supplement.name.toLowerCase().split(' ')[0])
      )) {
        score -= 20; // Already taking this
      }
    }
    
    if (score > 0) {
      scoredSupplements.push({ supplement, score, reasons });
    }
  }
  
  // Sort by score and take top 6
  scoredSupplements.sort((a, b) => b.score - a.score);
  const topSupplements = scoredSupplements.slice(0, 6);
  
  // Convert to recommendations with priorities
  return topSupplements.map((item, index) => {
    let priority: 'essential' | 'beneficial' | 'optional' = 'optional';
    if (index < 2 && item.score >= 15) {
      priority = 'essential';
    } else if (index < 4 && item.score >= 10) {
      priority = 'beneficial';
    }
    
    return {
      supplement: item.supplement,
      relevanceScore: item.score,
      reason: item.reasons.slice(0, 2).join('. '),
      priority,
    };
  });
}

export function checkInteractions(selectedSupplements: Supplement[]): string[] {
  const warnings: string[] = [];
  
  for (let i = 0; i < selectedSupplements.length; i++) {
    for (let j = i + 1; j < selectedSupplements.length; j++) {
      const a = selectedSupplements[i];
      const b = selectedSupplements[j];
      
      // Check conflicts
      if (a.conflicts?.some(c => b.name.toLowerCase().includes(c.toLowerCase())) ||
          b.conflicts?.some(c => a.name.toLowerCase().includes(c.toLowerCase()))) {
        warnings.push(`${a.name} and ${b.name} may have interactions. Consider taking separately or consulting a practitioner.`);
      }
      
      // Check mineral competition
      if ((a.id === 'zinc' && b.id === 'iron') || (a.id === 'iron' && b.id === 'zinc')) {
        warnings.push('Zinc and Iron compete for absorption. Take at different times of day.');
      }
      if ((a.id === 'calcium' && b.id === 'iron') || (a.id === 'iron' && b.id === 'calcium')) {
        warnings.push('Calcium inhibits Iron absorption. Take at different times of day.');
      }
      
      // Check serotonergic combinations
      if (a.id === '5-htp' && b.id === 'st-johns-wort') {
        warnings.push('5-HTP and St. John\'s Wort both affect serotonin. Do not combine without medical supervision.');
      }
    }
  }
  
  return warnings;
}

export function getSuggestedTiming(selectedSupplements: Supplement[]): { morning: Supplement[]; afternoon: Supplement[]; evening: Supplement[] } {
  const morning: Supplement[] = [];
  const afternoon: Supplement[] = [];
  const evening: Supplement[] = [];
  
  for (const supp of selectedSupplements) {
    const timing = supp.timing.toLowerCase();
    
    if (timing.includes('morning') || timing.includes('energizing') || timing.includes('stimulat')) {
      morning.push(supp);
    } else if (timing.includes('evening') || timing.includes('bed') || timing.includes('night') || timing.includes('calm')) {
      evening.push(supp);
    } else if (timing.includes('afternoon') || timing.includes('midday')) {
      afternoon.push(supp);
    } else if (timing.includes('any time') || timing.includes('with meal')) {
      // Distribute based on type
      if (supp.type === 'vitamin' || supp.goals.includes('energy')) {
        morning.push(supp);
      } else {
        afternoon.push(supp);
      }
    } else {
      morning.push(supp); // Default to morning
    }
  }
  
  return { morning, afternoon, evening };
}
