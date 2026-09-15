# HEPE-EV-INGEST-02D2-FULL-ROUNDTRIP-20260911

Evidence ID: `HEPE-EV-INGEST-02D2-FULL-ROUNDTRIP-20260911`
Evidence Type: Test / Regression Evidence
Source: Exact Source-B + approved I-R-M controlled record + NON-PRODUCTION Supabase `lztxpjsuzqvtgyasfnyj`
Version/Date: HEPE-INGEST-02D.2 / 2026-09-11
Authority/Owner: Project Owner / HEPE-INGEST-MASTER-CONTINUATION-02D2B-02F authorization
Relevant Contract/Assertion: complete lossless Source-B validation dataset and provenance
Verification Status: **PASS**

## Source identity
Source-B SHA-256: `f580fec8bb661181cbc0dff3c58473563c4b723f2dde5e863d91667ea4ec3557`
Programme code: `25510071103503`
Physical pages: 157
Total credits: 151
Effective academic period: `ภาคการศึกษาที่ 2 ปีการศึกษา 2567`

## Database read-back
Validation curriculum remains `DRAFT`, `is_current=false`, `approved_at=NULL`, `activated_at=NULL`, `effective_from=NULL`.

- Courses: 92/92
- Course credit patterns: 92/92
- Course groups: 16/16
- Study-plan rows: 54/54
- Study-plan credits: 151
- Fake choice-course links: 0
- PLO: 7/7
- Course→PLO I-R-M: 99/99
- Mapped I-R-M courses: 78
- M pairs: 18
- Study-plan provenance gaps: 0
- I-R-M provenance gaps: 0

A generic additive `curricular_provenance_bindings` contract was required because legacy base entities (`programmes`, `curriculum_versions`, `courses`, `outcomes`) do not carry ingestion provenance fields directly. Migration `hepe_ingest_02d2b_curricular_provenance_binding` added programme-scoped RLS and source binding without changing base entity semantics.

Source-B SHA bindings recorded:
- PROGRAMME 1
- CURRICULUM_VERSION 1
- ACADEMIC_PERIOD 1
- COURSE 92
- CREDIT_PATTERN 92
- COURSE_GROUP 16
- STUDY_PLAN_ENTRY 54
- PLO 7
- COURSE_PLO_IRM 99

For Course→PLO I-R-M, Source-B binding represents the curriculum relationship existence; the row itself separately retains approved I-R-M document ID `QMS-OBE-IRM-BEdHPE-2567-APPROVED-01` for I/R/M authority. No I/R/M value was inferred from PDF checkmarks.

## Disposition
`HEPE-INGEST-02D.2 = PASS`.

No canonical activation/publication, Audit Evidence admission, Production action or PR merge was attempted.