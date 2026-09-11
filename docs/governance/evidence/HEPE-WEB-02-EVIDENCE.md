# HEPE-WEB-02 — Controlled Evidence Record

Environment: **NON-PRODUCTION ONLY**  
Production Authorization: **NOT GRANTED**  
PR Merge Authorization: **NOT GRANTED**

## Final controlled classification
**HEPE-WEB-02C.2 = PASS**  
**HEPE-WEB-02C.1 = CONTROLLED / RECONCILED — PASS**  
**HEPE-WEB-02C through WEB-02G = MATERIALIZED / BUILD VERIFIED**  
**HEPE-WEB-02R.1 = PASS — INTEGRATED NON-PRODUCTION PREVIEW ACCEPTANCE**  
**HEPE-WEB-02 = CONTROLLED / RECONCILED — PASS — CORE ACADEMIC WORKFLOWS MATERIALIZED — NON-PRODUCTION ONLY**

Conversation is not admitted as audit evidence.

## Application materialization
Controlled application bindings cover Programme Overview, Curriculum Context, PLO/CLO Traceability, Mapping/I-R-M, Evidence, QA/CPRR, Tasks/Review Context and AI Advisory. Application reads use the authenticated server Supabase client and controlled RLS-preserving sources. No service-role application fallback is present.

## WEB-02R discrepancy and verified root cause
Earlier WEB-02R runs established a real discrepancy: NO_AUTHORITY returned zero rows from the direct authenticated Supabase/RLS read while `/programme` rendered `VERIFIED`. This was not an RLS leak.

Source inspection of `app/programme/page.tsx` identified the application defect: after all four programme academic read-model queries completed successfully, `loadProgramme()` returned overall state `VERIFIED` unconditionally, even when every section returned zero rows. Section-level states were correct; only the aggregate page state was incorrect.

Minimal repair commit `43f5b465d774f3ab2cacb8dd129f8e5aca45a1f3` changed only the aggregate programme-state derivation so that the overall state is `VERIFIED` when at least one controlled row is visible and `EMPTY` when the authenticated authority scope returns zero rows. No IAM, RLS, schema, authority contract or authentication mechanism was changed.

## Fresh Git-associated Preview
Application SHA under test: `43f5b465d774f3ab2cacb8dd129f8e5aca45a1f3`  
Vercel deployment: `dpl_AUqf8rX1kFusT1eCdcU5Hd13a17r`  
Preview URL: `hepe-ui-prototype-7d6y8b4jn-kasemch-3467s-projects.vercel.app`

Verified deployment provenance:
- Git source
- PR #28
- branch `feat/hepe-rel-03-runtime-binding`
- exact Git commit SHA `43f5b465d774f3ab2cacb8dd129f8e5aca45a1f3`
- deployment READY
- build completed successfully

## WEB-02R.1 integrated regression
GitHub Actions run: `34577727131`  
Job: `103193915017`

Expected:
- build/type validity PASS
- no service-role application fallback
- unauthenticated fail closed
- PREPARER_A controlled core academic reads scoped to authorized programme
- NO_AUTHORITY governed rendered surfaces EMPTY
- AI advisory-only boundary preserved
- temporary synthetic Auth and academic fixture mandatory cleanup
- zero residual

Actual verified results:
- Build/type validity = PASS
- source security boundary = PASS
- unauthenticated `/programme` = AUTH_REQUIRED / PASS
- synthetic academic fixture creation = PASS
- PREPARER_A direct programme rows = 1
- PREPARER_A `/programme` = VERIFIED
- PREPARER_A `/curriculum` = VERIFIED
- PREPARER_A `/traceability` = VERIFIED
- PREPARER_A `/mapping` = VERIFIED
- PREPARER_A `/evidence` = EMPTY
- PREPARER_A `/qa` = VERIFIED
- PREPARER_A `/tasks` = VERIFIED
- PREPARER_A `/ai` = EMPTY with `AI ADVISORY ONLY` boundary preserved
- NO_AUTHORITY direct programme rows = 0
- NO_AUTHORITY `/programme` = EMPTY
- NO_AUTHORITY `/curriculum` = EMPTY
- NO_AUTHORITY `/traceability` = EMPTY
- NO_AUTHORITY `/mapping` = EMPTY
- NO_AUTHORITY `/evidence` = EMPTY
- NO_AUTHORITY `/qa` = EMPTY
- NO_AUTHORITY `/tasks` = EMPTY
- NO_AUTHORITY `/ai` = EMPTY
- integrated assertion = PASS
- Auth residual = 0
- synthetic academic fixture residual = 0
- mandatory cleanup = PASS

An independent post-run Supabase verification confirmed:
- temporary Auth residual = 0
- temporary curriculum residual = 0
- temporary course residual = 0
- temporary outcome residual = 0
- temporary mapping residual = 0
- PREPARER_A subject restored to its original synthetic subject
- PREPARER_A active authority assignments = 1
- NO_AUTHORITY subject restored to its original synthetic subject
- NO_AUTHORITY active authority assignments = 0

The temporary WEB-02R.1 regression workflow was removed after execution.

## Evidence register
| Evidence ID | Evidence Type | Source | Version/Date | Authority/Owner | Relevant assertion | Expected | Actual | Verification Status |
|---|---|---|---|---|---|---|---|---|
| HEPE-WEB02-EVD-R01 | Verified System Evidence | Vercel deployment `dpl_BYphEvtHoFWE3PTAoj59uHxUjpLw` | 2026-09-11 | Vercel | Initial WEB-02 application Preview | Git-associated Preview READY | READY | PASS |
| HEPE-WEB02-EVD-R02 | Test / Regression Evidence | GitHub Actions run `34575635352` | 2026-09-11 | GitHub Actions | Initial integrated build/security/PREPARER path | PASS | PASS except NO_AUTHORITY aggregate-state conflict | PARTIAL / SUPERSEDED FOR FINAL NOAUTH ASSERTION |
| HEPE-WEB02-EVD-R05 | Test / Regression Evidence | GitHub Actions run `34576649293` | 2026-09-11 | GitHub Actions | Exact rendered NO_AUTHORITY programme state before repair | EMPTY | VERIFIED | FAIL / ROOT-CAUSE INPUT |
| HEPE-WEB02-EVD-R06 | Test / Regression Evidence | GitHub Actions run `34576962493` | 2026-09-11 | GitHub Actions | Same-session direct RLS vs rendered UI before repair | both zero/EMPTY | direct rows 0; rendered VERIFIED | VERIFIED CONFLICT / ROOT-CAUSE INPUT |
| HEPE-WEB02-EVD-R07 | Test / Regression Evidence | Transaction-scoped authenticated SQL simulation | 2026-09-11 | Supabase | NO_AUTHORITY programme RLS | 0 rows | 0 rows | PASS |
| HEPE-WEB02-EVD-R08 | Verified System Evidence | PostgreSQL view/policy/helper inspection | 2026-09-11 | Supabase | Programme dashboard preserves RLS contract | SECURITY_INVOKER + scoped authority helper | confirmed | PASS |
| HEPE-WEB02-EVD-R10 | Verified System Evidence | `app/programme/page.tsx` source inspection | 2026-09-11 | GitHub | Aggregate page state reflects visible controlled rows | EMPTY when all sections empty | pre-repair unconditional VERIFIED identified | ROOT CAUSE VERIFIED |
| HEPE-WEB02-EVD-R11 | Controlled Document / Record | Commit `43f5b465d774f3ab2cacb8dd129f8e5aca45a1f3` | 2026-09-11 | GitHub | Minimum aggregate-state repair only | no IAM/RLS/schema redesign | visible-row aggregation implemented | PASS |
| HEPE-WEB02-EVD-R12 | Verified System Evidence | Vercel deployment `dpl_AUqf8rX1kFusT1eCdcU5Hd13a17r` | 2026-09-11 | Vercel | Fresh exact repaired application Preview | Git-associated PR #28 SHA READY | exact SHA READY | PASS |
| HEPE-WEB02-EVD-R13 | Test / Regression Evidence | GitHub Actions run `34577727131`, job `103193915017` | 2026-09-11 | GitHub Actions | PREPARER_A + NO_AUTHORITY rendered workflow agreement with direct RLS | scoped VERIFIED / zero-row EMPTY | all required assertions matched | PASS |
| HEPE-WEB02-EVD-R14 | Test / Regression Evidence | GitHub Actions run `34577727131` cleanup | 2026-09-11 | GitHub Actions | Mandatory rollback and cleanup | zero residual / personas restored | PASS | PASS |
| HEPE-WEB02-EVD-R15 | Verified System Evidence | Supabase post-run verification | 2026-09-11 | Supabase | Independent cleanup confirmation | zero Auth/fixture residual; authority unchanged | confirmed | PASS |

## Reconciliation closure
The prior WEB-02R reconciliation item is closed by verified root-cause repair plus post-repair integrated regression. The conflict was an aggregate UI-state semantics defect in Programme Overview, not evidence of RLS bypass or authority leakage.

## Known limitations
- Live Remote Connector remains NOT VERIFIED / NOT AUTHORIZED unless separately tested.
- AI remains advisory only and has no approval, baseline mutation, authority-elevation or Audit Evidence admission power.
- Missing controlled provenance remains explicit rather than inferred.
- This acceptance is NON-PRODUCTION Preview acceptance, not Production authorization.
- PR #28 merge is not authorized by this record.

## Boundary
No Production access, Production deployment, real curriculum write, service-role application read, autonomous AI approval, authority elevation or PR merge was authorized or performed by HEPE-WEB-02R.1.
