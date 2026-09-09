# Application Architecture, UI, and Search Audit

Audit date: 2026-09-09

## Implementation update

The first client-only refactor pass now implements typed search intent, a non-endorsing safety lookup state,
word-boundary benefit matching, extracted browse personalization and safety utilities, qualified personalization
copy, accessible browse toggles, URL-restorable query/sort/view state, transparent “Featured” ordering, and removal
of simulated loading. The unused root-level legacy supplement and NRV files were also removed; the GitHub Pages
single-file build remains intentionally enabled because this application has no backend.

## Executive summary

The application has a strong safety baseline: strict TypeScript is enabled, the supplement knowledge build is deterministic, and the dedicated knowledge, search, safety, and intimacy checks all pass. The main risk is no longer missing functionality; it is **complexity and unclear product semantics**. The UI contains several product surfaces inside a few very large components, while recommendation, browse, and safety search use overlapping but different decision paths.

The highest-value next step is to establish one domain-level recommendation/search service and split the large screens around user workflows. In parallel, safety-related searches should be visually and behaviorally distinct from positive recommendations so that a query such as `warfarin interaction` cannot look like an endorsement.

## Scope and method

The review covered:

- application composition, state, persistence, authentication, and cloud sync;
- supplement types, primary data, generated knowledge, curated stacks, and legacy root files;
- recommendation parsing, ranking, canonicalization, browse search, and regression scripts;
- the main recommendation, catalog, detail, tracking, educational, and intimacy interfaces;
- TypeScript, ESLint, knowledge integrity, search, safety, intimacy, and production build output.

Baseline observations:

- `src/App.tsx` is approximately 2,600 lines.
- `src/utils/analyzer.ts` is approximately 2,300 lines.
- `src/components/AdvancedBrowse.tsx` is approximately 1,500 lines.
- `src/components/EducationalGuide.tsx` is approximately 1,450 lines.
- `src/data/supplements.ts` is approximately 4,370 lines and contains 136 checked supplements.
- The single-file production build is approximately 1.84 MB uncompressed / 403 KB gzip.

## Prioritized findings

### P0 — Separate safety lookup from recommendation intent

**Problem:** Browse search intentionally searches safety notes and interaction terms. This is useful for discovery, but those results are rendered in the same selectable supplement cards as benefit/name matches. A user searching `warfarin` can therefore receive interaction-related products in a presentation that still implies “add this supplement.” Search reasons help, but do not change the action semantics.

**Recommendation:** Introduce a typed search intent such as `discovery | safety | exact-product`. For `safety`, render a warning-oriented result layout, rank contraindication relevance first, remove or subordinate “Add to stack,” and provide a clear “why this appeared” explanation. Safety intent should never silently become a positive recommendation.

**Acceptance criteria:**

- `warfarin`, `pregnancy safety`, and `SSRI interaction` enter safety mode.
- Safety-mode results cannot be mistaken for endorsements.
- Regression tests assert intent, ranking reason, and available actions—not only that results exist.

### P0 — Unify recommendation and browse ranking

**Problem:** `analyzer.ts` performs parsing, direct matching, semantic matching, safety assessment, ranking, stack selection, interaction checking, timing, and a React hook. `supplementSearchEngine.ts` separately implements fuzzy matching, token scoring, goals, systems, gender filtering, safety-term matching, canonical merging, and suggestions. The existing parity check only requires two common items in the top six and a 0.40 average overlap, so materially different answers can still pass.

**Recommendation:** Build a framework-agnostic domain pipeline:

1. `parseSearchIntent(query, profile)`;
2. `retrieveCandidates(intent, catalog)`;
3. `assessSafety(candidate, profile)`;
4. `rankCandidates(candidates, intent)`;
5. UI-specific presenters for recommendations and browsing.

Keep `useGoalAnalysis` in a small hook module. Share normalization, typo handling, aliases, goal expansion, canonicalization, and safety intent across both surfaces. Treat stacks as an additional presentation of returned individuals, never a replacement for them.

### P0 — Remove clinical decisions and claims from presentational components

**Problem:** `AdvancedBrowse.tsx` contains hardcoded lower-risk supplement IDs, a medication-risk regular expression, gender/lifestyle recommendation rules, and assertive copy such as “Proven cortisol reducer,” “Essential for strength,” and “Brain and heart protection.” This duplicates analyzer/data responsibilities, is difficult to validate, and makes evidence context inconsistent.

**Recommendation:** Move all personalization and risk classification into typed utilities under `src/utils/`, with labels sourced from supplement evidence data. Components should receive `PersonalizedSuggestion[]` and display qualified reasons. Replace absolute claims with indication-specific, evidence-qualified wording.

### P1 — Decompose the four oversized modules by workflow

**Problem:** File size reflects mixed responsibilities rather than data volume alone. `App.tsx` owns navigation, profile editing, recommendation state, stack management, persistence, tracking/labs, auth, cloud synchronization, dialogs, and major page markup. `AdvancedBrowse.tsx` owns filter metadata, product logic, ranking, virtualization, and three card implementations. This increases regression risk and makes isolated testing difficult.

**Recommendation:** Extract in this order:

- `hooks/usePersistedProfile.ts`, `hooks/useSupplementStack.ts`, and `hooks/useCloudSync.ts`;
- route/page components: `FindPage`, `StacksPage`, `LearnPage`, `AboutPage`;
- browse domain modules: `browseFilters.ts`, `browsePersonalization.ts`, `useBrowseResults.ts`;
- shared `SupplementCard` primitives with layout variants instead of three largely separate cards;
- analyzer modules for parsing, safety, ranking, interactions, stack selection, and timing.

Avoid introducing a state library; context plus focused local hooks is sufficient.

### P1 — Stop simulating loading for synchronous local filtering

**Problem:** Every browse input/filter/view change starts a fixed 280 ms timer and displays skeletons even though the search is local and synchronous. This adds perceived latency, flicker, timer complexity, and misleading feedback.

**Recommendation:** Remove the artificial loading state. If input responsiveness becomes measurable at catalog scale, use `useDeferredValue` for the query and memoized selectors; reserve skeletons for actual network or lazy-module waits.

### P1 — Make browse filters accessible and URL-addressable

**Problem:** Toggle buttons communicate selection mostly through color. The filter and view controls do not consistently expose `aria-pressed`, the sort select lacks a visible/associated label, and search/filter state disappears on refresh or when sharing a link.

**Recommendation:** Add `aria-pressed` to toggle controls, semantic fieldsets/legends for grouped filters, a label for sort, and a polite result-count live region. Serialize `q`, `goal`, `type`, `evidence`, `sort`, and `view` to URL search parameters while retaining local component state as the immediate source.

### P1 — Replace hardcoded “popularity” with a transparent sort

**Problem:** Popularity is a manually assigned score map in the component. It has no source, timestamp, or fallback semantics, yet appears alongside objective sorts such as evidence and name.

**Recommendation:** Rename it to “Featured” and define editorial rank in a typed data/config file with rationale, or add real analytics with a time window and privacy policy. Never label hand-authored ordering as popularity.

### P1 — Establish the real single source of truth

**Problem:** The active catalog correctly lives at `src/data/supplements.ts`, but a legacy root-level `supplements.ts` defines an incompatible supplement schema and imports from a path that does not resolve from its location. Root-level `nrvValues.ts` is similarly detached from the `src/` architecture. These files are excluded by `tsconfig`, so normal checks cannot detect drift or breakage.

**Recommendation:** Confirm that neither root file is used by external tooling, then migrate any still-needed NRV content into `src/data/` and remove/archive the legacy supplement file. Add an import-boundary check ensuring runtime catalog data comes only from `src/data/supplements.ts`.

### P1 — Add behavioral tests rather than script-only smoke checks

**Problem:** The current scripts are valuable but focus on curated examples. There is no component/unit test runner, no keyboard/focus regression coverage, and limited negative-query search coverage.

**Recommendation:** Add Vitest and React Testing Library. Start with table-driven tests for:

- negation (`not for sleep`, `no caffeine`);
- short tokens and substring collisions;
- misspellings and aliases;
- mixed benefit/safety intent;
- gender/reproductive filtering with unknown status;
- stack-plus-individual invariants;
- modal focus trap/restoration and Escape behavior;
- browse filter keyboard state and result announcements.

### P2 — Reduce first-load and deployment coupling

**Problem:** `vite-plugin-singlefile` forces all built JavaScript and CSS—including lazy imports—into one HTML artifact. The result is convenient to deploy, but the current build is about 1.84 MB before gzip and prevents normal long-lived chunk caching. The application also imports large catalog data into primary flows.

**Recommendation:** Decide whether single-file delivery is a hard requirement. If not, remove the plugin and use route/feature chunks. If it is required, document the tradeoff and add a bundle-size budget. Consider generating compact search indexes and loading long educational/intimacy content only when its section opens.

### P2 — Consolidate design tokens and dark-mode behavior

**Problem:** Visual styling is repeated as long Tailwind class strings, while dark mode globally overrides a small set of generic utility classes in `src/index.css`. This can produce accidental contrast changes and makes semantic states—success, caution, danger, evidence—hard to audit consistently.

**Recommendation:** Define shared semantic component variants (`Button`, `Chip`, `Callout`, `Card`, `EvidenceBadge`) using typed class maps and `cn`. Prefer explicit `dark:` variants or Tailwind theme tokens over global overrides of `.bg-white` and `.text-gray-*`. Run automated contrast checks for both themes.

### P2 — Clarify navigation and sensitive-content placement

**Problem:** “Learn” contains Guide, Insights, Track, and Intimacy. Tracking is an ongoing personal workflow rather than education, and intimacy is a sensitive opt-in domain with different expectations. An additional About tab makes four top-level destinations despite the existing audit describing three.

**Recommendation:** User-test one of two structures:

- `Find | Stacks | Track | Learn`, with intimacy behind an explicit Wellness entry; or
- `Find | Plan | Progress | Library`, with clear subtitles.

Keep the age/consent gate, but make entry into sensitive content deliberate and explain local/cloud data handling before opt-in.

### P2 — Validate persisted data at runtime

**Problem:** JSON read from local storage is asserted or inferred as application types after parsing. Valid JSON with an obsolete or malformed shape can enter state after a schema evolution. Catch blocks only cover parse/storage exceptions, not semantic validity.

**Recommendation:** Add lightweight type guards/migrations for profile, tracking, labs, preferences, and sync metadata. Version persisted payloads and discard only invalid fields rather than the whole object.

## Search-specific decision review

### Decisions worth keeping

- Canonical supplement deduplication is explicit and deterministic.
- Exact name/alias matches appropriately outrank prefix, contains, and fuzzy matches.
- Typo suggestions are separated from result ranking.
- Search considers knowledge aliases and use cases rather than only the main data record.
- The analyzer returns individual supplement details alongside relevant stacks.

### Decisions to revise

- `term.includes(token)` is broad substring matching; tokenize indexed text or require word/prefix boundaries to prevent incidental matches.
- Fuzzy matching compares the whole normalized query to a whole candidate name. Apply fuzzy matching only to likely product-name spans/tokens, not long symptom sentences.
- Fertility gender filtering is activated by a small hand-maintained token set and a small hand-maintained list of gender-specific goals. Derive scope from normalized taxonomy metadata.
- Match scores are opaque magic numbers. Export a versioned scoring configuration and test rank invariants instead of exact implementation details.
- Search reasons are truncated to four before presentation. Preserve structured reasons internally and select the most decision-relevant explanations by intent.
- The analyzer and browse experience use overlapping stop-word, stemming, Levenshtein, and normalization implementations. One tokenizer/index should serve both.

## Suggested delivery plan

### Phase 1 — Safety and correctness

1. Add typed search intent and safety-result presentation.
2. Move browse personalization/risk logic out of the component.
3. Expand regression cases for negative, mixed, and safety queries.
4. Validate persisted data.

### Phase 2 — Architecture

1. Extract the shared retrieval/ranking pipeline.
2. Split `analyzer.ts` into domain modules and move its hook.
3. Split `App.tsx` by page and stateful hook.
4. Consolidate browse cards and filter selectors.

### Phase 3 — UX and performance

1. Remove simulated loading and add accessible filter semantics.
2. Persist shareable search state in the URL.
3. Rename/rework popularity and qualify personalized copy.
4. Decide on single-file deployment, add a size budget, and test both themes for contrast.

## Definition of done

- Safety searches have distinct intent, ranking, copy, and actions.
- Browse and recommendation use one candidate retrieval and safety pipeline.
- No presentational component contains medication/reproductive risk rules.
- No page component exceeds roughly 500 lines without a documented reason.
- Search behavior is covered by positive, negative, typo, mixed-intent, and safety tests.
- All toggle controls expose programmatic state and all dialogs manage focus.
- Search/filter URLs are shareable and restorable.
- The legacy root data files are removed or explicitly documented and checked.
- Production bundle budgets are enforced in CI.
