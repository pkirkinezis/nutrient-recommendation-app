import { CuratedStack } from '../types';

export const curatedStacks: CuratedStack[] = [
  {
    id: 'sleep-deep-reset',
    name: 'Sleep Deep Reset',
    description: 'A calming nighttime stack to improve sleep onset and recovery.',
    synergyDescription:
      'Magnesium relaxes the nervous system, glycine lowers core body temperature, L-theanine promotes alpha-wave calm, and ashwagandha helps dampen stress-driven cortisol—together creating faster sleep onset and more restorative rest.',
    supplementIds: ['magnesium', 'glycine', 'l-theanine', 'ashwagandha'],
    goals: ['sleep', 'stress', 'recovery'],
    bestFor: ['Restless sleep', 'Racing thoughts', 'Nighttime tension'],
    icon: '😴',
  },
  {
    id: 'calm-focus-stack',
    name: 'Calm Focus Stack',
    description: 'Steady energy and focus without overstimulation.',
    synergyDescription:
      'Rhodiola supports mental endurance, L-theanine smooths focus without jitteriness, magnesium keeps stress signaling in check, and omega-3s support neuronal membranes—providing a balanced, sustained focus profile.',
    supplementIds: ['rhodiola', 'l-theanine', 'magnesium', 'omega-3'],
    goals: ['brain', 'energy', 'stress'],
    bestFor: ['Busy workdays', 'Focus with calm', 'Low-stress productivity'],
    icon: '🧠',
  },
  {
    id: 'hormone-recovery-core',
    name: 'Hormone & Recovery Core',
    description: 'A foundational stack for training recovery and hormonal resilience.',
    synergyDescription:
      'Vitamin D3 and zinc support hormone signaling, magnesium aids muscle relaxation and sleep quality, and CoQ10 supports cellular energy—together improving recovery, resilience, and hormonal balance.',
    supplementIds: ['vitamin-d3', 'zinc', 'magnesium', 'coq10'],
    goals: ['fitness', 'hormones', 'energy'],
    bestFor: ['Training recovery', 'Low vitality', 'Hormonal balance'],
    icon: '💪',
  },
  {
    id: 'immune-shield',
    name: 'Immune Shield',
    description: 'Everyday immune support and seasonal resilience.',
    synergyDescription:
      'Vitamin C and zinc reinforce immune barrier function, vitamin D3 supports immune signaling, and elderberry adds antioxidant-rich botanical support.',
    supplementIds: ['vitamin-c', 'zinc', 'vitamin-d3', 'elderberry'],
    goals: ['immunity', 'recovery', 'energy'],
    bestFor: ['Seasonal defense', 'Low immune resilience', 'Travel support'],
    icon: '🛡️',
  },
  {
    id: 'gut-reset',
    name: 'Gut Reset',
    description: 'Digestive balance and gut barrier support.',
    synergyDescription:
      'Probiotics seed healthy flora, digestive enzymes improve nutrient breakdown, and L-glutamine supports gut lining repair for better digestion and absorption.',
    supplementIds: ['probiotics', 'digestive-enzymes', 'l-glutamine'],
    goals: ['gut', 'digestion', 'energy'],
    bestFor: ['Bloating', 'Irregular digestion', 'Food sensitivity'],
    icon: '🌿',
  },
  {
    id: 'skin-radiance',
    name: 'Skin Radiance',
    description: 'Hydration, collagen support, and glow from within.',
    synergyDescription:
      'Collagen provides structural building blocks, vitamin C supports collagen synthesis, hyaluronic acid boosts hydration, and biotin supports hair and skin strength.',
    supplementIds: ['collagen', 'vitamin-c', 'hyaluronic-acid', 'biotin'],
    goals: ['beauty', 'skin', 'recovery'],
    bestFor: ['Dry skin', 'Hair/nail support', 'Post-workout recovery'],
    icon: '✨',
  },
  {
    id: 'performance-pump',
    name: 'Performance Pump',
    description: 'Workout performance and recovery stack.',
    synergyDescription:
      'Creatine boosts power output, citrulline enhances blood flow, beetroot supports nitric oxide, and beta-alanine improves endurance for stronger training sessions.',
    supplementIds: ['creatine', 'citrulline', 'beetroot-extract', 'beta-alanine'],
    goals: ['fitness', 'performance', 'recovery'],
    bestFor: ['Strength gains', 'Endurance focus', 'Pre-workout support'],
    icon: '⚡',
  },
];
