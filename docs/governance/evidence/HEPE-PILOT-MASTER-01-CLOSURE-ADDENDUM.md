# HEPE-PILOT-MASTER-01 — Closure Addendum / Controlled UAT Package

Environment: **NON-PRODUCTION ONLY**  
Production: **NOT AUTHORIZED**  
Data: **SYNTHETIC PILOT DATA ONLY**

## New admitted evidence
| Evidence ID | Evidence Type | Source | Version / Date | Authority / Owner | Assertion | Verification Status |
|---|---|---|---|---|---|---|
| HEPE-PILOT-EVD-018 | Test / Regression Evidence | Supabase migration `20260911120336 hepe_pilot_iam_search_path_hardening` + Security Advisor | 2026-09-11 | Supabase | Three IAM functions received explicit controlled `search_path`; previous mutable-search-path WARN findings no longer appear | PASS |
| HEPE-PILOT-EVD-019 | Test / Regression Evidence | Direct transition-function regression | 2026-09-11 | Supabase/PostgreSQL | `CANDIDATE→INVITE_APPROVED=true`, invalid `CANDIDATE→ACTIVE=false`, `REVOKED→ACTIVE=false` after hardening | PASS |
| HEPE-PILOT-EVD-020 | Test / Regression Evidence | Supabase migration `20260911120411 hepe_pilot_assessment_read_rls` | 2026-09-11 | Supabase | Assessment SELECT policies added using established A0 authority model; RLS remained enabled; no write policy opened | PASS / READ FOUNDATION |
| HEPE-PILOT-EVD-021 | Test / Regression Evidence | Transaction-scoped authenticated persona SQL | 2026-09-11 | Supabase/PostgreSQL | PREPARER_A reads 2 synthetic learning activities + 1 assessment/version; NO_AUTHORITY reads 0 for same scoped objects | PASS |
| HEPE-PILOT-EVD-022 | Verified System Evidence | Synthetic pilot inventory | 2026-09-11 | Supabase/PostgreSQL | `SYN-HEPE-A` contains 1 pilot curriculum version, 2 courses, 2 outcomes, 2 activities, 1 delivery, 1 assessment, 1 evidence object, 1 finding, 1 improvement action; existing synthetic review-state fixtures retained | PASS |
| HEPE-PILOT-EVD-023 | Test / Regression Evidence | Synthetic fixture insertion attempt 1 | 2026-09-11 | Supabase/PostgreSQL | Invalid lifecycle `COMPLETED` rejected by FK; statement rolled back; residual check showed zero curriculum/course/activity fixture rows | PASS — FAIL-CLOSED TEST |
| HEPE-PILOT-EVD-024 | Test / Regression Evidence | Synthetic fixture insertion attempt 2 | 2026-09-11 | Supabase/PostgreSQL | Invalid assessment alignment `DIRECT` rejected by CHECK; statement rolled back | PASS — FAIL-CLOSED TEST |
| HEPE-PILOT-EVD-025 | Verified System Evidence | Final synthetic fixture | 2026-09-11 | Supabase/PostgreSQL | Controlled values only: lifecycle `ACTIVE`, assessment alignment `R`, activity-assessment relation `GENERATES`; positive delivery and intentional missing-delivery paths coexist | PASS |

## Finding disposition updates
### FND-002 — Assessment RLS policy gap
**Previous:** OPEN / default-deny gap.  
**Now:** **READ FOUNDATION CLOSED**. A0 SELECT-only policy has been added and positive/negative persona reads verified. Assessment mutation remains intentionally unopened and is not claimed as complete.

### FND-003 — IAM mutable search_path
**Now:** **CLOSED / PASS**. Explicit search paths applied via controlled Supabase migration and behavior regression remained unchanged.

### FND-004 — Comprehensive synthetic pilot dataset absent
**Now:** **CLOSED FOR PILOT DATA FOUNDATION / PASS**. Controlled synthetic pilot dataset exists under `SYN-HEPE-A`; no real institutional data was reused as synthetic evidence.

## Gate F — Synthetic Pilot Dataset
**Status: PASS — DATA FOUNDATION**

Synthetic dataset contains:
- synthetic programme and personas;
- one controlled synthetic curriculum version;
- multiple synthetic courses;
- PLO + CLO and CLO→PLO / I-R-M context;
- two learning activities;
- one recorded delivery positive case;
- one intentional no-delivery / missing-evidence case;
- one assessment/version and outcome link;
- one synthetic evidence object/version with verification limitation;
- existing review states including Draft, Submitted, Under Review, Ready for Decision and Approved;
- one synthetic finding;
- one linked improvement action;
- PREPARER_A and NO_AUTHORITY positive/negative RLS evidence.

This PASS is limited to dataset readiness. It is not an authenticated browser E2E PASS.

# Controlled Pilot UAT Package

## Persona set
- PREPARER_A — synthetic A2 PREPARER, programme `SYN-HEPE-A`
- REVIEWER_A — synthetic A3 REVIEWER, programme `SYN-HEPE-A`
- APPROVER_A — synthetic approver fixture where supported by existing workflow
- NO_AUTHORITY — synthetic negative persona, no authority assignment

No real person is a UAT identity.

## Scenario 1 — Instructor / preparer reviews assigned course and teaching plan
**Precondition:** authenticated synthetic PREPARER_A.  
**Target:** Programme → synthetic curriculum → SYNHPE101 → Learning & Teaching.  
**Expected:** two activities visible; no cross-authority bypass; non-production label visible.

## Scenario 2 — Teaching and assessment evidence context
**Target:** SYN-LA01 / SYN-AS01.  
**Expected:** planned hours, CLO link, assessment link and one recorded delivery visible.  
**Boundary:** current pilot surface is read-only. No claim is made that browser-based record creation is complete.

## Scenario 3 — Plan vs Actual
**Expected positive case:** SYN-LA01 shows recorded delivery and controlled links, but remains conservative (`PARTIALLY ALIGNED`) until complete sufficiency evidence exists.  
**Expected exception case:** SYN-LA02 has no delivery and must display `NO EVIDENCE` rather than infer completion.

## Scenario 4 — Reviewer checks alignment and evidence
**Expected:** reviewer can inspect controlled review/evidence context according to current read models. Human review is authoritative; AI cannot approve.

## Scenario 5 — Programme status
**Expected:** Command Center links to Learning & Teaching, Assessment and Plan vs Actual and remains clearly NON-PRODUCTION.

## Scenario 6 — QA evidence gap
**Expected:** synthetic finding `SYN-FND-PILOT-01` represents intentional missing delivery evidence and is linked to an improvement action.

## Scenario 7 — Negative access
**Persona:** NO_AUTHORITY.  
**Expected:** zero synthetic Learning Activity / Assessment rows under authenticated RLS; governed surfaces fail closed.

## UAT capture fields
For each scenario record:
- Scenario ID
- Persona
- Source commit SHA
- Exact Preview deployment ID
- Expected result
- Actual result
- PASS / FAIL
- Evidence reference
- Usability observation
- Permission failure, if any
- Defect priority if verified

Informal comments remain `OBSERVATION` until admitted under HEPE Evidence Admission Rule.

## Current closure boundary
Gate L package is **PREPARED**, not executed. Browser UAT and new-surface authenticated E2E remain blocked until an exact pilot Preview can be deployed. The current Vercel build-rate limit must not be misclassified as application build failure.
