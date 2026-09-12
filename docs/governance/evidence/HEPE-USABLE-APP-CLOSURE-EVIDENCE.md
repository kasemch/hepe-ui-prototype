# HEPE USABLE-APP CLOSURE — TEST / REGRESSION EVIDENCE CANDIDATE

Status: NON-PRODUCTION ONLY / SYNTHETIC ONLY
Date: 2026-09-12
Branch: `feat/hepe-usable-app-closure-batch`
Application SHA under exact-head browser/build verification: `a21c3477a5b7c9db22302c7d239a9a5daa9842b7`
Supabase project: `lztxpjsuzqvtgyasfnyj` (NON-PRODUCTION)
Vercel deployment: `dpl_G1c9rSHiscCGXUiuqLj9GY1LNuNG`

> This record is a controlled test-evidence candidate. Conversation text is not evidence. Admission into the final Audit Evidence Set remains subject to the HEPE Evidence Admission Requirement and closure authority review.

## Evidence register

### HEPE-EVD-UAC-001 — Exact-head build regression
- Evidence Type: Test / Regression Evidence
- Source: GitHub Actions run `34671130703`, job `103492560528`
- Version/Date: SHA `a21c3477a5b7c9db22302c7d239a9a5daa9842b7`, 2026-09-12
- Authority/Owner: HEPE controlled-pilot development scope; final evidence admission pending closure review
- Relevant Assertion: exact closure branch compiles and retains pilot-critical source/boundary assertions
- Expected: dependency install, Next.js build/type validity, source assertions, boundary summary = PASS
- Actual: all steps completed successfully
- Verification Status: PASS — VERIFIED SYSTEM TEST RESULT

### HEPE-EVD-UAC-002 — Exact-head Preview readiness
- Evidence Type: Verified System Evidence
- Source: Vercel deployment `dpl_G1c9rSHiscCGXUiuqLj9GY1LNuNG`
- Version/Date: SHA `a21c3477a5b7c9db22302c7d239a9a5daa9842b7`, 2026-09-12
- Relevant Assertion: exact application SHA is deployable in Preview
- Expected: Preview state READY; no Production target
- Actual: READY; target null; branch `feat/hepe-usable-app-closure-batch`
- Verification Status: PASS

### HEPE-EVD-UAC-003 — Unauthenticated My Courses fail-closed browser smoke
- Evidence Type: Test / Regression Evidence
- Source: exact-head Vercel Preview `/my-courses`
- Version/Date: SHA `a21c3477a5b7c9db22302c7d239a9a5daa9842b7`, 2026-09-12
- Expected: HTTP 200 application shell; authenticated state `AUTH_REQUIRED`; NON-PRODUCTION / TEST DATA ONLY boundary visible
- Actual: HTTP 200; `AUTH_REQUIRED`; boundary visible
- Verification Status: PASS

### HEPE-EVD-UAC-004 — Delivery RPC positive authority regression
- Evidence Type: Test / Regression Evidence
- Source: Supabase SQL transaction using authenticated synthetic PREPARER subject `10000000-0000-0000-0000-000000000001`
- Version/Date: 2026-09-12; RPC `public.hepe_pilot_record_delivery`
- Test Scope: learning activity version `45be0ddc-a7bd-47e4-a3b7-8377d64c6826`; AY 2569; term 1; synthetic date 2026-09-12
- Expected: PREPARER-authorized synthetic write returns a delivery UUID
- Actual: returned delivery UUID `e7e710bd-88d5-4ed5-ba6d-9fc26bcd8b36`
- Cleanup: transaction ROLLBACK
- Verification Status: PASS

### HEPE-EVD-UAC-005 — Delivery RPC negative authority regression
- Evidence Type: Test / Regression Evidence
- Source: Supabase SQL transaction using synthetic NO_AUTHORITY subject `10000000-0000-0000-0000-000000000006`
- Version/Date: 2026-09-12
- Expected: direct write denied
- Actual: PostgreSQL 42501 / `PREPARER_AUTHORITY_REQUIRED`
- Verification Status: PASS — DENY AS EXPECTED

### HEPE-EVD-UAC-006 — Assessment evidence RPC positive authority regression
- Evidence Type: Test / Regression Evidence
- Source: Supabase SQL transaction using authenticated synthetic PREPARER subject
- Version/Date: 2026-09-12; RPC `public.hepe_pilot_record_assessment_evidence`
- Test Scope: assessment version `e2887275-f281-49d7-a924-ba4ca878c6f6`
- Expected: PREPARER-authorized synthetic evidence creation succeeds
- Actual: evidence object `d338c229-90cb-4468-b6fb-4fab227c7234`; evidence version `e4640e82-87e5-40b0-aec8-2305dd1037e1`
- Cleanup: transaction ROLLBACK
- Verification Status: PASS

### HEPE-EVD-UAC-007 — Assessment evidence negative authority regression
- Evidence Type: Test / Regression Evidence
- Source: Supabase SQL transaction using synthetic NO_AUTHORITY subject
- Version/Date: 2026-09-12
- Expected: direct evidence creation denied
- Actual: PostgreSQL 42501 / `PREPARER_AUTHORITY_REQUIRED`
- Verification Status: PASS — DENY AS EXPECTED

### HEPE-EVD-UAC-008 — Mandatory cleanup / residual check
- Evidence Type: Test / Regression Evidence
- Source: Supabase post-rollback residual query
- Version/Date: 2026-09-12
- Expected: no synthetic test delivery/evidence persists from the closure regression
- Actual: `delivery_residual=0`; `evidence_residual=0`
- Verification Status: PASS

## Remaining HOLD

### HEPE-EVD-UAC-H01 — Exact-head authenticated browser write→read propagation
- Required Assertion: authenticated PREPARER browser session writes through `/api/pilot-entry`, then the created synthetic record is visible through Teaching / Plan vs Actual / Evidence read models; NO_AUTHORITY browser POST is denied; all temporary auth identities and records are cleaned.
- Current Status: HOLD
- Reason: available connector safety controls block modification of the existing synthetic-identity GitHub Actions harness. Database authority/write behavior is independently PASS, but this does not substitute for exact-head authenticated browser E2E.

## Current gate statement

BUILD = PASS
PREVIEW_EXACT_SHA = PASS
UNAUTH_FAIL_CLOSED = PASS
DB_WRITE_POSITIVE = PASS
DB_WRITE_NEGATIVE = PASS
CLEANUP = PASS
AUTHENTICATED_BROWSER_WRITE_READ = HOLD
CONTROLLED_PILOT_READY = NOT DECLARED
PRODUCTION_AUTHORIZATION = NOT GRANTED
