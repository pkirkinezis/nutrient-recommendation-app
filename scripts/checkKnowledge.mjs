import { readFileSync } from 'node:fs';
import {
  buildKnowledgeArtifacts,
  generatedOutputPath
} from './knowledgeBuilder.mjs';

const failures = [];

const first = await buildKnowledgeArtifacts();
const second = await buildKnowledgeArtifacts();

if (first.moduleText !== second.moduleText) {
  failures.push('Knowledge generation is not deterministic: two consecutive builds produced different output.');
}

for (const entry of Object.values(first.knowledgeMap)) {
  if (!entry.citations.length) {
    failures.push(`Missing citations for supplement: ${entry.supplementId}`);
  }

  const normalizedName = entry.supplementName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  const normalizedId = entry.supplementId
    .toLowerCase()
    .replace(/-/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  const expectsAliases =
    /[(/]/.test(entry.supplementName) ||
    entry.supplementName.includes("'") ||
    normalizedName !== normalizedId;

  if (expectsAliases && entry.aliases.length === 0) {
    failures.push(`Expected aliases for supplement but none were generated: ${entry.supplementId}`);
  }
}

let generatedOnDisk = '';
try {
  generatedOnDisk = readFileSync(generatedOutputPath, 'utf8');
} catch {
  failures.push(`Generated file does not exist: ${generatedOutputPath}`);
}

if (generatedOnDisk && generatedOnDisk !== first.moduleText) {
  failures.push('Generated file content is stale. Run "npm run build:knowledge".');
}

if (failures.length > 0) {
  console.error('Knowledge checks failed:');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log('Knowledge checks passed.');
console.log(`Entries checked: ${first.summary.totalEntries}`);
