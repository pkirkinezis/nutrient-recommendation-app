import { writeFileSync } from 'node:fs';
import { buildKnowledgeArtifacts, generatedOutputPath } from './knowledgeBuilder.mjs';

const artifacts = await buildKnowledgeArtifacts();
writeFileSync(generatedOutputPath, artifacts.moduleText, 'utf8');

console.log(`Knowledge entries: ${artifacts.summary.totalEntries}`);
console.log(`Entries with citations: ${artifacts.summary.entriesWithCitations}`);
console.log(`Entries with aliases: ${artifacts.summary.entriesWithAliases}`);
console.log(`Wrote: ${generatedOutputPath}`);
console.log(`Content hash: ${artifacts.contentHash}`);

