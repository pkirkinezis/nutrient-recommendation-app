import { PersonalizedSupplementSuggestion, UserProfile } from '../types';

function dedupeSuggestions(
  suggestions: PersonalizedSupplementSuggestion[]
): PersonalizedSupplementSuggestion[] {
  const seen = new Set<string>();
  return suggestions.filter((suggestion) => {
    if (!suggestion?.supplementId || seen.has(suggestion.supplementId)) return false;
    seen.add(suggestion.supplementId);
    return true;
  });
}

export function getPersonalizedSupplementSuggestions(
  profile?: UserProfile
): PersonalizedSupplementSuggestion[] {
  if (!profile) return [];

  const suggestions: PersonalizedSupplementSuggestion[] = [];
  const diet = profile.diet || profile.dietType;
  const age = profile.age || profile.ageRange;
  const add = (supplementId: string, reason: string): void => {
    suggestions.push({ supplementId, reason });
  };

  if (diet === 'vegan') {
    add('vitamin-b12', 'Common priority for vegan diets');
    add('omega-3', 'Consider an algae-derived omega-3');
    add('iron', 'Plant iron can be less bioavailable; test before supplementing');
    add('zinc', 'Plant-based diets may need extra zinc planning');
  }
  if (diet === 'vegetarian') add('vitamin-b12', 'Worth reviewing for vegetarian diets');

  if (profile.sleepQuality === 'poor') {
    add('magnesium', 'May support sleep when intake is insufficient');
    add('glycine', 'Has limited evidence for sleep quality');
    add('l-theanine', 'May support relaxation without marked sedation');
  }
  if (profile.stressLevel === 'high' || profile.stressLevel === 'very-high') {
    add('ashwagandha', 'May support perceived stress in some adults');
    add('rhodiola', 'May help stress-related fatigue');
    add('l-theanine', 'May support a calmer state');
  }
  if (profile.trainingStyle === 'strength') {
    add('creatine', 'Strong evidence for strength-training performance');
    add('vitamin-d3', 'Review intake or labs if vitamin D status is uncertain');
    add('zinc', 'Supports normal physiology when intake is insufficient');
  }
  if (profile.trainingStyle === 'endurance') {
    add('beetroot-extract', 'May support endurance performance');
    add('l-citrulline', 'May support exercise blood flow');
    add('iron', 'Relevant to oxygen transport; test before supplementing');
  }
  if (age === '60+' || age === '45-59' || age === 'over-60' || age === '45-60') {
    add('coq10', 'Worth reviewing with age and medication context');
    add('vitamin-d3', 'Review intake and vitamin D status for bone health');
    add('omega-3', 'May support cardiovascular health');
  }
  if (profile.sex === 'female') {
    add('iron', 'Needs vary; confirm status before supplementing');
    add('shatavari', 'Traditional option with limited hormone evidence');
  }
  if (profile.sex === 'male') {
    add('zinc', 'Supports normal testosterone when zinc is insufficient');
    add('tongkat-ali', 'Emerging evidence for male vitality');
  }

  return dedupeSuggestions(suggestions);
}
