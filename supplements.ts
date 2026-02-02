import { Supplement, HealthCondition } from '../types';

export const supplements: Supplement[] = [
  // VITAMINS (with EU NRV)
  {
    id: 'vitamin-a',
    name: 'Vitamin A',
    category: 'vitamin',
    hasOfficialNRV: true,
    nrvNutrientId: 'vitamin-a',
    description: 'Essential fat-soluble vitamin important for vision, immune function, and skin health.',
    benefits: [
      'Supports healthy vision and night vision',
      'Essential for immune system function',
      'Promotes healthy skin and mucous membranes',
      'Important for bone growth and reproduction'
    ],
    dosage: {
      recommended: '800 µg RE/day (EU NRV)',
      timing: 'With meals containing fat',
      withFood: true
    },
    forms: ['Retinol (preformed)', 'Beta-carotene (provitamin)', 'Retinyl palmitate', 'Retinyl acetate'],
    precautions: [
      'High doses can be toxic',
      'Avoid high doses during pregnancy',
      'May interact with retinoid medications'
    ],
    drugInteractions: ['Retinoid medications (isotretinoin, tretinoin)', 'Orlistat', 'Cholestyramine'],
    references: ['EU Regulation 1169/2011', 'EFSA NDA Panel opinions']
  },
  {
    id: 'vitamin-b1',
    name: 'Vitamin B1 (Thiamin)',
    category: 'vitamin',
    hasOfficialNRV: true,
    nrvNutrientId: 'vitamin-b1',
    description: 'Water-soluble B vitamin essential for energy metabolism and nerve function.',
    benefits: [
      'Converts carbohydrates to energy',
      'Supports nervous system function',
      'Important for muscle function',
      'Aids in proper heart function'
    ],
    dosage: {
      recommended: '1.1 mg/day (EU NRV)',
      timing: 'Any time of day',
      withFood: false
    },
    forms: ['Thiamine HCl', 'Thiamine mononitrate', 'Benfotiamine'],
    precautions: ['Generally well tolerated', 'Rare allergic reactions possible'],
    drugInteractions: ['May interact with loop diuretics', 'Metformin may reduce absorption'],
    references: ['EU Regulation 1169/2011', 'EFSA Scientific Opinion']
  },
  {
    id: 'vitamin-b2',
    name: 'Vitamin B2 (Riboflavin)',
    category: 'vitamin',
    hasOfficialNRV: true,
    nrvNutrientId: 'vitamin-b2',
    description: 'Water-soluble B vitamin crucial for energy production and cellular function.',
    benefits: [
      'Supports energy production',
      'May help reduce migraine frequency',
      'Antioxidant properties',
      'Important for red blood cell production'
    ],
    dosage: {
      recommended: '1.4 mg/day (EU NRV)',
      timing: 'Any time of day',
      withFood: false
    },
    forms: ['Riboflavin', 'Riboflavin-5-phosphate (active form)'],
    precautions: ['May cause yellow-orange urine (harmless)', 'Sensitivity to light'],
    drugInteractions: ['Tricyclic antidepressants', 'Probenecid'],
    references: ['EU Regulation 1169/2011']
  },
  {
    id: 'vitamin-b3',
    name: 'Vitamin B3 (Niacin)',
    category: 'vitamin',
    hasOfficialNRV: true,
    nrvNutrientId: 'vitamin-b3',
    description: 'Water-soluble B vitamin important for metabolism and nervous system function.',
    benefits: [
      'Supports energy metabolism',
      'Important for DNA repair',
      'May support healthy cholesterol levels',
      'Supports brain function'
    ],
    dosage: {
      recommended: '16 mg NE/day (EU NRV)',
      timing: 'With meals',
      withFood: true
    },
    forms: ['Nicotinic acid', 'Nicotinamide (niacinamide)', 'Inositol hexanicotinate'],
    precautions: ['High doses may cause flushing', 'Monitor liver function at high doses'],
    drugInteractions: ['Statins (increased myopathy risk)', 'Diabetes medications', 'Blood thinners'],
    references: ['EU Regulation 1169/2011']
  },
  {
    id: 'vitamin-b5',
    name: 'Vitamin B5 (Pantothenic Acid)',
    category: 'vitamin',
    hasOfficialNRV: true,
    nrvNutrientId: 'vitamin-b5',
    description: 'Water-soluble B vitamin essential for synthesizing coenzyme A.',
    benefits: [
      'Essential for energy metabolism',
      'Supports synthesis of hormones',
      'Important for red blood cell production',
      'May support wound healing'
    ],
    dosage: {
      recommended: '6 mg/day (EU NRV)',
      timing: 'Any time of day',
      withFood: false
    },
    forms: ['Calcium D-pantothenate', 'Pantethine', 'Dexpanthenol'],
    precautions: ['Generally well tolerated', 'High doses may cause diarrhea'],
    drugInteractions: ['May enhance effects of cholinesterase inhibitors'],
    references: ['EU Regulation 1169/2011']
  },
  {
    id: 'vitamin-b6',
    name: 'Vitamin B6',
    category: 'vitamin',
    hasOfficialNRV: true,
    nrvNutrientId: 'vitamin-b6',
    description: 'Water-soluble B vitamin involved in over 100 enzyme reactions.',
    benefits: [
      'Supports brain development and function',
      'Helps produce neurotransmitters',
      'May reduce homocysteine levels',
      'Supports immune function'
    ],
    dosage: {
      recommended: '1.4 mg/day (EU NRV)',
      timing: 'Any time of day',
      withFood: false
    },
    forms: ['Pyridoxine HCl', 'Pyridoxal-5-phosphate (P5P)', 'Pyridoxamine'],
    precautions: ['High doses may cause nerve damage', 'Keep below 100mg/day long-term'],
    drugInteractions: ['Levodopa', 'Phenytoin', 'Phenobarbital'],
    references: ['EU Regulation 1169/2011', 'EFSA UL opinion']
  },
  {
    id: 'vitamin-b7',
    name: 'Vitamin B7 (Biotin)',
    category: 'vitamin',
    hasOfficialNRV: true,
    nrvNutrientId: 'vitamin-b7',
    description: 'Water-soluble B vitamin important for metabolism of fats, carbohydrates, and protein.',
    benefits: [
      'Supports healthy hair, skin, and nails',
      'Important for energy metabolism',
      'Supports nervous system function',
      'May help maintain blood sugar levels'
    ],
    dosage: {
      recommended: '50 µg/day (EU NRV)',
      timing: 'Any time of day',
      withFood: false
    },
    forms: ['D-Biotin', 'Biocytin'],
    precautions: ['Can interfere with lab tests (troponin, thyroid)', 'Inform lab before blood tests'],
    drugInteractions: ['Anti-seizure medications may lower biotin levels'],
    references: ['EU Regulation 1169/2011']
  },
  {
    id: 'vitamin-b9',
    name: 'Vitamin B9 (Folate)',
    category: 'vitamin',
    hasOfficialNRV: true,
    nrvNutrientId: 'vitamin-b9',
    description: 'Water-soluble B vitamin crucial for DNA synthesis and cell division.',
    benefits: [
      'Essential for DNA synthesis',
      'Critical during pregnancy for fetal development',
      'Helps reduce homocysteine levels',
      'Supports red blood cell formation'
    ],
    dosage: {
      recommended: '200 µg/day (EU NRV)',
      timing: 'Any time of day',
      withFood: false
    },
    forms: ['Folic acid (synthetic)', 'Methylfolate (5-MTHF)', 'Folinic acid'],
    precautions: ['High doses may mask B12 deficiency', 'MTHFR gene variants may affect metabolism'],
    drugInteractions: ['Methotrexate', 'Anti-epileptic drugs', 'Sulfasalazine'],
    references: ['EU Regulation 1169/2011']
  },
  {
    id: 'vitamin-b12',
    name: 'Vitamin B12',
    category: 'vitamin',
    hasOfficialNRV: true,
    nrvNutrientId: 'vitamin-b12',
    description: 'Water-soluble B vitamin essential for nerve function and blood cell formation.',
    benefits: [
      'Essential for red blood cell formation',
      'Supports nervous system health',
      'Required for DNA synthesis',
      'May support energy levels'
    ],
    dosage: {
      recommended: '2.5 µg/day (EU NRV)',
      timing: 'Any time of day',
      withFood: false
    },
    forms: ['Cyanocobalamin', 'Methylcobalamin', 'Adenosylcobalamin', 'Hydroxocobalamin'],
    precautions: ['Deficiency common in elderly and vegans', 'Absorption decreases with age'],
    drugInteractions: ['Metformin', 'Proton pump inhibitors', 'H2 blockers'],
    references: ['EU Regulation 1169/2011']
  },
  {
    id: 'vitamin-c',
    name: 'Vitamin C',
    category: 'vitamin',
    hasOfficialNRV: true,
    nrvNutrientId: 'vitamin-c',
    description: 'Water-soluble vitamin with powerful antioxidant properties.',
    benefits: [
      'Powerful antioxidant',
      'Supports immune function',
      'Essential for collagen synthesis',
      'Enhances iron absorption'
    ],
    dosage: {
      recommended: '80 mg/day (EU NRV)',
      timing: 'Divided doses throughout day',
      withFood: false
    },
    forms: ['Ascorbic acid', 'Sodium ascorbate', 'Calcium ascorbate', 'Liposomal vitamin C'],
    precautions: ['High doses may cause GI upset', 'May affect blood sugar readings'],
    drugInteractions: ['Warfarin', 'Chemotherapy drugs', 'Estrogen-containing contraceptives'],
    references: ['EU Regulation 1169/2011']
  },
  {
    id: 'vitamin-d',
    name: 'Vitamin D',
    category: 'vitamin',
    hasOfficialNRV: true,
    nrvNutrientId: 'vitamin-d',
    description: 'Fat-soluble vitamin crucial for calcium absorption and bone health.',
    benefits: [
      'Essential for calcium absorption',
      'Supports bone health',
      'Important for immune function',
      'May support muscle function'
    ],
    dosage: {
      recommended: '5 µg/day (200 IU) (EU NRV)',
      timing: 'With meals containing fat',
      withFood: true
    },
    forms: ['Vitamin D3 (cholecalciferol)', 'Vitamin D2 (ergocalciferol)'],
    precautions: ['Toxicity possible at very high doses', 'Monitor blood levels if supplementing high doses'],
    drugInteractions: ['Steroids', 'Orlistat', 'Cholestyramine', 'Statins'],
    references: ['EU Regulation 1169/2011', 'EFSA recommends 15 µg/day for adults']
  },
  {
    id: 'vitamin-e',
    name: 'Vitamin E',
    category: 'vitamin',
    hasOfficialNRV: true,
    nrvNutrientId: 'vitamin-e',
    description: 'Fat-soluble vitamin with antioxidant properties.',
    benefits: [
      'Powerful antioxidant',
      'Supports immune function',
      'Protects cells from oxidative damage',
      'Supports skin health'
    ],
    dosage: {
      recommended: '12 mg/day (EU NRV)',
      timing: 'With meals containing fat',
      withFood: true
    },
    forms: ['d-alpha-tocopherol (natural)', 'dl-alpha-tocopherol (synthetic)', 'Mixed tocopherols', 'Tocotrienols'],
    precautions: ['High doses may increase bleeding risk', 'May interact with vitamin K'],
    drugInteractions: ['Anticoagulants (warfarin)', 'Chemotherapy drugs', 'Statins'],
    references: ['EU Regulation 1169/2011']
  },
  {
    id: 'vitamin-k',
    name: 'Vitamin K',
    category: 'vitamin',
    hasOfficialNRV: true,
    nrvNutrientId: 'vitamin-k',
    description: 'Fat-soluble vitamin essential for blood clotting and bone metabolism.',
    benefits: [
      'Essential for blood clotting',
      'Supports bone health',
      'May support cardiovascular health',
      'Works synergistically with vitamin D'
    ],
    dosage: {
      recommended: '75 µg/day (EU NRV)',
      timing: 'With meals containing fat',
      withFood: true
    },
    forms: ['Vitamin K1 (phylloquinone)', 'Vitamin K2 (menaquinone)', 'MK-4', 'MK-7'],
    precautions: ['Can interfere with anticoagulant therapy', 'Maintain consistent intake if on warfarin'],
    drugInteractions: ['Warfarin (critical)', 'Antibiotics', 'Orlistat', 'Bile acid sequestrants'],
    references: ['EU Regulation 1169/2011']
  },
  // MINERALS (with EU NRV)
  {
    id: 'calcium',
    name: 'Calcium',
    category: 'mineral',
    hasOfficialNRV: true,
    nrvNutrientId: 'calcium',
    description: 'Essential mineral for bone health, muscle function, and nerve signaling.',
    benefits: [
      'Essential for bone and teeth health',
      'Supports muscle function',
      'Important for nerve transmission',
      'Required for blood clotting'
    ],
    dosage: {
      recommended: '800 mg/day (EU NRV)',
      timing: 'Divided doses with meals',
      withFood: true
    },
    forms: ['Calcium carbonate', 'Calcium citrate', 'Calcium gluconate', 'Calcium lactate'],
    precautions: ['May cause constipation', 'Do not exceed 2500mg/day', 'Can interfere with iron absorption'],
    drugInteractions: ['Bisphosphonates', 'Thyroid medications', 'Some antibiotics', 'Zinc supplements'],
    references: ['EU Regulation 1169/2011']
  },
  {
    id: 'iron',
    name: 'Iron',
    category: 'mineral',
    hasOfficialNRV: true,
    nrvNutrientId: 'iron',
    description: 'Essential mineral for oxygen transport and energy production.',
    benefits: [
      'Essential for hemoglobin production',
      'Transports oxygen in blood',
      'Supports energy metabolism',
      'Important for cognitive function'
    ],
    dosage: {
      recommended: '14 mg/day (EU NRV)',
      timing: 'On empty stomach or with vitamin C',
      withFood: false
    },
    forms: ['Ferrous sulfate', 'Ferrous gluconate', 'Ferrous fumarate', 'Iron bisglycinate'],
    precautions: ['Can cause GI upset', 'Do not take unless deficient', 'Keep away from children'],
    drugInteractions: ['Antacids', 'Proton pump inhibitors', 'Tetracycline antibiotics', 'Levodopa'],
    references: ['EU Regulation 1169/2011']
  },
  {
    id: 'magnesium',
    name: 'Magnesium',
    category: 'mineral',
    hasOfficialNRV: true,
    nrvNutrientId: 'magnesium',
    description: 'Essential mineral involved in over 300 enzymatic reactions.',
    benefits: [
      'Supports muscle and nerve function',
      'Important for energy production',
      'May support sleep quality',
      'Supports bone health'
    ],
    dosage: {
      recommended: '375 mg/day (EU NRV)',
      timing: 'Evening or divided doses',
      withFood: true
    },
    forms: ['Magnesium citrate', 'Magnesium glycinate', 'Magnesium oxide', 'Magnesium threonate', 'Magnesium malate'],
    precautions: ['High doses may cause diarrhea', 'Reduce dose if GI symptoms occur'],
    drugInteractions: ['Bisphosphonates', 'Some antibiotics', 'Diuretics', 'Proton pump inhibitors'],
    references: ['EU Regulation 1169/2011']
  },
  {
    id: 'zinc',
    name: 'Zinc',
    category: 'mineral',
    hasOfficialNRV: true,
    nrvNutrientId: 'zinc',
    description: 'Essential trace mineral important for immune function and wound healing.',
    benefits: [
      'Supports immune function',
      'Important for wound healing',
      'Required for protein synthesis',
      'Supports taste and smell'
    ],
    dosage: {
      recommended: '10 mg/day (EU NRV)',
      timing: 'With food to reduce nausea',
      withFood: true
    },
    forms: ['Zinc picolinate', 'Zinc citrate', 'Zinc gluconate', 'Zinc acetate', 'Zinc bisglycinate'],
    precautions: ['High doses can cause copper deficiency', 'May cause nausea if taken on empty stomach'],
    drugInteractions: ['Antibiotics (quinolones, tetracyclines)', 'Penicillamine', 'Thiazide diuretics'],
    references: ['EU Regulation 1169/2011']
  },
  {
    id: 'selenium',
    name: 'Selenium',
    category: 'mineral',
    hasOfficialNRV: true,
    nrvNutrientId: 'selenium',
    description: 'Essential trace mineral with antioxidant properties.',
    benefits: [
      'Supports thyroid function',
      'Antioxidant protection',
      'Supports immune function',
      'May support reproductive health'
    ],
    dosage: {
      recommended: '55 µg/day (EU NRV)',
      timing: 'With food',
      withFood: true
    },
    forms: ['Selenomethionine', 'Sodium selenite', 'Selenium yeast'],
    precautions: ['Toxicity possible at high doses', 'Do not exceed 400 µg/day'],
    drugInteractions: ['Statins', 'Niacin', 'Chemotherapy drugs'],
    references: ['EU Regulation 1169/2011']
  },
  {
    id: 'iodine',
    name: 'Iodine',
    category: 'mineral',
    hasOfficialNRV: true,
    nrvNutrientId: 'iodine',
    description: 'Essential trace mineral crucial for thyroid hormone production.',
    benefits: [
      'Essential for thyroid function',
      'Supports metabolism',
      'Important during pregnancy',
      'Supports cognitive development'
    ],
    dosage: {
      recommended: '150 µg/day (EU NRV)',
      timing: 'Any time of day',
      withFood: false
    },
    forms: ['Potassium iodide', 'Kelp', 'Sodium iodide'],
    precautions: ['Excess can affect thyroid function', 'Caution with thyroid conditions'],
    drugInteractions: ['Thyroid medications', 'ACE inhibitors', 'Potassium-sparing diuretics'],
    references: ['EU Regulation 1169/2011']
  },
  {
    id: 'copper',
    name: 'Copper',
    category: 'mineral',
    hasOfficialNRV: true,
    nrvNutrientId: 'copper',
    description: 'Essential trace mineral important for iron metabolism and connective tissue.',
    benefits: [
      'Supports iron absorption',
      'Important for connective tissue',
      'Supports nervous system',
      'Involved in energy production'
    ],
    dosage: {
      recommended: '1 mg/day (EU NRV)',
      timing: 'With food',
      withFood: true
    },
    forms: ['Copper gluconate', 'Copper sulfate', 'Copper bisglycinate'],
    precautions: ['Excess can be toxic', 'Balance with zinc intake'],
    drugInteractions: ['Zinc supplements', 'Penicillamine', 'Antacids'],
    references: ['EU Regulation 1169/2011']
  },
  {
    id: 'manganese',
    name: 'Manganese',
    category: 'mineral',
    hasOfficialNRV: true,
    nrvNutrientId: 'manganese',
    description: 'Trace mineral important for bone formation and metabolism.',
    benefits: [
      'Supports bone health',
      'Important for metabolism',
      'Antioxidant cofactor',
      'Supports wound healing'
    ],
    dosage: {
      recommended: '2 mg/day (EU NRV)',
      timing: 'With food',
      withFood: true
    },
    forms: ['Manganese gluconate', 'Manganese sulfate', 'Manganese citrate'],
    precautions: ['Excess can be neurotoxic', 'Avoid high-dose supplementation'],
    drugInteractions: ['Antacids', 'Laxatives', 'Tetracycline antibiotics'],
    references: ['EU Regulation 1169/2011']
  },
  {
    id: 'chromium',
    name: 'Chromium',
    category: 'mineral',
    hasOfficialNRV: true,
    nrvNutrientId: 'chromium',
    description: 'Trace mineral that may support glucose metabolism.',
    benefits: [
      'May support blood sugar control',
      'May support insulin sensitivity',
      'Involved in macronutrient metabolism'
    ],
    dosage: {
      recommended: '40 µg/day (EU NRV)',
      timing: 'With food',
      withFood: true
    },
    forms: ['Chromium picolinate', 'Chromium polynicotinate', 'Chromium chloride'],
    precautions: ['May affect blood sugar levels', 'Consult doctor if diabetic'],
    drugInteractions: ['Insulin', 'Diabetes medications', 'NSAIDs'],
    references: ['EU Regulation 1169/2011']
  },
  {
    id: 'molybdenum',
    name: 'Molybdenum',
    category: 'mineral',
    hasOfficialNRV: true,
    nrvNutrientId: 'molybdenum',
    description: 'Trace mineral that serves as a cofactor for several enzymes.',
    benefits: [
      'Cofactor for essential enzymes',
      'Supports sulfite detoxification',
      'Important for uric acid production'
    ],
    dosage: {
      recommended: '50 µg/day (EU NRV)',
      timing: 'With food',
      withFood: true
    },
    forms: ['Sodium molybdate', 'Molybdenum citrate', 'Molybdenum glycinate'],
    precautions: ['Deficiency is rare', 'Excess may affect copper metabolism'],
    drugInteractions: ['May interact with copper supplements'],
    references: ['EU Regulation 1169/2011']
  },
  {
    id: 'potassium',
    name: 'Potassium',
    category: 'mineral',
    hasOfficialNRV: true,
    nrvNutrientId: 'potassium',
    description: 'Essential mineral for fluid balance and muscle function.',
    benefits: [
      'Supports blood pressure regulation',
      'Essential for muscle function',
      'Supports nerve function',
      'Maintains fluid balance'
    ],
    dosage: {
      recommended: '2000 mg/day (EU NRV)',
      timing: 'With meals, divided doses',
      withFood: true
    },
    forms: ['Potassium citrate', 'Potassium chloride', 'Potassium gluconate'],
    precautions: ['Can affect heart rhythm', 'Use caution with kidney disease', 'Monitor if on certain medications'],
    drugInteractions: ['ACE inhibitors', 'Potassium-sparing diuretics', 'NSAIDs'],
    references: ['EU Regulation 1169/2011']
  },
  {
    id: 'phosphorus',
    name: 'Phosphorus',
    category: 'mineral',
    hasOfficialNRV: true,
    nrvNutrientId: 'phosphorus',
    description: 'Essential mineral for bone health and energy production.',
    benefits: [
      'Essential for bone structure',
      'Component of ATP (energy)',
      'Supports cell membrane structure',
      'Important for DNA/RNA synthesis'
    ],
    dosage: {
      recommended: '700 mg/day (EU NRV)',
      timing: 'With meals',
      withFood: true
    },
    forms: ['Sodium phosphate', 'Potassium phosphate', 'Calcium phosphate'],
    precautions: ['Usually adequate in diet', 'Excess may affect calcium balance'],
    drugInteractions: ['Antacids', 'Calcium supplements', 'Some diuretics'],
    references: ['EU Regulation 1169/2011']
  },
  // FATTY ACIDS
  {
    id: 'omega-3',
    name: 'Omega-3 Fatty Acids',
    category: 'fatty-acid',
    hasOfficialNRV: true,
    nrvNutrientId: 'omega-3',
    description: 'Essential fatty acids important for heart and brain health.',
    benefits: [
      'Supports cardiovascular health',
      'May reduce inflammation',
      'Supports brain function',
      'Important for eye health'
    ],
    dosage: {
      recommended: '250 mg EPA+DHA/day (EFSA)',
      timing: 'With meals',
      withFood: true
    },
    forms: ['Fish oil', 'Krill oil', 'Algal oil (vegan)', 'Cod liver oil'],
    precautions: ['May increase bleeding risk at high doses', 'Fish-derived products may contain contaminants'],
    drugInteractions: ['Blood thinners', 'Blood pressure medications', 'Contraceptive drugs'],
    references: ['EFSA 2010', 'EU health claims regulation']
  },
  // HERBS (No official NRV)
  {
    id: 'ashwagandha',
    name: 'Ashwagandha',
    category: 'herb',
    hasOfficialNRV: false,
    description: 'Traditional Ayurvedic adaptogenic herb used for stress support.',
    benefits: [
      'May help reduce stress and anxiety',
      'May support healthy cortisol levels',
      'Traditionally used for vitality',
      'May support sleep quality'
    ],
    dosage: {
      recommended: '300-600 mg standardized extract daily',
      timing: 'Evening or divided doses',
      withFood: true
    },
    forms: ['Root extract', 'KSM-66', 'Sensoril', 'Powder'],
    precautions: [
      'May affect thyroid function',
      'Avoid during pregnancy',
      'May cause drowsiness'
    ],
    drugInteractions: ['Thyroid medications', 'Sedatives', 'Immunosuppressants'],
    references: ['Traditional Ayurvedic use', 'Various clinical studies']
  },
  {
    id: 'turmeric',
    name: 'Turmeric (Curcumin)',
    category: 'herb',
    hasOfficialNRV: false,
    description: 'Anti-inflammatory spice with active compound curcumin.',
    benefits: [
      'Potent anti-inflammatory properties',
      'Antioxidant effects',
      'May support joint health',
      'May support cognitive function'
    ],
    dosage: {
      recommended: '500-2000 mg curcumin daily',
      timing: 'With meals containing fat',
      withFood: true
    },
    forms: ['Curcumin extract', 'Turmeric powder', 'Liposomal curcumin', 'Curcumin with piperine'],
    precautions: [
      'May thin blood',
      'May cause GI upset',
      'Avoid before surgery'
    ],
    drugInteractions: ['Blood thinners', 'Diabetes medications', 'Acid-reducing drugs'],
    references: ['Traditional Ayurvedic use', 'Various clinical studies']
  },
  {
    id: 'ginkgo-biloba',
    name: 'Ginkgo Biloba',
    category: 'herb',
    hasOfficialNRV: false,
    description: 'Traditional herb used for cognitive support and circulation.',
    benefits: [
      'May support cognitive function',
      'May improve circulation',
      'Antioxidant properties',
      'May support eye health'
    ],
    dosage: {
      recommended: '120-240 mg standardized extract daily',
      timing: 'Divided doses with meals',
      withFood: true
    },
    forms: ['Standardized leaf extract (EGb 761)', 'Capsules', 'Tablets'],
    precautions: [
      'May increase bleeding risk',
      'Avoid before surgery',
      'May cause headaches'
    ],
    drugInteractions: ['Blood thinners', 'SSRIs', 'MAOIs', 'Seizure medications'],
    references: ['German Commission E', 'Various clinical studies']
  },
  {
    id: 'milk-thistle',
    name: 'Milk Thistle (Silymarin)',
    category: 'herb',
    hasOfficialNRV: false,
    description: 'Herb traditionally used for liver support.',
    benefits: [
      'May support liver health',
      'Antioxidant properties',
      'May support detoxification',
      'Traditionally used for digestive support'
    ],
    dosage: {
      recommended: '200-400 mg silymarin daily',
      timing: 'With meals',
      withFood: true
    },
    forms: ['Silymarin extract', 'Seed extract', 'Phosphatidylcholine complex'],
    precautions: [
      'May cause allergic reactions in people allergic to ragweed',
      'May have estrogenic effects'
    ],
    drugInteractions: ['Medications metabolized by liver', 'Estrogen-containing medications'],
    references: ['Traditional European use', 'Various clinical studies']
  },
  {
    id: 'valerian',
    name: 'Valerian Root',
    category: 'herb',
    hasOfficialNRV: false,
    description: 'Traditional herb used for sleep and relaxation support.',
    benefits: [
      'May support sleep quality',
      'May reduce time to fall asleep',
      'May promote relaxation',
      'Traditionally used for nervous tension'
    ],
    dosage: {
      recommended: '300-600 mg before bedtime',
      timing: '30-60 minutes before sleep',
      withFood: false
    },
    forms: ['Root extract', 'Dried root', 'Tincture', 'Tea'],
    precautions: [
      'May cause morning grogginess',
      'Do not combine with alcohol',
      'May affect driving ability'
    ],
    drugInteractions: ['Sedatives', 'Benzodiazepines', 'Alcohol', 'Other sleep aids'],
    references: ['German Commission E', 'Traditional European use']
  },
  // NOOTROPICS (No official NRV)
  {
    id: 'lions-mane',
    name: "Lion's Mane Mushroom",
    category: 'nootropic',
    hasOfficialNRV: false,
    description: 'Medicinal mushroom traditionally used for cognitive support.',
    benefits: [
      'May support cognitive function',
      'May support nerve growth factor',
      'May support mood',
      'Traditional immune support'
    ],
    dosage: {
      recommended: '500-3000 mg daily',
      timing: 'With meals',
      withFood: true
    },
    forms: ['Fruiting body extract', 'Mycelium extract', 'Powder', 'Capsules'],
    precautions: [
      'May cause digestive discomfort',
      'Possible allergic reactions',
      'Limited long-term safety data'
    ],
    drugInteractions: ['Blood thinners', 'Diabetes medications'],
    references: ['Traditional Chinese medicine', 'Various clinical studies']
  },
  {
    id: 'bacopa',
    name: 'Bacopa Monnieri',
    category: 'nootropic',
    hasOfficialNRV: false,
    description: 'Ayurvedic herb traditionally used for memory and cognitive support.',
    benefits: [
      'May support memory',
      'May support learning',
      'Adaptogenic properties',
      'Antioxidant effects'
    ],
    dosage: {
      recommended: '300-450 mg standardized extract daily',
      timing: 'With meals',
      withFood: true
    },
    forms: ['Standardized extract', 'Whole herb powder', 'BacoMind', 'Synapsa'],
    precautions: [
      'May cause GI upset',
      'Effects may take 8-12 weeks',
      'May cause fatigue initially'
    ],
    drugInteractions: ['Thyroid medications', 'Calcium channel blockers', 'Sedatives'],
    references: ['Traditional Ayurvedic use', 'Various clinical studies']
  },
  {
    id: 'rhodiola',
    name: 'Rhodiola Rosea',
    category: 'herb',
    hasOfficialNRV: false,
    description: 'Adaptogenic herb traditionally used for fatigue and stress support.',
    benefits: [
      'May reduce fatigue',
      'May support stress resilience',
      'May support mental performance',
      'Adaptogenic properties'
    ],
    dosage: {
      recommended: '200-600 mg standardized extract daily',
      timing: 'Morning, before meals',
      withFood: false
    },
    forms: ['Root extract', 'SHR-5 extract', 'Capsules', 'Tablets'],
    precautions: [
      'May cause insomnia if taken late',
      'May cause agitation in some people',
      'Start with lower doses'
    ],
    drugInteractions: ['Stimulants', 'Antidepressants', 'Diabetes medications'],
    references: ['Traditional Scandinavian use', 'Various clinical studies']
  },
  // AMINO ACIDS
  {
    id: 'l-theanine',
    name: 'L-Theanine',
    category: 'amino-acid',
    hasOfficialNRV: false,
    description: 'Amino acid found in tea that promotes relaxation without drowsiness.',
    benefits: [
      'May promote relaxation',
      'May support focus when combined with caffeine',
      'May support sleep quality',
      'May reduce stress'
    ],
    dosage: {
      recommended: '100-400 mg daily',
      timing: 'Any time, or before bed for sleep',
      withFood: false
    },
    forms: ['L-Theanine', 'Suntheanine'],
    precautions: [
      'Generally well tolerated',
      'May lower blood pressure slightly'
    ],
    drugInteractions: ['Blood pressure medications', 'Stimulants'],
    references: ['Various clinical studies']
  },
  {
    id: 'glycine',
    name: 'Glycine',
    category: 'amino-acid',
    hasOfficialNRV: false,
    description: 'Simple amino acid that supports sleep and collagen production.',
    benefits: [
      'May improve sleep quality',
      'Supports collagen synthesis',
      'May support cognitive function',
      'Component of glutathione'
    ],
    dosage: {
      recommended: '3-5 g before bed for sleep',
      timing: 'Before bedtime',
      withFood: false
    },
    forms: ['Glycine powder', 'Capsules'],
    precautions: [
      'Generally well tolerated',
      'May cause mild stomach upset in some'
    ],
    drugInteractions: ['Clozapine', 'Some antipsychotics'],
    references: ['Various clinical studies']
  },
  // OTHER
  {
    id: 'coq10',
    name: 'Coenzyme Q10 (CoQ10)',
    category: 'other',
    hasOfficialNRV: false,
    description: 'Antioxidant compound important for cellular energy production.',
    benefits: [
      'Supports cellular energy production',
      'Antioxidant properties',
      'May support heart health',
      'May reduce statin side effects'
    ],
    dosage: {
      recommended: '100-300 mg daily',
      timing: 'With meals containing fat',
      withFood: true
    },
    forms: ['Ubiquinone', 'Ubiquinol (reduced form)', 'Softgels', 'Capsules'],
    precautions: [
      'May interact with blood thinners',
      'May lower blood pressure'
    ],
    drugInteractions: ['Warfarin', 'Blood pressure medications', 'Chemotherapy drugs'],
    references: ['Various clinical studies']
  },
  {
    id: 'probiotics',
    name: 'Probiotics',
    category: 'other',
    hasOfficialNRV: false,
    description: 'Beneficial bacteria that support gut health and immune function.',
    benefits: [
      'Support digestive health',
      'May support immune function',
      'May improve gut barrier function',
      'May support mental health via gut-brain axis'
    ],
    dosage: {
      recommended: '1-50 billion CFU daily (strain dependent)',
      timing: 'With or without food (product specific)',
      withFood: true
    },
    forms: ['Capsules', 'Powder', 'Fermented foods', 'Sachets'],
    precautions: [
      'May cause initial gas/bloating',
      'Caution in immunocompromised individuals',
      'Strain-specific benefits'
    ],
    drugInteractions: ['Antibiotics (take separately)', 'Immunosuppressants'],
    references: ['Various clinical studies', 'Strain-specific research']
  },
  {
    id: 'melatonin',
    name: 'Melatonin',
    category: 'other',
    hasOfficialNRV: false,
    description: 'Hormone that regulates sleep-wake cycles.',
    benefits: [
      'May help with jet lag',
      'May support sleep onset',
      'May support circadian rhythm',
      'Antioxidant properties'
    ],
    dosage: {
      recommended: '0.5-5 mg before bed',
      timing: '30-60 minutes before sleep',
      withFood: false
    },
    forms: ['Tablets', 'Gummies', 'Liquid', 'Extended-release'],
    precautions: [
      'May cause morning grogginess',
      'Not for long-term use without guidance',
      'May affect fertility'
    ],
    drugInteractions: ['Sedatives', 'Blood thinners', 'Immunosuppressants', 'Diabetes medications', 'Contraceptive drugs'],
    references: ['Various clinical studies', 'EFSA health claims']
  },
  {
    id: 'choline',
    name: 'Choline',
    category: 'other',
    hasOfficialNRV: true,
    nrvNutrientId: 'choline',
    description: 'Essential nutrient important for brain function and liver health.',
    benefits: [
      'Supports brain function',
      'Important for liver health',
      'Precursor to acetylcholine',
      'Supports cell membrane structure'
    ],
    dosage: {
      recommended: '400 mg/day (EFSA AI)',
      timing: 'With meals',
      withFood: true
    },
    forms: ['Choline bitartrate', 'CDP-choline (Citicoline)', 'Alpha-GPC', 'Phosphatidylcholine'],
    precautions: [
      'High doses may cause fishy body odor',
      'May cause GI upset'
    ],
    drugInteractions: ['Acetylcholinesterase inhibitors', 'Anticholinergic drugs'],
    references: ['EFSA 2016', 'Various clinical studies']
  }
];

// Health conditions for recommendation engine
export const healthConditions: HealthCondition[] = [
  {
    id: 'stress-anxiety',
    name: 'Stress & Anxiety Support',
    description: 'Support for managing daily stress and promoting calm',
    recommendedSupplements: ['ashwagandha', 'magnesium', 'l-theanine', 'rhodiola', 'vitamin-b6']
  },
  {
    id: 'sleep-support',
    name: 'Sleep Support',
    description: 'Support for healthy sleep patterns',
    recommendedSupplements: ['magnesium', 'melatonin', 'glycine', 'valerian', 'l-theanine']
  },
  {
    id: 'cognitive-function',
    name: 'Cognitive Function',
    description: 'Support for memory, focus, and mental clarity',
    recommendedSupplements: ['omega-3', 'lions-mane', 'bacopa', 'ginkgo-biloba', 'vitamin-b12', 'choline']
  },
  {
    id: 'energy-vitality',
    name: 'Energy & Vitality',
    description: 'Support for natural energy levels',
    recommendedSupplements: ['vitamin-b12', 'iron', 'coq10', 'rhodiola', 'vitamin-b1', 'magnesium']
  },
  {
    id: 'immune-support',
    name: 'Immune Support',
    description: 'Support for healthy immune function',
    recommendedSupplements: ['vitamin-c', 'vitamin-d', 'zinc', 'selenium', 'probiotics']
  },
  {
    id: 'bone-health',
    name: 'Bone Health',
    description: 'Support for healthy bones and joints',
    recommendedSupplements: ['calcium', 'vitamin-d', 'vitamin-k', 'magnesium', 'phosphorus']
  },
  {
    id: 'heart-health',
    name: 'Heart Health',
    description: 'Support for cardiovascular health',
    recommendedSupplements: ['omega-3', 'coq10', 'magnesium', 'potassium', 'vitamin-b9']
  },
  {
    id: 'skin-health',
    name: 'Skin, Hair & Nails',
    description: 'Support for healthy skin, hair, and nails',
    recommendedSupplements: ['vitamin-a', 'vitamin-c', 'vitamin-e', 'vitamin-b7', 'zinc', 'selenium']
  },
  {
    id: 'liver-support',
    name: 'Liver Support',
    description: 'Support for healthy liver function',
    recommendedSupplements: ['milk-thistle', 'choline', 'vitamin-b12', 'selenium']
  },
  {
    id: 'antioxidant-support',
    name: 'Antioxidant Support',
    description: 'Protection against oxidative stress',
    recommendedSupplements: ['vitamin-c', 'vitamin-e', 'selenium', 'coq10', 'turmeric']
  }
];
