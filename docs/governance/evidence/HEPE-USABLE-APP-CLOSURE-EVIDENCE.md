# HEPE USABLE-APP CLOSURE — TEST / REGRESSION EVIDENCE CANDIDATE

Status: NON-PRODUCTION ONLY / SYNTHETIC ONLY
Date: 2026-09-12
Branch: `feat/hepe-usable-app-closure-batch`
Application SHA under latest exact-head authenticated browser verification: `5c3f317094888946d11b43e0d963f79307f5cf77`
Supabase project: `lztxpjsuzqvtgyasfnyj` (NON-PRODUCTION)
Vercel deployment: `dpl_H85iPT72dzZkG2rjkRyr45mCfww1`

> This record is a controlled test-evidence candidate. Conversation text is not evidence. Admission into the final Audit Evidence Set remains subject to the HEPE Evidence Admission Requirement and closure authority review.

## Evidence register

### HEPE-EVD-UAC-001 — Exact-head build regression
- Evidence Type: Test / Regression Evidence
- Source: GitHub Actions run `34673814246`, job `103499965366`
- Version/Date: SHA `5c3f317094888946d11b43e0d963f79307f5cf77`, 2026-09-12
- Authority/Owner: HEPE controlled-pilot development scope; final evidence admission pending closure review
- Relevant Assertion: exact closure branch compiles and retains pilot-critical source/boundary assertions
- Expected: dependency install, Next.js build/type validity, source assertions, boundary summary = PASS
- Actual: all steps completed successfully
- Verification Status: PASS — VERIFIED SYSTEM TEST RESULT

### HEPE-EVD-UAC-002 — Exact-head Preview readiness
- Evidence Type: Verified System Evidence
- Source: Vercel deployment `dpl_H85iPT72dzZkG2rjkRyr45mCfww1`
- Version/Date: SHA `5c3f317094888946d11b43e0d963f79307f5cf77`, 2026-09-12
- Relevant Assertion: exact application SHA is deployable in Preview
- Expected: Preview state READY; no Production target
- Actual: READY; target null; branch `feat/hepe-usable-app-closure-batch`
- Verification Status: PASS

### HEPE-EVD-UAC-003 — Unauthenticated fail-closed browser acceptance
- Evidence Type: Test / Regression Evidence
- Source: GitHub Actions run `34673814280`, job `103499965541`, exact-head Preview `/pilot-entry?course=<synthetic-course-id>`
- Version/Date: SHA `5c3f317094888946d11b43e0d963f79307f5cf77`, 2026-09-12
- Expected: unauthenticated application state `AUTH_REQUIRED`
- Actual: marker `UNAUTH_PILOT_ENTRY_AUTH_REQUIRED_PASS`
- Verification Status: PASS

### HEPE-EVD-UAC-004 — Delivery RPC positive/negative authority regression
- Evidence Type: Test / Regression Evidence
- Source: Supabase regression + exact-head authenticated browser E2E
- Version/Date: 2026-09-12; RPC `public.hepe_pilot_record_delivery`
- Expected: synthetic PREPARER write ALLOW; NO_AUTHORITY DENY
- Actual: PREPARER browser POST/write/read = PASS; NO_AUTHORITY POST = DENY/403
- Verification Status: PASS

### HEPE-EVD-UAC-005 — Assessment evidence positive/negative authority regression
- Evidence Type: Test / Regression Evidence
- Source: Supabase regression + exact-head authenticated browser E2E
- Version/Date: 2026-09-12; RPC `public.hepe_pilot_record_assessment_evidence`
- Expected: synthetic PREPARER evidence creation ALLOW; NO_AUTHORITY DENY
- Actual: PREPARER browser POST→Evidence read = PASS; NO_AUTHORITY POST = DENY/403
- Verification Status: PASS

### HEPE-EVD-UAC-006 — Exact-head authenticated browser write→read propagation
- Evidence Type: Test / Regression Evidence
- Source: GitHub Actions run `34673814280`, job `103499965541`
- Version/Date: SHA `5c3f317094888946d11b43e0d963f79307f5cf77`, 2026-09-12
- Test Scope: temporary synthetic PREPARER_A and NO_AUTHORITY sessions; exact-SHA protected Preview; `/pilot-entry`, `/api/pilot-entry`, `/teaching`, `/evidence`
- Expected:
  - exact-SHA Preview match
  - PREPARER Quick Entry state VERIFIED
  - PREPARER delivery POST succeeds and authenticated readback is visible
  - PREPARER assessment-evidence POST succeeds and Evidence page displays created title
  - NO_AUTHORITY delivery/evidence POST denied
  - NO_AUTHORITY teaching read returns EMPTY
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
- Expected: all temporary synthetic users and created delivery/evidence records removed; actor subjects and authority counts restored
- Actual:
  - `HEPE_USABLE_APP_AUTH_RESIDUAL=0`
  - `HEPE_USABLE_APP_DELIVERY_RESIDUAL=0`
  - `HEPE_USABLE_APP_IDENTITY_RESTORE=PASS`
  - `HEPE_USABLE_APP_CLEANUP=PASS`
- Verification Status: PASS

## Current gate statement

BUILD = PASS
PREVIEW_EXACT_SHA = PASS
UNAUTH_FAIL_CLOSED = PASS
DB_WRITE_POSITIVE = PASS
DB_WRITE_NEGATIVE = PASS
AUTHENTICATED_BROWSER_WRITE_READ = PASS
NEGATIVE_BROWSER_AUTHORITY = PASS
CLEANUP = PASS
SYNTHETIC_UAT = PARTIAL PASS — remaining integrated scenarios are tracked separately
CONTROLLED_PILOT_READY = NOT YET DECLARED
PRODUCTION_AUTHORIZATION = NOT GRANTED
