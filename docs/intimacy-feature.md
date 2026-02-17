# Intimacy & Sexual Wellness Integration

## Scope
- Adults only: hard gate with `ageVerified`.
- Mature content hidden by default: soft gate with `sexualContentOptIn`.
- Educational and non-graphic lesson/position content only.
- Continuous consent: check-ins built into lesson and position flows.
- Safety escalation: coercion, trauma signals, or persistent pain/distress stop coaching.
- Unified search: one query/filter surface drives both positions and comfort-principle results.

## Main Files
- `src/components/IntimacyWellnessSection.tsx`
- `src/components/IntimacyOnboarding.tsx`
- `src/components/IntimacyLessonPlayer.tsx`
- `src/components/PositionsComfortLibrary.tsx`
- `src/components/PositionMechanicsIllustration.tsx`
- `src/components/ConsentCheckInDialog.tsx`
- `src/components/IntimacySafetyEscalation.tsx`
- `src/data/intimacyComfortGuidance.ts`
- `src/data/intimacyLessons.ts`
- `src/data/intimacyExternalReferences.ts`
- `src/data/intimacyPositions.ts`
- `src/data/positionSourceMap.ts`
- `src/data/positionIllustrations.ts`
- `src/utils/intimacyFeatureFlags.ts`
- `src/utils/intimacyImageSearch.ts`
- `src/utils/intimacyMatcher.ts`
- `src/utils/intimacyConsent.ts`
- `src/utils/intimacySafety.ts`
- `src/utils/intimacyStorage.ts`
- `scripts/importPositionData.mjs`
- `scripts/checkIntimacy.cjs`

## Verification
1. Run `npm run check:intimacy`.
2. Start app with `npm run dev`.
3. Open `Learn` -> `Intimacy`.
4. Confirm content remains hidden until both `I am 18+` and explicit opt-in are enabled.
5. Start a lesson and verify each step requires a consent response (`Continue`, `Switch`, `Stop`).
6. Use `Run Safety Check` with an empty note and confirm you get a guidance message.
7. Enter text indicating coercion/trauma/pain/distress in safety note and confirm coaching stops with escalation guidance.
8. In `Positions & Comfort Library`, search a principle phrase (for example `low back`) and confirm linked position cards appear.
9. Confirm each position card renders a non-photo, non-explicit body-mechanics diagram.
10. Confirm each position card also shows `How To Perform Safely` with a numbered sequence.
11. Confirm `Positions & Comfort Library` includes 25 documented entries with source links on each card.
12. Confirm external image links are inside `Optional external images (not verified)`.
13. Confirm external links show Google and Yandex targeted/broader options.
14. Confirm Google links open with `tbm=isch&safe=off`.
15. Confirm Yandex links open with `family=no`.
16. Confirm targeted queries are concise and return results more reliably than long quoted searches.
17. Confirm `Personalized Position Matcher` returns top 3 ranked positions and applies filters.
18. Confirm safety checks can trigger severity-based triage (`pause`, `urgent`, `emergency`).
19. Confirm `Optional external images` shows `Mapped External Reference` on positions with curated matches.
20. Confirm `Search & Filters` shows active filter chips and supports `Clear all`.
21. Confirm `Personalized Position Matcher` is collapsed by default and expands on demand.
22. Confirm `Apply to Library Filters` auto-scrolls to Results.
23. Confirm external references default to strict matches; broad matches appear only when enabled.

## External Data Import (Schema Reference Workflow)
- Use `node scripts/importPositionData.mjs --input <path-or-url-to-exported-json>`.
- The importer validates each row has:
  - `sourceName`
  - `sourceUrl` (absolute `http(s)` URL)
  - `license`
  - `attribution`
- If those fields are missing, import fails.
- Add `--strict-mapping` to reject rows that do not map to internal `position.id` values.

## Research Sources Used For Position Expansion
- Mayo Clinic: Painful intercourse  
  `https://www.mayoclinic.org/symptoms/painful-intercourse/basics/definition/sym-20050639`
- AAFP (2021): Dyspareunia in Women  
  `https://www.aafp.org/pubs/afp/issues/2021/0515/p597.html`
- PubMed (2019): Pelvic floor rehabilitation and female sexual function  
  `https://pubmed.ncbi.nlm.nih.gov/31286158/`
- PubMed (2023): Sexual function in women with pelvic floor dysfunction  
  `https://pubmed.ncbi.nlm.nih.gov/37727447/`
- PubMed (2014): Male coital spine biomechanics  
  `https://pubmed.ncbi.nlm.nih.gov/24342991/`
- PubMed (2014): Female coital spine biomechanics  
  `https://pubmed.ncbi.nlm.nih.gov/24562134/`
- PubMed (2024): Sexual disability in low back pain framework  
  `https://pubmed.ncbi.nlm.nih.gov/38200986/`
- Cleveland Clinic: Best sex positions for endometriosis  
  `https://health.clevelandclinic.org/best-sex-positions-for-endometriosis`
- MDPI (2025): Position recommendation framework for painful sex  
  `https://www.mdpi.com/1660-4601/22/4/550`
- NHS: Pain during sex  
  `https://www.nhs.uk/conditions/pain-during-sex/`
