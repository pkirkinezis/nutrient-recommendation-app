import { UserProfile } from '../types';

export type NutrientPriority = 'high' | 'medium' | 'baseline';

export interface NutrientTarget {
  id: string;
  name: string;
  target: string;
  unit: string;
  priority: NutrientPriority;
  rationale: string[];
  foodSources: string[];
  supplementIds: string[];
  references: { title: string; url: string }[];
}

const REFERENCES = {
  vitaminD: {
    title: 'NIH ODS: Vitamin D Fact Sheet',
    url: 'https://ods.od.nih.gov/factsheets/VitaminD-Consumer/'
  },
  vitaminB12: {
    title: 'NIH ODS: Vitamin B12 Fact Sheet',
    url: 'https://ods.od.nih.gov/factsheets/VitaminB12-Consumer/'
  },
  iron: {
    title: 'NIH ODS: Iron Fact Sheet',
    url: 'https://ods.od.nih.gov/factsheets/Iron-Consumer/'
  },
  calcium: {
    title: 'NIH ODS: Calcium Fact Sheet',
    url: 'https://ods.od.nih.gov/factsheets/Calcium-Consumer/'
  },
  magnesium: {
    title: 'NIH ODS: Magnesium Fact Sheet',
    url: 'https://ods.od.nih.gov/factsheets/Magnesium-Consumer/'
  },
  zinc: {
    title: 'NIH ODS: Zinc Fact Sheet',
    url: 'https://ods.od.nih.gov/factsheets/Zinc-Consumer/'
  },
  folate: {
    title: 'NIH ODS: Folate Fact Sheet',
    url: 'https://ods.od.nih.gov/factsheets/Folate-Consumer/'
  },
  omega3: {
    title: 'NIH ODS: Omega-3 Fatty Acids Fact Sheet',
    url: 'https://ods.od.nih.gov/factsheets/Omega3FattyAcids-Consumer/'
  },
  iodine: {
    title: 'NIH ODS: Iodine Fact Sheet',
    url: 'https://ods.od.nih.gov/factsheets/Iodine-Consumer/'
  }
};

const AGE_GROUPS = ['18-29', '30-44', '45-59', '60+'] as const;

type AgeGroup = (typeof AGE_GROUPS)[number];

type SexKey = 'male' | 'female';

const normalizeSex = (sex?: UserProfile['sex']): SexKey => (sex === 'female' ? 'female' : 'male');

const mapAgeRange = (ageRange?: UserProfile['ageRange']): AgeGroup | null => {
  switch (ageRange) {
    case 'under-30':
      return '18-29';
    case '30-45':
      return '30-44';
    case '45-60':
      return '45-59';
    case 'over-60':
      return '60+';
    default:
      return null;
  }
};

const normalizeAge = (age?: UserProfile['age'], ageRange?: UserProfile['ageRange']): AgeGroup => {
  if (age && AGE_GROUPS.includes(age)) return age as AgeGroup;
  const mappedRange = mapAgeRange(ageRange);
  if (mappedRange) return mappedRange;
  return '30-44';
};

const isOlderAdult = (age: AgeGroup): boolean => age === '60+';

export function buildNutrientTargets(profile: UserProfile): NutrientTarget[] {
  const sex = normalizeSex(profile.sex);
  const age = normalizeAge(profile.age, profile.ageRange);
  const diet = profile.diet || profile.dietType;

  const targets: NutrientTarget[] = [];

  const vitaminDTarget = isOlderAdult(age) ? '20' : '15';
  targets.push({
    id: 'vitamin-d',
    name: 'Vitamin D',
    target: `${vitaminDTarget} mcg (600-800 IU)` ,
    unit: 'mcg',
    priority: isOlderAdult(age) ? 'high' : 'baseline',
    rationale: [
      'Supports bone health, immune function, and muscle strength.',
      isOlderAdult(age) ? 'Older adults typically require higher intake.' : 'Many adults fall short due to limited sun exposure.'
    ],
    foodSources: ['Fatty fish', 'Fortified dairy/plant milks', 'Egg yolk'],
    supplementIds: ['vitamin-d3'],
    references: [REFERENCES.vitaminD]
  });

  targets.push({
    id: 'vitamin-b12',
    name: 'Vitamin B12',
    target: '2.4 mcg',
    unit: 'mcg',
    priority: diet === 'vegan' ? 'high' : diet === 'vegetarian' ? 'medium' : 'baseline',
    rationale: [
      'Essential for nerve function and red blood cell formation.',
      diet === 'vegan'
        ? 'Plant-based diets lack reliable B12 sources.'
        : diet === 'vegetarian'
          ? 'Dairy/eggs supply B12, but intake can still be low.'
          : 'Deficiency risk rises with low animal food intake.'
    ],
    foodSources: ['Fortified foods', 'Fish', 'Eggs', 'Dairy'],
    supplementIds: ['vitamin-b12'],
    references: [REFERENCES.vitaminB12]
  });

  const ironTarget = sex === 'female' && (age === '18-29' || age === '30-44') ? '18' : '8';
  targets.push({
    id: 'iron',
    name: 'Iron',
    target: `${ironTarget} mg`,
    unit: 'mg',
    priority: diet === 'vegan' ? 'high' : diet === 'vegetarian' ? 'medium' : 'baseline',
    rationale: [
      'Supports oxygen transport and energy metabolism.',
      sex === 'female' && (age === '18-29' || age === '30-44')
        ? 'Premenopausal needs are higher due to monthly losses.'
        : 'Endurance training and low meat intake can raise risk.'
    ],
    foodSources: ['Red meat', 'Lentils', 'Spinach', 'Fortified cereals'],
    supplementIds: ['iron'],
    references: [REFERENCES.iron]
  });

  const calciumTarget = isOlderAdult(age) ? '1200' : '1000';
  targets.push({
    id: 'calcium',
    name: 'Calcium',
    target: `${calciumTarget} mg`,
    unit: 'mg',
    priority: isOlderAdult(age) ? 'high' : 'baseline',
    rationale: [
      'Supports bone density and neuromuscular function.',
      isOlderAdult(age) ? 'Needs rise with age to protect bone health.' : 'Adequate intake supports peak bone mass.'
    ],
    foodSources: ['Dairy', 'Fortified plant milk', 'Leafy greens', 'Canned fish with bones'],
    supplementIds: ['calcium'],
    references: [REFERENCES.calcium]
  });

  const magnesiumTarget = sex === 'female' ? '310-320' : '400-420';
  targets.push({
    id: 'magnesium',
    name: 'Magnesium',
    target: `${magnesiumTarget} mg`,
    unit: 'mg',
    priority: profile.stressLevel === 'high' || profile.stressLevel === 'very-high' ? 'medium' : 'baseline',
    rationale: [
      'Supports energy production, muscle function, and sleep quality.',
      'Many diets fall below recommended intake.'
    ],
    foodSources: ['Pumpkin seeds', 'Legumes', 'Dark chocolate', 'Leafy greens'],
    supplementIds: ['magnesium'],
    references: [REFERENCES.magnesium]
  });

  const zincTarget = sex === 'female' ? '8' : '11';
  targets.push({
    id: 'zinc',
    name: 'Zinc',
    target: `${zincTarget} mg`,
    unit: 'mg',
    priority: diet === 'vegan' ? 'medium' : 'baseline',
    rationale: [
      'Supports immune function, wound healing, and hormones.',
      diet === 'vegan' ? 'Plant sources have lower bioavailability.' : 'Athletes may benefit from higher intake.'
    ],
    foodSources: ['Oysters', 'Beef', 'Pumpkin seeds', 'Chickpeas'],
    supplementIds: ['zinc'],
    references: [REFERENCES.zinc]
  });

  targets.push({
    id: 'folate',
    name: 'Folate',
    target: '400 mcg DFE',
    unit: 'mcg',
    priority: 'baseline',
    rationale: [
      'Supports DNA synthesis, red blood cells, and energy.',
      'Low intake can worsen fatigue and mood.'
    ],
    foodSources: ['Leafy greens', 'Beans', 'Asparagus', 'Fortified grains'],
    supplementIds: ['folate'],
    references: [REFERENCES.folate]
  });

  const omegaTarget = sex === 'female' ? '1.1' : '1.6';
  targets.push({
    id: 'omega-3',
    name: 'Omega-3 (ALA)',
    target: `${omegaTarget} g ALA + 250-500 mg EPA/DHA`,
    unit: 'g',
    priority: diet === 'vegan' || diet === 'vegetarian' ? 'medium' : 'baseline',
    rationale: [
      'Supports cardiovascular, cognitive, and inflammatory balance.',
      diet === 'vegan' || diet === 'vegetarian'
        ? 'EPA/DHA often low without fatty fish or algae sources.'
        : 'Most diets still fall short of EPA/DHA targets.'
    ],
    foodSources: ['Salmon', 'Sardines', 'Chia seeds', 'Algae oil'],
    supplementIds: ['omega-3'],
    references: [REFERENCES.omega3]
  });

  targets.push({
    id: 'iodine',
    name: 'Iodine',
    target: '150 mcg',
    unit: 'mcg',
    priority: diet === 'vegan' ? 'medium' : 'baseline',
    rationale: [
      'Supports thyroid hormone production and metabolism.',
      diet === 'vegan' ? 'Iodized salt and sea vegetables are key sources.' : 'Intake varies widely by salt use.'
    ],
    foodSources: ['Iodized salt', 'Seaweed', 'Dairy', 'Fish'],
    supplementIds: [],
    references: [REFERENCES.iodine]
  });

  return targets;
}
