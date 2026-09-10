import { Supplement } from '../types';

/** Editorial ordering for the optional "Featured" sort. This is not usage analytics. */
export const FEATURED_SUPPLEMENT_SCORES: Readonly<Record<string, number>> = {
  'vitamin-d3': 100,
  'omega-3': 98,
  magnesium: 97,
  ashwagandha: 95,
  creatine: 94,
  'vitamin-b12': 90,
  'vitamin-c': 89,
  probiotics: 88,
  zinc: 87,
  collagen: 86,
  'turmeric-curcumin': 85,
  melatonin: 82,
  'lions-mane': 80,
  coq10: 75,
  'l-theanine': 72,
  rhodiola: 70,
  'tongkat-ali': 68,
  'brahmi-bacopa': 65,
  nac: 60,
  glycine: 55,
};

export const PREGNANCY_FRIENDLY_SUPPLEMENT_IDS: ReadonlySet<string> = new Set([
  'folate', 'iodine', 'iron', 'choline', 'omega-3', 'vitamin-d3', 'vitamin-b12',
]);

export const BREASTFEEDING_LOWER_RISK_SUPPLEMENT_IDS: ReadonlySet<string> = new Set([
  'omega-3', 'vitamin-d3', 'vitamin-b12', 'folate', 'magnesium', 'iodine', 'iron', 'choline',
]);

export const STRONG_INTERACTION_SIGNAL_PATTERN =
  /warfarin|maoi|ssri|snri|anticoagul|blood thinner|antiplatelet|immunosuppress|digoxin|lithium|levodopa|carbidopa|contraindicat|do not combine|avoid with|major interaction/;

export const ALL_SUPPLEMENT_TYPES: readonly Supplement['type'][] = [
  'vitamin', 'mineral', 'amino-acid', 'herb', 'tea', 'ayurvedic', 'mushroom', 'probiotic',
  'fatty-acid', 'protein', 'performance', 'enzyme', 'antioxidant', 'other',
];
