# HEPE-EV-INGEST-02D2-STUDYPLAN-ROUNDTRIP-20260911

Evidence ID: `HEPE-EV-INGEST-02D2-STUDYPLAN-ROUNDTRIP-20260911`
Evidence Type: Test / Regression Evidence
Source: Source-B PDF + HEPE NON-PRODUCTION Supabase `lztxpjsuzqvtgyasfnyj`
Version/Date: HEPE-INGEST-02D.2 / 2026-09-11
Authority/Owner: Project Owner / HEPE-INGEST-MASTER-CONTINUATION-02D2-02F authorization
Relevant Contract/Assertion: C06, C07, C12, C23 and Source-B study-plan round-trip
Verification Status: PASS — STUDY-PLAN SUBSCOPE / FULL 02D.2 STILL HOLD

## Scope

Normalize the Source-B section `3.1.4 แผนการศึกษา` into 54 logical plan entries, preserve choice/elective placeholders without fake course creation, stage the records against the existing validation-only curriculum version, read them back, verify integrity/provenance, then clean up the staged study-plan rows.

## Controlled source identity

- Source document: `HEPE-SRC-BED-HPE-2567-MKO2-01`
- SHA-256: `f580fec8bb661181cbc0dff3c58473563c4b723f2dde5e863d91667ea4ec3557`
- Programme code: `25510071103503`
- Study-plan source scope: physical PDF pages 21–23

## Expected

- 54 logical study-plan rows.
- Total plan credits = 151.
- Choice semantics remain `CHOICE_GROUP`.
- No `CHOICE_GROUP` row may point to a concrete curriculum course.
- Every staged row carries source_document_id, source_page, source_locator, raw_excerpt_hash, ingestion_batch_id and candidate_record_id.
- Cleanup leaves zero staged study-plan rows for the validation curriculum version.

## Actual

Database read-back returned:

- curriculum courses = 92
- credit-pattern rows = 92
- curriculum course groups = 16
- choice pools after controlled cleanup = 9
- PLO rows = 7
- staged study-plan rows = 54
- staged study-plan credit sum = 151
- fake concrete-course links on CHOICE_GROUP rows = 0
- study-plan provenance gaps = 0
- Course→PLO I-R-M rows = 0 (remaining gate blocker)

Credit-pattern read-back retained the Source-B raw notations, including spacing variants and special practicum forms. The 92 rows distribute across the raw forms corresponding to `3(3-0-6)`, `2(1-2-3)`, `3(2-2-5)`, `6(270)`, `1(45)`, `1(0-2-1)` and `2(2-0-4)` without semantic coercion.

A pre-existing validation-only choice-pool row named `กลุ่มวิชาพลศึกษาเลือก ภาคฤดูร้อน ปี 3` was found in the same 02D.2 ingestion batch. Source-B contains no such study-plan period. Because it was an unreferenced validation fixture from this controlled batch, it was removed as test cleanup before the 54-row run. No institutional/active record was deleted.

Cleanup after read-back returned:

- residual staged study-plan rows = 0

## Controlled comparison

The normalized 54-row candidate is materialized at:
`docs/hepe-ingest/candidates/HEPE-INGEST-02D2-SOURCEB-STUDYPLAN-54-20260911.json`

Controlled master-data comparison sources independently describe 54 study-plan records and 151 total credits. They are comparison records only; Source-B remains the provenance source for this round-trip.

## Remaining 02D.2 blocker

The approved Course→PLO I-R-M control record states 99 approved pairs covering 78 courses. The row-level 99-pair payload has not yet been materialized into the current execution workspace/database. The database therefore correctly remains at `irm_pairs = 0` and C09/C10 must not be marked PASS.

HEPE-INGEST-02D.2 therefore remains `HOLD — I-R-M FULL ROW PAYLOAD / STAGED ROUND-TRIP PENDING`.

## Boundary

No Production action, curriculum activation/publication, IAM/authority change, Audit Evidence admission, baseline freeze or PR merge was attempted.
