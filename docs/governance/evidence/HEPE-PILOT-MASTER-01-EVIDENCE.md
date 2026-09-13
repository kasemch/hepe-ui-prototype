# HEPE-PILOT-MASTER-01 — Controlled Evidence Record

Environment: **NON-PRODUCTION ONLY**  
Production Authorization: **NOT GRANTED**  
Real institutional/student/staff data ingestion: **NOT AUTHORIZED**  
PR merge authorization: **NOT GRANTED BY THIS RECORD**

## Evidence admission boundary
Conversation, brainstorming, progress estimates and AI summaries are not Audit Evidence. Only evidence with identified source, version/date, owner/authority, assertion and verification status is admitted below.

## Current controlled classification
- Existing HEPE-WEB-02 foundation: **CONTROLLED / RECONCILED PASS** based on its controlled record and independently verified successful regression.
- HEPE-PILOT-MASTER-01 pilot-critical source materialization: **BUILD VERIFIED / NON-PRODUCTION**.
- Controlled Pilot Ready: **HOLD**.
- Production: **NOT AUTHORIZED**.

## Evidence register
| Evidence ID | Evidence Type | Source | Version / Date | Authority / Owner | Relevant Contract / Assertion | Verification Status |
|---|---|---|---|---|---|---|
| HEPE-PILOT-EVD-001 | Verified System Evidence | GitHub repository/branch API | 2026-09-11 | GitHub / repository owner | Canonical repo `kasemch/hepe-ui-prototype`; controlled base branch `non-production` exists | PASS |
| HEPE-PILOT-EVD-002 | Verified System Evidence | GitHub PR #28 metadata | head `8998989830bcdb9298b07e4880b6d7f7cb4acb49`, 2026-09-11 | GitHub | REL-03/WEB-02 parent runtime branch and PR remain unmerged | PASS |
| HEPE-PILOT-EVD-003 | Verified System Evidence | Vercel deployment `dpl_PXqMw3ioKewA7oBFGbwyCKBvMvqT` | SHA `8998989830bcdb9298b07e4880b6d7f7cb4acb49`, 2026-09-11 | Vercel | Exact Git-associated PR #28 Preview is READY and NON-PRODUCTION | PASS |
| HEPE-PILOT-EVD-004 | Verified System Evidence | Vercel `/runtime` protected Preview response | 2026-09-11 | Vercel | Unauthenticated runtime is fail-closed and displays `AUTH_REQUIRED`; no privileged fallback | PASS |
| HEPE-PILOT-EVD-005 | Controlled Document / Record | `docs/governance/evidence/HEPE-WEB-02-EVIDENCE.md` | 2026-09-11 | HEPE repository controlled record | WEB-02 core academic read workflow, RLS agreement, cleanup and AI advisory boundary | PASS / RECONCILED |
| HEPE-PILOT-EVD-006 | Test / Regression Evidence | GitHub Actions run `34577727131` | 2026-09-11 | GitHub Actions | WEB-02R.1 integrated PREPARER_A / NO_AUTHORITY regression and cleanup | PASS |
| HEPE-PILOT-EVD-007 | Verified System Evidence | Supabase project inventory | 2026-09-11 | Supabase | HEPE project `lztxpjsuzqvtgyasfnyj` is ACTIVE_HEALTHY | PASS |
| HEPE-PILOT-EVD-008 | Verified System Evidence | PostgreSQL `pg_tables` inspection | 2026-09-11 | Supabase/PostgreSQL | Public HEPE tables inspected have RLS enabled | PASS for assertion inspected |
| HEPE-PILOT-EVD-009 | Controlled Document / Record | commits `60944d2`, `676e851`, `1706707`, `4423edc` | 2026-09-11 | GitHub | Pilot-critical Learning & Teaching, Assessment, Plan-vs-Actual and Command Center surfaces materialized without DB/schema write | PASS / MATERIALIZED |
| HEPE-PILOT-EVD-010 | Test / Regression Evidence | GitHub Actions run `34596502837` | 2026-09-11 | GitHub Actions | Initial independent build harness | SUPERSEDED — harness failed before build because npm cache assumed absent lockfile |
| HEPE-PILOT-EVD-011 | Test / Regression Evidence | GitHub Actions run `34596547590` | 2026-09-11 | GitHub Actions | Second build harness | SUPERSEDED — dependency install passed; standalone `tsc` invalid for repository with no `tsconfig.json`; build not reached |
| HEPE-PILOT-EVD-012 | Test / Regression Evidence | GitHub Actions run `34596665449`, job `103253907933` | 2026-09-11 | GitHub Actions | Dependency install; Next.js build/type validity; critical-path source assertions; no service-role source match; environment boundary | PASS |
| HEPE-PILOT-EVD-013 | Verified System Evidence | Vercel commit status for pilot branch | 2026-09-11 | Vercel/GitHub | New pilot Preview deployment attempt was rejected by account build-rate limit | BLOCKED — INFRASTRUCTURE RATE LIMIT; NOT APPLICATION BUILD FAILURE |
| HEPE-PILOT-EVD-014 | Verified System Evidence | Supabase security advisor | 2026-09-11 | Supabase | Existing RLS-enabled/no-policy INFO findings and mutable `search_path` WARN findings exist | OPEN SECURITY REVIEW FINDING |
| HEPE-PILOT-EVD-015 | Verified System Evidence | `pg_policies` + helper-function inspection | 2026-09-11 | Supabase/PostgreSQL | Learning Activity tables use A0 authenticated read and A2 COURSE_OWNER/PREPARER write preparation pattern; Assessment tables currently have no policies | VERIFIED GAP / FAIL-CLOSED |
| HEPE-PILOT-EVD-016 | Verified System Evidence | Synthetic fixture inventory | 2026-09-11 | Supabase/PostgreSQL | Seven synthetic personas remain; synthetic programmes A/B exist but no persistent synthetic curriculum/course/activity/assessment pilot dataset remains after prior cleanup | VERIFIED GAP |
| HEPE-PILOT-EVD-017 | Controlled Document / Record | Draft PR #32 | 2026-09-11 | GitHub | Pilot changes are isolated as a draft stacked on PR #28; no merge performed | PASS |

## Formal findings / reconciliation items
### HEPE-PILOT-FND-001 — Vercel Preview build-rate limiter
**Type:** Infrastructure / Pilot execution blocker  
**Observed:** Vercel commit status points to account build-rate-limit rather than compiler/build failure.  
**Impact:** New pilot branch cannot yet receive an exact Preview deployment, blocking authenticated browser E2E for the newly materialized pages.  
**Disposition:** Keep source verification on independent GitHub Actions. Do not classify as application failure. Retry Preview only when platform permits.

### HEPE-PILOT-FND-002 — Assessment RLS policy gap
**Type:** Security / functional fail-closed gap  
**Observed:** `assessments`, `assessment_versions`, `assessment_outcome_links` have RLS enabled but no policies.  
**Impact:** Authenticated pilot personas cannot read these base tables through normal RLS scope; Assessment pilot page will remain EMPTY unless a controlled read model/policy is authorized and tested.  
**Security effect:** Default deny/fail-closed; no evidence of exposure.  
**Disposition:** Reuse established authority pattern only after scoped regression contract is defined. No ad hoc policy weakening.

### HEPE-PILOT-FND-003 — Mutable search_path on three private IAM functions
**Type:** Security hardening  
**Observed:** Supabase Advisor WARN on `private.hepe_iam_transition_allowed`, `private.hepe_iam_onboarding_guard`, `private.hepe_iam_onboarding_history`.  
**Impact:** Requires controlled review and a separate regression-safe hardening change before Pilot Ready security closure.  
**Disposition:** OPEN. Do not mutate IAM functions as part of unrelated UI work.

### HEPE-PILOT-FND-004 — Comprehensive synthetic pilot dataset absent
**Type:** Pilot data readiness  
**Observed:** synthetic personas and programmes exist, but no persistent synthetic curriculum/course/activity/assessment dataset remains; prior WEB-02 temporary fixture cleanup succeeded.  
**Impact:** Gate F and full Plan-vs-Actual authenticated demonstration cannot close yet.  
**Disposition:** Create a controlled reversible synthetic fixture harness; never reuse real institutional data as synthetic evidence.

## Current gate posture
- Gate A Runtime/Auth Closure: **FOUNDATION PASS / NEW-PILOT BROWSER REGRESSION PENDING**
- Gate B Application Shell: **PILOT-CRITICAL SURFACES MATERIALIZED / DEPLOYED-BROWSER CHECK PENDING**
- Gate C Core Domain Binding: **WEB-02 FOUNDATION PASS; TEACHING/ASSESSMENT EXTENSION PARTIAL**
- Gate D Plan vs Actual: **MATERIALIZED + BUILD PASS; AUTHENTICATED DATA/E2E PENDING**
- Gate E Persona & Authority Matrix: **FOUNDATION EVIDENCE PASS; NEW SURFACES PENDING**
- Gate F Synthetic Pilot Dataset: **HOLD**
- Gate G End-to-End Academic Workflow: **HOLD**
- Gate H Academic Command Center: **MATERIALIZED / PILOT DEPLOYMENT PENDING**
- Gate I Traceability: **WEB-02 FOUNDATION PASS; TEACHING/ASSESSMENT TRACE EXTENSION PENDING**
- Gate J Security & Privacy: **HOLD — FND-002/FND-003 OPEN**
- Gate K UX/Responsive/Accessibility: **SOURCE PARTIAL; BROWSER UAT PENDING**
- Gate L Controlled Pilot UAT Package: **PREPARATION ALLOWED / EXECUTION PENDING**

## Boundary
No Production resource, production deployment, real-user authority grant, real institutional/student/staff data write, SMTP/email action, service-role application fallback, autonomous AI approval or baseline admission by AI is authorized by this record.
