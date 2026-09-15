# HEPE HD-07B — Baseline Promotion Execution Record

Status: CONTROLLED NON-PRODUCTION RECORD / NOT PRODUCTION AUTHORIZATION / NOT AUDIT EVIDENCE
Date: 2026-09-15

## Authorized scope
Explicit Human Decision authorized promotion of curriculum version `2567-SOURCEB-VALIDATION` to a controlled NON-PRODUCTION baseline and final regression. This authorization did not include Production deployment/authorization or Audit Evidence admission.

## Target
- Programme ID: `69e3361e-b342-43e1-b386-ac73b191b9a4`
- Curriculum Version ID: `a77345fe-62ab-4189-847b-29ebc0689ee6`
- Stable version code retained: `2567-SOURCEB-VALIDATION`
- Prior state: `DRAFT`, `is_current=false`, `approved_at=null`, `activated_at=null`

## Promotion result
Applied transactionally with fail-closed preconditions:
- provenance bindings for target programme had to equal 363 `SOURCE_VERIFIED` records
- no other current curriculum version could exist for the programme
- exact target UUID/programme/version code/prior lifecycle state had to match

Post-promotion state:
- curriculum status: `ACTIVE`
- `is_current=true`
- label: `หลักสูตรปรับปรุง พ.ศ. 2567 — CONTROLLED NON-PRODUCTION BASELINE`
- `approved_at` and `activated_at` populated at the promotion transaction
- programme-level status intentionally remains `DRAFT` because programme promotion was outside HD-07B scope
- version code and UUID retained to preserve traceability and provenance bindings

## Regression readback
- courses: 92
- course groups: 16
- Course→PLO/I-R-M mappings: 99
- study-plan rows: 54
- provenance bindings: 363 / 363 `SOURCE_VERIFIED`
- other current curriculum versions for programme: 0
- target programme active authority assignments: 3
- authority assignments: 13 total records / 11 ACTIVE / 2 synthetic inactive fixtures (`EXPIRED`, `REVOKED`)
- critical S5 authority-binding RPC generic authenticated EXECUTE: false
- `v_hepe_mkor_workspace_v1` security_invoker: true
- Security Advisor residual populations unchanged: 62 RLS-enabled/no-policy review population; 23 authenticated SECURITY DEFINER review population; leaked-password protection WARN remains due plan limitation with human-approved compensating password controls

## Boundary assertions
- Production deployment: NOT PERFORMED
- Production Authorization: NO
- Programme promotion: NOT PERFORMED
- Audit Evidence Admission: NOT PERFORMED / NOT_ADMITTED
- IAM/authority mutation by HD-07B: NONE

## Gate outcome
`HD07B_NONPROD_BASELINE_PROMOTION_PASS_WITH_RESIDUAL_SECURITY_RISK_ALREADY_CLASSIFIED`

The controlled NON-PRODUCTION curriculum baseline is active/current within the sandbox. A separate HD-08 Human Decision is required before any Production authorization. HD-09 Audit Evidence Admission remains separate.