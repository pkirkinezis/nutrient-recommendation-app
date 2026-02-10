import { existsSync, readFileSync, unlinkSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import ts from 'typescript';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
export const repoRoot = path.resolve(scriptDir, '..');
export const supplementsSourcePath = path.join(repoRoot, 'src/data/supplements.ts');
export const knowledgeConfigPath = path.join(scriptDir, 'knowledgeSources.config.json');
export const generatedOutputPath = path.join(repoRoot, 'src/data/supplementKnowledge.generated.ts');
const tempSupplementsModulePath = path.join(scriptDir, `.tmp.supplements.module.${process.pid}.mjs`);

const typeToCategory = {
  vitamin: 'vitamin',
  mineral: 'mineral',
  herb: 'herb',
  tea: 'herb',
  'amino-acid': 'amino-acid',
  ayurvedic: 'herb',
  mushroom: 'mushroom',
  probiotic: 'probiotic',
  'fatty-acid': 'fatty-acid',
  protein: 'performance',
  performance: 'performance',
  enzyme: 'enzyme',
  antioxidant: 'antioxidant',
  other: 'other',
};

const evidenceTagOrder = {
  'well-supported': 1,
  mixed: 2,
  emerging: 3,
  traditional: 4,
};

const adaptogenHints = [
  'ashwagandha',
  'rhodiola',
  'tulsi',
  'holy basil',
  'maca',
  'ginseng',
  'eleuthero',
  'schisandra',
  'reishi',
  'cordyceps',
  'shilajit',
  'bacopa',
  'brahmi',
];

const safetyFlagOrder = {
  pregnancy: 1,
  breastfeeding: 2,
  'drug-interaction': 3,
  'bleeding-risk': 4,
  'blood-pressure': 5,
  'blood-sugar': 6,
  sedation: 7,
  stimulant: 8,
  thyroid: 9,
  liver: 10,
  kidney: 11,
  autoimmune: 12,
  'general-caution': 13,
};

const interactionSignalPattern =
  /warfarin|maoi|ssri|snri|anticoagul|blood thinner|antiplatelet|immunosuppress|digoxin|lithium|levodopa|carbidopa|antiarrhythmic|contraindicat|do not combine|avoid with|major interaction|interacts with/;
const interactionContextPattern = /\b(interaction|interactions|interact)\b/;
const medicationMentionPattern = /\b(medication|medications|medicine|drug|drugs|prescription)\b/;

const hashText = (value) => createHash('sha256').update(value).digest('hex');

const normalizeValue = (value) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\s+/g, ' ');

const withTerminalPeriod = (value) => {
  const trimmed = value.trim();
  if (!trimmed) return '';
  if (/[.!?]$/.test(trimmed)) return trimmed;
  return `${trimmed}.`;
};

const uniqueSorted = (values, sorter) => {
  const seen = new Set();
  const output = [];
  for (const value of values) {
    if (!value) continue;
    const normalized = typeof value === 'string' ? normalizeValue(value) : JSON.stringify(value);
    if (!normalized || seen.has(normalized)) continue;
    seen.add(normalized);
    output.push(value);
  }
  output.sort(sorter || ((a, b) => String(a).localeCompare(String(b))));
  return output;
};

const inferPublisherFromUrl = (url) => {
  try {
    const hostname = new URL(url).hostname.toLowerCase().replace(/^www\./, '');
    if (hostname.includes('nccih.nih.gov')) return 'National Center for Complementary and Integrative Health';
    if (hostname.includes('ods.od.nih.gov')) return 'NIH Office of Dietary Supplements';
    if (hostname.includes('nih.gov')) return 'National Institutes of Health';
    if (hostname.includes('fda.gov')) return 'U.S. Food and Drug Administration';
    return hostname;
  } catch {
    return 'External source';
  }
};

const addAliasVariants = (seed, alias) => {
  const cleaned = alias.trim();
  if (!cleaned) return;
  seed.add(cleaned);
  seed.add(cleaned.replace(/[()]/g, '').replace(/\s+/g, ' ').trim());
  seed.add(cleaned.replace(/'/g, ''));
  seed.add(cleaned.replace(/\//g, ' '));
  seed.add(cleaned.replace(/-/g, ' '));
};

const extractAliasesFromName = (supplement) => {
  const aliases = new Set();
  const name = supplement.name;
  const idAlias = supplement.id.replace(/-/g, ' ');

  addAliasVariants(aliases, idAlias);

  const withoutParentheses = name.replace(/\([^)]*\)/g, ' ').replace(/\s+/g, ' ').trim();
  if (withoutParentheses) {
    addAliasVariants(aliases, withoutParentheses);
  }

  const parentheticalMatches = [...name.matchAll(/\(([^)]+)\)/g)];
  for (const [, match] of parentheticalMatches) {
    addAliasVariants(aliases, match);
  }

  for (const part of name.split('/')) {
    addAliasVariants(aliases, part);
  }

  for (const part of name.split(',')) {
    addAliasVariants(aliases, part);
  }

  return uniqueSorted(
    [...aliases].filter((alias) => normalizeValue(alias) !== normalizeValue(name)),
  );
};

const buildCategories = (supplement, override = {}) => {
  const categories = new Set();

  const mapped = typeToCategory[supplement.type] || 'other';
  categories.add(mapped);

  if (supplement.type === 'ayurvedic' || supplement.type === 'tea') {
    categories.add('herb');
  }

  const hintText = `${supplement.name} ${supplement.description} ${supplement.traditionalUse || ''}`.toLowerCase();
  if (adaptogenHints.some((hint) => hintText.includes(hint))) {
    categories.add('adaptogen');
  }

  for (const category of override.categories || []) {
    categories.add(category);
  }

  return uniqueSorted([...categories]);
};

const buildEvidenceStrengthTags = (supplement, override = {}) => {
  const tags = new Set(override.evidenceStrengthTags || []);
  if (tags.size === 0) {
    if (supplement.evidence === 'strong') {
      tags.add('well-supported');
    } else if (supplement.evidence === 'moderate') {
      tags.add('mixed');
      tags.add('emerging');
    } else {
      tags.add('emerging');
    }
  }

  if ((supplement.type === 'herb' || supplement.type === 'ayurvedic') && supplement.evidence !== 'strong') {
    tags.add('traditional');
  }

  return uniqueSorted([...tags], (a, b) => (evidenceTagOrder[a] || 99) - (evidenceTagOrder[b] || 99));
};

const defaultEvidenceSummary = (supplement) => {
  const name = supplement.name.split('(')[0].trim();
  if (supplement.evidence === 'strong') {
    return `${name} has human clinical evidence for select wellness outcomes, with response varying by dose, formulation, and individual context.`;
  }
  if (supplement.evidence === 'moderate') {
    return `${name} has mixed human evidence and should be interpreted with attention to study quality, product form, and personal context.`;
  }
  return `${name} is informed by traditional use and emerging research, while higher-quality clinical evidence remains limited.`;
};

const formatUseCase = (value) => value.toLowerCase().replace(/[-_]+/g, ' ').replace(/\s+/g, ' ').trim();

const buildTypicalUseCases = (supplement, override = {}) => {
  const cases = [];

  for (const useCase of override.typicalUseCases || []) {
    const normalized = formatUseCase(useCase);
    if (normalized) cases.push(normalized);
  }

  for (const goal of supplement.goals || []) {
    const normalized = formatUseCase(goal);
    if (normalized) cases.push(normalized);
  }

  if (cases.length === 0 && supplement.benefits?.length) {
    for (const benefit of supplement.benefits.slice(0, 3)) {
      cases.push(formatUseCase(benefit));
    }
  }

  if (cases.length === 0) {
    cases.push('general wellness support');
  }

  return uniqueSorted(cases).slice(0, 8);
};

const buildAutomaticSafetyNotes = (supplement) => {
  const notes = [];

  if (supplement.avoidIf?.length) {
    notes.push(`Use clinician guidance with: ${supplement.avoidIf.slice(0, 3).join(', ')}`);
  }

  if (supplement.drugInteractions?.length) {
    notes.push(`Potential medication interactions include: ${supplement.drugInteractions.slice(0, 3).join(', ')}`);
  }

  if (supplement.cautions?.length) {
    notes.push(supplement.cautions[0]);
    if (supplement.cautions.length > 1) {
      notes.push(supplement.cautions[1]);
    }
  }

  if (notes.length === 0) {
    notes.push(
      'Safety depends on dose, formulation, medications, and health context. Review with a qualified clinician before long-term use.'
    );
  }

  return uniqueSorted(notes.map(withTerminalPeriod)).slice(0, 4);
};

const buildSafetyFlags = (supplement, override = {}) => {
  const flags = new Set(override.safetyFlags || []);
  const safetyText = [
    ...(supplement.avoidIf || []),
    ...(supplement.drugInteractions || []),
    ...(supplement.cautions || []),
    ...(override.safetyNotes || []),
  ]
    .join(' ')
    .toLowerCase();

  const hasDrugInteractionSignal =
    interactionSignalPattern.test(safetyText) ||
    (interactionContextPattern.test(safetyText) && medicationMentionPattern.test(safetyText));

  if (/pregnan|trying to conceive|ovulation/.test(safetyText)) flags.add('pregnancy');
  if (/breastfeed|lactation/.test(safetyText)) flags.add('breastfeeding');
  if (hasDrugInteractionSignal) {
    flags.add('drug-interaction');
  }
  if (/bleed|blood thinner|anticoagul|antiplatelet/.test(safetyText)) flags.add('bleeding-risk');
  if (/blood pressure|hypertension|hypotension/.test(safetyText)) flags.add('blood-pressure');
  if (/blood sugar|diabet|hypoglyc/.test(safetyText)) flags.add('blood-sugar');
  if (/sedat|sleepy|drows|calm|bedtime/.test(safetyText)) flags.add('sedation');
  if (/stimul|caffeine|jitters|alert/.test(safetyText)) flags.add('stimulant');
  if (/thyroid/.test(safetyText)) flags.add('thyroid');
  if (/liver|hepatic/.test(safetyText)) flags.add('liver');
  if (/kidney|renal/.test(safetyText)) flags.add('kidney');
  if (/autoimmune|immunosuppress|immune/.test(safetyText) && /avoid|caution/.test(safetyText)) flags.add('autoimmune');

  if (flags.size === 0) {
    flags.add('general-caution');
  }

  return uniqueSorted([...flags], (a, b) => (safetyFlagOrder[a] || 99) - (safetyFlagOrder[b] || 99));
};

const buildCitations = (supplement, config, override = {}) => {
  const citations = [];
  const sourceKeyList = [
    ...(config.defaultSourceKeysByType?.[supplement.type] || []),
    ...(override.citationSourceKeys || []),
    ...(config.fallbackSourceKeys || []),
  ];

  for (const sourceKey of sourceKeyList) {
    const source = config.sources?.[sourceKey];
    if (!source) continue;
    citations.push({
      title: source.title,
      publisher: source.publisher,
      url: source.url,
      accessedAt: config.accessedAt,
    });
  }

  for (const source of supplement.evidenceSources || []) {
    if (!source?.url) continue;
    citations.push({
      title: source.title || 'Evidence source',
      publisher: inferPublisherFromUrl(source.url),
      url: source.url,
      accessedAt: config.accessedAt,
    });
  }

  const uniqueCitations = uniqueSorted(citations, (a, b) => {
    if (a.publisher !== b.publisher) return a.publisher.localeCompare(b.publisher);
    if (a.title !== b.title) return a.title.localeCompare(b.title);
    return a.url.localeCompare(b.url);
  });

  return uniqueCitations;
};

const buildKnowledgeEntry = (supplement, config) => {
  const override = config.supplementOverrides?.[supplement.id] || {};
  const automaticAliases = extractAliasesFromName(supplement);
  const overrideAliases = uniqueSorted(override.aliases || []);
  const aliases = uniqueSorted([...overrideAliases, ...automaticAliases]).slice(0, 24);
  const categories = buildCategories(supplement, override);
  const evidenceStrengthTags = buildEvidenceStrengthTags(supplement, override);
  const evidenceSummary = override.evidenceSummary?.trim() || defaultEvidenceSummary(supplement);
  const typicalUseCases = buildTypicalUseCases(supplement, override);
  const safetyNotes = uniqueSorted([...(override.safetyNotes || []), ...buildAutomaticSafetyNotes(supplement)].map(withTerminalPeriod)).slice(0, 5);
  const safetyFlags = buildSafetyFlags(supplement, override);
  const citations = buildCitations(supplement, config, override);

  return {
    supplementId: supplement.id,
    supplementName: supplement.name,
    aliases,
    categories,
    evidenceStrengthTags,
    evidenceSummary,
    typicalUseCases,
    safetyNotes,
    safetyFlags,
    dosageRangeNote: override.dosageRangeNote?.trim() || undefined,
    citations,
  };
};

export async function loadSupplementsFromSource() {
  const source = readFileSync(supplementsSourcePath, 'utf8');
  const transpiled = ts.transpileModule(source, {
    compilerOptions: {
      target: ts.ScriptTarget.ES2020,
      module: ts.ModuleKind.ES2020,
      moduleResolution: ts.ModuleResolutionKind.Bundler,
      importsNotUsedAsValues: ts.ImportsNotUsedAsValues.Remove,
      preserveValueImports: false,
    },
    fileName: supplementsSourcePath,
  }).outputText;

  writeFileSync(tempSupplementsModulePath, transpiled, 'utf8');
  try {
    const loaded = await import(pathToFileURL(tempSupplementsModulePath).href + `?v=${Date.now()}`);
    if (!Array.isArray(loaded.supplements)) {
      throw new Error('Expected supplements export to be an array.');
    }
    return loaded.supplements;
  } finally {
    if (existsSync(tempSupplementsModulePath)) {
      unlinkSync(tempSupplementsModulePath);
    }
  }
}

export function loadKnowledgeConfig() {
  return JSON.parse(readFileSync(knowledgeConfigPath, 'utf8'));
}

export function generateKnowledgeMapFromSupplements(supplements, config) {
  const sortedSupplements = [...supplements].sort((a, b) => a.id.localeCompare(b.id));
  const map = {};
  for (const supplement of sortedSupplements) {
    const entry = buildKnowledgeEntry(supplement, config);
    map[entry.supplementId] = entry;
  }
  return map;
}

export function generateKnowledgeModuleText(knowledgeMap) {
  const header = [
    '/* eslint-disable */',
    '// This file is generated by scripts/buildKnowledge.mjs.',
    '// Do not edit manually.',
    '',
    "import type { SupplementKnowledgeMap } from '../types';",
    '',
  ].join('\n');

  const body = `export const supplementKnowledgeGenerated: SupplementKnowledgeMap = ${JSON.stringify(knowledgeMap, null, 2)};\n`;
  return `${header}${body}`;
}

export function summarizeKnowledgeMap(knowledgeMap) {
  const entries = Object.values(knowledgeMap);
  return {
    totalEntries: entries.length,
    entriesWithCitations: entries.filter((entry) => entry.citations.length > 0).length,
    entriesWithAliases: entries.filter((entry) => entry.aliases.length > 0).length,
  };
}

export async function buildKnowledgeArtifacts() {
  const supplements = await loadSupplementsFromSource();
  const config = loadKnowledgeConfig();
  const knowledgeMap = generateKnowledgeMapFromSupplements(supplements, config);
  const moduleText = generateKnowledgeModuleText(knowledgeMap);
  const contentHash = hashText(moduleText);

  return {
    supplements,
    config,
    knowledgeMap,
    moduleText,
    contentHash,
    summary: summarizeKnowledgeMap(knowledgeMap),
  };
}
