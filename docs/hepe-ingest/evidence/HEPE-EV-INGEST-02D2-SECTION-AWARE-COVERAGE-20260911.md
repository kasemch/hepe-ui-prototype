# HEPE-EV-INGEST-02D2-SECTION-AWARE-COVERAGE-20260911

Evidence ID: `HEPE-EV-INGEST-02D2-SECTION-AWARE-COVERAGE-20260911`
Evidence Type: Test / Regression Evidence
Source: exact Source-B raw PDF binary + section-aware parser execution
Version/Date: HEPE-INGEST-02D.2 / 2026-09-11
Authority/Owner: Project Owner / authorized HEPE-INGEST-MASTER-CONTINUATION-02D2-02F gate
Relevant Contract/Assertion: Source identity, C03 source course count, PLO source coverage, study-plan/mapping section isolation
Verification Status: **PASS WITH REMAINING FULL-ROUND-TRIP CONDITIONS**

## Expected
- exact Source-B binary identity remains stable;
- curriculum-course population must be taken from the controlled structural section, not global PDF code uniqueness;
- PLO1–PLO7 source block is identifiable without rewriting;
- study-plan and curriculum-mapping source blocks are separately bounded for subsequent normalization/round-trip.

## Actual
- SHA-256 = `f580fec8bb661181cbc0dff3c58473563c4b723f2dde5e863d91667ea4ec3557` — PASS
- physical pages = 157 — PASS
- programme code = `25510071103503` — PASS
- structural section physical pages 15–21 unique course codes = **92** — PASS / reconciles C03 source count
- Source-B exact PLO block physical pages 67–69 contains PLO1–PLO7 = **7/7** — PASS for source coverage
- study-plan block bounded by headings on physical pages 21–23 — PASS for section isolation
- study-plan raw code occurrences = 54 before choice-placeholder normalization; this is not yet equivalent to 54 normalized study-plan rows because source text also contains non-code choice requirements and a prerequisite cross-reference.
- curriculum-mapping block physical pages 103–108 contains 83 unique course codes with source checkmark relationships; the separately controlled I-R-M workbook identifies 99 approved pairs covering 78 courses. These are distinct semantics and must not be silently equated.

## Boundary / remaining conditions
This evidence closes the parser-coverage defect that caused the prior HOLD. It does **not** yet claim full C01–C24 closure. Remaining work is:
1. normalize the 54 study-plan records including HED_ELECTIVE / PE_ELECTIVE / COACH_REF_ELECTIVE / FREE_ELECTIVE semantics;
2. bind the 99 approved Course→PLO I-R-M pairs from the controlled mapping record without confusing them with raw PDF checkmark relationships;
3. execute complete staged database round-trip/read-back/rollback for the full Source-B candidate set and provenance.

Canonical activation/publication: NOT ATTEMPTED.
Production: NOT TOUCHED.
Audit Evidence admission: NOT ATTEMPTED.
PR merge: NOT ATTEMPTED.