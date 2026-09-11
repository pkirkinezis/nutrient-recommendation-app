# Supplement evidence audit — September 2026

## Scope and method

This pass prioritized claims most likely to cause harm or materially mislead a recommendation: quantified outcomes, fertility claims, routine megadoses, absolute efficacy language, and interaction advice. It reviewed the corresponding records in `src/data/supplements.ts` against authoritative evidence summaries and regulatory scientific opinions.

This is a targeted audit, not a certification of all 143 records. An evidence label applies to a stated use, population, preparation, and outcome—not to every benefit attached to an ingredient. Future work should migrate every record to per-goal evidence and attach a source to each clinical claim.

## Corrections made

| Record | Problem found | Correction |
| --- | --- | --- |
| Ashwagandha | A fixed cortisol percentage, broad “strong” evidence, hormone/performance promises, unsupported cycling/anhedonia advice, and reproductive recommendation tags overstated small heterogeneous trials. | Downgraded to limited; confined possible benefit and recommendation goals to modest stress/sleep effects; added short-term, liver, thyroid, pregnancy, and surgery cautions. |
| Green tea / matcha | The range extended to 800mg EGCG without making clear that this is the dose at which liver-enzyme elevations have been observed. | Separated beverages from extracts and advised against self-prescribing high-dose EGCG. |
| Vitamin B12 | Routine 1,000–5,000mcg dosing, methylcobalamin superiority, sublingual superiority, and an energy promise were presented as general facts. | Added adult requirements, deficiency-specific treatment context, equivalent route/form evidence, and the distinction between correcting deficiency and boosting energy. |
| Vitamin C | Recommended 500–2,000mg to everyone and suggested taking more during illness. | Replaced this with RDAs and the 2,000mg adult upper limit; clarified the modest prevention-versus-treatment cold evidence. |
| Vitamin K2 | Said K2 prevents arterial calcification and “does not affect blood clotting like K1.” | Removed prevention claims, supplied total-vitamin-K adequate intakes, and clearly stated K2 can interfere with vitamin K antagonist anticoagulants. |
| Astaxanthin | “6,000x stronger than vitamin C” translated an in-vitro comparison into a human-health claim. | Identified this as a laboratory comparison and made human skin, eye, UV, and exercise outcomes explicitly preliminary. |
| Vitex | Claimed a 26–36% pregnancy-rate improvement, ovulation/progesterone effects, strong fertility evidence, and carried fertility recommendation tags. | Removed the quantified promise and fertility tags, downgraded evidence to limited, retained only cautious PMS wording, and explicitly excluded unsupported fertility intents from recommendation matching. |
| Red clover | Presented estrogen balance, cervical mucus, and uterine support as established fertility benefits and carried fertility recommendation tags. | Marked these outcomes unproven, removed fertility tags, downgraded evidence, strengthened reproductive/hormone-sensitive cautions, and explicitly excluded unsupported fertility intents from recommendation matching. |
| L-carnitine | Promised a 30–40% sperm-motility improvement and DNA-fragmentation benefit. | Replaced the percentage with mixed semen-parameter evidence and noted uncertainty for pregnancy and live birth. |

## Sources used

- [NCCIH: Ashwagandha](https://www.nccih.nih.gov/health/ashwagandha)
- [NCCIH: Chasteberry](https://www.nccih.nih.gov/health/chasteberry)
- [NCCIH: Red Clover](https://www.nccih.nih.gov/health/red-clover)
- [NIH ODS: Vitamin B12 fact sheet for health professionals](https://ods.od.nih.gov/factsheets/VitaminB12-HealthProfessional/)
- [NIH ODS: Vitamin C fact sheet for health professionals](https://ods.od.nih.gov/factsheets/VitaminC-HealthProfessional/)
- [NIH ODS: Vitamin K fact sheet for health professionals](https://ods.od.nih.gov/factsheets/VitaminK-HealthProfessional/)
- [EFSA scientific opinion on green tea catechins](https://doi.org/10.2903/j.efsa.2018.5239)

## Remaining high-priority audit work

1. Split the record-level `evidence` value into `goalEvidence` for every claimed outcome.
2. Review every fertility stack for live-birth or clinical-pregnancy outcomes rather than surrogate hormone or semen outcomes.
3. Remove remaining absolute marketing language such as “detox,” “powerful,” “proven,” and fixed percentage improvements unless a cited source supports the exact preparation and population.
4. Validate every dose against life stage, deficiency status, formulation, duration, and established upper limits.
5. Add a source and last-reviewed date to each record; flag records without either during CI.

The application should continue to state that it provides educational information, not diagnosis or individualized treatment. Pregnancy, infertility, liver disease, anticoagulant use, and suspected nutrient deficiency require clinician review.
