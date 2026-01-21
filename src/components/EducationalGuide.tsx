import React, { useState } from 'react';

type Section = 
  | 'overview'
  | 'macronutrients'
  | 'micronutrients'
  | 'adaptogens'
  | 'nootropics'
  | 'metabolic'
  | 'traditional'
  | 'wellness-goals'
  | 'bioactives'
  | 'emerging';

interface NutrientInfo {
  name: string;
  category: string;
  role: string;
  sources: string[];
  rda?: string;
  deficiencyRisk?: string;
  evidence: 'strong' | 'moderate' | 'limited';
}

interface HerbInfo {
  name: string;
  tradition: string;
  category: string;
  benefits: string[];
  dosage?: string;
  cautions?: string[];
  evidence: 'strong' | 'moderate' | 'limited';
}

const micronutrients: NutrientInfo[] = [
  {
    name: 'Vitamin A',
    category: 'Fat-Soluble Vitamin',
    role: 'Vision, epithelial integrity, immune defense, gene expression, skin health',
    sources: ['Liver', 'Sweet potato', 'Carrots', 'Spinach', 'Eggs', 'Cod liver oil'],
    rda: '700-900 mcg RAE',
    deficiencyRisk: 'Night blindness, dry skin, weakened immunity',
    evidence: 'strong'
  },
  {
    name: 'Vitamin B1 (Thiamine)',
    category: 'B-Complex',
    role: 'Carbohydrate metabolism, nerve function, energy production',
    sources: ['Whole grains', 'Pork', 'Legumes', 'Seeds', 'Nutritional yeast'],
    rda: '1.1-1.2 mg',
    deficiencyRisk: 'Beriberi, fatigue, nerve damage (common in alcoholism)',
    evidence: 'strong'
  },
  {
    name: 'Vitamin B2 (Riboflavin)',
    category: 'B-Complex',
    role: 'Energy metabolism, antioxidant function, red blood cell production',
    sources: ['Dairy', 'Eggs', 'Lean meats', 'Almonds', 'Mushrooms'],
    rda: '1.1-1.3 mg',
    deficiencyRisk: 'Cracked lips, sore throat, anemia',
    evidence: 'strong'
  },
  {
    name: 'Vitamin B3 (Niacin)',
    category: 'B-Complex',
    role: 'Energy metabolism, DNA repair, cholesterol metabolism, skin health',
    sources: ['Chicken', 'Tuna', 'Turkey', 'Peanuts', 'Mushrooms'],
    rda: '14-16 mg',
    deficiencyRisk: 'Pellagra (dermatitis, diarrhea, dementia)',
    evidence: 'strong'
  },
  {
    name: 'Vitamin B5 (Pantothenic Acid)',
    category: 'B-Complex',
    role: 'Coenzyme A synthesis, fatty acid metabolism, hormone production',
    sources: ['Chicken', 'Beef', 'Avocado', 'Sunflower seeds', 'Mushrooms'],
    rda: '5 mg',
    deficiencyRisk: 'Rare - fatigue, numbness (widespread in foods)',
    evidence: 'strong'
  },
  {
    name: 'Vitamin B6 (Pyridoxine)',
    category: 'B-Complex',
    role: 'Neurotransmitter synthesis (serotonin, dopamine), protein metabolism, immune function',
    sources: ['Poultry', 'Fish', 'Potatoes', 'Bananas', 'Chickpeas'],
    rda: '1.3-1.7 mg',
    deficiencyRisk: 'Depression, confusion, weakened immunity, anemia',
    evidence: 'strong'
  },
  {
    name: 'Vitamin B7 (Biotin)',
    category: 'B-Complex',
    role: 'Fatty acid synthesis, glucose metabolism, hair/nail health',
    sources: ['Eggs', 'Nuts', 'Seeds', 'Sweet potato', 'Salmon'],
    rda: '30 mcg',
    deficiencyRisk: 'Hair loss, brittle nails, skin rash (rare)',
    evidence: 'strong'
  },
  {
    name: 'Vitamin B9 (Folate)',
    category: 'B-Complex',
    role: 'DNA synthesis, cell division, neural tube development, red blood cell formation',
    sources: ['Leafy greens', 'Legumes', 'Asparagus', 'Fortified grains', 'Liver'],
    rda: '400 mcg DFE (600 mcg pregnancy)',
    deficiencyRisk: 'Neural tube defects, megaloblastic anemia, fatigue',
    evidence: 'strong'
  },
  {
    name: 'Vitamin B12 (Cobalamin)',
    category: 'B-Complex',
    role: 'Nerve function, DNA synthesis, red blood cell formation, energy metabolism',
    sources: ['Meat', 'Fish', 'Dairy', 'Eggs', 'Fortified foods'],
    rda: '2.4 mcg',
    deficiencyRisk: 'Pernicious anemia, nerve damage, fatigue, cognitive issues (high risk in vegans)',
    evidence: 'strong'
  },
  {
    name: 'Vitamin C (Ascorbic Acid)',
    category: 'Water-Soluble Vitamin',
    role: 'Antioxidant, collagen synthesis, immune support, iron absorption, wound healing',
    sources: ['Citrus fruits', 'Bell peppers', 'Kiwi', 'Broccoli', 'Strawberries'],
    rda: '75-90 mg (up to 2000 mg safe)',
    deficiencyRisk: 'Scurvy (bleeding gums, poor healing, fatigue)',
    evidence: 'strong'
  },
  {
    name: 'Vitamin D3 (Cholecalciferol)',
    category: 'Fat-Soluble Vitamin',
    role: 'Calcium absorption, bone health, immune regulation, mood, muscle function',
    sources: ['Sunlight', 'Fatty fish', 'Egg yolks', 'Fortified foods', 'Cod liver oil'],
    rda: '600-800 IU (many need 1000-4000 IU)',
    deficiencyRisk: 'Rickets, osteoporosis, depression, weakened immunity (very common deficiency)',
    evidence: 'strong'
  },
  {
    name: 'Vitamin E (Tocopherols)',
    category: 'Fat-Soluble Vitamin',
    role: 'Antioxidant in cell membranes, skin and eye health, immune function',
    sources: ['Nuts', 'Seeds', 'Vegetable oils', 'Spinach', 'Avocado'],
    rda: '15 mg (22.4 IU)',
    deficiencyRisk: 'Nerve damage, muscle weakness, vision problems (rare)',
    evidence: 'strong'
  },
  {
    name: 'Vitamin K1 (Phylloquinone)',
    category: 'Fat-Soluble Vitamin',
    role: 'Blood clotting, bone health, wound healing',
    sources: ['Leafy greens', 'Broccoli', 'Brussels sprouts', 'Green beans'],
    rda: '90-120 mcg',
    deficiencyRisk: 'Bleeding disorders, easy bruising',
    evidence: 'strong'
  },
  {
    name: 'Vitamin K2 (Menaquinone)',
    category: 'Fat-Soluble Vitamin',
    role: 'Bone mineralization (activates osteocalcin), arterial health, calcium metabolism',
    sources: ['Natto', 'Aged cheese', 'Egg yolks', 'Liver', 'Fermented foods'],
    rda: '100-200 mcg (no official RDA)',
    deficiencyRisk: 'Arterial calcification, poor bone density (often overlooked)',
    evidence: 'moderate'
  },
  {
    name: 'Calcium',
    category: 'Major Mineral',
    role: 'Bone/teeth structure, muscle contraction, nerve signaling, blood clotting',
    sources: ['Dairy', 'Sardines', 'Leafy greens', 'Fortified foods', 'Almonds'],
    rda: '1000-1200 mg',
    deficiencyRisk: 'Osteoporosis, muscle cramps, numbness',
    evidence: 'strong'
  },
  {
    name: 'Magnesium',
    category: 'Major Mineral',
    role: '300+ enzyme reactions, muscle/nerve function, energy production, sleep, blood sugar',
    sources: ['Dark chocolate', 'Nuts', 'Seeds', 'Leafy greens', 'Legumes', 'Whole grains'],
    rda: '310-420 mg',
    deficiencyRisk: 'Muscle cramps, fatigue, anxiety, poor sleep, irregular heartbeat (50%+ deficient)',
    evidence: 'strong'
  },
  {
    name: 'Potassium',
    category: 'Major Mineral',
    role: 'Fluid balance, muscle contractions, nerve signals, blood pressure regulation',
    sources: ['Bananas', 'Potatoes', 'Spinach', 'Avocado', 'Coconut water'],
    rda: '2600-3400 mg',
    deficiencyRisk: 'Muscle weakness, cramps, fatigue, irregular heartbeat',
    evidence: 'strong'
  },
  {
    name: 'Sodium',
    category: 'Major Mineral',
    role: 'Fluid balance, nerve transmission, muscle function (electrolyte)',
    sources: ['Table salt', 'Processed foods', 'Cheese', 'Seafood'],
    rda: '<2300 mg (athletes may need more)',
    deficiencyRisk: 'Hyponatremia (rare except in over-hydration or heavy sweating)',
    evidence: 'strong'
  },
  {
    name: 'Iron',
    category: 'Trace Mineral',
    role: 'Hemoglobin formation, oxygen transport, energy production, immune function',
    sources: ['Red meat', 'Liver', 'Spinach', 'Legumes', 'Fortified cereals'],
    rda: '8-18 mg (higher for menstruating women)',
    deficiencyRisk: 'Anemia, fatigue, weakness, cognitive impairment (very common)',
    evidence: 'strong'
  },
  {
    name: 'Zinc',
    category: 'Trace Mineral',
    role: 'Immune function, wound healing, DNA synthesis, taste/smell, testosterone',
    sources: ['Oysters', 'Beef', 'Pumpkin seeds', 'Chickpeas', 'Cashews'],
    rda: '8-11 mg',
    deficiencyRisk: 'Weakened immunity, hair loss, slow healing, loss of taste',
    evidence: 'strong'
  },
  {
    name: 'Selenium',
    category: 'Trace Mineral',
    role: 'Antioxidant (glutathione peroxidase), thyroid function, immune health',
    sources: ['Brazil nuts', 'Seafood', 'Organ meats', 'Eggs', 'Sunflower seeds'],
    rda: '55 mcg',
    deficiencyRisk: 'Thyroid dysfunction, weakened immunity, cognitive decline',
    evidence: 'strong'
  },
  {
    name: 'Iodine',
    category: 'Trace Mineral',
    role: 'Thyroid hormone synthesis (metabolism, growth, development)',
    sources: ['Iodized salt', 'Seafood', 'Seaweed', 'Dairy', 'Eggs'],
    rda: '150 mcg',
    deficiencyRisk: 'Goiter, hypothyroidism, cognitive impairment, developmental issues',
    evidence: 'strong'
  },
  {
    name: 'Copper',
    category: 'Trace Mineral',
    role: 'Iron metabolism, connective tissue, antioxidant enzymes, nerve function',
    sources: ['Liver', 'Shellfish', 'Nuts', 'Seeds', 'Dark chocolate'],
    rda: '900 mcg',
    deficiencyRisk: 'Anemia, bone abnormalities, low white blood cells',
    evidence: 'strong'
  },
  {
    name: 'Manganese',
    category: 'Trace Mineral',
    role: 'Bone formation, blood clotting, metabolism, antioxidant function',
    sources: ['Whole grains', 'Nuts', 'Leafy greens', 'Tea', 'Legumes'],
    rda: '1.8-2.3 mg',
    deficiencyRisk: 'Poor bone health, impaired glucose tolerance (rare)',
    evidence: 'strong'
  },
  {
    name: 'Chromium',
    category: 'Trace Mineral',
    role: 'Insulin sensitivity, glucose metabolism, macronutrient metabolism',
    sources: ['Broccoli', 'Barley', 'Oats', 'Green beans', 'Beef'],
    rda: '25-35 mcg',
    deficiencyRisk: 'Impaired glucose tolerance (rare in healthy individuals)',
    evidence: 'moderate'
  },
  {
    name: 'Molybdenum',
    category: 'Trace Mineral',
    role: 'Enzyme cofactor for sulfite oxidase and xanthine oxidase',
    sources: ['Legumes', 'Grains', 'Nuts', 'Dairy'],
    rda: '45 mcg',
    deficiencyRisk: 'Extremely rare',
    evidence: 'strong'
  },
  {
    name: 'Choline',
    category: 'Essential Nutrient',
    role: 'Acetylcholine synthesis (memory), cell membrane structure, liver function',
    sources: ['Eggs', 'Liver', 'Beef', 'Fish', 'Soybeans'],
    rda: '425-550 mg',
    deficiencyRisk: 'Fatty liver, memory issues, muscle damage (often overlooked)',
    evidence: 'strong'
  },
  {
    name: 'Omega-3 (EPA/DHA)',
    category: 'Essential Fatty Acid',
    role: 'Brain structure, anti-inflammatory, heart health, mood regulation',
    sources: ['Fatty fish', 'Fish oil', 'Algae oil', 'Walnuts', 'Flaxseed (ALA only)'],
    rda: '250-500 mg EPA+DHA (up to 3g safe)',
    deficiencyRisk: 'Inflammation, cognitive decline, dry skin, mood issues',
    evidence: 'strong'
  }
];

const macronutrients = [
  {
    name: 'Carbohydrates',
    role: 'Primary energy source (4 cal/g), brain fuel, muscle glycogen',
    types: ['Simple sugars (quick energy)', 'Complex starches (sustained energy)', 'Fiber (gut health)'],
    sources: ['Whole grains', 'Fruits', 'Vegetables', 'Legumes', 'Potatoes'],
    recommendation: '45-65% of calories; prioritize complex carbs and fiber'
  },
  {
    name: 'Protein',
    role: 'Muscle building/repair, enzymes, hormones, immune function (4 cal/g)',
    types: ['Complete proteins (all essential amino acids)', 'Incomplete proteins (combine for complete)'],
    sources: ['Meat', 'Fish', 'Eggs', 'Dairy', 'Legumes', 'Tofu', 'Quinoa'],
    recommendation: '0.8-2.2 g/kg body weight depending on activity level'
  },
  {
    name: 'Fats',
    role: 'Energy storage (9 cal/g), hormone production, nutrient absorption, cell membranes',
    types: ['Saturated (limit)', 'Monounsaturated (heart-healthy)', 'Polyunsaturated (omega-3/6)', 'Trans (avoid)'],
    sources: ['Olive oil', 'Avocado', 'Nuts', 'Fatty fish', 'Eggs', 'Coconut'],
    recommendation: '20-35% of calories; prioritize unsaturated fats'
  },
  {
    name: 'Fiber',
    role: 'Gut health, satiety, blood sugar control, cholesterol reduction, microbiome food',
    types: ['Soluble (forms gel, lowers cholesterol)', 'Insoluble (adds bulk, promotes regularity)'],
    sources: ['Vegetables', 'Fruits', 'Whole grains', 'Legumes', 'Nuts', 'Seeds'],
    recommendation: '25-38 g/day (most people get only 15g)'
  },
  {
    name: 'Water',
    role: 'Temperature regulation, nutrient transport, waste removal, joint lubrication',
    types: ['Plain water', 'Mineral water', 'Water from foods'],
    sources: ['Drinking water', 'Fruits', 'Vegetables', 'Soups', 'Herbal teas'],
    recommendation: '2-3.7 liters/day (more with exercise/heat)'
  }
];

const adaptogens: HerbInfo[] = [
  {
    name: 'Ashwagandha (Withania somnifera)',
    tradition: 'Ayurveda',
    category: 'Adaptogen',
    benefits: ['Reduces cortisol and stress', 'Improves sleep quality', 'Enhances energy and stamina', 'Supports thyroid function', 'May increase testosterone in men', 'Reduces anxiety'],
    dosage: '300-600mg standardized extract (KSM-66 or Sensoril)',
    cautions: ['Avoid with hyperthyroidism', 'May increase thyroid hormones', 'Avoid during pregnancy'],
    evidence: 'moderate'
  },
  {
    name: 'Rhodiola rosea',
    tradition: 'Siberian/Scandinavian',
    category: 'Adaptogen',
    benefits: ['Reduces mental fatigue', 'Enhances endurance', 'Improves stress resilience', 'Supports cognitive function', 'May reduce burnout symptoms'],
    dosage: '200-600mg standardized extract (3% rosavins, 1% salidroside)',
    cautions: ['May cause insomnia if taken late', 'Can be stimulating', 'Avoid with bipolar disorder'],
    evidence: 'moderate'
  },
  {
    name: 'Panax Ginseng (Korean/Asian)',
    tradition: 'Traditional Chinese Medicine',
    category: 'Adaptogen',
    benefits: ['Boosts energy and alertness', 'Supports immune function', 'May improve cognitive function', 'Anti-inflammatory (ginsenosides)', 'May support blood sugar'],
    dosage: '200-400mg standardized extract',
    cautions: ['May cause insomnia', 'Can affect blood pressure', 'Avoid with hormone-sensitive conditions'],
    evidence: 'moderate'
  },
  {
    name: 'Eleuthero (Siberian Ginseng)',
    tradition: 'Russian/Chinese',
    category: 'Adaptogen',
    benefits: ['Increases endurance', 'Supports immune function', 'Reduces fatigue', 'Stress resilience', 'Athletic performance'],
    dosage: '300-1200mg daily',
    cautions: ['May affect blood pressure', 'Avoid with autoimmune conditions'],
    evidence: 'moderate'
  },
  {
    name: 'Holy Basil (Tulsi)',
    tradition: 'Ayurveda',
    category: 'Adaptogen',
    benefits: ['Reduces stress and anxiety', 'Supports respiratory health', 'Anti-inflammatory', 'Blood sugar support', 'Antioxidant'],
    dosage: '300-600mg extract or tea daily',
    cautions: ['May slow blood clotting', 'May affect fertility (traditional belief)'],
    evidence: 'moderate'
  },
  {
    name: 'Schisandra chinensis',
    tradition: 'Traditional Chinese Medicine',
    category: 'Adaptogen',
    benefits: ['Liver protection', 'Stress tolerance', 'Mental performance', 'Endurance', 'Skin health'],
    dosage: '500-2000mg daily',
    cautions: ['May cause heartburn', 'Avoid with epilepsy', 'Pregnancy contraindicated'],
    evidence: 'moderate'
  },
  {
    name: 'Astragalus (Huang Qi)',
    tradition: 'Traditional Chinese Medicine',
    category: 'Adaptogen/Immune',
    benefits: ['Immune stimulation', 'Anti-inflammatory', 'Cardiovascular support', 'Anti-aging (telomerase)', 'Energy enhancement'],
    dosage: '500-2000mg daily',
    cautions: ['Avoid with autoimmune conditions', 'May interact with immunosuppressants'],
    evidence: 'moderate'
  },
  {
    name: 'Maca Root (Lepidium meyenii)',
    tradition: 'Peruvian',
    category: 'Adaptogen',
    benefits: ['Hormone balance', 'Libido enhancement', 'Energy and stamina', 'Mood support', 'Fertility support'],
    dosage: '1500-3000mg daily',
    cautions: ['Avoid with hormone-sensitive conditions', 'May cause digestive upset initially'],
    evidence: 'moderate'
  },
  {
    name: 'Cordyceps (Cordyceps sinensis/militaris)',
    tradition: 'Traditional Chinese Medicine',
    category: 'Adaptogenic Mushroom',
    benefits: ['Athletic endurance', 'Oxygen utilization', 'Energy and stamina', 'Immune modulation', 'Anti-aging'],
    dosage: '1000-3000mg daily',
    cautions: ['May affect blood clotting', 'Avoid with autoimmune conditions'],
    evidence: 'moderate'
  },
  {
    name: 'Reishi (Ganoderma lucidum)',
    tradition: 'Traditional Chinese Medicine',
    category: 'Adaptogenic Mushroom',
    benefits: ['Immune modulation', 'Sleep quality', 'Stress reduction', 'Liver support', 'Longevity'],
    dosage: '1000-3000mg daily (or 500-1500mg extract)',
    cautions: ['May affect blood clotting', 'Avoid before surgery', 'May lower blood pressure'],
    evidence: 'moderate'
  }
];

const nootropics: HerbInfo[] = [
  {
    name: 'Bacopa monnieri (Brahmi)',
    tradition: 'Ayurveda',
    category: 'Cognitive Enhancer',
    benefits: ['Memory enhancement', 'Learning improvement', 'Neuroprotection (bacosides)', 'Anxiety reduction', 'Processing speed'],
    dosage: '300-450mg standardized extract (50% bacosides)',
    cautions: ['Takes 8-12 weeks for effects', 'May cause digestive upset', 'Take with fat for absorption'],
    evidence: 'moderate'
  },
  {
    name: 'Lion\'s Mane (Hericium erinaceus)',
    tradition: 'Traditional Chinese Medicine',
    category: 'Nootropic Mushroom',
    benefits: ['Nerve growth factor stimulation', 'Cognitive enhancement', 'Neuroprotection', 'Memory support', 'Mood improvement'],
    dosage: '500-3000mg daily',
    cautions: ['May cause itchy skin (rare)', 'Avoid with mushroom allergies'],
    evidence: 'moderate'
  },
  {
    name: 'Ginkgo biloba',
    tradition: 'Traditional Chinese Medicine',
    category: 'Cognitive Enhancer',
    benefits: ['Cerebral blood flow', 'Memory support (older adults)', 'Antioxidant', 'Circulation', 'Eye health'],
    dosage: '120-240mg standardized extract',
    cautions: ['May affect blood clotting', 'Avoid before surgery', 'Interacts with blood thinners'],
    evidence: 'moderate'
  },
  {
    name: 'L-Theanine',
    tradition: 'Japanese (from tea)',
    category: 'Amino Acid Nootropic',
    benefits: ['Calm focus', 'Anxiety reduction', 'Sleep quality', 'Synergizes with caffeine', 'Alpha brain wave promotion'],
    dosage: '100-400mg daily',
    cautions: ['Very safe', 'May cause drowsiness at high doses'],
    evidence: 'strong'
  },
  {
    name: 'Phosphatidylserine',
    tradition: 'Modern',
    category: 'Phospholipid',
    benefits: ['Memory support', 'Cognitive function', 'Cortisol reduction', 'Exercise recovery', 'ADHD support'],
    dosage: '100-300mg daily',
    cautions: ['May interact with blood thinners', 'Very safe overall'],
    evidence: 'moderate'
  },
  {
    name: 'Alpha-GPC',
    tradition: 'Modern',
    category: 'Choline Donor',
    benefits: ['Acetylcholine production', 'Memory enhancement', 'Power output', 'Cognitive function', 'Growth hormone'],
    dosage: '300-600mg daily',
    cautions: ['May cause headache', 'Fishy body odor at high doses'],
    evidence: 'moderate'
  },
  {
    name: 'Citicoline (CDP-Choline)',
    tradition: 'Modern',
    category: 'Choline Donor',
    benefits: ['Brain energy', 'Memory and focus', 'Neuroprotection', 'Phospholipid synthesis', 'Dopamine support'],
    dosage: '250-500mg daily',
    cautions: ['Very safe', 'May cause insomnia if taken late'],
    evidence: 'moderate'
  },
  {
    name: 'Gotu Kola (Centella asiatica)',
    tradition: 'Ayurveda',
    category: 'Cognitive Enhancer',
    benefits: ['Cognitive enhancement', 'Anxiety reduction', 'Wound healing', 'Circulation', 'Skin health'],
    dosage: '500-1000mg daily',
    cautions: ['May cause drowsiness', 'Avoid with liver disease', 'Avoid during pregnancy'],
    evidence: 'limited'
  }
];

const wellnessGoals = [
  {
    goal: 'Immune Support',
    keyNutrients: ['Vitamin C', 'Vitamin D', 'Zinc', 'Selenium'],
    keyHerbs: ['Echinacea', 'Elderberry', 'Astragalus', 'Garlic', 'Andrographis'],
    lifestyle: ['Adequate sleep (7-9 hours)', 'Regular moderate exercise', 'Stress management', 'Balanced diet'],
    evidence: 'strong'
  },
  {
    goal: 'Digestion & Gut Health',
    keyNutrients: ['Fiber', 'Zinc', 'Glutamine'],
    keyHerbs: ['Probiotics', 'Prebiotics (inulin)', 'Ginger', 'Peppermint', 'Triphala', 'Digestive enzymes'],
    lifestyle: ['Chew food thoroughly', 'Eat mindfully', 'Manage stress', 'Stay hydrated'],
    evidence: 'strong'
  },
  {
    goal: 'Energy & Metabolism',
    keyNutrients: ['Iron', 'B-vitamins', 'CoQ10', 'L-Carnitine', 'Magnesium'],
    keyHerbs: ['Ginseng', 'Rhodiola', 'Cordyceps', 'Ashwagandha', 'Green tea'],
    lifestyle: ['Regular sleep schedule', 'Regular exercise', 'Blood sugar balance', 'Adequate hydration'],
    evidence: 'strong'
  },
  {
    goal: 'Stress & Anxiety',
    keyNutrients: ['Magnesium', 'B-vitamins', 'Omega-3'],
    keyHerbs: ['Ashwagandha', 'L-Theanine', 'Rhodiola', 'Holy Basil', 'Lavender', 'Passionflower'],
    lifestyle: ['Meditation/breathwork', 'Regular exercise', 'Sleep hygiene', 'Social connection'],
    evidence: 'moderate'
  },
  {
    goal: 'Sleep & Recovery',
    keyNutrients: ['Magnesium', 'Glycine', 'Zinc'],
    keyHerbs: ['Melatonin', 'Valerian', 'Chamomile', 'Ashwagandha', 'L-Theanine', 'Passionflower'],
    lifestyle: ['Consistent sleep schedule', 'Dark room', 'No screens before bed', 'Cool temperature'],
    evidence: 'moderate'
  },
  {
    goal: 'Cognition & Memory',
    keyNutrients: ['Omega-3 DHA', 'B-vitamins', 'Choline', 'Vitamin D'],
    keyHerbs: ['Bacopa', 'Lion\'s Mane', 'Ginkgo', 'Rhodiola', 'Phosphatidylserine'],
    lifestyle: ['Regular exercise', 'Quality sleep', 'Mental stimulation', 'Social engagement'],
    evidence: 'moderate'
  },
  {
    goal: 'Inflammation & Recovery',
    keyNutrients: ['Omega-3', 'Vitamin D', 'Vitamin C', 'Zinc'],
    keyHerbs: ['Curcumin', 'Ginger', 'Boswellia', 'Bromelain', 'Quercetin', 'Tart cherry'],
    lifestyle: ['Anti-inflammatory diet', 'Regular movement', 'Adequate sleep', 'Stress management'],
    evidence: 'moderate'
  },
  {
    goal: 'Hormonal Balance',
    keyNutrients: ['Zinc', 'Vitamin D', 'Magnesium', 'Omega-3', 'B6'],
    keyHerbs: ['Maca', 'Ashwagandha', 'Vitex (women)', 'Tongkat Ali (men)', 'DIM', 'Black cohosh'],
    lifestyle: ['Blood sugar balance', 'Adequate sleep', 'Stress management', 'Regular exercise'],
    evidence: 'moderate'
  }
];

const emergingCompounds = [
  {
    name: 'Vitamin K2 (MK-7)',
    why: 'Unlike K1, K2 activates proteins that direct calcium to bones (not arteries). Most diets lack adequate K2.',
    sources: 'Natto, aged cheese, egg yolks, grass-fed dairy',
    evidence: 'moderate'
  },
  {
    name: 'Choline',
    why: 'Essential for acetylcholine (memory), liver health, and cell membranes. Most Americans are deficient.',
    sources: 'Eggs, liver, fish, soybeans',
    evidence: 'strong'
  },
  {
    name: 'Probiotics/Prebiotics',
    why: 'Gut microbiome affects immunity, mood, metabolism, and brain function. Not tracked by most apps.',
    sources: 'Fermented foods, fiber-rich plants, or supplements',
    evidence: 'strong'
  },
  {
    name: 'Polyphenols',
    why: 'Antioxidant compounds that reduce inflammation and support longevity. Rarely tracked.',
    sources: 'Berries, dark chocolate, green tea, olive oil, red wine',
    evidence: 'moderate'
  },
  {
    name: 'Curcumin',
    why: 'Potent anti-inflammatory, but requires piperine/fat for absorption. Raw turmeric is insufficient.',
    sources: 'Turmeric extracts with piperine, or liposomal forms',
    evidence: 'moderate'
  },
  {
    name: 'Collagen',
    why: 'Supports skin elasticity, joint health, and gut lining. Production declines with age.',
    sources: 'Bone broth, collagen peptides (bovine, marine)',
    evidence: 'moderate'
  },
  {
    name: 'NAC (N-Acetyl Cysteine)',
    why: 'Precursor to glutathione (master antioxidant). Supports liver, lungs, and mental health.',
    sources: 'Supplement form (not dietary)',
    evidence: 'moderate'
  },
  {
    name: 'Adaptogens',
    why: 'Not nutrients but help regulate stress response. Ashwagandha, Rhodiola, Ginseng have clinical support.',
    sources: 'Standardized herbal extracts',
    evidence: 'moderate'
  }
];

const EducationalGuide: React.FC = () => {
  const [activeSection, setActiveSection] = useState<Section>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const sections: { id: Section; label: string; icon: string }[] = [
    { id: 'overview', label: 'Overview', icon: '📖' },
    { id: 'macronutrients', label: 'Macronutrients', icon: '🍽️' },
    { id: 'micronutrients', label: 'Vitamins & Minerals', icon: '💊' },
    { id: 'adaptogens', label: 'Adaptogens', icon: '🌿' },
    { id: 'nootropics', label: 'Nootropics', icon: '🧠' },
    { id: 'metabolic', label: 'Metabolic & Anti-inflammatory', icon: '🔥' },
    { id: 'traditional', label: 'Traditional Medicine', icon: '🕉️' },
    { id: 'wellness-goals', label: 'Wellness Goals', icon: '🎯' },
    { id: 'bioactives', label: 'Functional Bioactives', icon: '⚗️' },
    { id: 'emerging', label: 'Gaps & Emerging', icon: '🔬' }
  ];

  const toggleExpanded = (id: string) => {
    setExpandedItems(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const getEvidenceBadge = (evidence: string) => {
    const colors = {
      strong: 'bg-green-100 text-green-800',
      moderate: 'bg-yellow-100 text-yellow-800',
      limited: 'bg-orange-100 text-orange-800'
    };
    return colors[evidence as keyof typeof colors] || colors.limited;
  };

  const filteredMicronutrients = micronutrients.filter(n =>
    n.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    n.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredAdaptogens = adaptogens.filter(h =>
    h.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    h.benefits.some(b => b.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const filteredNootropics = nootropics.filter(h =>
    h.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    h.benefits.some(b => b.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-emerald-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">📚 Nutritional Science Guide</h2>
        <p className="text-emerald-100">
          Evidence-based education on nutrients, herbs, and wellness compounds
        </p>
        
        {/* Search */}
        <div className="mt-4 relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search nutrients, herbs, or benefits..."
            className="w-full pl-10 pr-4 py-3 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white"
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
        </div>
      </div>

      {/* Navigation */}
      <div className="border-b border-gray-200 overflow-x-auto">
        <div className="flex p-2 gap-1 min-w-max">
          {sections.map(section => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                activeSection === section.id
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {section.icon} {section.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-6 max-h-[70vh] overflow-y-auto">
        {/* Overview Section */}
        {activeSection === 'overview' && (
          <div className="space-y-6">
            <div className="prose max-w-none">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Essential Nutrients Overview</h3>
              
              <div className="bg-emerald-50 rounded-xl p-5 mb-6">
                <p className="text-gray-700 leading-relaxed">
                  A balanced diet must supply <strong>macronutrients</strong> (carbohydrates, proteins, fats, fiber, water) 
                  and <strong>micronutrients</strong> (vitamins and minerals) that the body cannot synthesize. 
                  Carbohydrates (including fiber) and fats are primary energy sources, while protein provides 
                  amino acids for muscle, enzymes, and hormones.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="bg-blue-50 rounded-xl p-5">
                  <h4 className="font-bold text-blue-900 mb-2">🥗 Macronutrients</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Carbohydrates (energy, fiber)</li>
                    <li>• Proteins (muscle, enzymes)</li>
                    <li>• Fats (hormones, absorption)</li>
                    <li>• Fiber (gut health, satiety)</li>
                    <li>• Water (transport, regulation)</li>
                  </ul>
                </div>
                <div className="bg-purple-50 rounded-xl p-5">
                  <h4 className="font-bold text-purple-900 mb-2">💊 Micronutrients</h4>
                  <ul className="text-sm text-purple-800 space-y-1">
                    <li>• 13 Essential Vitamins</li>
                    <li>• 7 Major Minerals</li>
                    <li>• 9+ Trace Minerals</li>
                    <li>• Essential Fatty Acids</li>
                    <li>• Choline & other conditionally essential</li>
                  </ul>
                </div>
              </div>

              <div className="bg-amber-50 rounded-xl p-5 mb-6">
                <h4 className="font-bold text-amber-900 mb-2">⚠️ Common Deficiencies</h4>
                <div className="grid md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="font-medium text-amber-800">Vitamin D</p>
                    <p className="text-amber-700">~42% of adults deficient</p>
                  </div>
                  <div>
                    <p className="font-medium text-amber-800">Magnesium</p>
                    <p className="text-amber-700">~50% below RDA</p>
                  </div>
                  <div>
                    <p className="font-medium text-amber-800">B12 (Vegans)</p>
                    <p className="text-amber-700">Up to 90% deficient</p>
                  </div>
                  <div>
                    <p className="font-medium text-amber-800">Iron (Women)</p>
                    <p className="text-amber-700">~10% deficient</p>
                  </div>
                  <div>
                    <p className="font-medium text-amber-800">Omega-3</p>
                    <p className="text-amber-700">Most diets lack EPA/DHA</p>
                  </div>
                  <div>
                    <p className="font-medium text-amber-800">Fiber</p>
                    <p className="text-amber-700">95% below recommendation</p>
                  </div>
                </div>
              </div>

              <h4 className="font-bold text-gray-900 mb-3">The App Philosophy</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="font-medium text-gray-800 mb-2">✅ What We Prioritize</p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Food before pills</li>
                    <li>• Evidence over influencers</li>
                    <li>• Safety over extremes</li>
                    <li>• Simplicity over excess</li>
                    <li>• Recovery before stimulation</li>
                  </ul>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="font-medium text-gray-800 mb-2">❌ What We Avoid</p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Unproven "miracle" cures</li>
                    <li>• Mega-dosing without evidence</li>
                    <li>• Replacing medical advice</li>
                    <li>• Marketing hype</li>
                    <li>• One-size-fits-all solutions</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Macronutrients Section */}
        {activeSection === 'macronutrients' && (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-900 mb-4">🍽️ Macronutrients</h3>
            <p className="text-gray-600 mb-6">
              The foundation of nutrition — energy sources and building blocks your body needs in large amounts daily.
            </p>
            
            {macronutrients.map((macro, idx) => (
              <div key={idx} className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                <h4 className="text-lg font-bold text-gray-900 mb-2">{macro.name}</h4>
                <p className="text-gray-700 mb-3">{macro.role}</p>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Types:</p>
                    <ul className="text-sm text-gray-700">
                      {macro.types.map((t, i) => <li key={i}>• {t}</li>)}
                    </ul>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Best Sources:</p>
                    <p className="text-sm text-gray-700">{macro.sources.join(', ')}</p>
                  </div>
                </div>
                
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <p className="text-sm text-emerald-700">
                    <strong>Recommendation:</strong> {macro.recommendation}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Micronutrients Section */}
        {activeSection === 'micronutrients' && (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-900 mb-2">💊 Vitamins & Minerals</h3>
            <p className="text-gray-600 mb-4">
              Essential micronutrients your body needs in small amounts for critical functions.
            </p>
            
            <div className="mb-4 flex gap-2 flex-wrap">
              <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800">● Strong Evidence</span>
              <span className="text-xs px-2 py-1 rounded-full bg-yellow-100 text-yellow-800">● Moderate Evidence</span>
            </div>

            <div className="space-y-3">
              {filteredMicronutrients.map((nutrient, idx) => (
                <div 
                  key={idx} 
                  className="bg-white border border-gray-200 rounded-xl overflow-hidden"
                >
                  <button
                    onClick={() => toggleExpanded(`micro-${idx}`)}
                    className="w-full p-4 flex items-center justify-between text-left hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-3">
                      <span className={`text-xs px-2 py-1 rounded-full ${getEvidenceBadge(nutrient.evidence)}`}>
                        {nutrient.evidence}
                      </span>
                      <div>
                        <h4 className="font-semibold text-gray-900">{nutrient.name}</h4>
                        <p className="text-sm text-gray-500">{nutrient.category}</p>
                      </div>
                    </div>
                    <span className="text-gray-400">
                      {expandedItems.has(`micro-${idx}`) ? '▼' : '▶'}
                    </span>
                  </button>
                  
                  {expandedItems.has(`micro-${idx}`) && (
                    <div className="p-4 pt-0 border-t border-gray-100">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium text-gray-600 mb-1">Role & Benefits:</p>
                          <p className="text-sm text-gray-700">{nutrient.role}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-600 mb-1">Food Sources:</p>
                          <p className="text-sm text-gray-700">{nutrient.sources.join(', ')}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-600 mb-1">RDA:</p>
                          <p className="text-sm text-gray-700">{nutrient.rda}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-600 mb-1">Deficiency Risk:</p>
                          <p className="text-sm text-amber-700">{nutrient.deficiencyRisk}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Adaptogens Section */}
        {activeSection === 'adaptogens' && (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-900 mb-2">🌿 Adaptogens & Stress Relievers</h3>
            <p className="text-gray-600 mb-4">
              Adaptogenic herbs help the body cope with stress and fatigue by modulating the stress response and supporting adrenal function.
            </p>

            <div className="bg-emerald-50 rounded-xl p-4 mb-6">
              <h4 className="font-semibold text-emerald-800 mb-2">How Adaptogens Work</h4>
              <p className="text-sm text-emerald-700">
                Adaptogens help normalize physiological functions by modulating the hypothalamic-pituitary-adrenal (HPA) axis. 
                They can blunt cortisol spikes during stress and support recovery, helping the body maintain homeostasis.
              </p>
            </div>

            <div className="space-y-3">
              {filteredAdaptogens.map((herb, idx) => (
                <div 
                  key={idx} 
                  className="bg-white border border-gray-200 rounded-xl overflow-hidden"
                >
                  <button
                    onClick={() => toggleExpanded(`adapt-${idx}`)}
                    className="w-full p-4 flex items-center justify-between text-left hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-3">
                      <span className={`text-xs px-2 py-1 rounded-full ${getEvidenceBadge(herb.evidence)}`}>
                        {herb.evidence}
                      </span>
                      <div>
                        <h4 className="font-semibold text-gray-900">{herb.name}</h4>
                        <p className="text-sm text-gray-500">{herb.tradition} • {herb.category}</p>
                      </div>
                    </div>
                    <span className="text-gray-400">
                      {expandedItems.has(`adapt-${idx}`) ? '▼' : '▶'}
                    </span>
                  </button>
                  
                  {expandedItems.has(`adapt-${idx}`) && (
                    <div className="p-4 pt-0 border-t border-gray-100 space-y-3">
                      <div>
                        <p className="text-sm font-medium text-gray-600 mb-1">Benefits:</p>
                        <div className="flex flex-wrap gap-1">
                          {herb.benefits.map((b, i) => (
                            <span key={i} className="text-xs bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full">{b}</span>
                          ))}
                        </div>
                      </div>
                      {herb.dosage && (
                        <div>
                          <p className="text-sm font-medium text-gray-600 mb-1">Dosage:</p>
                          <p className="text-sm text-gray-700">{herb.dosage}</p>
                        </div>
                      )}
                      {herb.cautions && (
                        <div>
                          <p className="text-sm font-medium text-amber-600 mb-1">⚠️ Cautions:</p>
                          <ul className="text-sm text-amber-700">
                            {herb.cautions.map((c, i) => <li key={i}>• {c}</li>)}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Nootropics Section */}
        {activeSection === 'nootropics' && (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-900 mb-2">🧠 Nootropics & Cognitive Enhancers</h3>
            <p className="text-gray-600 mb-4">
              Botanical and nutritional compounds that may support memory, focus, and neuroprotection.
            </p>

            <div className="bg-purple-50 rounded-xl p-4 mb-6">
              <h4 className="font-semibold text-purple-800 mb-2">Understanding Nootropics</h4>
              <p className="text-sm text-purple-700">
                Nootropics range from amino acids (L-theanine, L-tyrosine) and choline donors (Alpha-GPC, Citicoline) 
                to plant extracts (Bacopa, Lion's Mane). Many require consistent use for 4-12 weeks to show effects. 
                The caffeine + L-theanine combination is one of the most well-studied synergies for focus.
              </p>
            </div>

            <div className="space-y-3">
              {filteredNootropics.map((herb, idx) => (
                <div 
                  key={idx} 
                  className="bg-white border border-gray-200 rounded-xl overflow-hidden"
                >
                  <button
                    onClick={() => toggleExpanded(`noo-${idx}`)}
                    className="w-full p-4 flex items-center justify-between text-left hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-3">
                      <span className={`text-xs px-2 py-1 rounded-full ${getEvidenceBadge(herb.evidence)}`}>
                        {herb.evidence}
                      </span>
                      <div>
                        <h4 className="font-semibold text-gray-900">{herb.name}</h4>
                        <p className="text-sm text-gray-500">{herb.tradition} • {herb.category}</p>
                      </div>
                    </div>
                    <span className="text-gray-400">
                      {expandedItems.has(`noo-${idx}`) ? '▼' : '▶'}
                    </span>
                  </button>
                  
                  {expandedItems.has(`noo-${idx}`) && (
                    <div className="p-4 pt-0 border-t border-gray-100 space-y-3">
                      <div>
                        <p className="text-sm font-medium text-gray-600 mb-1">Benefits:</p>
                        <div className="flex flex-wrap gap-1">
                          {herb.benefits.map((b, i) => (
                            <span key={i} className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">{b}</span>
                          ))}
                        </div>
                      </div>
                      {herb.dosage && (
                        <div>
                          <p className="text-sm font-medium text-gray-600 mb-1">Dosage:</p>
                          <p className="text-sm text-gray-700">{herb.dosage}</p>
                        </div>
                      )}
                      {herb.cautions && (
                        <div>
                          <p className="text-sm font-medium text-amber-600 mb-1">⚠️ Cautions:</p>
                          <ul className="text-sm text-amber-700">
                            {herb.cautions.map((c, i) => <li key={i}>• {c}</li>)}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Metabolic & Anti-inflammatory Section */}
        {activeSection === 'metabolic' && (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-900 mb-2">🔥 Metabolic & Anti-inflammatory Botanicals</h3>
            <p className="text-gray-600 mb-4">
              Plants and compounds that support metabolism, blood sugar regulation, and inflammation control.
            </p>

            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div className="bg-orange-50 rounded-xl p-4">
                <h4 className="font-semibold text-orange-800 mb-2">Anti-inflammatory Compounds</h4>
                <ul className="text-sm text-orange-700 space-y-1">
                  <li>• <strong>Curcumin</strong> - Powerful COX-2 inhibitor</li>
                  <li>• <strong>Ginger</strong> - Gingerols reduce inflammation</li>
                  <li>• <strong>Boswellia</strong> - Blocks 5-LOX pathway</li>
                  <li>• <strong>Omega-3s</strong> - Resolvin production</li>
                  <li>• <strong>Quercetin</strong> - Mast cell stabilizer</li>
                </ul>
              </div>
              <div className="bg-blue-50 rounded-xl p-4">
                <h4 className="font-semibold text-blue-800 mb-2">Blood Sugar Support</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• <strong>Berberine</strong> - AMPK activation</li>
                  <li>• <strong>Cinnamon</strong> - Insulin sensitivity</li>
                  <li>• <strong>Bitter Melon</strong> - Glucose uptake</li>
                  <li>• <strong>Chromium</strong> - Insulin cofactor</li>
                  <li>• <strong>Alpha-Lipoic Acid</strong> - Antioxidant</li>
                </ul>
              </div>
            </div>

            <div className="space-y-3">
              {[
                {
                  name: 'Turmeric (Curcumin)',
                  category: 'Anti-inflammatory',
                  benefits: 'Potent anti-inflammatory, antioxidant, joint health, brain health, digestive support',
                  dosage: '500-2000mg curcumin with piperine or liposomal form',
                  note: 'Raw turmeric has poor bioavailability (~3%). Must be taken with black pepper (piperine) or fat to absorb.',
                  evidence: 'moderate'
                },
                {
                  name: 'Ginger (Zingiber officinale)',
                  category: 'Digestive/Anti-inflammatory',
                  benefits: 'Nausea relief, digestion, anti-inflammatory (gingerols), muscle soreness',
                  dosage: '1-3g fresh ginger or 250-500mg extract',
                  note: 'Well-studied for nausea (pregnancy, chemotherapy). May thin blood.',
                  evidence: 'strong'
                },
                {
                  name: 'Boswellia (Frankincense)',
                  category: 'Anti-inflammatory',
                  benefits: 'Joint health, inflammatory bowel conditions, asthma support',
                  dosage: '300-500mg extract (AKBA standardized)',
                  note: 'Works via different pathway than curcumin - can be combined.',
                  evidence: 'moderate'
                },
                {
                  name: 'Green Tea (EGCG)',
                  category: 'Metabolic/Antioxidant',
                  benefits: 'Fat oxidation, antioxidant, brain health, metabolic support',
                  dosage: '250-500mg EGCG or 3-5 cups tea',
                  note: 'Caffeine content varies. Decaf retains most EGCG.',
                  evidence: 'moderate'
                },
                {
                  name: 'Berberine',
                  category: 'Metabolic',
                  benefits: 'Blood sugar regulation, cholesterol, gut health (AMPK activator)',
                  dosage: '500mg 2-3x daily with meals',
                  note: 'Often compared to metformin. Can cause GI upset initially.',
                  evidence: 'moderate'
                }
              ].map((item, idx) => (
                <div key={idx} className="bg-white border border-gray-200 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${getEvidenceBadge(item.evidence)}`}>
                      {item.evidence}
                    </span>
                    <h4 className="font-semibold text-gray-900">{item.name}</h4>
                  </div>
                  <p className="text-sm text-gray-500 mb-2">{item.category}</p>
                  <p className="text-sm text-gray-700 mb-2"><strong>Benefits:</strong> {item.benefits}</p>
                  <p className="text-sm text-gray-700 mb-2"><strong>Dosage:</strong> {item.dosage}</p>
                  <p className="text-sm text-amber-700"><strong>Note:</strong> {item.note}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Traditional Medicine Section */}
        {activeSection === 'traditional' && (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-900 mb-2">🕉️ Traditional Medicine Systems</h3>
            <p className="text-gray-600 mb-4">
              Time-tested remedies from Ayurveda, Traditional Chinese Medicine (TCM), and other healing traditions.
            </p>

            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div className="bg-orange-50 rounded-xl p-4">
                <h4 className="font-semibold text-orange-800 mb-2">🕉️ Ayurvedic Staples</h4>
                <ul className="text-sm text-orange-700 space-y-1">
                  <li>• <strong>Triphala</strong> - Digestive tonic, detox</li>
                  <li>• <strong>Ashwagandha</strong> - Adaptogen, stress</li>
                  <li>• <strong>Brahmi</strong> - Cognitive support</li>
                  <li>• <strong>Tulsi</strong> - Stress, respiratory</li>
                  <li>• <strong>Shatavari</strong> - Female tonic</li>
                  <li>• <strong>Guduchi</strong> - Immune modulator</li>
                  <li>• <strong>Neem</strong> - Detox, antimicrobial</li>
                </ul>
              </div>
              <div className="bg-red-50 rounded-xl p-4">
                <h4 className="font-semibold text-red-800 mb-2">☯️ TCM Classics</h4>
                <ul className="text-sm text-red-700 space-y-1">
                  <li>• <strong>Astragalus</strong> - Qi tonic, immunity</li>
                  <li>• <strong>Reishi</strong> - Shen, longevity</li>
                  <li>• <strong>Ginseng</strong> - Energy, vitality</li>
                  <li>• <strong>Schisandra</strong> - Adaptogen, liver</li>
                  <li>• <strong>Goji Berry</strong> - Antioxidant</li>
                  <li>• <strong>Licorice</strong> - Adrenal support</li>
                  <li>• <strong>Dong Quai</strong> - Blood tonic</li>
                </ul>
              </div>
            </div>

            <div className="bg-yellow-50 rounded-xl p-4 mb-6">
              <h4 className="font-semibold text-yellow-800 mb-2">⚖️ How We Present Traditional Medicine</h4>
              <div className="text-sm text-yellow-700 space-y-2">
                <p>Each traditional remedy is presented with:</p>
                <ul className="list-disc ml-4 space-y-1">
                  <li><strong>Traditional role</strong> - How it&apos;s used in its original system</li>
                  <li><strong>Modern scientific understanding</strong> - What research supports</li>
                  <li><strong>Safety considerations</strong> - Interactions and contraindications</li>
                  <li><strong>Who should avoid it</strong> - Specific warnings</li>
                  <li><strong>Modern lifestyle use</strong> - How to incorporate today</li>
                </ul>
                <p className="mt-2 font-medium">Nothing mystical is presented as proven fact — tradition and science are clearly separated but respectfully combined.</p>
              </div>
            </div>

            <div className="space-y-3">
              {[
                {
                  name: 'Triphala',
                  tradition: 'Ayurveda',
                  description: 'A blend of three fruits: Amalaki, Bibhitaki, and Haritaki',
                  traditional: 'Digestive tonic, gentle detox, bowel regularity, rejuvenation (Rasayana)',
                  modern: 'Antioxidant, promotes bowel movements, may support gut microbiome',
                  dosage: '500-1000mg before bed or 1-2g powder in warm water',
                  evidence: 'limited'
                },
                {
                  name: 'Guduchi (Tinospora cordifolia)',
                  tradition: 'Ayurveda',
                  description: 'Known as Amrita (nectar of immortality) in Sanskrit',
                  traditional: 'Immune modulator, fever, liver support, longevity tonic',
                  modern: 'Immunomodulatory effects shown in studies, antioxidant, adaptogenic',
                  dosage: '300-500mg extract daily',
                  evidence: 'limited'
                },
                {
                  name: 'Shatavari (Asparagus racemosus)',
                  tradition: 'Ayurveda',
                  description: 'The Queen of Herbs - primary female tonic',
                  traditional: 'Female reproductive health, lactation, hormonal balance, digestive soothing',
                  modern: 'Contains steroidal saponins, may support hormonal health, adaptogenic',
                  dosage: '500-1000mg extract daily',
                  evidence: 'limited'
                },
                {
                  name: 'Astragalus (Huang Qi)',
                  tradition: 'TCM',
                  description: 'One of the most important Qi tonics in Chinese medicine',
                  traditional: 'Strengthen Wei Qi (defensive energy), tonify Spleen and Lung',
                  modern: 'Immune-stimulating polysaccharides, may support telomerase activity, anti-inflammatory',
                  dosage: '500-2000mg daily',
                  evidence: 'moderate'
                }
              ].map((item, idx) => (
                <div key={idx} className="bg-white border border-gray-200 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${getEvidenceBadge(item.evidence)}`}>
                      {item.evidence}
                    </span>
                    <span className="text-xs px-2 py-1 rounded-full bg-purple-100 text-purple-800">{item.tradition}</span>
                    <h4 className="font-semibold text-gray-900">{item.name}</h4>
                  </div>
                  <p className="text-sm text-gray-500 italic mb-2">{item.description}</p>
                  <p className="text-sm text-gray-700 mb-2"><strong>Traditional Use:</strong> {item.traditional}</p>
                  <p className="text-sm text-gray-700 mb-2"><strong>Modern Research:</strong> {item.modern}</p>
                  <p className="text-sm text-gray-700"><strong>Dosage:</strong> {item.dosage}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Wellness Goals Section */}
        {activeSection === 'wellness-goals' && (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-900 mb-2">🎯 Wellness Goals & Targeted Support</h3>
            <p className="text-gray-600 mb-4">
              Common health goals and the nutrients, herbs, and lifestyle factors that support them.
            </p>

            <div className="space-y-4">
              {wellnessGoals.map((goal, idx) => (
                <div key={idx} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                  <button
                    onClick={() => toggleExpanded(`goal-${idx}`)}
                    className="w-full p-4 flex items-center justify-between text-left hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-3">
                      <span className={`text-xs px-2 py-1 rounded-full ${getEvidenceBadge(goal.evidence)}`}>
                        {goal.evidence}
                      </span>
                      <h4 className="font-semibold text-gray-900">{goal.goal}</h4>
                    </div>
                    <span className="text-gray-400">
                      {expandedItems.has(`goal-${idx}`) ? '▼' : '▶'}
                    </span>
                  </button>
                  
                  {expandedItems.has(`goal-${idx}`) && (
                    <div className="p-4 pt-0 border-t border-gray-100">
                      <div className="grid md:grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm font-medium text-blue-600 mb-2">💊 Key Nutrients</p>
                          <div className="flex flex-wrap gap-1">
                            {goal.keyNutrients.map((n, i) => (
                              <span key={i} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">{n}</span>
                            ))}
                          </div>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-emerald-600 mb-2">🌿 Key Herbs</p>
                          <div className="flex flex-wrap gap-1">
                            {goal.keyHerbs.map((h, i) => (
                              <span key={i} className="text-xs bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full">{h}</span>
                            ))}
                          </div>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-purple-600 mb-2">🧘 Lifestyle</p>
                          <ul className="text-xs text-purple-800 space-y-1">
                            {goal.lifestyle.map((l, i) => (
                              <li key={i}>• {l}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Functional Bioactives Section */}
        {activeSection === 'bioactives' && (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-900 mb-2">⚗️ Functional Bioactives</h3>
            <p className="text-gray-600 mb-4">
              Beyond vitamins and herbs — specialized compounds for targeted benefits.
            </p>

            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <div className="bg-purple-50 rounded-xl p-4">
                <h4 className="font-semibold text-purple-800 mb-2">🧠 Nootropic Compounds</h4>
                <ul className="text-sm text-purple-700 space-y-1">
                  <li>• L-Tyrosine (dopamine)</li>
                  <li>• L-Theanine (calm focus)</li>
                  <li>• Alpha-GPC (acetylcholine)</li>
                  <li>• Citicoline (brain energy)</li>
                  <li>• Phosphatidylserine (membranes)</li>
                  <li>• Creatine (brain ATP)</li>
                </ul>
              </div>
              <div className="bg-red-50 rounded-xl p-4">
                <h4 className="font-semibold text-red-800 mb-2">🛡️ Antioxidants</h4>
                <ul className="text-sm text-red-700 space-y-1">
                  <li>• Resveratrol (grapes)</li>
                  <li>• Quercetin (onions, apples)</li>
                  <li>• EGCG (green tea)</li>
                  <li>• NAC (glutathione precursor)</li>
                  <li>• Astaxanthin (marine)</li>
                  <li>• CoQ10 (mitochondria)</li>
                </ul>
              </div>
              <div className="bg-green-50 rounded-xl p-4">
                <h4 className="font-semibold text-green-800 mb-2">🦠 Microbiome</h4>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• Probiotics (live bacteria)</li>
                  <li>• Prebiotics (fiber food)</li>
                  <li>• Postbiotics (metabolites)</li>
                  <li>• Butyrate (gut fuel)</li>
                  <li>• Saccharomyces boulardii</li>
                  <li>• Spore-based probiotics</li>
                </ul>
              </div>
            </div>

            <div className="space-y-3">
              {[
                {
                  name: 'Coenzyme Q10 (Ubiquinol)',
                  category: 'Mitochondrial Support',
                  benefits: 'Cellular energy production, heart health, antioxidant, exercise performance, statin drug depletion recovery',
                  forms: 'Ubiquinol (active, better absorbed) vs Ubiquinone (cheaper, must convert)',
                  dosage: '100-300mg daily with fat',
                  evidence: 'moderate'
                },
                {
                  name: 'NAC (N-Acetyl Cysteine)',
                  category: 'Antioxidant Precursor',
                  benefits: 'Glutathione production (master antioxidant), liver support, respiratory health, mental health support, detoxification',
                  forms: 'Capsules or powder; sometimes paired with glycine (for glutathione)',
                  dosage: '600-1800mg daily',
                  evidence: 'moderate'
                },
                {
                  name: 'Collagen Peptides',
                  category: 'Structural Protein',
                  benefits: 'Skin elasticity, joint health, gut lining, bone support, hair and nail strength',
                  forms: 'Bovine (Type I/III), Marine (Type I), Chicken (Type II for joints)',
                  dosage: '10-20g daily',
                  evidence: 'moderate'
                },
                {
                  name: 'Probiotics',
                  category: 'Microbiome Modulator',
                  benefits: 'Gut barrier function, immune modulation, nutrient absorption, mood (gut-brain axis), pathogen defense',
                  forms: 'Capsules, powders, fermented foods. Strain-specific effects.',
                  dosage: '1-50 billion CFU depending on strain and purpose',
                  evidence: 'strong'
                }
              ].map((item, idx) => (
                <div key={idx} className="bg-white border border-gray-200 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${getEvidenceBadge(item.evidence)}`}>
                      {item.evidence}
                    </span>
                    <h4 className="font-semibold text-gray-900">{item.name}</h4>
                  </div>
                  <p className="text-sm text-gray-500 mb-2">{item.category}</p>
                  <p className="text-sm text-gray-700 mb-2"><strong>Benefits:</strong> {item.benefits}</p>
                  <p className="text-sm text-gray-700 mb-2"><strong>Forms:</strong> {item.forms}</p>
                  <p className="text-sm text-gray-700"><strong>Dosage:</strong> {item.dosage}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Emerging Compounds Section */}
        {activeSection === 'emerging' && (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-900 mb-2">🔬 Gaps & Emerging Suggestions</h3>
            <p className="text-gray-600 mb-4">
              Important nutrients often overlooked by conventional tracking and emerging compounds with promising research.
            </p>

            <div className="bg-blue-50 rounded-xl p-4 mb-6">
              <h4 className="font-semibold text-blue-800 mb-2">What Most Diet Apps Miss</h4>
              <p className="text-sm text-blue-700">
                Most nutrition apps focus on macros, basic vitamins/minerals, and calories — often overlooking fiber, omega-3s, 
                phytonutrients, choline, vitamin K2, and herbal/functional compounds. A truly personalized approach should 
                integrate these overlooked elements based on individual goals.
              </p>
            </div>

            <div className="space-y-3">
              {emergingCompounds.map((item, idx) => (
                <div key={idx} className="bg-white border border-gray-200 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${getEvidenceBadge(item.evidence)}`}>
                      {item.evidence}
                    </span>
                    <h4 className="font-semibold text-gray-900">{item.name}</h4>
                  </div>
                  <p className="text-sm text-gray-700 mb-2"><strong>Why It Matters:</strong> {item.why}</p>
                  <p className="text-sm text-gray-700"><strong>Sources:</strong> {item.sources}</p>
                </div>
              ))}
            </div>

            <div className="bg-emerald-50 rounded-xl p-5 mt-6">
              <h4 className="font-semibold text-emerald-800 mb-3">📱 What Makes NutriCompass Different</h4>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-medium text-emerald-700 mb-2">This app IS:</p>
                  <ul className="text-emerald-700 space-y-1">
                    <li>✅ A structured educational guide</li>
                    <li>✅ A safety-first supplement navigator</li>
                    <li>✅ A bridge between science & tradition</li>
                    <li>✅ A filter against misinformation</li>
                  </ul>
                </div>
                <div>
                  <p className="font-medium text-emerald-700 mb-2">This app is NOT:</p>
                  <ul className="text-emerald-700 space-y-1">
                    <li>❌ A pill-selling platform</li>
                    <li>❌ A biohacking fantasy generator</li>
                    <li>❌ A medical replacement</li>
                    <li>❌ An influencer marketing tool</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EducationalGuide;
