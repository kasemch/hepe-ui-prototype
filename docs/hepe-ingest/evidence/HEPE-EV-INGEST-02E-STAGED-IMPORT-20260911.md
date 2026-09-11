# HEPE-EV-INGEST-02E-STAGED-IMPORT-20260911

Evidence ID: `HEPE-EV-INGEST-02E-STAGED-IMPORT-20260911`
Evidence Type: Test / Regression Evidence
Source: NON-PRODUCTION Supabase project `lztxpjsuzqvtgyasfnyj` + controlled Source-B candidate set
Version/Date: HEPE-INGEST-02E / 2026-09-11
Authority/Owner: Project Owner / HEPE-INGEST-MASTER-CONTINUATION-02D2B-02F authorization
Relevant Contract/Assertion: controlled staged curriculum import lifecycle
Verification Status: **PASS**

## Staged state
A dedicated additive staging contract was created by migration `hepe_ingest_02e_controlled_staging_batches`.

Retained Source-B import batch:
- source SHA = `f580fec8bb661181cbc0dff3c58473563c4b723f2dde5e863d91667ea4ec3557`
- programme = `25510071103503`
- version = `2567-SOURCEB-VALIDATION`
- import_state = `VALIDATION_ONLY`
- is_active = false
- is_published = false
- canonical_activation_attempted = false
- audit_evidence_admission_attempted = false

The validation curriculum itself remains DRAFT, `is_current=false`, `approved_at=NULL`, `activated_at=NULL`.

## Integrity read-back
- courses 92
- credit patterns 92
- course groups 16
- study plan 54 / 151 credits
- fake choice courses 0
- PLO 7
- approved Course→PLO I-R-M 99
- provenance gaps 0 for staged study-plan/I-R-M and Source-B generic binding counts complete

## Import lifecycle tests
1. Same source/version/hash replay: idempotency conflict key; duplicate inserted = 0.
2. Same programme/version with changed synthetic hash: classified `HUMAN_REVIEW` with `SAME_VERSION_DIFFERENT_HASH`; test record cleaned and residual = 0.
3. Partial-failure atomicity: a valid test candidate followed by an invalid `NOT_FOUND` candidate with fabricated normalized value raised the controlled check violation; subtransaction rolled back; residual candidates = 0.
4. Candidate `NOT_FOUND` semantics: read back as `NOT_FOUND` with `normalized_value=NULL`; rollback residual = 0.
5. Cross-programme Course→PLO negative: denied after integrity-guard repair; residual = 0.
6. Prior scoped RLS synthetic regression remains PASS for no-authority and cross-programme persona denial.

## Read-model preparation
`v_hepe_ingest_validation_summary` and `v_hepe_ingest_import_status` were created/secured with `security_invoker=true` so application reads preserve caller RLS rather than bypass it.

## Disposition
`HEPE-INGEST-02E = PASS` for controlled NON-PRODUCTION staged import validation.

No canonical activation/publication, Audit Evidence admission, Production action or PR merge was attempted.