# HEPE Evidence Candidate — WORKFLOW-04C

## Admission status
**EVIDENCE CANDIDATE ONLY — NOT ADMITTED TO AUDIT EVIDENCE SET**

Evidence Candidate ID: `HEPE-EVC-WORKFLOW-04C-20260912`
Evidence Type Candidate: Verified System Evidence + Test / Regression Evidence
Project: HEPE Curriculum Governance & Development
Environment: NON-PRODUCTION ONLY
Date: 2026-09-12
Authority/Owner: Human authority preserved under explicit HEPE-WORKFLOW-04C gate approval
Audit Evidence Admission: NOT AUTHORIZED / NOT ATTEMPTED

## Relevant assertions
1. Missing persistent entities for document/version and improvement backlog are created additively without rewriting the controlled curriculum baseline.
2. `improvement_items` preserves AI Recommendation ≠ Finding ≠ Approved Action.
3. `document_versions` are append-only in normal runtime.
4. Instructor document access is offering-assignment scoped.
5. Programme Chair document/improvement authority is programme scoped.
6. No-authority access fails closed.
7. Synthetic test state is cleaned to residual zero.

## Verified system evidence
Supabase project `lztxpjsuzqvtgyasfnyj` records migrations:
- `hepe_workflow_04c_document_improvement_persistent_foundation`
- `hepe_workflow_04c_document_version_cleanup_guard`

Created tables:
- `public.improvement_items`
- `public.document_records`
- `public.document_versions`

## NAT / regression results
- Assigned instructor document record insert: PASS.
- Assigned instructor document version insert: PASS using sequential runtime statements.
- Initial same-statement writable-CTE test for record+version produced an RLS failure because the child policy could not observe the newly inserted parent through the statement snapshot; this was classified as a harness/runtime-order issue, not silently treated as PASS. Sequential runtime behavior then passed.
- No-authority document insert against a known offering ID: DENY by RLS — PASS negative assertion.
- Programme Chair A4 improvement item insert: PASS.
- Document version update attempt: DENY with append-only trigger — PASS negative assertion.
- Mandatory cleanup initially exposed that the immutable child trigger also blocked cascade cleanup. A narrowly scoped postgres + `hepe.synthetic_cleanup=on` deletion path was added; authenticated runtime remains unable to update/delete document versions.
- Final cleanup residual: actors=0, authority=0, offering=0, document=0, improvement item=0.

## Scope limitations
- This gate establishes persistent schema and RLS foundation only.
- It does not claim full application runtime binding for document generation/export or Improvement Hub writes.
- No exact-SHA browser acceptance is claimed by this record.
- No full WCAG conformance claim.
- Department-wide cross-programme authority remains fail-closed pending controlled department binding.

## Boundary verification
- Production: NOT TOUCHED
- Real-user provisioning: NOT ATTEMPTED
- Permanent authority grant: NOT LEFT BEHIND
- Email/SMTP: NOT TOUCHED
- Secret change: NOT ATTEMPTED
- Canonical curriculum activation/publication: NOT ATTEMPTED
- PR merge: NOT ATTEMPTED
- Audit Evidence Admission: NOT ATTEMPTED

## Candidate verdict
`PASS WITH SCOPE LIMITATIONS — EVIDENCE CANDIDATE ONLY`
