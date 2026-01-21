export type EvidenceLevel = 'Strong' | 'Moderate' | 'Limited' | 'Traditional';

export type SystemTag = 
  | 'Nervous System' 
  | 'Immune System' 
  | 'Endocrine (Hormones)' 
  | 'Musculoskeletal' 
  | 'Cardiovascular' 
  | 'Digestive' 
  | 'Metabolism' 
  | 'Energy/Metabolism'
  | 'Cognitive/Brain' 
  | 'Reproductive'
  | 'Detoxification'
  | 'Skin/Hair/Nails';

export interface Supplement {
  id: string;
  name: string;
  category: 'Vitamin' | 'Mineral' | 'Herb' | 'Amino Acid' | 'Ayurveda' | 'Protein' | 'Other';
  description: string;
  benefits: string[];
  commonUses: string[]; 
  dosage: string;
  warnings: string;
  
  // New Enhanced Fields
  evidenceLevel: EvidenceLevel;
  systemTags: SystemTag[];
  mechanism: string; // "Scientific" explanation of how it works
  
  bestTime: string; // Changed from strict union to string to allow "Pre-workout", "With Carbs", etc.
  withFood: boolean;
  cyclingRecommended: boolean; // e.g., take for 8 weeks, off for 2
  
  timeline: string; // e.g. "Effects seen in 3-5 days"
  
  foodSources?: string[]; // "Food First" content
  foodSourceNote?: string; // e.g. "Hard to get enough from food alone"
  
  interactionWarnings?: string[]; // specific drug interactions
}

export interface UserProfile {
  diet: 'Omnivore' | 'Vegan' | 'Vegetarian';
  isPregnant: boolean;
  takingMedication: boolean;
  goals: string[];
}
