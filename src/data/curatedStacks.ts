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
];
