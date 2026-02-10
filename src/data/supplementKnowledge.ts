import type {
  KnowledgeCategory,
  KnowledgeEvidenceStrengthTag,
  KnowledgeSafetyFlag,
  SupplementKnowledgeEntry,
  SupplementKnowledgeMap,
} from '../types';
import { supplementKnowledgeGenerated } from './supplementKnowledge.generated';

const normalizeKnowledgeKey = (value: string): string =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\s+/g, ' ');

export const supplementKnowledge: SupplementKnowledgeMap = supplementKnowledgeGenerated;

const supplementKnowledgeByName = new Map<string, SupplementKnowledgeEntry>();
for (const entry of Object.values(supplementKnowledge)) {
  supplementKnowledgeByName.set(normalizeKnowledgeKey(entry.supplementName), entry);
  for (const alias of entry.aliases) {
    supplementKnowledgeByName.set(normalizeKnowledgeKey(alias), entry);
  }
}

export const knowledgeDisclaimers = {
  medical:
    'Educational content only. This library does not diagnose, treat, or replace care from a licensed clinician.',
  safety:
    'Medication interactions, pregnancy, and chronic conditions require individualized guidance from a qualified professional.',
} as const;

export function getSupplementKnowledgeById(id: string): SupplementKnowledgeEntry | undefined {
  return supplementKnowledge[id];
}

export function getSupplementKnowledgeByName(name: string): SupplementKnowledgeEntry | undefined {
  return supplementKnowledgeByName.get(normalizeKnowledgeKey(name));
}

export function getKnowledgeBenefitSearchTerms(entry: SupplementKnowledgeEntry): string[] {
  const tokens = new Set<string>();
  tokens.add(entry.supplementName);
  entry.aliases.forEach((alias) => tokens.add(alias));
  entry.categories.forEach((category) => tokens.add(category));
  entry.typicalUseCases.forEach((goal) => tokens.add(goal));
  entry.evidenceStrengthTags.forEach((tag) => tokens.add(tag));
  tokens.add(entry.evidenceSummary);
  if (entry.dosageRangeNote) {
    tokens.add(entry.dosageRangeNote);
  }
  return Array.from(tokens);
}

export function getKnowledgeSafetySearchTerms(entry: SupplementKnowledgeEntry): string[] {
  const tokens = new Set<string>();
  entry.safetyNotes.forEach((note) => tokens.add(note));
  entry.safetyFlags.forEach((flag) => tokens.add(flag));
  return Array.from(tokens);
}

export function getKnowledgeSearchTerms(entry: SupplementKnowledgeEntry): string[] {
  return [...getKnowledgeBenefitSearchTerms(entry), ...getKnowledgeSafetySearchTerms(entry)];
}

export function hasKnowledgeSafetyFlag(
  entry: SupplementKnowledgeEntry | undefined,
  flag: KnowledgeSafetyFlag
): boolean {
  return Boolean(entry?.safetyFlags.includes(flag));
}

export function hasKnowledgeCategory(
  entry: SupplementKnowledgeEntry | undefined,
  category: KnowledgeCategory
): boolean {
  return Boolean(entry?.categories.includes(category));
}

export function hasKnowledgeEvidenceTag(
  entry: SupplementKnowledgeEntry | undefined,
  tag: KnowledgeEvidenceStrengthTag
): boolean {
  return Boolean(entry?.evidenceStrengthTags.includes(tag));
}
