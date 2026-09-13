# HEPE USABLE-APP CLOSURE — TEST / REGRESSION EVIDENCE CANDIDATE

Status: NON-PRODUCTION ONLY / SYNTHETIC ONLY
Date: 2026-09-12
Branch: `feat/hepe-usable-app-closure-batch`
Current closure head before this evidence-record update: `004aa2c7b3a4d22762aad10c8459ea26a1f3e8d6`
Supabase project: `lztxpjsuzqvtgyasfnyj` (NON-PRODUCTION)

> This record is a controlled test-evidence candidate. Conversation text is not evidence. Admission into the final Audit Evidence Set remains subject to the HEPE Evidence Admission Requirement and closure authority review.

## Evidence register

### HEPE-EVD-UAC-001 — Build regression
- Evidence Type: Test / Regression Evidence
- Source: GitHub Actions build-regression runs, including current-head run `34674264193`
- Version/Date: SHA `004aa2c7b3a4d22762aad10c8459ea26a1f3e8d6`, 2026-09-12
- Authority/Owner: HEPE controlled-pilot development scope; final evidence admission pending closure review
- Relevant Assertion: closure branch compiles and retains pilot-critical source/boundary assertions
- Expected: dependency install, Next.js build/type validity, source assertions, responsive/accessibility assertions, boundary summary = PASS
- Actual: all steps completed successfully
- Verification Status: PASS — VERIFIED SYSTEM TEST RESULT

### HEPE-EVD-UAC-002 — Last exact-SHA Preview with integrated UAT surface
- Evidence Type: Verified System Evidence
- Source: Vercel deployment `dpl_J6YKDPSNYKQwNkaKLP7vbFGrkbdM`
- Version/Date: SHA `48716d4d1899f5d97d279781443afc16ba98a5c2`, 2026-09-12
- Relevant Assertion: integrated UAT application SHA is deployable in Preview
- Expected: Preview state READY; no Production target
- Actual: READY; target null; branch `feat/hepe-usable-app-closure-batch`
- Verification Status: PASS for SHA `48716d4d...`

### HEPE-EVD-UAC-003 — Unauthenticated fail-closed browser acceptance
- Evidence Type: Test / Regression Evidence
- Source: GitHub Actions run `34673814280`, job `103499965541`
- Version/Date: SHA `5c3f317094888946d11b43e0d963f79307f5cf77`, 2026-09-12
- Expected: unauthenticated `/pilot-entry` application state `AUTH_REQUIRED`
- Actual: `UNAUTH_PILOT_ENTRY_AUTH_REQUIRED_PASS`
- Verification Status: PASS

### HEPE-EVD-UAC-004 — Delivery RPC positive/negative authority regression
- Evidence Type: Test / Regression Evidence
- Source: Supabase regression + exact-head authenticated browser E2E run `34673814280`
- Expected: synthetic PREPARER write ALLOW; NO_AUTHORITY DENY
- Actual: PREPARER browser POST/write/read PASS; NO_AUTHORITY delivery POST DENY/403
- Verification Status: PASS

### HEPE-EVD-UAC-005 — Assessment evidence positive/negative authority regression
- Evidence Type: Test / Regression Evidence
- Source: Supabase regression + exact-head authenticated browser E2E run `34673814280`
- Expected: synthetic PREPARER evidence creation ALLOW; NO_AUTHORITY DENY
- Actual: PREPARER browser POST→Evidence read PASS; NO_AUTHORITY evidence POST DENY/403
- Verification Status: PASS

### HEPE-EVD-UAC-006 — Exact-SHA authenticated browser write→read propagation
- Evidence Type: Test / Regression Evidence
- Source: GitHub Actions run `34673814280`, job `103499965541`; Vercel deployment `dpl_H85iPT72dzZkG2rjkRyr45mCfww1`
- Version/Date: SHA `5c3f317094888946d11b43e0d963f79307f5cf77`, 2026-09-12
- Actual markers:
  - `EXACT_SHA_PREVIEW_PASS`
  - `PREPARER_PILOT_ENTRY_VERIFIED_PASS`
  - `PREPARER_DELIVERY_BROWSER_WRITE_READ_PASS`
  - `PREPARER_EVIDENCE_BROWSER_WRITE_READ_PASS`
  - `NOAUTH_DELIVERY_DENY_PASS`
  - `NOAUTH_EVIDENCE_DENY_PASS`
  - `NOAUTH_BROWSER_RLS_EMPTY_PASS`
  - `HEPE_USABLE_APP_AUTH_WRITE_READ_E2E=PASS`
- Verification Status: PASS — VERIFIED SYSTEM TEST RESULT

### HEPE-EVD-UAC-007 — Mandatory cleanup / identity restore
- Evidence Type: Test / Regression Evidence
- Source: GitHub Actions run `34673814280`, job `103499965541`
- Actual:
  - `HEPE_USABLE_APP_AUTH_RESIDUAL=0`
  - `HEPE_USABLE_APP_DELIVERY_RESIDUAL=0`
  - `HEPE_USABLE_APP_IDENTITY_RESTORE=PASS`
  - `HEPE_USABLE_APP_CLEANUP=PASS`
- Verification Status: PASS

### HEPE-EVD-UAC-008 — Integrated synthetic UAT
- Evidence Type: Test / Regression Evidence
- Source: GitHub Actions run `34673967798` plus Vercel exact Preview `dpl_J6YKDPSNYKQwNkaKLP7vbFGrkbdM`; detailed matrix in `HEPE-USABLE-APP-SYNTHETIC-UAT.md`
- Version/Date: SHA `48716d4d1899f5d97d279781443afc16ba98a5c2`, 2026-09-12
- Verified results:
  - UAT-01 My Courses / Course Workspace = PASS
  - UAT-02 Quick Entry Teaching = PASS
  - UAT-03 Assessment Evidence = PASS
  - UAT-04 Plan vs Actual = PASS
  - UAT-05 Work-first / Programme continuity = PASS
  - UAT-06 Finding→Improvement = PASS WITH TEST-HARNESS NOTE
  - UAT-07 Negative access / fail-closed = PASS
- UAT-06 reconciliation: initial default-deny RLS gap on `findings` / `improvement_actions` was resolved by SELECT-only migration `hepe_usable_app_finding_improvement_read_rls`. Rerun verified programme-scoped reads for both REVIEWER_A and APPROVER_A. `/findings` exact Preview independently returned HTTP 200 and rendered Findings & Improvement. The remaining failed raw-string assertion was caused by HTML encoding `&` as `&amp;`, not by RLS/application failure.
- Verification Status: PASS_WITH_TEST_HARNESS_NOTE

### HEPE-EVD-UAC-009 — Secret / privileged-source boundary scan
- Evidence Type: Test / Regression Evidence
- Source: GitHub Actions Secret and Boundary Scan runs `34674216242` and current-head run `34674264200`
- Version/Date: current-head SHA `004aa2c7b3a4d22762aad10c8459ea26a1f3e8d6`, 2026-09-12
- Expected: no prohibited Supabase secret literal, service-role literal assignment, Vercel bypass literal assignment, private-key material, or privileged service-role usage in `app` / `lib`
- Actual: all scan steps PASS
- Verification Status: PASS

### HEPE-EVD-UAC-010 — Current-head Vercel deployment rate-limit blocker
- Evidence Type: Verified System Evidence / Reconciliation Item
- Source: GitHub commit status for SHA `004aa2c7b3a4d22762aad10c8459ea26a1f3e8d6`, context `Vercel`
- Version/Date: 2026-09-12
- Expected: exact-head Preview deployment created and READY so the final authenticated closure harness can verify `004aa2c7...`
- Actual: Vercel status = FAILURE with description `Deployment rate limited — retry in 24 hours.`
- Verification Status: BLOCKED_EXTERNAL_RATE_LIMIT
- Consequence: exact-SHA rule prohibits substituting the older READY Preview for the current head. Current-head `CONTROLLED_PILOT_READY` cannot be declared yet.

## Delta reconciliation after integrated UAT SHA

GitHub compare `48716d4d...` → `004aa2c7...` shows only three files changed:
1. `.github/workflows/hepe-usable-app-secret-scan.yml` — added closure scan;
2. `docs/governance/evidence/HEPE-USABLE-APP-SYNTHETIC-UAT.md` — evidence-record update;
3. `app/api/pilot-build-meta/route.ts` — one non-functional metadata field (`closureRevision`) added to force exact-head validation.

No teacher workflow, authority-write path, RLS application code, Teaching, Assessment, Plan-vs-Actual, Evidence, My Courses, or Course Workspace implementation changed in this delta. This reconciliation does not substitute for exact-head Preview verification; it only explains the current external blocker.

## Current gate statement

BUILD = PASS
SECRET_SCAN = PASS
UNAUTH_FAIL_CLOSED = PASS
DB_WRITE_POSITIVE = PASS
DB_WRITE_NEGATIVE = PASS
AUTHENTICATED_BROWSER_WRITE_READ = PASS on last verified functional exact SHA
NEGATIVE_BROWSER_AUTHORITY = PASS
RLS_FINDING_IMPROVEMENT = PASS
CLEANUP = PASS
SYNTHETIC_UAT = PASS_WITH_TEST_HARNESS_NOTE
CURRENT_HEAD_PREVIEW_EXACT_SHA = HOLD — VERCEL_DEPLOYMENT_RATE_LIMIT
CONTROLLED_PILOT_READY = HOLD
PR_MERGE = NOT AUTHORIZED / NOT ATTEMPTED
PRODUCTION_AUTHORIZATION = NOT GRANTED
