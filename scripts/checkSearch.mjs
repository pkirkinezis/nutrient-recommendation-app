import { rmSync, writeFileSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';
import { build } from 'esbuild';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const runtimeEntryPath = path.join(scriptDir, `.tmp.checkSearch.runtime.${process.pid}.ts`);
const runtimeBundlePath = path.join(scriptDir, `.tmp.checkSearch.runtime.${process.pid}.mjs`);

const normalize = (value) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\s+/g, ' ');

const runtimeEntrySource = `
import { analyzeGoal } from '../src/utils/analyzer.ts';
import { searchSupplementsWithScores, suggestClosestSupplementTerm } from '../src/utils/supplementSearchEngine.ts';
import { supplements } from '../src/data/supplements.ts';
import { dedupeSupplementsByCanonical, getCanonicalSupplementKey } from '../src/utils/supplementCanonical.ts';

export {
  analyzeGoal,
  searchSupplementsWithScores,
  suggestClosestSupplementTerm,
  supplements,
  dedupeSupplementsByCanonical,
  getCanonicalSupplementKey,
};
`;

const failures = [];
const assert = (condition, message) => {
  if (!condition) failures.push(message);
};

try {
  writeFileSync(runtimeEntryPath, runtimeEntrySource, 'utf8');
  await build({
    entryPoints: [runtimeEntryPath],
    outfile: runtimeBundlePath,
    bundle: true,
    platform: 'node',
    format: 'esm',
    target: ['node20'],
    logLevel: 'silent',
  });

  const runtime = await import(`${pathToFileURL(runtimeBundlePath).href}?v=${Date.now()}`);
  const {
    analyzeGoal,
    searchSupplementsWithScores,
    suggestClosestSupplementTerm,
    supplements,
    dedupeSupplementsByCanonical,
    getCanonicalSupplementKey,
  } = runtime;

  const search = (query, options = {}) => searchSupplementsWithScores(query, supplements, options);
  const topSearchIds = (query, limit = 8, options = {}) =>
    search(query, options)
      .slice(0, limit)
      .map((item) => item.supplement.id);

  const thiamine = topSearchIds('thiamine', 1)[0];
  assert(thiamine === 'vitamin-b1', `Expected "thiamine" to rank vitamin-b1 first, got ${thiamine || 'none'}.`);

  const ashwagandhaMisspelled = topSearchIds('ashwaghanda', 1)[0];
  assert(
    ashwagandhaMisspelled === 'ashwagandha',
    `Expected "ashwaghanda" to rank ashwagandha first, got ${ashwagandhaMisspelled || 'none'}.`
  );

  const suggestion = suggestClosestSupplementTerm('thaimine', supplements);
  assert(
    suggestion !== null && normalize(suggestion).includes('thiam'),
    `Expected typo suggestion for "thaimine" to point to thiamine-related term, got ${suggestion || 'none'}.`
  );

  const noSafetyIntent = topSearchIds('warfarin', 5);
  assert(
    noSafetyIntent.length > 0,
    'Expected "warfarin" to return safety-aware matches even without extra intent keywords.'
  );

  const safetyIntent = topSearchIds('warfarin interaction', 5);
  assert(
    safetyIntent.length > 0,
    'Expected "warfarin interaction" to return safety-oriented matches.'
  );

  const firstRun = topSearchIds('energy support', 20);
  const secondRun = topSearchIds('energy support', 20);
  assert(
    JSON.stringify(firstRun) === JSON.stringify(secondRun),
    'Search ordering is not deterministic for "energy support".'
  );

  const supplementsById = new Map(supplements.map((supplement) => [supplement.id, supplement]));
  const canonicalKey = (id) => {
    const supplement = supplementsById.get(id);
    if (!supplement) return '';
    return getCanonicalSupplementKey(supplement);
  };

  assert(
    canonicalKey('white-tea-silver-needle') !== canonicalKey('jasmine-green-tea'),
    'Canonical dedupe should not merge distinct tea variants.'
  );
  assert(
    canonicalKey('ginger') !== canonicalKey('ginger-tea'),
    'Canonical dedupe should not merge ginger supplement with ginger tea.'
  );
  assert(
    canonicalKey('vitamin-e') !== canonicalKey('vitamin-e-tocotrienol'),
    'Canonical dedupe should not merge distinct Vitamin E variants.'
  );
  assert(
    canonicalKey('citrulline') === canonicalKey('l-citrulline'),
    'Canonical dedupe should merge citrulline and l-citrulline aliases.'
  );

  const dedupedSupplements = dedupeSupplementsByCanonical(supplements);
  const dedupedIds = new Set(dedupedSupplements.map((supplement) => supplement.id));
  assert(dedupedIds.has('white-tea-silver-needle'), 'Expected white-tea-silver-needle to survive dedupe.');
  assert(dedupedIds.has('jasmine-green-tea'), 'Expected jasmine-green-tea to survive dedupe.');
  assert(dedupedIds.has('ginger'), 'Expected ginger to survive dedupe.');
  assert(dedupedIds.has('ginger-tea'), 'Expected ginger-tea to survive dedupe.');
  assert(dedupedIds.has('vitamin-e'), 'Expected vitamin-e to survive dedupe.');
  assert(dedupedIds.has('vitamin-e-tocotrienol'), 'Expected vitamin-e-tocotrienol to survive dedupe.');
  const citrullineEntries = dedupedSupplements.filter((supplement) =>
    ['citrulline', 'l-citrulline'].includes(supplement.id)
  );
  assert(
    citrullineEntries.length === 1,
    `Expected exactly one citrulline canonical entry after dedupe, got ${citrullineEntries.length}.`
  );

  const parityQueries = [
    'better sleep and morning energy',
    'high stress and focus',
    'support libido and blood flow',
    'vegan fatigue',
    'joint pain recovery',
  ];
  let overlapAccumulator = 0;
  for (const query of parityQueries) {
    const browseTop = topSearchIds(query, 6);
    const recommendTop = analyzeGoal(query, supplements).recommendations
      .slice(0, 6)
      .map((item) => item.supplement.id);
    const overlapCount = browseTop.filter((id) => recommendTop.includes(id)).length;
    overlapAccumulator += overlapCount / 6;
    assert(
      overlapCount >= 2,
      `Expected browse/recommend parity overlap >= 2 for "${query}", got ${overlapCount}.`
    );
  }
  const averageOverlap = overlapAccumulator / parityQueries.length;
  assert(
    averageOverlap >= 0.4,
    `Expected average browse/recommend top-6 overlap >= 0.40, got ${averageOverlap.toFixed(2)}.`
  );

  if (failures.length > 0) {
    console.error('Search checks failed:');
    for (const failure of failures) {
      console.error(`- ${failure}`);
    }
    process.exit(1);
  }

  console.log('Search checks passed.');
  console.log(`Supplements checked: ${supplements.length}`);
} finally {
  rmSync(runtimeEntryPath, { force: true });
  rmSync(runtimeBundlePath, { force: true });
}
