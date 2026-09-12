# HEPE Evidence Candidate — WORKFLOW-04B.5→04B.6 Runtime Binding & Regression

## Admission Status
**EVIDENCE CANDIDATE ONLY — NOT ADMITTED TO AUDIT EVIDENCE SET**

Date: 2026-09-12
Environment: NON-PRODUCTION ONLY
Application subject SHA: `f8f2d8de3e12fde1beeae77224458b0f74f0f3c2`
Branch: `feat/hepe-academic-workflow-03-exec`
Authority: Human authority preserved; no Production or Audit Evidence Admission authority exercised.

## Scope
1. Bind authenticated Document runtime API through existing Supabase session and RLS.
2. Bind authenticated Improvement runtime API through existing Supabase session and RLS.
3. Expose runtime-bound state in Document Center and Curriculum Improvement Hub.
4. Preserve fail-closed boundaries: no unauthenticated write, no canonical curriculum mutation, no AI approval authority, no automatic Audit Evidence Admission.

## Runtime Contracts
### Documents
- `GET /api/workflow-documents` reads only RLS-authorized `document_records`.
- `POST /api/workflow-documents` creates DRAFT records only when database RLS permits the current actor/scope.
- PDF/Word binary generation remains unconnected.

### Improvements
- `GET /api/workflow-improvements` reads only RLS-authorized `improvement_items`.
- `POST /api/workflow-improvements` creates `RECOMMENDATION_CANDIDATE` only when RLS permits programme/offering scope.
- Recommendation creation does not modify controlled curriculum baseline and does not constitute approval.

## Verification
### GitHub Quality
Workflow: `HEPE Academic Workflow 03 Quality`
Run ID: `34698667088`
Subject SHA: `f8f2d8de3e12fde1beeae77224458b0f74f0f3c2`
Actual: COMPLETED / SUCCESS.
Verification status: PASS for static TypeScript/build/governance-boundary regression.

### Vercel exact-SHA
No exact-SHA Vercel Preview for subject SHA `f8f2d8de...` was available at verification time. The latest observed Preview remained an earlier commit. Therefore browser/runtime Preview acceptance is **NOT CLAIMED** and older Preview evidence is not substituted.

## Prior database NAT dependency
04C established `document_records`, `document_versions`, `improvement_items` and verified RLS with synthetic personas and cleanup residual=0. 04B established TQF5/result/calendar/timeline/verification/improvement-action RLS foundations. Those prior candidates remain separate and are not automatically admitted as Audit Evidence.

## Boundary Verification
- Production deployment: NOT ATTEMPTED
- PR merge: NOT ATTEMPTED
- Real-user provisioning: NOT ATTEMPTED
- Permanent authority grant: NOT ATTEMPTED
- Email/SMTP/notification send: NOT ATTEMPTED
- Secret change: NOT ATTEMPTED
- Canonical curriculum activation/publication: NOT ATTEMPTED
- Audit Evidence Admission: NOT ATTEMPTED
- AI academic authority: NOT GRANTED

## Candidate Verdict
`PASS WITH EXACT-PREVIEW LIMITATION — EVIDENCE CANDIDATE ONLY`

Controlled Pilot Closure cannot claim exact-SHA browser/runtime acceptance until an exact Preview for the application subject SHA (or a later verified application SHA containing the same changes) is available and tested.
