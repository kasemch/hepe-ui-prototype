# HEPE Curriculum Ingestion — Completion Roadmap

Date: 2026-09-11
Environment: NON-PRODUCTION
Status: CONTROLLED REVIEW RECORD

## Verified current state

- PR #30 is OPEN / DRAFT / NOT MERGED.
- HEPE-INGEST-02B.3: Source-B binary/parser/source reconciliation PASS.
- HEPE-INGEST-02C.2: lossless contract/schema/RLS/regression design complete.
- HEPE-INGEST-02D: additive schema + scoped RLS implemented in NON-PRODUCTION.
- Synthetic regression: PASS WITH CONTROLLED REPAIR; rollback residual = 0.
- Source-B semantic dry-run: PASS WITH CONDITIONS / NO CANONICAL WRITE.
- Current database check after rollback: curriculum_versions=0, courses=0, curriculum_course_groups=0, study_plan_entries=0, curriculum_course_plo_mappings=0, Source-B programme rows=0.
- Seven new contract tables currently have 14 RLS policies in total.

## Completion assessment

For the HEPE Curriculum Ingestion foundation to be considered complete and ready for controlled integration, four major gates remain.

### Gate 1 — HEPE-INGEST-02D.1 Full Lossless Regression Closure

Complete the C01-C24 assertion matrix. Separate assertions already proven by system/test evidence from those still pending Source-B full candidate round-trip. No assertion is upgraded to PASS without executed evidence.

### Gate 2 — HEPE-INGEST-02D.2 Source-B Full Controlled Round-Trip Validation

Use the verified 157-page Source-B candidate dataset to validate all controlled programme/course/group/study-plan/PLO/I-R-M structures against the new contract. This remains NON-PRODUCTION and must not activate/publish the curriculum. Controlled-import validation may use transactional/staged rows with mandatory rollback or isolated candidate scope, but no canonical activation.

Mandatory closure targets include all 92 controlled courses, all source course groups/subgroups, all study-plan rows, PLO1-PLO7 and every approved Course→PLO I-R-M relationship available from the controlled comparison source.

### Gate 3 — HEPE-INGEST-03A Canonical Import & Human Admission Decision

Requires separate explicit authorization because this gate would allow retained canonical curriculum rows. Human verification, import approval, canonical write and Audit Evidence admission remain separate decisions. No activation/publication is implied by import.

### Gate 4 — HEPE-INGEST-03B Integration / Read-Model / UI / Reporting Acceptance

Bind admitted curriculum data to HEPE read models and application UI, then run regression for traceability, QA/AUN-QA/CPRR views, authority-aware access and provenance presentation. PR merge/deployment require their own authorization if reached.

## Overall project note

The four gates above complete the Curriculum Ingestion foundation, not the entire HEPE production programme. Full HEPE production completion additionally depends on application/runtime/authenticated preview closure, integrated UI/UAT, release governance and explicit Production Authorization.

## Current estimated position

Curriculum Ingestion foundation: approximately 75-80% complete by gate progression, with the remaining work concentrated in full Source-B round-trip validation, canonical admission, and application integration. This percentage is a planning estimate, not Audit Evidence.

Conversation remains CONTEXT only and is not Audit Evidence.