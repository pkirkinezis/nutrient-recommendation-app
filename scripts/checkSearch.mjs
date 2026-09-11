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
import { getSupplementSearchIntent, searchSupplementsWithScores, suggestClosestSupplementTerm } from '../src/utils/supplementSearchEngine.ts';
import { supplements } from '../src/data/supplements.ts';
import { dedupeSupplementsByCanonical, getCanonicalSupplementKey } from '../src/utils/supplementCanonical.ts';
import { getInitialFindMode } from '../src/utils/browseUrlState.ts';

export {
  analyzeGoal,
  searchSupplementsWithScores,
  getSupplementSearchIntent,
  suggestClosestSupplementTerm,
  supplements,
  dedupeSupplementsByCanonical,
  getCanonicalSupplementKey,
  getInitialFindMode,
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
    getSupplementSearchIntent,
    suggestClosestSupplementTerm,
    supplements,
    dedupeSupplementsByCanonical,
    getCanonicalSupplementKey,
    getInitialFindMode,
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

  const medicationOnlySafetyResults = topSearchIds('warfarin', 5);
  assert(
    medicationOnlySafetyResults.length > 0,
    'Expected "warfarin" to return safety-aware matches even without extra intent keywords.'
  );

  const safetyIntent = topSearchIds('warfarin interaction', 5);
  assert(
    safetyIntent.length > 0,
    'Expected "warfarin interaction" to return safety-oriented matches.'
  );
  assert(
    getSupplementSearchIntent('warfarin interaction', supplements) === 'safety',
    'Expected interaction queries to use safety intent.'
  );
  assert(
    getSupplementSearchIntent('warfarin', supplements) === 'safety',
    'Expected a medication-only query to use safety intent.'
  );
  assert(
    getSupplementSearchIntent('magnesium', supplements) === 'exact-product',
    'Expected an exact catalog name to use exact-product intent.'
  );
  for (const supplementName of ['iron', 'calcium', 'potassium', 'copper', 'caffeine', 'taurine']) {
    assert(
      getSupplementSearchIntent(supplementName, supplements) === 'exact-product',
      `Expected exact supplement "${supplementName}" to take precedence over interaction inference.`
    );
  }
  assert(
    getSupplementSearchIntent('better sleep', supplements) === 'discovery',
    'Expected a benefit query to use discovery intent.'
  );
  for (const unsupportedQuery of ['fertility', 'ovulation']) {
    const browseIds = topSearchIds(unsupportedQuery, 20);
    const recommendationIds = analyzeGoal(unsupportedQuery, supplements).recommendations
      .map((item) => item.supplement.id);
    for (const unsupportedId of ['vitex', 'red-clover']) {
      assert(
        !browseIds.includes(unsupportedId),
        `Expected "${unsupportedQuery}" browse results to exclude unsupported ${unsupportedId}.`
      );
      assert(
        !recommendationIds.includes(unsupportedId),
        `Expected "${unsupportedQuery}" recommendations to exclude unsupported ${unsupportedId}.`
      );
    }
  }
  assert(
    topSearchIds('vitex', 1)[0] === 'vitex',
    'Expected an exact Vitex product query to remain available.'
  );
  assert(
    search('warfarin interaction').every((result) => result.intent === 'safety'),
    'Expected every interaction result to retain safety intent metadata.'
  );
  for (const medication of ['metformin', 'digoxin']) {
    assert(
      getSupplementSearchIntent(medication, supplements) === 'safety',
      `Expected catalog medication "${medication}" to use safety intent.`
    );
    const medicationResults = search(medication);
    assert(medicationResults.length > 0, `Expected safety matches for "${medication}".`);
    assert(
      medicationResults.every((result) => result.safetyScore > 0),
      `Expected every "${medication}" result to match safety or interaction text.`
    );
  }
  assert(
    getSupplementSearchIntent('blood pressure', supplements) === 'discovery',
    'Expected a general health-goal phrase not to become safety intent from generic interaction wording.'
  );
  const mixedSafetyResults = search('magnesium side effects');
  assert(
    mixedSafetyResults.every((result) =>
      result.safetyScore > 0 || result.reasons.some((reason) => reason.code.startsWith('name-') || reason.code.startsWith('alias-'))
    ),
    'Expected safety-mode results to match a product name or safety text.'
  );
  const namedSafetyQueries = [
    ['magnesium safety', 'magnesium'],
    ['creatine side effects', 'creatine'],
    ['vitamin d3 safety', 'vitamin-d3'],
  ];
  for (const [safetyQuery, expectedId] of namedSafetyQueries) {
    const resultIds = topSearchIds(safetyQuery, 10);
    assert(
      resultIds.includes(expectedId),
      `Expected "${safetyQuery}" to retain named product "${expectedId}".`
    );
  }
  assert(
    getInitialFindMode('?q=warfarin&view=list') === 'browse',
    'Expected shared browse parameters to open Browse Catalog.'
  );
  assert(
    getInitialFindMode('?mode=browse') === 'browse' && getInitialFindMode('') === 'recommend',
    'Expected explicit browse mode and default recommendation mode to restore correctly.'
  );

  const firstRun = topSearchIds('energy support', 20);
  const secondRun = topSearchIds('energy support', 20);
  assert(
    JSON.stringify(firstRun) === JSON.stringify(secondRun),
    'Search ordering is not deterministic for "energy support".'
  );

  const nonsenseAnalysis = analyzeGoal('something', supplements);
  assert(
    nonsenseAnalysis.matchType !== 'direct',
    `Expected "something" not to trigger direct-match mode, got ${nonsenseAnalysis.matchType || 'none'}.`
  );
  assert(
    !nonsenseAnalysis.directSupplements.includes('fenugreek'),
    'Expected "something" not to direct-match fenugreek via alias substring.'
  );

  const contextualDirect = analyzeGoal('I want magnesium', supplements);
  assert(
    contextualDirect.directSupplements.includes('magnesium'),
    'Expected direct-match extraction to still detect magnesium in a longer sentence.'
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
    'better sleep and relaxation',
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
