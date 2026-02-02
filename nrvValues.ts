// EU Nutrient Reference Values (NRVs) from Regulation (EU) No 1169/2011, Annex XIII
// Source: Official Journal of the European Union L 304/18, 22.11.2011
// Note: EU NRVs are single reference values for adults, not differentiated by sex or life stage

export interface NRVReference {
  nutrientId: string;
  nutrientName: string;
  nrv: {
    amount: number;
    unit: string;
    source: string;
  };
  unitConversion?: {
    from: string;
    to: string;
    factor: number;
  };
  notes?: string;
}

// EU NRVs from Regulation (EU) No 1169/2011
export const euNRVReferences: NRVReference[] = [
  // VITAMINS
  {
    nutrientId: 'vitamin-a',
    nutrientName: 'Vitamin A',
    nrv: { amount: 800, unit: 'µg', source: 'EU Regulation 1169/2011' },
    unitConversion: { from: 'IU', to: 'µg', factor: 0.3 },
    notes: 'Expressed as Retinol Equivalents (RE). 1 µg RE = 1 µg retinol = 6 µg β-carotene'
  },
  {
    nutrientId: 'vitamin-b1',
    nutrientName: 'Thiamin (Vitamin B1)',
    nrv: { amount: 1.1, unit: 'mg', source: 'EU Regulation 1169/2011' }
  },
  {
    nutrientId: 'vitamin-b2',
    nutrientName: 'Riboflavin (Vitamin B2)',
    nrv: { amount: 1.4, unit: 'mg', source: 'EU Regulation 1169/2011' }
  },
  {
    nutrientId: 'vitamin-b3',
    nutrientName: 'Niacin (Vitamin B3)',
    nrv: { amount: 16, unit: 'mg NE', source: 'EU Regulation 1169/2011' },
    notes: 'NE = Niacin Equivalents'
  },
  {
    nutrientId: 'vitamin-b5',
    nutrientName: 'Pantothenic Acid (Vitamin B5)',
    nrv: { amount: 6, unit: 'mg', source: 'EU Regulation 1169/2011' }
  },
  {
    nutrientId: 'vitamin-b6',
    nutrientName: 'Vitamin B6',
    nrv: { amount: 1.4, unit: 'mg', source: 'EU Regulation 1169/2011' }
  },
  {
    nutrientId: 'vitamin-b7',
    nutrientName: 'Biotin (Vitamin B7)',
    nrv: { amount: 50, unit: 'µg', source: 'EU Regulation 1169/2011' }
  },
  {
    nutrientId: 'vitamin-b9',
    nutrientName: 'Folate (Vitamin B9)',
    nrv: { amount: 200, unit: 'µg', source: 'EU Regulation 1169/2011' },
    notes: 'Expressed as folic acid'
  },
  {
    nutrientId: 'vitamin-b12',
    nutrientName: 'Vitamin B12',
    nrv: { amount: 2.5, unit: 'µg', source: 'EU Regulation 1169/2011' }
  },
  {
    nutrientId: 'vitamin-c',
    nutrientName: 'Vitamin C',
    nrv: { amount: 80, unit: 'mg', source: 'EU Regulation 1169/2011' }
  },
  {
    nutrientId: 'vitamin-d',
    nutrientName: 'Vitamin D',
    nrv: { amount: 5, unit: 'µg', source: 'EU Regulation 1169/2011' },
    unitConversion: { from: 'IU', to: 'µg', factor: 0.025 },
    notes: '5 µg = 200 IU. Note: EFSA recommends 15 µg/day for adults, but NRV remains 5 µg'
  },
  {
    nutrientId: 'vitamin-e',
    nutrientName: 'Vitamin E',
    nrv: { amount: 12, unit: 'mg', source: 'EU Regulation 1169/2011' },
    unitConversion: { from: 'IU', to: 'mg', factor: 0.67 },
    notes: 'Expressed as α-tocopherol equivalents'
  },
  {
    nutrientId: 'vitamin-k',
    nutrientName: 'Vitamin K',
    nrv: { amount: 75, unit: 'µg', source: 'EU Regulation 1169/2011' }
  },
  // MINERALS
  {
    nutrientId: 'calcium',
    nutrientName: 'Calcium',
    nrv: { amount: 800, unit: 'mg', source: 'EU Regulation 1169/2011' }
  },
  {
    nutrientId: 'chloride',
    nutrientName: 'Chloride',
    nrv: { amount: 800, unit: 'mg', source: 'EU Regulation 1169/2011' }
  },
  {
    nutrientId: 'chromium',
    nutrientName: 'Chromium',
    nrv: { amount: 40, unit: 'µg', source: 'EU Regulation 1169/2011' }
  },
  {
    nutrientId: 'copper',
    nutrientName: 'Copper',
    nrv: { amount: 1, unit: 'mg', source: 'EU Regulation 1169/2011' }
  },
  {
    nutrientId: 'fluoride',
    nutrientName: 'Fluoride',
    nrv: { amount: 3.5, unit: 'mg', source: 'EU Regulation 1169/2011' }
  },
  {
    nutrientId: 'iodine',
    nutrientName: 'Iodine',
    nrv: { amount: 150, unit: 'µg', source: 'EU Regulation 1169/2011' }
  },
  {
    nutrientId: 'iron',
    nutrientName: 'Iron',
    nrv: { amount: 14, unit: 'mg', source: 'EU Regulation 1169/2011' }
  },
  {
    nutrientId: 'magnesium',
    nutrientName: 'Magnesium',
    nrv: { amount: 375, unit: 'mg', source: 'EU Regulation 1169/2011' }
  },
  {
    nutrientId: 'manganese',
    nutrientName: 'Manganese',
    nrv: { amount: 2, unit: 'mg', source: 'EU Regulation 1169/2011' }
  },
  {
    nutrientId: 'molybdenum',
    nutrientName: 'Molybdenum',
    nrv: { amount: 50, unit: 'µg', source: 'EU Regulation 1169/2011' }
  },
  {
    nutrientId: 'phosphorus',
    nutrientName: 'Phosphorus',
    nrv: { amount: 700, unit: 'mg', source: 'EU Regulation 1169/2011' }
  },
  {
    nutrientId: 'potassium',
    nutrientName: 'Potassium',
    nrv: { amount: 2000, unit: 'mg', source: 'EU Regulation 1169/2011' }
  },
  {
    nutrientId: 'selenium',
    nutrientName: 'Selenium',
    nrv: { amount: 55, unit: 'µg', source: 'EU Regulation 1169/2011' }
  },
  {
    nutrientId: 'zinc',
    nutrientName: 'Zinc',
    nrv: { amount: 10, unit: 'mg', source: 'EU Regulation 1169/2011' }
  },
];

// Additional nutrients without official EU NRV but with EFSA recommendations
export const efsaRecommendations: NRVReference[] = [
  {
    nutrientId: 'omega-3',
    nutrientName: 'Omega-3 Fatty Acids (EPA+DHA)',
    nrv: { amount: 250, unit: 'mg', source: 'EFSA 2010' },
    notes: 'EFSA recommends 250 mg EPA+DHA per day for adults. ALA: 2g/day for heart health claims'
  },
  {
    nutrientId: 'choline',
    nutrientName: 'Choline',
    nrv: { amount: 400, unit: 'mg', source: 'EFSA 2016' },
    notes: 'EFSA Adequate Intake for adults'
  },
];

// Combined NRV references (EU NRVs + EFSA recommendations)
export const allNRVReferences: NRVReference[] = [...euNRVReferences, ...efsaRecommendations];

// Helper function to get NRV for a nutrient
export function getNRVForNutrient(nutrientId: string): NRVReference | null {
  return allNRVReferences.find(r => r.nutrientId === nutrientId) || null;
}

// Helper to check if nutrient has official NRV
export function hasOfficialNRV(nutrientId: string): boolean {
  return euNRVReferences.some(r => r.nutrientId === nutrientId);
}

// Mapping of common nutrient names to IDs
export const nutrientNameToId: Record<string, string> = {
  'vitamin a': 'vitamin-a',
  'vitamin b1': 'vitamin-b1',
  'thiamin': 'vitamin-b1',
  'thiamine': 'vitamin-b1',
  'vitamin b2': 'vitamin-b2',
  'riboflavin': 'vitamin-b2',
  'vitamin b3': 'vitamin-b3',
  'niacin': 'vitamin-b3',
  'vitamin b5': 'vitamin-b5',
  'pantothenic acid': 'vitamin-b5',
  'vitamin b6': 'vitamin-b6',
  'pyridoxine': 'vitamin-b6',
  'vitamin b7': 'vitamin-b7',
  'biotin': 'vitamin-b7',
  'vitamin b9': 'vitamin-b9',
  'folate': 'vitamin-b9',
  'folic acid': 'vitamin-b9',
  'vitamin b12': 'vitamin-b12',
  'cobalamin': 'vitamin-b12',
  'vitamin c': 'vitamin-c',
  'ascorbic acid': 'vitamin-c',
  'vitamin d': 'vitamin-d',
  'vitamin d3': 'vitamin-d',
  'cholecalciferol': 'vitamin-d',
  'vitamin e': 'vitamin-e',
  'tocopherol': 'vitamin-e',
  'vitamin k': 'vitamin-k',
  'vitamin k2': 'vitamin-k',
  'calcium': 'calcium',
  'chloride': 'chloride',
  'chromium': 'chromium',
  'copper': 'copper',
  'fluoride': 'fluoride',
  'iodine': 'iodine',
  'iron': 'iron',
  'magnesium': 'magnesium',
  'manganese': 'manganese',
  'molybdenum': 'molybdenum',
  'phosphorus': 'phosphorus',
  'potassium': 'potassium',
  'selenium': 'selenium',
  'zinc': 'zinc',
  'omega-3': 'omega-3',
  'omega 3': 'omega-3',
  'fish oil': 'omega-3',
  'choline': 'choline',
};
