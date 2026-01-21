// Simplified Type Definitions for NutriCompass

export type EvidenceLevel = 'strong' | 'moderate' | 'limited';
export type SupplementType = 'vitamin' | 'mineral' | 'amino-acid' | 'herb' | 'ayurvedic' | 'mushroom' | 'probiotic' | 'fatty-acid' | 'other';
export type Priority = 'essential' | 'beneficial' | 'optional';

export interface Supplement {
  id: string;
  name: string;
  type: SupplementType;
  category: 'modern' | 'traditional' | 'both';
  description: string;
  traditionalUse?: string;
  benefits: string[];
  dosage: string;
  timing: string;
  timeframe: string;
  evidence: EvidenceLevel;
  foodSources?: string[];
  cautions?: string[];
  drugInteractions?: string[];
  avoidIf?: string[];
  cycleTiming?: string;
  synergies?: string[];
  conflicts?: string[];
  systems: string[];
  goals: string[];
}

export interface UserProfile {
  ageRange?: 'under-30' | '30-45' | '45-60' | 'over-60';
  sex?: 'male' | 'female';
  dietType?: 'omnivore' | 'vegetarian' | 'vegan' | 'keto' | 'other';
  trainingStyle?: 'none' | 'endurance' | 'strength' | 'mixed' | 'yoga';
  sleepQuality?: 'good' | 'fair' | 'poor';
  stressLevel?: 'low' | 'moderate' | 'high';
  currentSupplements?: string[];
  healthConditions?: string[];
  medications?: string[];
}

export interface Recommendation {
  supplement: Supplement;
  relevanceScore: number;
  reason: string;
  priority: Priority;
}

export interface AnalyzedGoal {
  originalQuery: string;
  identifiedGoals: string[];
  identifiedSystems: string[];
  recommendations: Recommendation[];
}

// Form guidance types
export interface FormInfo {
  name: string;
  bioavailability: string;
  bestFor: string;
  avoid?: string;
}

export interface FormGuidance {
  forms: FormInfo[];
  enhancers: string[];
  blockers: string[];
  timing: string;
  foodFirst: { possible: boolean; note: string };
}

// Comparison types
export interface SupplementComparison {
  id: string;
  title: string;
  goal: string;
  optionA: { name: string; pros: string[]; cons: string[]; evidence: string };
  optionB: { name: string; pros: string[]; cons: string[]; evidence: string };
  verdict: string;
  canCombine: boolean;
}

// Misinformation alert types
export interface MisinformationAlert {
  claim: string;
  reality: string;
  recommendation: string;
}
