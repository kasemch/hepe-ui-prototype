# HEPE-EV-INGEST-02D-SYNTHETIC-REGRESSION-20260911

Evidence ID: `HEPE-EV-INGEST-02D-SYNTHETIC-REGRESSION-20260911`
Evidence Type: Test / Regression Evidence
Source: Supabase NON-PRODUCTION project `lztxpjsuzqvtgyasfnyj`
Version/Date: HEPE-INGEST-02D / 2026-09-11
Authority/Owner: Project Owner / Explicit HEPE-INGEST-02D Human Schema Modification Authorization
Relevant Contract/Assertion: synthetic migration, scoped RLS, rollback, lossless representation foundation
Verification Status: PASS WITH CONTROLLED REPAIR

## Test scope

Transactional synthetic fixture on programme `SYN-HEPE-A` using PREPARER_A, NO_AUTHORITY and REVIEWER_B personas. No real curriculum activation/publication. Synthetic rows were rolled back.

## Expected

- PREPARER_A may create scoped lossless structures for programme A.
- raw credit notation remains exact.
- academic-period wording remains exact without invented Gregorian date.
- elective/choice semantics remain non-course placeholders.
- Course→PLO I-R-M is represented directly without synthetic CLO creation.
- NO_AUTHORITY cannot read/write scoped rows.
- REVIEWER_B cannot write programme A rows.
- rollback leaves zero synthetic residual rows.

## Actual

Initial run: FAIL at `academic_periods` insert because the first RLS design lacked programme scope. No synthetic transaction committed.

Controlled repair: migration `20260911111230_hepe_ingest_02d_academic_period_scope_repair` added required `programme_id` and programme-scoped A0/A1 RLS.

Rerun: completed successfully through positive inserts, negative RLS checks and rollback.

Rollback verification returned:
- residual curriculum version = 0
- residual credit pattern = 0
- residual course group = 0
- residual study plan entries = 0
- residual Course→PLO mapping = 0

Unauthorized synthetic rows created after negative checks = 0 within the executed transaction.

## Boundary

This evidence supports NON-PRODUCTION schema/RLS/synthetic regression only. It does not prove Source-B canonical import, production readiness, canonical activation, or Audit Evidence admission.