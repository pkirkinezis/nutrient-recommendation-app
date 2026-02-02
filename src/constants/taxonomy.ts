/**
 * Centralized Taxonomy for NutriCompass
 * Single source of truth for goals, systems, types, and evidence levels
 * This prevents drift between analyzer, browse, and dataset
 */

// ============================================
// HEALTH GOALS TAXONOMY
// ============================================

export const HEALTH_GOALS = {
  STRESS: 'stress',
  ANXIETY: 'anxiety',
  SLEEP: 'sleep',
  ENERGY: 'energy',
  FOCUS: 'focus',
  COGNITION: 'cognition',
  MEMORY: 'memory',
  MOOD: 'mood',
  DEPRESSION: 'depression',
  IMMUNITY: 'immunity',
  DIGESTION: 'digestion',
  GUT_HEALTH: 'gut-health',
  INFLAMMATION: 'inflammation',
  JOINT_HEALTH: 'joint-health',
  MUSCLE: 'muscle',
  RECOVERY: 'recovery',
  PERFORMANCE: 'performance',
  ENDURANCE: 'endurance',
  STRENGTH: 'strength',
  HORMONES: 'hormones',
  LIBIDO: 'libido',
  SEXUAL_HEALTH: 'sexual-health',
  TESTOSTERONE: 'testosterone',
  THYROID: 'thyroid',
  WEIGHT: 'weight',
  METABOLISM: 'metabolism',
  HEART_HEALTH: 'heart-health',
  BLOOD_PRESSURE: 'blood-pressure',
  CHOLESTEROL: 'cholesterol',
  BLOOD_SUGAR: 'blood-sugar',
  SKIN: 'skin',
  HAIR: 'hair',
  NAILS: 'nails',
  BEAUTY: 'beauty',
  AGING: 'aging',
  LONGEVITY: 'longevity',
  DETOX: 'detox',
  LIVER: 'liver',
  METABOLIC: 'metabolic',
  BONE_HEALTH: 'bone-health',
  VISION: 'vision',
  RESPIRATORY: 'respiratory',
  FERTILITY: 'fertility',
  MENOPAUSE: 'menopause',
  PMS: 'pms',
} as const;

export type HealthGoal = typeof HEALTH_GOALS[keyof typeof HEALTH_GOALS];

// Goal categories for UI display
// IMPORTANT: Keywords should be specific and meaningful (4+ chars)
// Avoid generic words that could cause false positives
export const GOAL_CATEGORIES: { id: HealthGoal | string; label: string; icon: string; keywords: string[] }[] = [
  { 
    id: 'energy', 
    label: 'Energy & Vitality', 
    icon: '⚡',
    // Specific energy-related terms only
    keywords: ['energy', 'fatigue', 'tired', 'exhausted', 'vitality', 'stamina', 'endurance', 'alertness', 'vigor', 'lethargy', 'sluggish', 'low energy', 'more energy', 'boost energy', 'chronic fatigue']
  },
  { 
    id: 'brain', 
    label: 'Brain & Focus', 
    icon: '🧠',
    // Removed 'work' - too generic. Focus on cognitive-specific terms
    keywords: ['focus', 'concentration', 'brain', 'cognitive', 'mental clarity', 'attention', 'brain fog', 'thinking', 'learning', 'study', 'memory', 'recall', 'sharp mind', 'mental performance', 'nootropic']
  },
  { 
    id: 'mood', 
    label: 'Mood & Emotions', 
    icon: '😊',
    // Removed 'drive' - ambiguous. Added more specific terms
    keywords: ['mood', 'happiness', 'depression', 'depressed', 'sadness', 'emotional', 'wellbeing', 'well-being', 'positivity', 'motivation', 'low mood', 'mood swings', 'irritability', 'blues']
  },
  { 
    id: 'stress', 
    label: 'Stress & Anxiety', 
    icon: '🧘',
    // Removed 'pressure' - too generic. More specific stress terms
    keywords: ['stress', 'anxiety', 'anxious', 'calm', 'relax', 'tension', 'nervous', 'worried', 'panic', 'overwhelmed', 'cortisol', 'burnout', 'stressed', 'anxiousness', 'stress relief', 'calming']
  },
  { 
    id: 'sleep', 
    label: 'Sleep & Recovery', 
    icon: '😴',
    // Removed 'tired', 'fatigue' (covered by energy), 'morning', 'night', 'wake' - too generic
    keywords: ['sleep', 'insomnia', 'rest', 'recovery', 'bedtime', 'circadian', 'melatonin', 'sleep quality', 'deep sleep', 'falling asleep', 'stay asleep', 'restful', 'sleepless', 'sleep aid']
  },
  { 
    id: 'hormones', 
    label: 'Hormones & Balance', 
    icon: '⚖️',
    // 'sex' is included to support user phrasing like "better sex" while keeping other ambiguous terms removed.
    keywords: ['hormone', 'hormonal', 'testosterone', 'estrogen', 'libido', 'sex', 'menopause', 'perimenopause', 'fertility', 'thyroid', 'adrenal', 'cortisol', 'hormonal balance', 'hormone support', 'low testosterone', 'estrogen balance']
  },
  { 
    id: 'sexual-health', 
    label: 'Sexual & Reproductive Health', 
    icon: '❤️',
    keywords: ['sexual health', 'sexual', 'erection', 'erectile', 'libido', 'sex drive', 'intimacy', 'fertility', 'sperm', 'semen', 'ejaculation', 'refractory']
  },
  { 
    id: 'immunity', 
    label: 'Immune Support', 
    icon: '🛡️',
    // Removed 'health' - too generic
    keywords: ['immune', 'immunity', 'cold', 'flu', 'sick', 'infection', 'virus', 'defense', 'protection', 'resistance', 'illness', 'immune system', 'immune support', 'getting sick', 'stay healthy']
  },
  { 
    id: 'digestion', 
    label: 'Digestion & Gut', 
    icon: '🦠',
    // Removed 'acid' - ambiguous. Added specific terms
    keywords: ['digestion', 'digestive', 'gut health', 'stomach', 'intestine', 'bloating', 'bloat', 'constipation', 'diarrhea', 'microbiome', 'probiotic', 'ibs', 'acid reflux', 'indigestion', 'gut flora', 'bowel']
  },
  { 
    id: 'fitness', 
    label: 'Fitness & Muscle', 
    icon: '💪',
    // Removed 'training', 'power' - could be generic. Added specific fitness terms
    keywords: ['muscle', 'strength', 'gym', 'workout', 'exercise', 'fitness', 'athletic', 'performance', 'gains', 'bodybuilding', 'crossfit', 'muscle building', 'muscle recovery', 'lifting', 'weightlifting', 'sports']
  },
  { 
    id: 'inflammation', 
    label: 'Inflammation & Pain', 
    icon: '🔥',
    // Removed 'chronic', 'acute', 'injury' - too generic
    keywords: ['inflammation', 'inflammatory', 'pain', 'ache', 'sore', 'joint pain', 'arthritis', 'swelling', 'anti-inflammatory', 'joint health', 'stiffness', 'muscle pain', 'back pain', 'chronic pain']
  },
  { 
    id: 'bone-health', 
    label: 'Bone Health', 
    icon: '🦴',
    keywords: ['bone health', 'bone density', 'osteoporosis', 'fracture risk', 'brittle bones', 'bone strength']
  },
  { 
    id: 'heart', 
    label: 'Heart & Cardio', 
    icon: '❤️',
    // Removed 'blood', 'beat', 'pulse' - too generic
    keywords: ['heart', 'cardiovascular', 'cardio health', 'blood pressure', 'cholesterol', 'circulation', 'artery', 'heart health', 'cardiac', 'triglycerides', 'hdl', 'ldl', 'vascular']
  },
  { 
    id: 'beauty', 
    label: 'Skin, Hair & Beauty', 
    icon: '✨',
    // Removed 'dry' - too generic
    keywords: ['skin', 'hair', 'nails', 'beauty', 'collagen', 'wrinkle', 'anti-aging', 'glow', 'complexion', 'acne', 'skin health', 'hair growth', 'hair loss', 'nail strength', 'youthful']
  },
  {
    id: 'longevity',
    label: 'Longevity & Aging',
    icon: '⏳',
    keywords: ['longevity', 'aging', 'anti-aging', 'healthy aging', 'lifespan', 'sirtuins', 'senolytic', 'cellular aging']
  },
  {
    id: 'metabolic',
    label: 'Metabolic & Blood Sugar',
    icon: '🩸',
    keywords: ['blood sugar', 'glucose', 'insulin', 'metabolism', 'metabolic', 'a1c', 'insulin resistance', 'prediabetes']
  },
  {
    id: 'detox',
    label: 'Liver & Detox',
    icon: '🧪',
    keywords: ['detox', 'liver', 'hepatic', 'fatty liver', 'toxins', 'cleanse', 'glutathione']
  },
];

// ============================================
// SEMANTIC ASSOCIATIONS (CONCEPT-BASED MATCHING)
// ============================================

export const SEMANTIC_ASSOCIATIONS: Record<string, {
  synonyms: string[];
  supplements: string[];
  goals: string[];
  systems: string[];
}> = {
  'bone-health': {
    synonyms: ['bone health', 'bone density', 'osteoporosis', 'brittle bones', 'fracture risk', 'bone strength'],
    supplements: ['Calcium', 'Vitamin D3', 'Vitamin K2', 'Magnesium'],
    goals: ['bone-health', 'osteoporosis'],
    systems: ['musculoskeletal']
  },
  'brain-fog': {
    synonyms: ['brain fog', 'mental fog', 'foggy', 'memory issues', 'memory loss', 'forgetful'],
    supplements: ['Lion\'s Mane', 'Vitamin B12', 'Omega-3', 'Ginkgo Biloba'],
    goals: ['brain', 'focus'],
    systems: ['nervous']
  },
  'stress-anxiety': {
    synonyms: ['stress', 'anxiety', 'anxious', 'panic', 'overwhelmed', 'calm', 'relax'],
    supplements: ['Ashwagandha', 'L-Theanine', 'Rhodiola Rosea', 'Magnesium'],
    goals: ['stress', 'mood'],
    systems: ['nervous', 'endocrine']
  },
  'sleep-quality': {
    synonyms: ['sleep', 'insomnia', 'sleep quality', 'stay asleep', 'falling asleep', 'restful'],
    supplements: ['Magnesium', 'Melatonin', 'Valerian Root', 'Glycine'],
    goals: ['sleep'],
    systems: ['nervous']
  },
  'energy-fatigue': {
    synonyms: ['energy', 'fatigue', 'tired', 'exhausted', 'low energy', 'stamina'],
    supplements: ['B-Complex', 'Iron', 'CoQ10', 'Cordyceps'],
    goals: ['energy'],
    systems: ['endocrine', 'cardiovascular']
  },
  'immune-support': {
    synonyms: ['immunity', 'immune support', 'getting sick', 'cold', 'flu', 'infection'],
    supplements: ['Vitamin C', 'Vitamin D3', 'Zinc', 'Elderberry'],
    goals: ['immunity'],
    systems: ['immune']
  },
  'digestion-gut': {
    synonyms: ['digestion', 'gut health', 'bloating', 'ibs', 'constipation', 'diarrhea'],
    supplements: ['Probiotics', 'Ginger', 'Triphala'],
    goals: ['digestion'],
    systems: ['digestive']
  },
  'longevity-aging': {
    synonyms: ['anti-aging', 'longevity', 'healthy aging', 'lifespan', 'cellular aging'],
    supplements: ['Resveratrol', 'CoQ10', 'NAC', 'Collagen'],
    goals: ['longevity'],
    systems: ['cardiovascular', 'endocrine']
  },
  'muscle-performance': {
    synonyms: ['muscle', 'strength', 'athletic', 'performance', 'workout recovery'],
    supplements: ['Creatine', 'Beta-Alanine', 'Magnesium'],
    goals: ['fitness', 'muscle'],
    systems: ['musculoskeletal']
  },
  'heart-health': {
    synonyms: ['heart health', 'cardio', 'blood pressure', 'cholesterol', 'circulation'],
    supplements: ['CoQ10', 'Omega-3', 'Magnesium'],
    goals: ['heart-health'],
    systems: ['cardiovascular']
  },
  'focus-clarity': {
    synonyms: ['focus', 'concentration', 'mental clarity', 'attention', 'study'],
    supplements: ['Lion\'s Mane', 'L-Theanine', 'Caffeine'],
    goals: ['brain'],
    systems: ['nervous']
  },
  'detox-liver': {
    synonyms: ['detox', 'liver support', 'fatty liver', 'toxins'],
    supplements: ['Milk Thistle', 'NAC', 'Chlorella'],
    goals: ['detox'],
    systems: ['digestive']
  },
  'inflammation-pain': {
    synonyms: ['inflammation', 'joint pain', 'arthritis', 'pain relief', 'sore'],
    supplements: ['Turmeric / Curcumin', 'Omega-3', 'Boswellia'],
    goals: ['inflammation'],
    systems: ['musculoskeletal']
  },
  'hormonal-balance': {
    synonyms: ['hormones', 'hormonal balance', 'pms', 'menopause', 'testosterone'],
    supplements: ['Ashwagandha', 'Maca Root', 'Vitamin D3'],
    goals: ['hormones'],
    systems: ['endocrine']
  },
  'skin-health': {
    synonyms: ['skin', 'skin health', 'acne', 'glow', 'wrinkles'],
    supplements: ['Collagen', 'Vitamin C', 'Vitamin E', 'Zinc'],
    goals: ['beauty'],
    systems: ['integumentary']
  },
  'hair-health': {
    synonyms: ['hair', 'hair loss', 'hair growth', 'brittle hair'],
    supplements: ['Biotin', 'Collagen', 'Zinc', 'Iron'],
    goals: ['beauty'],
    systems: ['integumentary']
  },
  'weight-management': {
    synonyms: ['weight loss', 'fat loss', 'lose weight', 'metabolism'],
    supplements: ['Chromium', 'Acetyl-L-Carnitine', 'Caffeine'],
    goals: ['metabolic'],
    systems: ['endocrine']
  },
  'pregnancy-support': {
    synonyms: ['pregnancy', 'prenatal', 'trying to conceive'],
    supplements: ['Folate', 'Iron', 'Omega-3', 'Choline'],
    goals: ['fertility'],
    systems: ['reproductive']
  },
  'mood-support': {
    synonyms: ['mood', 'depressed', 'sadness', 'irritability', 'low mood'],
    supplements: ['Omega-3', 'Vitamin D3', 'B-Complex'],
    goals: ['mood'],
    systems: ['nervous']
  }
};

// ============================================
// BODY SYSTEMS TAXONOMY
// ============================================

export const BODY_SYSTEMS = {
  NERVOUS: 'nervous',
  ENDOCRINE: 'endocrine',
  IMMUNE: 'immune',
  DIGESTIVE: 'digestive',
  CARDIOVASCULAR: 'cardiovascular',
  MUSCULOSKELETAL: 'musculoskeletal',
  INTEGUMENTARY: 'integumentary',
  RESPIRATORY: 'respiratory',
  REPRODUCTIVE: 'reproductive',
  URINARY: 'urinary',
  LYMPHATIC: 'lymphatic',
} as const;

export type BodySystem = typeof BODY_SYSTEMS[keyof typeof BODY_SYSTEMS];

// SYSTEM_DEFINITIONS with refined keywords (avoiding short/generic terms)
export const SYSTEM_DEFINITIONS: { id: BodySystem; label: string; description: string; keywords: string[] }[] = [
  {
    id: 'nervous',
    label: 'Nervous System',
    description: 'Brain, spinal cord, nerves - controls cognition, mood, stress response',
    // Specific nervous system terms
    keywords: ['brain', 'nervous', 'cognitive', 'anxiety', 'stress', 'focus', 'memory', 'neurotransmitter', 'dopamine', 'serotonin', 'gaba', 'neurological', 'neural']
  },
  {
    id: 'endocrine',
    label: 'Endocrine System',
    description: 'Hormones, glands - controls metabolism, growth, mood, reproduction',
    // Removed 'metabolism' - too generic
    keywords: ['hormone', 'thyroid', 'adrenal', 'cortisol', 'testosterone', 'estrogen', 'insulin', 'gland', 'pituitary', 'endocrine', 'hormonal']
  },
  {
    id: 'immune',
    label: 'Immune System',
    description: 'Defense against pathogens, inflammation control',
    keywords: ['immune', 'inflammation', 'infection', 'virus', 'bacteria', 'antibody', 'cytokine', 'autoimmune', 'immunity', 'pathogen']
  },
  {
    id: 'digestive',
    label: 'Digestive System',
    description: 'Gut, stomach, intestines, liver - nutrient absorption, detox',
    // Removed 'enzyme' - too generic in supplement context
    keywords: ['gut', 'stomach', 'intestine', 'liver', 'digest', 'digestion', 'microbiome', 'probiotic', 'bile', 'colon', 'bowel', 'gastric']
  },
  {
    id: 'cardiovascular',
    label: 'Cardiovascular System',
    description: 'Heart, blood vessels - circulation, oxygen delivery',
    // Removed 'blood', 'pressure', 'pulse' - too generic
    keywords: ['heart', 'cardiovascular', 'artery', 'vein', 'circulation', 'cholesterol', 'cardiac', 'vascular', 'blood pressure', 'triglycerides']
  },
  {
    id: 'musculoskeletal',
    label: 'Musculoskeletal System',
    description: 'Muscles, bones, joints - movement, structure, strength',
    // Removed 'strength', 'flexibility' - too generic
    keywords: ['muscle', 'bone', 'joint', 'tendon', 'ligament', 'skeletal', 'cartilage', 'musculoskeletal', 'osteo', 'muscular']
  },
  {
    id: 'integumentary',
    label: 'Integumentary System',
    description: 'Skin, hair, nails - protection, appearance',
    keywords: ['skin', 'hair', 'nail', 'collagen', 'keratin', 'dermis', 'epidermis', 'complexion', 'dermal', 'cutaneous']
  },
  {
    id: 'respiratory',
    label: 'Respiratory System',
    description: 'Lungs, airways - oxygen intake, CO2 removal',
    keywords: ['lung', 'respiratory', 'airway', 'bronchi', 'asthma', 'breathing', 'pulmonary', 'bronchial']
  },
  {
    id: 'reproductive',
    label: 'Reproductive System',
    description: 'Fertility, libido, hormonal cycles',
    // Removed 'egg' - too generic
    keywords: ['reproductive', 'fertility', 'libido', 'menstrual', 'ovary', 'testis', 'sperm', 'conception', 'sexual health']
  },
  {
    id: 'urinary',
    label: 'Urinary System',
    description: 'Kidneys, bladder - waste removal, fluid balance',
    keywords: ['kidney', 'bladder', 'urinary', 'renal', 'nephro', 'urological']
  },
  {
    id: 'lymphatic',
    label: 'Lymphatic System',
    description: 'Lymph nodes, drainage - immune support, detox',
    // Removed 'node', 'detox' - could be generic
    keywords: ['lymph', 'lymphatic', 'drainage', 'spleen', 'lymph nodes', 'lymphoid']
  },
];

// ============================================
// SUPPLEMENT TYPES TAXONOMY
// ============================================

export const SUPPLEMENT_TYPES = {
  VITAMIN: 'vitamin',
  MINERAL: 'mineral',
  HERB: 'herb',
  TEA: 'tea',
  AYURVEDIC: 'ayurvedic',
  AMINO_ACID: 'amino-acid',
  MUSHROOM: 'mushroom',
  PROBIOTIC: 'probiotic',
  FATTY_ACID: 'fatty-acid',
  ENZYME: 'enzyme',
  ANTIOXIDANT: 'antioxidant',
  PROTEIN: 'protein',
  PERFORMANCE: 'performance',
  OTHER: 'other',
} as const;

export type SupplementType = typeof SUPPLEMENT_TYPES[keyof typeof SUPPLEMENT_TYPES];

export const TYPE_DEFINITIONS: { id: SupplementType; label: string; icon: string; description: string }[] = [
  { id: 'vitamin', label: 'Vitamins', icon: '💊', description: 'Essential organic compounds needed in small amounts' },
  { id: 'mineral', label: 'Minerals', icon: '⚗️', description: 'Essential inorganic elements for body functions' },
  { id: 'herb', label: 'Western Herbs', icon: '🌿', description: 'Plant-based supplements from Western traditions' },
  { id: 'tea', label: 'Tea Herbs', icon: '🫖', description: 'Herbal teas and traditional infusions' },
  { id: 'ayurvedic', label: 'Ayurvedic', icon: '🕉️', description: 'Traditional Indian medicine herbs and formulas' },
  { id: 'amino-acid', label: 'Amino Acids', icon: '🧬', description: 'Building blocks of proteins and neurotransmitters' },
  { id: 'mushroom', label: 'Mushrooms', icon: '🍄', description: 'Medicinal fungi with immune and cognitive benefits' },
  { id: 'probiotic', label: 'Probiotics', icon: '🦠', description: 'Beneficial bacteria for gut health' },
  { id: 'fatty-acid', label: 'Fatty Acids', icon: '🐟', description: 'Essential fats for brain and heart health' },
  { id: 'enzyme', label: 'Enzymes', icon: '🔬', description: 'Proteins that catalyze biochemical reactions' },
  { id: 'antioxidant', label: 'Antioxidants', icon: '🛡️', description: 'Compounds that neutralize free radicals' },
  { id: 'protein', label: 'Proteins', icon: '💪', description: 'Complete proteins and protein blends' },
  { id: 'performance', label: 'Performance', icon: '🏋️', description: 'Sports and athletic performance compounds' },
  { id: 'other', label: 'Other', icon: '📦', description: 'Other bioactive compounds' },
];

// ============================================
// EVIDENCE LEVELS TAXONOMY
// ============================================

export const EVIDENCE_LEVELS = {
  STRONG: 'strong',
  MODERATE: 'moderate',
  LIMITED: 'limited',
} as const;

export type EvidenceLevel = typeof EVIDENCE_LEVELS[keyof typeof EVIDENCE_LEVELS];

export const EVIDENCE_DEFINITIONS: { id: EvidenceLevel; label: string; description: string; color: string }[] = [
  { 
    id: 'strong', 
    label: 'Strong Evidence', 
    description: 'Backed by multiple high-quality human clinical trials and systematic reviews. Accepted in mainstream nutritional science.',
    color: 'green'
  },
  { 
    id: 'moderate', 
    label: 'Moderate Evidence', 
    description: 'Supported by some clinical trials with positive results, but more research needed for universal consensus.',
    color: 'yellow'
  },
  { 
    id: 'limited', 
    label: 'Limited / Traditional', 
    description: 'Primarily based on traditional use, animal studies, or preliminary human research. Promising but not yet proven.',
    color: 'gray'
  },
];

// ============================================
// NEGATION PATTERNS
// ============================================

export const NEGATION_WORDS = [
  'no', 'not', 'don\'t', 'dont', 'doesn\'t', 'doesnt', 
  'without', 'never', 'none', 'isn\'t', 'isnt', 'aren\'t', 'arent',
  'haven\'t', 'havent', 'hasn\'t', 'hasnt', 'won\'t', 'wont',
  'can\'t', 'cant', 'couldn\'t', 'couldnt', 'shouldn\'t', 'shouldnt',
  'wouldn\'t', 'wouldnt', 'lack', 'lacking', 'free', 'avoid', 'stop'
];

// ============================================
// GOAL & SYSTEM ALIASES
// ============================================

export const GOAL_ALIASES: Record<string, string> = {
  'brain-health': 'brain',
  'cognition': 'brain',
  'memory': 'brain',
  'focus': 'brain',
  'concentration': 'brain',
  'learning': 'brain',
  'brain-fog': 'brain',
  'mental-clarity': 'brain',
  'neuroprotection': 'brain',
  'calm': 'stress',
  'anxiety': 'stress',
  'relaxation': 'stress',
  'sleep': 'sleep',
  'insomnia': 'sleep',
  'recovery': 'sleep',
  'energy': 'energy',
  'vitality': 'energy',
  'fatigue': 'energy',
  'stamina': 'energy',
  'endurance': 'fitness',
  'athletic-performance': 'fitness',
  'performance': 'fitness',
  'strength': 'fitness',
  'muscle': 'fitness',
  'muscle-recovery': 'fitness',
  'joint-pain': 'inflammation',
  'joint-health': 'inflammation',
  'arthritis': 'inflammation',
  'pain': 'inflammation',
  'bone-health': 'bone-health',
  'bone density': 'bone-health',
  'osteoporosis': 'bone-health',
  'fracture risk': 'bone-health',
  'brittle bones': 'bone-health',
  'heart-health': 'heart',
  'blood-pressure': 'heart',
  'cholesterol': 'heart',
  'circulation': 'heart',
  'blood-sugar': 'metabolic',
  'weight': 'metabolic',
  'metabolism': 'metabolic',
  'skin': 'beauty',
  'hair': 'beauty',
  'nails': 'beauty',
  'beauty': 'beauty',
  'anti-aging': 'longevity',
  'longevity': 'longevity',
  'detox': 'detox',
  'liver': 'detox',
  'hormonal-balance': 'hormones',
  'testosterone': 'hormones',
  'libido': 'hormones',
  'sexual-health': 'sexual-health',
  'sexual-function': 'sexual-health',
  'sexual': 'sexual-health',
  'sex-drive': 'sexual-health',
  'intimacy': 'sexual-health',
  'erectile': 'sexual-health',
  'erectile-function': 'sexual-health',
  'erection': 'sexual-health',
  'semen': 'sexual-health',
  'semen-volume': 'sexual-health',
  'sperm': 'sexual-health',
  'sperm-quality': 'sexual-health',
  'sperm-count': 'sexual-health',
  'sperm-motility': 'sexual-health',
  'male-reproductive': 'sexual-health',
  'female-reproductive': 'sexual-health',
  'reproductive-health': 'sexual-health',
  'fertility': 'hormones',
  'menopause': 'hormones',
  'pms': 'hormones',
  'immunity': 'immunity',
  'immune': 'immunity',
  'respiratory': 'immunity',
  'digestion': 'digestion',
  'gut-health': 'digestion',
  'bloating': 'digestion'
};

export const SYSTEM_ALIASES: Record<string, string> = {
  'cognitive': 'nervous',
  'brain': 'nervous',
  'neuro': 'nervous',
  'metabolic': 'endocrine',
  'energy': 'endocrine',
  'hepatic': 'digestive',
  'liver': 'digestive',
  'detox': 'digestive',
  'muscular': 'musculoskeletal',
  'joint': 'musculoskeletal',
  'skin': 'integumentary',
  'hair': 'integumentary',
  'nail': 'integumentary'
};

// Window size for negation detection (words before the keyword)
export const NEGATION_WINDOW = 3;

// ============================================
// SUPPLEMENT NAME ALIASES
// ============================================

// Maps common variations/aliases to canonical supplement names
export const SUPPLEMENT_ALIASES: Record<string, string> = {
  // Vitamins
  'd3': 'Vitamin D3',
  'vitamin d': 'Vitamin D3',
  'vit d': 'Vitamin D3',
  'cholecalciferol': 'Vitamin D3',
  'b12': 'Vitamin B12',
  'vitamin b-12': 'Vitamin B12',
  'cobalamin': 'Vitamin B12',
  'methylcobalamin': 'Vitamin B12',
  'cyanocobalamin': 'Vitamin B12',
  'b-complex': 'B-Complex',
  'b vitamins': 'B-Complex',
  'vitamin c': 'Vitamin C',
  'vit c': 'Vitamin C',
  'ascorbic acid': 'Vitamin C',
  'vitamin e': 'Vitamin E',
  'tocopherol': 'Vitamin E',
  'vitamin k': 'Vitamin K2',
  'k2': 'Vitamin K2',
  'mk-7': 'Vitamin K2',
  'menaquinone': 'Vitamin K2',
  'folate': 'Folate',
  'folic acid': 'Folate',
  'vitamin b9': 'Folate',
  'b9': 'Folate',
  
  // Minerals
  'mag': 'Magnesium',
  'magnesium glycinate': 'Magnesium',
  'magnesium citrate': 'Magnesium',
  'mag glycinate': 'Magnesium',
  'zn': 'Zinc',
  'zinc picolinate': 'Zinc',
  'zinc bisglycinate': 'Zinc',
  'fe': 'Iron',
  'iron bisglycinate': 'Iron',
  'ferrous': 'Iron',
  'selenium': 'Selenium',
  'se': 'Selenium',
  'selenomethionine': 'Selenium',
  'ca': 'Calcium',
  'calcium citrate': 'Calcium',
  'potassium': 'Potassium',
  'k': 'Potassium',
  
  // Omega-3s
  'fish oil': 'Omega-3',
  'omega 3': 'Omega-3',
  'omega3': 'Omega-3',
  'epa': 'Omega-3',
  'dha': 'Omega-3',
  'epa/dha': 'Omega-3',
  'algae oil': 'Omega-3',
  
  // Adaptogens
  'ashwa': 'Ashwagandha',
  'withania': 'Ashwagandha',
  'ksm-66': 'Ashwagandha',
  'sensoril': 'Ashwagandha',
  'rhodiola': 'Rhodiola Rosea',
  'golden root': 'Rhodiola Rosea',
  'arctic root': 'Rhodiola Rosea',
  'ginseng': 'Panax Ginseng',
  'korean ginseng': 'Panax Ginseng',
  'red ginseng': 'Panax Ginseng',
  'american ginseng': 'Panax Ginseng',
  'maca': 'Maca Root',
  'peruvian ginseng': 'Maca Root',
  'eleuthero': 'Eleuthero',
  'siberian ginseng': 'Eleuthero',
  
  // Ayurvedic
  'brahmi': 'Bacopa Monnieri',
  'bacopa': 'Bacopa Monnieri',
  'tulsi': 'Holy Basil (Tulsi)',
  'holy basil': 'Holy Basil (Tulsi)',
  'triphala': 'Triphala',
  'shatavari': 'Shatavari',
  'guduchi': 'Guduchi (Giloy)',
  'giloy': 'Guduchi (Giloy)',
  'shilajit': 'Shilajit',
  'mucuna': 'Mucuna Pruriens',
  'velvet bean': 'Mucuna Pruriens',
  'boswellia': 'Boswellia',
  'frankincense': 'Boswellia',
  'arjuna': 'Arjuna',
  'amla': 'Amla',
  'indian gooseberry': 'Amla',
  
  // Mushrooms
  'lions mane': 'Lion\'s Mane',
  'lion\'s mane': 'Lion\'s Mane',
  'hericium': 'Lion\'s Mane',
  'reishi': 'Reishi',
  'ganoderma': 'Reishi',
  'lingzhi': 'Reishi',
  'cordyceps': 'Cordyceps',
  'turkey tail': 'Turkey Tail',
  'chaga': 'Chaga',
  'maitake': 'Maitake',
  
  // Amino Acids
  'theanine': 'L-Theanine',
  'l theanine': 'L-Theanine',
  'glycine': 'Glycine',
  'taurine': 'Taurine',
  'nac': 'NAC (N-Acetyl Cysteine)',
  'n-acetyl cysteine': 'NAC (N-Acetyl Cysteine)',
  'n acetyl cysteine': 'NAC (N-Acetyl Cysteine)',
  'tyrosine': 'L-Tyrosine',
  'l-tyrosine': 'L-Tyrosine',
  'creatine': 'Creatine Monohydrate',
  'creatine monohydrate': 'Creatine Monohydrate',
  'carnitine': 'L-Carnitine',
  'l-carnitine': 'L-Carnitine',
  'acetyl-l-carnitine': 'Acetyl-L-Carnitine (ALCAR)',
  'alcar': 'Acetyl-L-Carnitine (ALCAR)',
  'citrulline': 'L-Citrulline',
  'l-citrulline': 'L-Citrulline',
  'arginine': 'L-Arginine',
  'l-arginine': 'L-Arginine',
  'glutamine': 'L-Glutamine',
  'l-glutamine': 'L-Glutamine',
  'beta-alanine': 'Beta-Alanine',
  'beta alanine': 'Beta-Alanine',
  'bcaas': 'BCAAs',
  'bcaa': 'BCAAs',
  'branched chain amino acids': 'BCAAs',
  'eaas': 'EAAs',
  'eaa': 'EAAs',
  'essential amino acids': 'EAAs',
  'hmb': 'HMB',
  'beta-hydroxy beta-methylbutyrate': 'HMB',
  '5-htp': '5-HTP',
  '5htp': '5-HTP',
  
  // Other common
  'coq10': 'CoQ10 (Ubiquinol)',
  'ubiquinol': 'CoQ10 (Ubiquinol)',
  'ubiquinone': 'CoQ10 (Ubiquinol)',
  'coenzyme q10': 'CoQ10 (Ubiquinol)',
  'turmeric': 'Curcumin',
  'curcumin': 'Curcumin',
  'ginger': 'Ginger',
  'ginkgo': 'Ginkgo Biloba',
  'ginkgo biloba': 'Ginkgo Biloba',
  'valerian': 'Valerian Root',
  'melatonin': 'Melatonin',
  'collagen': 'Collagen',
  'collagen peptides': 'Collagen',
  'probiotics': 'Probiotics',
  'probiotic': 'Probiotics',
  'elderberry': 'Elderberry',
  'echinacea': 'Echinacea',
  'garlic': 'Garlic',
  'milk thistle': 'Milk Thistle',
  'silymarin': 'Milk Thistle',
  'alpha-gpc': 'Alpha-GPC',
  'alpha gpc': 'Alpha-GPC',
  'phosphatidylserine': 'Phosphatidylserine',
  'ps': 'Phosphatidylserine',
  'berberine': 'Berberine',
  'quercetin': 'Quercetin',
  'resveratrol': 'Resveratrol',
  'ala': 'Alpha-Lipoic Acid',
  'alpha lipoic acid': 'Alpha-Lipoic Acid',
  'alpha-lipoic acid': 'Alpha-Lipoic Acid',
  'sam-e': 'SAMe',
  'same': 'SAMe',
  's-adenosyl methionine': 'SAMe',
  'glucosamine': 'Glucosamine',
  'chondroitin': 'Glucosamine',
  'msm': 'MSM',
  'methylsulfonylmethane': 'MSM',
  'astaxanthin': 'Astaxanthin',
  'beetroot': 'Beetroot Extract',
  'beet root': 'Beetroot Extract',
  'beet juice': 'Beetroot Extract',
  'nitrates': 'Beetroot Extract',
  'whey': 'Whey Protein',
  'whey protein': 'Whey Protein',
  'casein': 'Casein Protein',
  'caffeine': 'Caffeine',
  'electrolytes': 'Electrolytes',
  'sodium bicarbonate': 'Sodium Bicarbonate',
  'baking soda': 'Sodium Bicarbonate',
  'betaine': 'Betaine (TMG)',
  'tmg': 'Betaine (TMG)',
  'trimethylglycine': 'Betaine (TMG)',
  'glycerol': 'Glycerol',
};

// ============================================
// INTERACTION SEVERITY LEVELS
// ============================================

export const INTERACTION_SEVERITY = {
  HIGH: 'high',
  MODERATE: 'moderate',
  LOW: 'low',
} as const;

export type InteractionSeverity = typeof INTERACTION_SEVERITY[keyof typeof INTERACTION_SEVERITY];

// Known high-risk interactions
export const HIGH_RISK_INTERACTIONS: { supplements: [string, string]; reason: string; severity: InteractionSeverity }[] = [
  { supplements: ['Iron', 'Calcium'], reason: 'Calcium significantly reduces iron absorption. Take 2+ hours apart.', severity: 'high' },
  { supplements: ['Iron', 'Zinc'], reason: 'Compete for absorption. Take at different times of day.', severity: 'moderate' },
  { supplements: ['Zinc', 'Copper'], reason: 'High zinc can deplete copper over time. Balance with copper if taking zinc long-term.', severity: 'moderate' },
  { supplements: ['Calcium', 'Magnesium'], reason: 'High doses compete for absorption. Split doses or take at different times.', severity: 'low' },
  { supplements: ['Vitamin E', 'Vitamin K2'], reason: 'High-dose vitamin E may interfere with vitamin K function.', severity: 'moderate' },
  { supplements: ['5-HTP', 'St. John\'s Wort'], reason: 'Both increase serotonin - risk of serotonin syndrome. Do not combine.', severity: 'high' },
  { supplements: ['5-HTP', 'SAMe'], reason: 'Both increase serotonin levels. Risk of serotonin syndrome.', severity: 'high' },
  { supplements: ['Melatonin', 'Valerian Root'], reason: 'Both are sedating - may cause excessive drowsiness.', severity: 'low' },
  { supplements: ['Ashwagandha', 'Thyroid medication'], reason: 'Ashwagandha may increase thyroid hormone levels.', severity: 'high' },
  { supplements: ['St. John\'s Wort', 'Antidepressants'], reason: 'Can cause dangerous serotonin syndrome. Never combine.', severity: 'high' },
  { supplements: ['Ginkgo Biloba', 'Blood thinners'], reason: 'Ginkgo has blood-thinning effects - increases bleeding risk.', severity: 'high' },
  { supplements: ['Omega-3', 'Blood thinners'], reason: 'Fish oil has mild blood-thinning effects at high doses.', severity: 'moderate' },
  { supplements: ['Vitamin K2', 'Warfarin'], reason: 'Vitamin K counteracts warfarin. Consult doctor before taking.', severity: 'high' },
  { supplements: ['Berberine', 'Metformin'], reason: 'Both lower blood sugar - risk of hypoglycemia.', severity: 'high' },
  { supplements: ['Alpha-Lipoic Acid', 'Thyroid medication'], reason: 'May affect thyroid hormone levels. Take 4 hours apart.', severity: 'moderate' },
  { supplements: ['Caffeine', 'Ephedra'], reason: 'Dangerous combination for heart - do not use together.', severity: 'high' },
  { supplements: ['L-Tyrosine', 'MAOIs'], reason: 'Can cause dangerous blood pressure spikes.', severity: 'high' },
  { supplements: ['Mucuna Pruriens', 'Parkinson\'s medication'], reason: 'Both affect dopamine - may cause excessive dopamine.', severity: 'high' },
];

// ============================================
// LIFESTYLE FACTORS FOR PERSONALIZATION
// ============================================

export const DIET_TYPES = ['omnivore', 'vegetarian', 'vegan', 'pescatarian', 'keto', 'paleo'] as const;
export type DietType = typeof DIET_TYPES[number];

export const TRAINING_STYLES = ['none', 'light', 'moderate', 'strength', 'endurance', 'mixed'] as const;
export type TrainingStyle = typeof TRAINING_STYLES[number];

export const AGE_RANGES = ['18-29', '30-44', '45-59', '60+'] as const;
export type AgeRange = typeof AGE_RANGES[number];

export const SLEEP_QUALITY_LEVELS = ['poor', 'fair', 'good', 'excellent'] as const;
export type SleepQuality = typeof SLEEP_QUALITY_LEVELS[number];

export const STRESS_LEVELS = ['low', 'moderate', 'high', 'very-high'] as const;
export type StressLevel = typeof STRESS_LEVELS[number];

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Normalize a supplement name to its canonical form
 */
export function normalizeSupplementName(input: string): string {
  const normalized = input.toLowerCase().trim();
  return SUPPLEMENT_ALIASES[normalized] || input;
}

/**
 * Check if a word is a negation word
 */
export function isNegation(word: string): boolean {
  return NEGATION_WORDS.includes(word.toLowerCase());
}

/**
 * Get goal category by ID
 */
export function getGoalCategory(id: string) {
  return GOAL_CATEGORIES.find(g => g.id === id);
}

/**
 * Get system definition by ID
 */
export function getSystemDefinition(id: string) {
  return SYSTEM_DEFINITIONS.find(s => s.id === id);
}

/**
 * Get type definition by ID
 */
export function getTypeDefinition(id: string) {
  return TYPE_DEFINITIONS.find(t => t.id === id);
}

/**
 * Get evidence definition by level
 */
export function getEvidenceDefinition(level: string) {
  return EVIDENCE_DEFINITIONS.find(e => e.id === level);
}
