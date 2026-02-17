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

function collectStrings(value, sink = []) {
  if (typeof value === 'string') {
    sink.push(value);
    return sink;
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      collectStrings(item, sink);
    }
    return sink;
  }

  if (value && typeof value === 'object') {
    for (const item of Object.values(value)) {
      collectStrings(item, sink);
    }
  }

  return sink;
}

function run() {
  registerTypeScriptLoader();

  const { buildIntimacyFeatureFlags, canAccessIntimacyContent } = require('../src/utils/intimacyFeatureFlags.ts');
  const { containsExplicitContent } = require('../src/utils/intimacyContent.ts');
  const { createConsentFlowState, resolveConsentFlow } = require('../src/utils/intimacyConsent.ts');
  const { matchPersonalizedPositions } = require('../src/utils/intimacyMatcher.ts');
  const { evaluateSafetyEscalation } = require('../src/utils/intimacySafety.ts');
  const {
    buildPositionImageFallbackSearchQuery,
    buildPositionImageFallbackSearchQueryYandex,
    buildPositionImageFallbackSearchUrl,
    buildPositionImageFallbackSearchUrlYandex,
    buildPositionImageSearchQuery,
    buildPositionImageSearchQueryYandex,
    buildPositionImageSearchUrl,
    buildPositionImageSearchUrlYandex
  } = require('../src/utils/intimacyImageSearch.ts');
  const { intimacyLessons } = require('../src/data/intimacyLessons.ts');
  const { intimacyPositions } = require('../src/data/intimacyPositions.ts');
  const {
    externalReferenceByPositionId,
    externalReferenceByPositionIdBroad,
    getExternalReferenceForPosition
  } = require('../src/data/intimacyExternalReferences.ts');
  const {
    getPositionIdFromExternalName,
    hasSourceMapForEveryPosition,
    positionSourceMap,
    validatePositionSourceMetadata
  } = require('../src/data/positionSourceMap.ts');
  const { hasIllustrationForEveryPosition, positionIllustrationById } = require('../src/data/positionIllustrations.ts');

  test('Gating denies access when age is unverified', () => {
    const flags = buildIntimacyFeatureFlags({
      ageVerified: false,
      sexualContentOptIn: true,
      boundaries: [],
      accessibilityNeeds: []
    });
    assert.equal(canAccessIntimacyContent(flags), false);
  });

  test('Gating denies access when opt-in is false', () => {
    const flags = buildIntimacyFeatureFlags({
      ageVerified: true,
      sexualContentOptIn: false,
      boundaries: [],
      accessibilityNeeds: []
    });
    assert.equal(canAccessIntimacyContent(flags), false);
  });

  test('Gating allows access only when both age and opt-in are true', () => {
    const flags = buildIntimacyFeatureFlags({
      ageVerified: true,
      sexualContentOptIn: true,
      boundaries: ['slow pacing'],
      accessibilityNeeds: ['lumbar support']
    });
    assert.equal(canAccessIntimacyContent(flags), true);
  });

  test('Seed lesson and position content remains non-graphic', () => {
    const lessonStrings = collectStrings(intimacyLessons);
    const positionStrings = collectStrings(intimacyPositions);
    const all = [...lessonStrings, ...positionStrings];
    for (const text of all) {
      assert.equal(
        containsExplicitContent(text),
        false,
        `Found disallowed explicit wording in: ${text}`
      );
    }
  });

  test('Position catalog is documented with sources', () => {
    assert.ok(
      intimacyPositions.length >= 25,
      `Expected at least 25 documented positions, got ${intimacyPositions.length}.`
    );

    for (const position of intimacyPositions) {
      assert.ok(
        Array.isArray(position.documentationSources) && position.documentationSources.length > 0,
        `Position ${position.id} is missing documentation sources.`
      );
    }
  });

  test('Position source map covers all positions and includes license attribution metadata', () => {
    assert.equal(
      hasSourceMapForEveryPosition(intimacyPositions),
      true,
      'Every position must have a source map entry.'
    );

    const metadataIssues = validatePositionSourceMetadata(positionSourceMap);
    assert.equal(
      metadataIssues.length,
      0,
      `Source map metadata issues:\n${metadataIssues.join('\n')}`
    );
  });

  test('External position alias mapping resolves common names', () => {
    assert.equal(getPositionIdFromExternalName('cowgirl'), 'top-facing-forward-supported');
    assert.equal(getPositionIdFromExternalName('reverse cowgirl'), 'top-facing-backward-supported');
    assert.equal(getPositionIdFromExternalName('spooning'), 'side-lying-support');
    assert.equal(getPositionIdFromExternalName('coital alignment technique'), 'coital-alignment-technique-supported');
  });

  test('External position references provide valid high-confidence links', () => {
    const entries = Object.entries(externalReferenceByPositionId);
    assert.ok(
      entries.length >= 2,
      `Expected at least 2 strict external references, got ${entries.length}.`
    );

    const knownIds = new Set(intimacyPositions.map((position) => position.id));
    for (const [positionId, reference] of entries) {
      assert.ok(
        knownIds.has(positionId),
        `External reference points to unknown position id: ${positionId}`
      );
      assert.ok(
        /^https?:\/\/\S+/i.test(reference.imageUrl),
        `External reference image URL must be absolute for ${positionId}`
      );
      assert.ok(reference.externalName && reference.externalName.length > 0);
      assert.ok(reference.sourceName && reference.sourceName.length > 0);
      assert.ok(reference.sourceUrl && /^https?:\/\/\S+/i.test(reference.sourceUrl));
      assert.ok(reference.license && reference.license.length > 0);
      assert.ok(reference.attribution && reference.attribution.length > 0);
      assert.ok(
        reference.mappingConfidence === 'exact' || reference.mappingConfidence === 'alias',
        `Strict map should avoid broad keyword matches for ${positionId}`
      );
    }

    const broadEntries = Object.entries(externalReferenceByPositionIdBroad);
    assert.ok(
      broadEntries.length >= 8,
      `Expected at least 8 broad external references, got ${broadEntries.length}.`
    );

    for (const [positionId, reference] of broadEntries) {
      assert.ok(knownIds.has(positionId));
      assert.ok(/^https?:\/\/\S+/i.test(reference.imageUrl));
    }

    const importedPositions = intimacyPositions.filter((position) => position.id.startsWith('club-'));
    const importedWithDirectReference = importedPositions.filter((position) =>
      Boolean(getExternalReferenceForPosition(position, { allowBroadMatches: false }))
    );
    assert.equal(
      importedWithDirectReference.length,
      importedPositions.length,
      `Every imported position should resolve a mapped external reference. Got ${importedWithDirectReference.length}/${importedPositions.length}.`
    );
  });

  test('Every position has a non-explicit safety-first illustration mapping', () => {
    assert.equal(
      hasIllustrationForEveryPosition(intimacyPositions),
      true,
      'Every position must have an illustration mapping.'
    );

    for (const position of intimacyPositions) {
      const illustration = positionIllustrationById[position.id];
      assert.ok(
        illustration,
        `Position ${position.id} is missing illustration metadata.`
      );

      assert.equal(
        containsExplicitContent(illustration.caption),
        false,
        `Illustration caption must stay non-graphic: ${illustration.caption}`
      );

      for (const item of illustration.mechanicsFocus) {
        assert.equal(
          containsExplicitContent(item),
          false,
          `Illustration mechanics guidance must stay non-graphic: ${item}`
        );
      }
    }
  });

  test('Position image search links stay valid and concise for Google/Yandex', () => {
    for (const position of intimacyPositions) {
      const link = buildPositionImageSearchUrl(position);
      const fallbackLink = buildPositionImageFallbackSearchUrl(position);
      const yandexLink = buildPositionImageSearchUrlYandex(position);
      const yandexFallbackLink = buildPositionImageFallbackSearchUrlYandex(position);
      const parsed = new URL(link);
      const fallbackParsed = new URL(fallbackLink);
      const yandexParsed = new URL(yandexLink);
      const yandexFallbackParsed = new URL(yandexFallbackLink);
      const query = buildPositionImageSearchQuery(position).toLowerCase();
      const fallbackQuery = buildPositionImageFallbackSearchQuery(position).toLowerCase();
      const yandexQuery = buildPositionImageSearchQueryYandex(position).toLowerCase();
      const yandexFallbackQuery = buildPositionImageFallbackSearchQueryYandex(position).toLowerCase();

      assert.equal(
        parsed.hostname,
        'www.google.com',
        `Expected Google host for image search URL in ${position.id}`
      );
      assert.equal(
        parsed.searchParams.get('tbm'),
        'isch',
        `Expected image search mode for ${position.id}`
      );
      assert.equal(
        parsed.searchParams.get('safe'),
        'off',
        `Expected SafeSearch=off for ${position.id}`
      );
      assert.ok(
        query.length >= 8,
        `Targeted query should not be empty for ${position.id}`
      );
      assert.ok(
        query.length <= 140,
        `Targeted query should stay concise for ${position.id}; got ${query.length} chars`
      );
      assert.ok(
        !query.includes('"'),
        `Targeted query should avoid heavy quoting for ${position.id}`
      );

      assert.equal(
        fallbackParsed.hostname,
        'www.google.com',
        `Expected Google host for fallback URL in ${position.id}`
      );
      assert.equal(
        fallbackParsed.searchParams.get('tbm'),
        'isch',
        `Expected image search mode for fallback URL in ${position.id}`
      );
      assert.equal(
        fallbackParsed.searchParams.get('safe'),
        'off',
        `Expected SafeSearch=off for fallback URL in ${position.id}`
      );
      assert.ok(
        fallbackQuery.length >= 6,
        `Fallback query should not be empty for ${position.id}`
      );
      assert.ok(
        fallbackQuery.length <= 120,
        `Fallback query should stay concise for ${position.id}; got ${fallbackQuery.length} chars`
      );

      assert.equal(
        yandexParsed.hostname,
        'yandex.com',
        `Expected Yandex host for targeted URL in ${position.id}`
      );
      assert.equal(
        yandexParsed.pathname,
        '/images/search',
        `Expected Yandex images search path for targeted URL in ${position.id}`
      );
      assert.equal(
        yandexParsed.searchParams.get('family'),
        'no',
        `Expected Yandex family=no for targeted URL in ${position.id}`
      );
      assert.ok(
        yandexParsed.searchParams.get('text') && yandexParsed.searchParams.get('text').length > 10,
        `Expected Yandex targeted text query for ${position.id}`
      );
      assert.ok(
        yandexQuery.length >= 8,
        `Yandex targeted query should not be empty for ${position.id}`
      );
      assert.ok(
        yandexQuery.length <= 140,
        `Yandex targeted query should stay concise for ${position.id}; got ${yandexQuery.length} chars`
      );

      assert.equal(
        yandexFallbackParsed.hostname,
        'yandex.com',
        `Expected Yandex host for fallback URL in ${position.id}`
      );
      assert.equal(
        yandexFallbackParsed.pathname,
        '/images/search',
        `Expected Yandex images search path for fallback URL in ${position.id}`
      );
      assert.equal(
        yandexFallbackParsed.searchParams.get('family'),
        'no',
        `Expected Yandex family=no for fallback URL in ${position.id}`
      );
      assert.ok(
        yandexFallbackParsed.searchParams.get('text') && yandexFallbackParsed.searchParams.get('text').length > 4,
        `Expected Yandex fallback text query for ${position.id}`
      );
      assert.ok(
        yandexFallbackQuery.length >= 6,
        `Yandex fallback query should not be empty for ${position.id}`
      );
      assert.ok(
        yandexFallbackQuery.length <= 90,
        `Yandex fallback query should stay concise for ${position.id}; got ${yandexFallbackQuery.length} chars`
      );
    }
  });

  test('Personalized matcher returns profile-aligned top recommendations', () => {
    const lowBackControl = matchPersonalizedPositions(
      intimacyPositions,
      {
        painFocus: 'low-back',
        energyLevel: 'medium',
        priority: 'control',
        preferUpright: false,
        beginnerFriendlyOnly: true
      },
      3
    );
    assert.equal(lowBackControl.length, 3);
    assert.equal(lowBackControl[0].isExcluded, false);
    assert.ok(lowBackControl[0].position.comfortTags.includes('low-back-sensitive'));

    const pelvicComfort = matchPersonalizedPositions(
      intimacyPositions,
      {
        painFocus: 'pelvic-floor',
        energyLevel: 'low',
        priority: 'comfort',
        preferUpright: false,
        beginnerFriendlyOnly: true
      },
      3
    );
    assert.equal(pelvicComfort.length, 3);
    assert.ok(
      pelvicComfort.some((item) => item.position.comfortTags.includes('pelvic-floor-tension')),
      'Expected at least one top recommendation with pelvic-floor support.'
    );

    const mobilityUpright = matchPersonalizedPositions(
      intimacyPositions,
      {
        painFocus: 'mobility-balance',
        energyLevel: 'medium',
        priority: 'connection',
        preferUpright: true,
        beginnerFriendlyOnly: true
      },
      3
    );
    assert.equal(mobilityUpright.length, 3);
    assert.equal(mobilityUpright[0].isExcluded, false);
    assert.ok(
      mobilityUpright.some((item) => item.position.comfortTags.includes('mobility-limited')),
      'Expected mobility-focused recommendations for mobility-balance profile.'
    );
  });

  test('Consent flow advances and completes on continue responses', () => {
    let state = createConsentFlowState(3);
    state = resolveConsentFlow(state, 'continue');
    assert.equal(state.stepIndex, 1);
    assert.equal(state.status, 'active');

    state = resolveConsentFlow(state, 'continue');
    assert.equal(state.stepIndex, 2);
    assert.equal(state.status, 'active');

    state = resolveConsentFlow(state, 'continue');
    assert.equal(state.stepIndex, 2);
    assert.equal(state.status, 'completed');
  });

  test('Consent flow stops or switches when requested', () => {
    const stopped = resolveConsentFlow(createConsentFlowState(2), 'stop');
    assert.equal(stopped.status, 'stopped');

    const switched = resolveConsentFlow(createConsentFlowState(2), 'switch');
    assert.equal(switched.status, 'switched');
  });

  test('Safety escalation detects coercion and persistent pain signals', () => {
    const coercion = evaluateSafetyEscalation('I feel pressured and forced.');
    assert.equal(coercion.requiresEscalation, true);
    assert.equal(coercion.severity, 'urgent');
    assert.ok(coercion.immediateSteps.length >= 2);

    const coercionByLanguage = evaluateSafetyEscalation('I feel pressured to continue.');
    assert.equal(coercionByLanguage.requiresEscalation, true);
    assert.equal(coercionByLanguage.severity, 'urgent');

    const pain = evaluateSafetyEscalation('There is persistent pain and distress.');
    assert.equal(pain.requiresEscalation, true);
    assert.equal(pain.severity, 'pause');

    const physicalPressure = evaluateSafetyEscalation('I feel knee pressure and discomfort.');
    assert.equal(physicalPressure.requiresEscalation, true);
    assert.equal(physicalPressure.severity, 'pause');

    const plainPain = evaluateSafetyEscalation('There is pain when we continue.');
    assert.equal(plainPain.requiresEscalation, true);
    assert.equal(plainPain.severity, 'pause');

    const emergency = evaluateSafetyEscalation('There is heavy bleeding and I fainted.');
    assert.equal(emergency.requiresEscalation, true);
    assert.equal(emergency.severity, 'emergency');

    const neutral = evaluateSafetyEscalation('We are comfortable and want to continue.');
    assert.equal(neutral.requiresEscalation, false);
    assert.equal(neutral.severity, 'none');
  });

  console.log('Intimacy checks passed.');
}

run();
