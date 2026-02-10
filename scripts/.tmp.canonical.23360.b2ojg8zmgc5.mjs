import { normalizeSupplementName } from '../constants/taxonomy';
const normalizeCanonicalText = (value) => value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\s+/g, ' ');
const extractCandidatePhrases = (value) => {
    const normalized = value.trim();
    if (!normalized)
        return [];
    const candidates = new Set();
    candidates.add(normalized);
    for (const part of normalized.split(/[()/,+;|]+/)) {
        const cleaned = part.trim();
        if (!cleaned)
            continue;
        candidates.add(cleaned);
    }
    return Array.from(candidates);
};
const evidenceScore = {
    strong: 3,
    moderate: 2,
    limited: 1,
};
const getSupplementPreferenceScore = (supplement, canonicalKey) => {
    const nameKey = normalizeCanonicalText(supplement.name);
    const idKey = normalizeCanonicalText(supplement.id.replace(/-/g, ' '));
    let score = evidenceScore[supplement.evidence] * 4;
    score += (supplement.benefits?.length || 0) * 0.2;
    score += (supplement.goals?.length || 0) * 0.15;
    score += (supplement.systems?.length || 0) * 0.1;
    if (!supplement.name.includes('('))
        score += 0.8;
    if (nameKey === canonicalKey)
        score += 2.5;
    if (idKey === canonicalKey)
        score += 2;
    return score;
};
export function getCanonicalSupplementName(supplement) {
    const candidates = new Set();
    candidates.add(supplement.name);
    candidates.add(supplement.id);
    candidates.add(supplement.id.replace(/-/g, ' '));
    for (const phrase of extractCandidatePhrases(supplement.name)) {
        candidates.add(phrase);
    }
    const normalizedCandidates = Array.from(candidates)
        .map((candidate) => normalizeSupplementName(candidate).trim())
        .filter(Boolean);
    if (normalizedCandidates.length === 0) {
        return supplement.name;
    }
    normalizedCandidates.sort((a, b) => {
        const aLen = normalizeCanonicalText(a).length;
        const bLen = normalizeCanonicalText(b).length;
        if (aLen !== bLen)
            return aLen - bLen;
        return a.localeCompare(b);
    });
    return normalizedCandidates[0];
}
export function getCanonicalSupplementKey(supplement) {
    return normalizeCanonicalText(getCanonicalSupplementName(supplement));
}
export function choosePreferredCanonicalSupplement(a, b) {
    const canonicalKey = getCanonicalSupplementKey(a);
    const aScore = getSupplementPreferenceScore(a, canonicalKey);
    const bScore = getSupplementPreferenceScore(b, canonicalKey);
    if (aScore === bScore) {
        return a.id.localeCompare(b.id) <= 0 ? a : b;
    }
    return aScore > bScore ? a : b;
}
export function dedupeSupplementsByCanonical(supplements) {
    const byCanonical = new Map();
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
