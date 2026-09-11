# HEPE-EV-INGEST-02D2B-IRM99-20260911

Evidence ID: `HEPE-EV-INGEST-02D2B-IRM99-20260911`
Evidence Type: Test / Regression Evidence
Source: Approved I-R-M controlled record + NON-PRODUCTION Supabase project `lztxpjsuzqvtgyasfnyj`
Version/Date: HEPE-INGEST-02D.2B / 2026-09-11
Authority/Owner: Project Owner / HEPE-INGEST-MASTER-CONTINUATION-02D2B-02F authorization
Relevant Contract/Assertion: Approved Course→PLO I-R-M 99-pair controlled binding
Verification Status: **PASS**

## Controlled source
- TDW binding gate: `TDW-01A.4R` — PASS.
- Approved I-R-M document ID: `QMS-OBE-IRM-BEdHPE-2567-APPROVED-01`.
- Binding rule: Course→PLO relationship follows controlled curriculum; I/R/M follows approved I-R-M; no inferred relationship added.

## Expected
- 99 approved pairs.
- 78 distinct mapped curriculum courses.
- I/R/M only.
- Approved M pairs = 18.
- zero orphan course and PLO references.
- staged rows remain DRAFT, not current, not approved, not activated.
- complete row-level provenance and idempotent replay.
- cross-programme PLO reference denied.

## Actual
Preflight resolution against validation curriculum:
- total pairs = 99
- mapped courses = 78
- orphan courses = 0
- orphan PLOs = 0
- I = 9
- R = 72
- M = 18

Database staged insert:
- inserted = 99
- status_code DRAFT = 99/99
- is_current = false = 99/99
- approved_at NULL = 99/99
- activated_at NULL = 99/99
- candidate_record_id distinct = 99
- provenance gaps = 0

PLO distribution read-back:
- PLO1: I2/R6/M1 = 9
- PLO2: I2/R6/M1 = 9
- PLO3: I4/R26/M8 = 38
- PLO4: I1/R20/M2 = 23
- PLO5: R7/M2 = 9
- PLO6: R4/M2 = 6
- PLO7: R3/M2 = 5

Idempotency replay inserted = 0; semantic row count remained 99.

Negative cross-programme test initially exposed a contract-integrity defect: independent foreign keys allowed a PLO from another programme. The test transaction was rolled back. Controlled additive repair migration `hepe_ingest_02d2b_mapping_scope_integrity_guard` added a trigger enforcing curriculum-version/course-version and programme/PLO scope consistency. Rerun denied the cross-programme mapping and residual negative rows = 0.

## Boundary
No curriculum activation/publication, Audit Evidence admission, IAM/authority change, Production action or PR merge was attempted.