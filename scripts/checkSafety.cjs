#!/usr/bin/env node

const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');

function registerTypeScriptLoader() {
  const compile = (module, filename) => {
    const source = fs.readFileSync(filename, 'utf8');
    const { outputText } = ts.transpileModule(source, {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2020,
        jsx: ts.JsxEmit.ReactJSX,
        esModuleInterop: true,
        resolveJsonModule: true
      },
      fileName: filename
    });
    module._compile(outputText, filename);
  };

  require.extensions['.ts'] = compile;
  require.extensions['.tsx'] = compile;
}

function test(name, fn) {
  try {
    fn();
    console.log(`PASS ${name}`);
  } catch (error) {
    console.error(`FAIL ${name}`);
    throw error;
  }
}

function baseProfile(overrides = {}) {
  return {
    sex: 'female',
    pregnancyStatus: 'no',
    breastfeedingStatus: 'no',
    tryingToConceiveStatus: 'no',
    medicationStatus: 'none',
    medications: [],
    healthConditions: [],
    ...overrides
  };
}

function run() {
  registerTypeScriptLoader();

  const { analyzeGoal, checkInteractions } = require('../src/utils/analyzer.ts');
  const { supplements } = require('../src/data/supplements.ts');
  const { isReproductiveScopeQuery } = require('../src/constants/reproductiveScope.ts');

  const byId = (id) => {
    const supplement = supplements.find((item) => item.id === id);
    assert.ok(supplement, `Supplement '${id}' must exist for safety checks.`);
    return supplement;
  };

  const hasRecommendation = (analysis, supplementId) =>
    analysis.recommendations.some((rec) => rec.supplement.id === supplementId);

  const findRecommendation = (analysis, supplementId) =>
    analysis.recommendations.find((rec) => rec.supplement.id === supplementId);

  test('Reproductive query scope includes libido, sexual, and hormonal terms', () => {
    assert.equal(isReproductiveScopeQuery('libido support'), true, 'libido should trigger reproductive intake scope.');
    assert.equal(isReproductiveScopeQuery('sexual performance support'), true, 'sexual should trigger reproductive intake scope.');
    assert.equal(isReproductiveScopeQuery('hormonal balance support'), true, 'hormonal should trigger reproductive intake scope.');
  });

  test('DIM is excluded when pregnancy status is yes', () => {
    const analysis = analyzeGoal('dim hormonal acne', supplements, baseProfile({ pregnancyStatus: 'yes' }));
    assert.equal(hasRecommendation(analysis, 'dim'), false, 'DIM must not be recommended during pregnancy.');
  });

  test('DIM is excluded when breastfeeding status is yes', () => {
    const analysis = analyzeGoal('dim hormonal balance', supplements, baseProfile({ breastfeedingStatus: 'yes' }));
    assert.equal(hasRecommendation(analysis, 'dim'), false, 'DIM must not be recommended while breastfeeding.');
  });

  test('DIM is excluded when breastfeeding status is unknown', () => {
    const analysis = analyzeGoal(
      'dim supplement',
      supplements,
      baseProfile({ breastfeedingStatus: 'unknown' })
    );
    assert.equal(
      hasRecommendation(analysis, 'dim'),
      false,
      'DIM should be blocked until breastfeeding status is explicitly set.'
    );
  });

  test('Tulsi is excluded when trying-to-conceive status is unknown', () => {
    const analysis = analyzeGoal(
      'tulsi stress support',
      supplements,
      baseProfile({ tryingToConceiveStatus: 'unknown' })
    );
    assert.equal(
      hasRecommendation(analysis, 'tulsi'),
      false,
      'Tulsi should be blocked when TTC status is unknown due explicit TTC avoidIf.'
    );
  });

  test('Unknown reproductive status does not exclude non-reproductive botanical recommendations', () => {
    const analysis = analyzeGoal(
      'anxiety',
      [byId('lemon-balm')],
      baseProfile({
        pregnancyStatus: 'unknown',
        breastfeedingStatus: 'unknown',
        tryingToConceiveStatus: 'unknown'
      })
    );
    assert.equal(
      hasRecommendation(analysis, 'lemon-balm'),
      true,
      'Lemon balm should remain eligible when reproductive status is unknown and no reproductive-risk signal is present.'
    );
  });

  test('Anticoagulant class plural is detected for interaction warnings', () => {
    const warnings = checkInteractions(
      [byId('ginkgo')],
      baseProfile({ medicationStatus: 'taking', medications: ['anticoagulants'] })
    );
    assert.ok(
      warnings.some((warning) => warning.severity === 'high' && /ginkgo/i.test(warning.supplements.join(' '))),
      'Expected a high-severity anticoagulant interaction warning for ginkgo.'
    );
  });

  test('SSRI class plural is detected for serotonergic interaction warnings', () => {
    const warnings = checkInteractions(
      [byId('5-htp')],
      baseProfile({ medicationStatus: 'taking', medications: ['SSRIs'] })
    );
    assert.ok(
      warnings.some(
        (warning) =>
          warning.severity === 'high' &&
          /5-htp|hydroxytryptophan/i.test(`${warning.supplements.join(' ')} ${warning.reason}`)
      ),
      'Expected a high-severity SSRI interaction warning for 5-HTP.'
    );
  });

  test('SNRI class plural is detected for serotonergic interaction warnings', () => {
    const warnings = checkInteractions(
      [byId('st-johns-wort')],
      baseProfile({ medicationStatus: 'taking', medications: ['SNRIs'] })
    );
    assert.ok(
      warnings.some(
        (warning) =>
          warning.severity === 'high' &&
          /st john|hypericum|snri/i.test(`${warning.supplements.join(' ')} ${warning.reason}`)
      ),
      'Expected a high-severity SNRI interaction warning for St. John\'s Wort.'
    );
  });

  test('MAOI class plural is detected for interaction warnings', () => {
    const warnings = checkInteractions(
      [byId('l-tyrosine')],
      baseProfile({ medicationStatus: 'taking', medications: ['MAOIs'] })
    );
    assert.ok(
      warnings.some((warning) => warning.severity === 'high' && /tyrosine|maoi/i.test(`${warning.supplements.join(' ')} ${warning.reason}`)),
      'Expected a high-severity MAOI interaction warning for L-Tyrosine.'
    );
  });

  test('Thyroid medication spacing warning is surfaced for magnesium recommendations', () => {
    const analysis = analyzeGoal(
      'magnesium support',
      supplements,
      baseProfile({ medicationStatus: 'taking', medications: ['levothyroxine'] })
    );
    const magnesiumRecommendation = findRecommendation(analysis, 'magnesium');
    assert.ok(
      magnesiumRecommendation,
      'Magnesium should remain recommendable with spacing cautions for thyroid medication.'
    );
    assert.ok(
      (magnesiumRecommendation.safetyFlags || []).some((flag) => /thyroid medication|4 hours/i.test(flag)),
      'Expected thyroid spacing or thyroid medication safety guidance for magnesium.'
    );
  });

  test('Kidney condition excludes high-risk potassium recommendations', () => {
    const analysis = analyzeGoal(
      'potassium electrolyte support',
      supplements,
      baseProfile({ healthConditions: ['chronic kidney disease'] })
    );
    assert.equal(
      hasRecommendation(analysis, 'potassium'),
      false,
      'Potassium should be excluded when kidney disease is present.'
    );
  });

  test('Liver condition excludes high-risk kava recommendations', () => {
    const analysis = analyzeGoal(
      'kava anxiety support',
      supplements,
      baseProfile({ healthConditions: ['liver disease'] })
    );
    assert.equal(hasRecommendation(analysis, 'kava'), false, 'Kava should be excluded when liver disease is present.');
  });

  console.log('Safety regression checks passed.');
}

run();
