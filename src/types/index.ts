// Comprehensive Type Definitions for NutriCompass

export type EvidenceLevel = 'strong' | 'moderate' | 'limited';
export type PragmaticTier = 'S+' | 'S' | 'A' | 'B' | 'C';
export type SupplementType = 'vitamin' | 'mineral' | 'amino-acid' | 'herb' | 'tea' | 'ayurvedic' | 'mushroom' | 'probiotic' | 'fatty-acid' | 'protein' | 'performance' | 'enzyme' | 'antioxidant' | 'other';
export type Priority = 'essential' | 'beneficial' | 'optional';
export type ReproductiveStatus = 'unknown' | 'yes' | 'no' | 'not-applicable';
export type MedicationIntakeStatus = 'unknown' | 'none' | 'taking';

// ============================================
// SUPPLEMENT TYPES
// ============================================

export interface EvidenceSource {
  title: string;
  url: string;
  note?: string;
}

export type KnowledgeCategory =
  | 'vitamin'
  | 'mineral'
  | 'herb'
  | 'tea'
  | 'adaptogen'
  | 'amino-acid'
  | 'fatty-acid'
  | 'probiotic'
  | 'mushroom'
  | 'enzyme'
  | 'performance'
  | 'antioxidant'
  | 'other';

export type KnowledgeEvidenceStrengthTag =
  | 'well-supported'
  | 'mixed'
  | 'emerging'
  | 'traditional';

export type KnowledgeSafetyFlag =
  | 'pregnancy'
  | 'breastfeeding'
  | 'drug-interaction'
  | 'bleeding-risk'
  | 'blood-pressure'
  | 'blood-sugar'
  | 'sedation'
  | 'stimulant'
  | 'thyroid'
  | 'liver'
  | 'kidney'
  | 'autoimmune'
  | 'general-caution';

export interface KnowledgeCitation {
  title: string;
  publisher: string;
  url: string;
  accessedAt: string;
}

export interface SupplementKnowledgeEntry {
  supplementId: string;
  supplementName: string;
  aliases: string[];
  categories: KnowledgeCategory[];
  evidenceStrengthTags: KnowledgeEvidenceStrengthTag[];
  evidenceSummary: string;
  typicalUseCases: string[];
  safetyNotes: string[];
  safetyFlags: KnowledgeSafetyFlag[];
  dosageRangeNote?: string;
  citations: KnowledgeCitation[];
}

export type SupplementKnowledgeMap = Record<string, SupplementKnowledgeEntry>;

export interface DosagePerKgGuidance {
  min: number;
  max: number;
  unit: 'mg' | 'g';
  note?: string;
}

export interface Supplement {
  id: string;
  name: string;
  type: SupplementType;
  category: 'modern' | 'traditional' | 'both';
  description: string;
  topLevelSafetyAlert?: string;
  safetyNote?: string;
  traditionalUse?: string;
  mechanism?: string;
  benefits: string[];
  dosage: string;
  dosagePerKg?: DosagePerKgGuidance;
  timing: string;
  timeframe: string;
  evidence: EvidenceLevel;
  pragmaticTier?: PragmaticTier;
  pragmaticTierContext?: string;
  bioavailabilityNote?: string;
  evidenceSources?: EvidenceSource[];
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

export interface FoodSource {
  food: string;
  basis: string;
  amount: number;
  unit: string;
  percentNRV: number;
  source: string;
  sourceId?: string;
}

export interface FoodSearchItem {
  id: string;
  name: string;
  brand?: string;
  servingSize?: string;
  caloriesPer100g?: number;
  proteinPer100g?: number;
  carbsPer100g?: number;
  fatPer100g?: number;
  nutriments?: NutrimentEntry[];
  source: 'open-food-facts' | 'usda-fooddata-central' | 'offline';
}

export interface FoodSearchResponse {
  items: FoodSearchItem[];
  source: 'open-food-facts' | 'usda-fooddata-central' | 'offline' | 'cache';
}

export interface NutrimentEntry {
  key: string;
  value: number;
  unit?: string;
  basis?: '100g' | 'serving';
}

export interface FoodSupplementMatch {
  id: string;
  name: string;
  reasons: string[];
}

export interface IntentDatasetEntry {
  id: string;
  text: string;
  goals: string[];
  systems: string[];
}

// ============================================
// CURATED STACK TYPES
// ============================================

export interface CuratedStack {
  id: string;
  name: string;
  description: string;
  synergyDescription: string;
  supplementIds: string[];
  goals: string[];
  bestFor?: string[];
  icon?: string;
}

// ============================================
// PREMADE STACK TYPES
// ============================================

export interface SupplementStackIngredient {
  supplementId: string;
  dosage: string;
  reason: string;
}

export interface SupplementStack {
  id: string;
  name: string;
  description: string;
  targetGender: 'men' | 'women' | 'all';
  primaryGoal: string;
  synergyDescription: string;
  ingredients: SupplementStackIngredient[];
}

// ============================================
// USER PROFILE TYPES
// ============================================

export interface UserProfile {
  // Demographics
  age?: '18-29' | '30-44' | '45-59' | '60+';
  ageRange?: 'under-30' | '30-45' | '45-60' | 'over-60';  // Deprecated, use 'age'
  sex?: 'male' | 'female' | 'other';
  weightKg?: number;
  heightCm?: number;
  
  // Lifestyle
  diet?: 'omnivore' | 'vegetarian' | 'vegan' | 'pescatarian' | 'keto' | 'paleo';
  dietType?: 'omnivore' | 'vegetarian' | 'vegan' | 'keto' | 'other';  // Deprecated, use 'diet'
  trainingStyle?: 'none' | 'light' | 'moderate' | 'strength' | 'endurance' | 'mixed' | 'yoga';
  activityLevel?: 'sedentary' | 'light' | 'moderate' | 'active' | 'athlete';
  
  // Health status
  sleepQuality?: 'poor' | 'fair' | 'good' | 'excellent';
  stressLevel?: 'low' | 'moderate' | 'high' | 'very-high';
  caffeineIntake?: 'none' | 'low' | 'moderate' | 'high';
  pregnancyStatus?: ReproductiveStatus;
  breastfeedingStatus?: ReproductiveStatus;
  tryingToConceiveStatus?: ReproductiveStatus;
  
  // Current supplements & medications
  currentSupplements?: string[];
  healthConditions?: string[];
  medicationStatus?: MedicationIntakeStatus;
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
  recommendedStacks?: SupplementStack[];
  matchType?: 'keyword' | 'direct' | 'semantic' | 'none';
  confidence?: number;
  directSupplements?: string[];
  relatedSupplements?: string[];
  inferredGoals?: string[];
  inferredSystems?: string[];
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
  id?: string;
  date: string;
  sleepQuality: 1 | 2 | 3 | 4 | 5;
  energyLevel: 1 | 2 | 3 | 4 | 5;
  mood: 1 | 2 | 3 | 4 | 5;
  focus: 1 | 2 | 3 | 4 | 5;
  recovery: 1 | 2 | 3 | 4 | 5;
  supplementsTaken: string[];
  notes?: string;
  sideEffects?: string[];
  updatedAt?: number;
}

export interface ChartPoint {
  date: string;
  label: string;
  value: number;
}

export interface TrackingData {
  logs: DailyLog[];
  startDate: string;
  supplements: string[];
}

export interface LocalSyncMeta {
  profileUpdatedAt: number;
  stackUpdatedAt: number;
  trackingUpdatedAt: number;
  labsUpdatedAt: number;
}

export interface CloudSettings {
  schemaVersion: number;
  updatedAt: number;
  trackingStartDate: string;
  trackingSupplements: string[];
  labs: LabResult[];
}

export interface CloudProfile {
  schemaVersion: number;
  updatedAt: number;
  profile: UserProfile;
}

export interface CloudStack {
  schemaVersion: number;
  updatedAt: number;
  supplementIds: string[];
}

export interface SemanticAssociation {
  synonyms: string[];
  supplements: string[];
  goals: string[];
  systems: string[];
}

export interface LabResult {
  id: string;
  name: string;
  value: number;
  unit: string;
  range?: string;
  note?: string;
  date?: string;
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
