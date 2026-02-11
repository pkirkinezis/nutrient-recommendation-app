import { PragmaticTier, Supplement } from '../types';

export interface PragmaticTierInfo {
  label: string;
  shortLabel: string;
  color: string;
  bg: string;
  score: number;
  description: string;
}

export const PRAGMATIC_TIER_CONTEXT =
  'Pragmatic tiering layer based on user-provided synthesis of human evidence, effect size, safety, and practical real-world use (merged February 11, 2026).';

export const pragmaticTierConfig: Record<PragmaticTier, PragmaticTierInfo> = {
  'S+': {
    label: 'Pragmatic S+',
    shortLabel: 'S+',
    color: 'text-emerald-800',
    bg: 'bg-emerald-100',
    score: 5,
    description: 'Strong practical upside, broad outcomes, and favorable safety profile.'
  },
  S: {
    label: 'Pragmatic S',
    shortLabel: 'S',
    color: 'text-teal-800',
    bg: 'bg-teal-100',
    score: 4,
    description: 'High-confidence benefit with narrower scope or less breadth than S+.'
  },
  A: {
    label: 'Pragmatic A',
    shortLabel: 'A',
    color: 'text-blue-800',
    bg: 'bg-blue-100',
    score: 3,
    description: 'Promising and practical, with moderate evidence or narrower use-cases.'
  },
  B: {
    label: 'Pragmatic B',
    shortLabel: 'B',
    color: 'text-amber-800',
    bg: 'bg-amber-100',
    score: 2,
    description: 'Limited, mixed, or early data; potentially useful in specific contexts.'
  },
  C: {
    label: 'Pragmatic C',
    shortLabel: 'C',
    color: 'text-gray-700',
    bg: 'bg-gray-100',
    score: 1,
    description: 'Preliminary or sparse human evidence.'
  }
};

// This map intentionally stores only supplements that were explicitly tiered.
// Any ID not listed is treated as "unranked" for this layer.
export const pragmaticTierBySupplementId: Record<string, PragmaticTier> = {
  // Botanicals, mushrooms, and tea herbs
  'ashwagandha': 'S+',
  'turmeric-curcumin': 'S+',
  'turmeric': 'S+',
  'green-tea-matcha': 'S+',
  'ginseng-panax': 'S+',
  'st-johns-wort': 'S+',
  'ginger': 'S+',

  'brahmi-bacopa': 'S',
  'brahmi': 'S',
  'rhodiola': 'S',
  'boswellia': 'S',
  'tongkat-ali': 'S',
  'vitex': 'S',
  'andrographis': 'S',
  'elderberry': 'S',
  'hibiscus-tea': 'S',
  'olive-leaf': 'S',
  'ginger-tea': 'S',
  'green-tea-sencha': 'S',
  'oolong-tea-tieguanyin': 'S',
  'black-tea-assam': 'S',
  'dark-tea-pu-erh-sheng': 'S',
  'english-breakfast-tea': 'S',
  'earl-grey-tea': 'S',
  'echinacea': 'S',

  'tulsi': 'A',
  'shatavari': 'A',
  'triphala': 'A',
  'guduchi': 'A',
  'shilajit': 'A',
  'arjuna': 'A',
  'amla': 'A',
  'gotu-kola': 'A',
  'mucuna': 'A',
  'chyawanprash': 'A',
  'guggulu': 'A',
  'trikatu': 'A',
  'jatamansi': 'A',
  'shankhpushpi': 'A',
  'schisandra': 'A',
  'reishi': 'A',
  'cordyceps': 'A',
  'turkey-tail': 'A',
  'ginkgo': 'A',
  'milk-thistle': 'A',
  'saw-palmetto': 'A',
  'black-pepper': 'A',
  'hawthorn': 'A',
  'saffron': 'A',
  'fenugreek': 'A',
  'red-clover': 'A',
  'lions-mane': 'A',
  'valerian': 'A',
  'chamomile-tea': 'A',
  'lemon-balm': 'A',
  'passionflower': 'A',
  'peppermint-tea': 'A',
  'cinnamon-tea': 'A',
  'greek-mountain-tea': 'A',
  'white-tea-silver-needle': 'A',
  'white-tea-white-peony': 'A',
  'jasmine-green-tea': 'A',
  'decaf-tea': 'A',

  'maca': 'B',
  'tribulus': 'B',
  'chaga': 'B',
  'dittany-of-crete': 'B',
  'lemon-verbena': 'B',
  'kava': 'B',
  'yellow-tea-huang-ya': 'B',
  'smoked-tea-lapsang-souchong': 'B',

  // Vitamins
  'vitamin-d3': 'S+',
  'vitamin-b12': 'S+',
  'vitamin-c': 'S+',
  'vitamin-k2': 'S+',
  'vitamin-b1': 'S+',
  'b-complex': 'S+',
  'folate': 'S+',

  'vitamin-a': 'S',
  'vitamin-e-tocotrienol': 'S',

  'vitamin-e': 'A',
  'biotin': 'A',

  // Minerals
  'magnesium': 'S+',
  'zinc': 'S+',
  'selenium': 'S+',
  'calcium': 'S+',
  'iron': 'S+',
  'potassium': 'S+',

  'copper': 'S',
  'boron': 'S',

  'chromium': 'A',
  'iodine': 'A',

  // Fatty acids
  'omega-3': 'S+',
  'krill-oil': 'S',

  // Amino acids
  'creatine': 'S+',

  'l-theanine': 'S',
  'glycine': 'S',
  'nac': 'S',
  'l-tyrosine': 'S',
  'taurine': 'S',
  'beta-alanine': 'S',

  'acetyl-l-carnitine': 'A',
  'citrulline': 'A',
  'l-citrulline': 'A',
  'l-arginine': 'A',
  'l-glutamine': 'A',
  '5-htp': 'A',
  'tryptophan': 'A',

  'gaba': 'B',

  // Other compounds
  'coq10': 'S+',
  'melatonin': 'S+',

  'berberine': 'S',
  'l-carnitine': 'S',
  'alpha-lipoic-acid': 'S',
  'same': 'S',
  'beetroot-extract': 'S',
  'caffeine': 'S',
  'inositol': 'S',
  'glucosamine': 'S',
  'probiotics': 'S',

  'dim': 'A',
  'pqq': 'A',
  'nmn': 'A',
  'astaxanthin': 'A',
  'alpha-gpc': 'A',
  'phosphatidylserine': 'A',
  'quercetin': 'A',
  'collagen': 'A',
  'hyaluronic-acid': 'A',
  'spirulina': 'A',
  'chlorella': 'A',
  'nattokinase': 'A',
  'digestive-enzymes': 'A',

  'uridine': 'B',
  'apigenin': 'B',
  'resveratrol': 'B',
};

export const pragmaticTieredSupplementIds = Object.keys(pragmaticTierBySupplementId);

export function getPragmaticTierForSupplement(
  supplement: Pick<Supplement, 'id' | 'pragmaticTier'>
): PragmaticTier | null {
  return supplement.pragmaticTier || pragmaticTierBySupplementId[supplement.id] || null;
}

export function getPragmaticTierInfo(
  tier: PragmaticTier | null | undefined
): PragmaticTierInfo | null {
  if (!tier) return null;
  return pragmaticTierConfig[tier];
}

export function getPragmaticTierScore(tier: PragmaticTier | null | undefined): number {
  if (!tier) return 0;
  return pragmaticTierConfig[tier].score;
}
