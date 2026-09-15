# HEPE HD-08 Programme-Level Production Activation — Execution Record

Status: CONTROLLED RECORD / PRE-DEPLOYMENT / NOT DEPLOYMENT AUTHORIZATION / NOT AUDIT EVIDENCE

## Authorization scope
Human approval authorized programme-level activation from DRAFT to a production-governed state, followed by final regression before deployment. This authorization did not itself authorize deployment and did not authorize Audit Evidence admission.

## Target
- Programme ID: `69e3361e-b342-43e1-b386-ac73b191b9a4`
- Programme code: `25510071103503`
- Curriculum version ID: `a77345fe-62ab-4189-847b-29ebc0689ee6`
- Curriculum version code: `2567-SOURCEB-VALIDATION`

## Executed change
Guarded transactional update changed programme status from `DRAFT` to `ACTIVE` only after verifying the linked curriculum baseline was `ACTIVE`, `is_current=true`, and had populated `approved_at` and `activated_at`.

No Production deployment, PR merge, IAM change, authority creation, schema DDL, or Audit Evidence admission was performed.

## Final regression readback
- Programme status: ACTIVE
- Curriculum status: ACTIVE
- Curriculum is_current: true
- Total authority assignments: 13
- ACTIVE authority assignments: 11
- Target programme ACTIVE authority assignments: 3
- Provenance bindings: 363
- Provenance SOURCE_VERIFIED: 363
- Other current curriculum versions for programme: 0
- Critical S5 authority-binding RPC executable by authenticated: false
- `v_hepe_mkor_workspace_v1` security_invoker: true
- Exact application SHA: `435dbdd6786663d9cd9523bea2fc0bbeae509152`
- GitHub workflows associated with exact SHA: HEPE-INGEST-02A Synthetic Parser Acceptance = success; HEPE Copilot Governance Check = success; HEPE Controlled Pilot 03 Quality = success
- Vercel runtime errors in selected 12-hour range: none found

## Residual known controls
- RLS-enabled/no-policy tables remain a review population; fail-closed posture must not be weakened merely to silence advisor notices.
- Public authenticated SECURITY DEFINER functions remain a reviewed intentional population; no blanket revoke is authorized.
- Supabase leaked-password protection remains unavailable on current plan; human-approved password-strength compensating controls remain user-confirmed but not connector-readback verified.
- Real-human protected-preview browser session correlation remains NOT_PROVEN; alternative exact-SHA acceptance contract remains PASS WITH EVIDENCE LIMITATION.

## Gate result
Programme-level activation: PASS
Pre-deployment final regression: PASS WITH KNOWN LIMITATIONS
Production deployment: NOT PERFORMED / REQUIRES SEPARATE EXPLICIT DEPLOYMENT AUTHORIZATION
Audit Evidence admission: NOT_ADMITTED
