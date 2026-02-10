import { Supplement } from '../types';
import { normalizeSupplementName } from '../constants/taxonomy';

const normalizeCanonicalText = (value: string): string =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\s+/g, ' ');

const evidenceScore: Record<Supplement['evidence'], number> = {
  strong: 3,
  moderate: 2,
  limited: 1,
};

const getSupplementPreferenceScore = (supplement: Supplement, canonicalKey: string): number => {
  const nameKey = normalizeCanonicalText(supplement.name);
  const idKey = normalizeCanonicalText(supplement.id.replace(/-/g, ' '));
  let score = evidenceScore[supplement.evidence] * 4;
  score += (supplement.benefits?.length || 0) * 0.2;
  score += (supplement.goals?.length || 0) * 0.15;
  score += (supplement.systems?.length || 0) * 0.1;
  if (!supplement.name.includes('(')) score += 0.8;
  if (nameKey === canonicalKey) score += 2.5;
  if (idKey === canonicalKey) score += 2;
  return score;
};

export function getCanonicalSupplementName(supplement: Supplement): string {
  // Canonical identity for dedupe is ID-based only.
  // This avoids merging distinct products that share botanical names in parentheses.
  return normalizeSupplementName(supplement.id).trim() || supplement.id;
}

export function getCanonicalSupplementKey(supplement: Supplement): string {
  return normalizeCanonicalText(getCanonicalSupplementName(supplement));
}

export function choosePreferredCanonicalSupplement(a: Supplement, b: Supplement): Supplement {
  const canonicalKey = getCanonicalSupplementKey(a);
  const aScore = getSupplementPreferenceScore(a, canonicalKey);
  const bScore = getSupplementPreferenceScore(b, canonicalKey);
  if (aScore === bScore) {
    return a.id.localeCompare(b.id) <= 0 ? a : b;
  }
  return aScore > bScore ? a : b;
}

export function dedupeSupplementsByCanonical(supplements: Supplement[]): Supplement[] {
  const byCanonical = new Map<string, Supplement>();
  for (const supplement of supplements) {
    const key = getCanonicalSupplementKey(supplement);
    const existing = byCanonical.get(key);
    if (!existing) {
      byCanonical.set(key, supplement);
      continue;
    }
    byCanonical.set(key, choosePreferredCanonicalSupplement(existing, supplement));
  }
  return Array.from(byCanonical.values());
}
