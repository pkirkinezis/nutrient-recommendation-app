// Comprehensive Type Definitions for NutriCompass

export type EvidenceLevel = 'strong' | 'moderate' | 'limited';
export type SupplementType = 'vitamin' | 'mineral' | 'amino-acid' | 'herb' | 'ayurvedic' | 'mushroom' | 'probiotic' | 'fatty-acid' | 'protein' | 'performance' | 'enzyme' | 'antioxidant' | 'other';
export type Priority = 'essential' | 'beneficial' | 'optional';

// ============================================
// SUPPLEMENT TYPES
// ============================================

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
  goalEvidence?: Partial<Record<string, EvidenceLevel>>;
  foodSources?: string[];
  cautions?: string[];
  drugInteractions?: string[];
  avoidIf?: string[];
  cycleTiming?: string;
  synergies?: string[];
  conflicts?: string[];
  systems: string[];
  goals: string[];
  formGuidance?: FormGuidance;
}

// ============================================
// USER PROFILE TYPES
// ============================================

export interface UserProfile {
  // Demographics
  age?: '18-29' | '30-44' | '45-59' | '60+';
  ageRange?: 'under-30' | '30-45' | '45-60' | 'over-60';  // Deprecated, use 'age'
  sex?: 'male' | 'female' | 'other';
  
  // Lifestyle
  diet?: 'omnivore' | 'vegetarian' | 'vegan' | 'pescatarian' | 'keto' | 'paleo';
  dietType?: 'omnivore' | 'vegetarian' | 'vegan' | 'keto' | 'other';  // Deprecated, use 'diet'
  trainingStyle?: 'none' | 'light' | 'moderate' | 'strength' | 'endurance' | 'mixed' | 'yoga';
  
  // Health status
  sleepQuality?: 'poor' | 'fair' | 'good' | 'excellent';
  stressLevel?: 'low' | 'moderate' | 'high' | 'very-high';
  caffeineIntake?: 'none' | 'low' | 'moderate' | 'high';
  
  // Current supplements & medications
  currentSupplements?: string[];
  healthConditions?: string[];
  medications?: string[];
  
  // Preferences
  formPreference?: 'capsules' | 'tablets' | 'powders' | 'liquids' | 'gummies' | 'any';
  budgetLevel?: 'budget' | 'moderate' | 'premium';
  preferNatural?: boolean;
}

// ============================================
// GOAL ANALYSIS TYPES
// ============================================

export interface RecommendedSupplement {
  supplement: Supplement;
  priority: Priority;
  reason: string;
  relevanceScore: number;
  safetyFlags?: string[];
  cautionLevel?: 'high' | 'moderate' | 'low';
}

export interface GoalAnalysis {
  query: string;
  identifiedGoals: string[];
  identifiedSystems: string[];
  recommendations: RecommendedSupplement[];
  tips: string[];
}

// Legacy alias for backward compatibility
export interface Recommendation {
  supplement: Supplement;
  relevanceScore: number;
  reason: string;
  priority: Priority;
  safetyFlags?: string[];
  cautionLevel?: 'high' | 'moderate' | 'low';
}

export interface AnalyzedGoal {
  originalQuery: string;
  identifiedGoals: string[];
  identifiedSystems: string[];
  recommendations: Recommendation[];
}

// ============================================
// FORM GUIDANCE TYPES
// ============================================

export interface FormInfo {
  name: string;
  bioavailability: string;
  bestFor: string;
  avoid?: string;
  cost?: 'low' | 'medium' | 'high';
}

export interface FormGuidance {
  forms: FormInfo[];
  enhancers: string[];
  blockers: string[];
  timing: string;
  foodFirst: { possible: boolean; note: string };
}

// ============================================
// COMPARISON TYPES
// ============================================

export interface SupplementComparison {
  id: string;
  title: string;
  goal: string;
  optionA: { name: string; pros: string[]; cons: string[]; evidence: string };
  optionB: { name: string; pros: string[]; cons: string[]; evidence: string };
  verdict: string;
  canCombine: boolean;
}

// ============================================
// INTERACTION TYPES
// ============================================

export interface InteractionWarning {
  supplements: [string, string];
  severity: 'high' | 'moderate' | 'low';
  reason: string;
  recommendation: string;
}

export interface RedundancyWarning {
  supplements: string[];
  message: string;
}

// ============================================
// TIMING TYPES
// ============================================

export interface TimingSchedule {
  morning: Supplement[];
  midday: Supplement[];
  evening: Supplement[];
  bedtime: Supplement[];
  withMeals: Supplement[];
  awayFromMeals: Supplement[];
}

// ============================================
// MISINFORMATION ALERT TYPES
// ============================================

export interface MisinformationAlert {
  claim: string;
  reality: string;
  recommendation: string;
}

// ============================================
// TRACKING TYPES
// ============================================

export interface DailyLog {
  date: string;
  sleepQuality: 1 | 2 | 3 | 4 | 5;
  energyLevel: 1 | 2 | 3 | 4 | 5;
  mood: 1 | 2 | 3 | 4 | 5;
  focus: 1 | 2 | 3 | 4 | 5;
  recovery: 1 | 2 | 3 | 4 | 5;
  supplementsTaken: string[];
  notes?: string;
  sideEffects?: string[];
}

export interface TrackingData {
  logs: DailyLog[];
  startDate: string;
  supplements: string[];
}

// ============================================
// FILTER TYPES
// ============================================

export interface FilterState {
  types: string[];
  evidence: EvidenceLevel[];
  goals: string[];
  systems: string[];
  hasFormGuidance: boolean;
  traditionalOnly: boolean;
  modernOnly: boolean;
  searchQuery: string;
}
