# HEPE-WEB-02 — Controlled Evidence Record

Environment: **NON-PRODUCTION ONLY**  
Production Authorization: **NOT GRANTED**  
PR Merge Authorization: **NOT GRANTED**

## Current classification
**HEPE-WEB-02C.2 = PASS**  
**HEPE-WEB-02C.1 = CONTROLLED / RECONCILED — PASS**  
**HEPE-WEB-02C through WEB-02G = MATERIALIZED / BUILD VERIFIED**  
**HEPE-WEB-02R = HOLD — FINAL NO_AUTHORITY UI ASSERTION REQUIRES RUNNER PARSER REPAIR**

Conversation is not admitted as audit evidence.

## Application materialization
Controlled application bindings were added for Programme Overview, Curriculum Context, PLO/CLO Traceability, Mapping/I-R-M, Evidence, QA/CPRR, Tasks/Review Context and AI Advisory. Application reads use the existing authenticated server Supabase client and controlled RLS-preserving sources. No service-role application fallback was introduced.

Fresh Git-associated Preview for application SHA `6567c514ee6d6901fcfa083363c1f18c94268ffd` was built successfully and reached READY at deployment `dpl_BYphEvtHoFWE3PTAoj59uHxUjpLw`.

## WEB-02R run 34575635352
Expected: build PASS; unauthenticated fail closed; PREPARER_A controlled surfaces readable; NO_AUTHORITY all governed surfaces EMPTY; mandatory Auth/fixture cleanup zero residual.

Actual verified observations before exception:
- Static security boundary = PASS.
- Build/type validity = PASS.
- Unauthenticated `/mapping` fail-closed = PASS.
- Synthetic fixture creation = PASS.
- PREPARER_A: Programme VERIFIED; Curriculum VERIFIED; Traceability VERIFIED; Mapping VERIFIED; Evidence VERIFIED; QA VERIFIED; Tasks VERIFIED; AI EMPTY with advisory boundary present.
- Mandatory actor/Auth/fixture cleanup = PASS.
- Auth residual = 0.
- Synthetic academic fixture residual = 0.

The run then reported `NOAUTH_programme_NOT_EMPTY_VERIFIED`. Log inspection verified the runner's `state(html)` function searched the entire returned HTML for the first literal state token and therefore could match static `VERIFIED` text rather than the rendered `live-state` value. This is classified as a test-runner parsing defect. The run is not admitted as proof that NO_AUTHORITY saw programme data, and it is also not sufficient to mark the final integrated NO_AUTHORITY UI assertion PASS.

Independent database RLS evidence remains PASS for NO_AUTHORITY zero-row access across programme/curriculum/course/outcome/mapping controlled surfaces.

## Evidence register
| Evidence ID | Evidence Type | Source | Version/Date | Authority/Owner | Relevant assertion | Expected | Actual | Verification Status |
|---|---|---|---|---|---|---|---|---|
| HEPE-WEB02-EVD-R01 | Verified System Evidence | Vercel deployment `dpl_BYphEvtHoFWE3PTAoj59uHxUjpLw` | 2026-09-11 | Vercel | Exact application Preview | Git-associated PR #28 app SHA READY | SHA `6567c...` READY | PASS |
| HEPE-WEB02-EVD-R02 | Test / Regression Evidence | GitHub Actions run `34575635352` | 2026-09-11 | GitHub Actions | Build/type/security boundary | PASS | PASS | PASS |
| HEPE-WEB02-EVD-R03 | Test / Regression Evidence | GitHub Actions run `34575635352` | 2026-09-11 | GitHub Actions | PREPARER_A authenticated workflow reads | governed core surfaces readable | programme/curriculum/traceability/mapping/evidence/qa/tasks VERIFIED; AI EMPTY | PASS |
| HEPE-WEB02-EVD-R04 | Test / Regression Evidence | GitHub Actions run `34575635352` | 2026-09-11 | GitHub Actions | Mandatory cleanup | zero Auth + fixture residual, personas restored | zero residual; cleanup PASS | PASS |
| HEPE-WEB02-EVD-R05 | Formal Reconciliation Item | GitHub Actions run `34575635352` log analysis | 2026-09-11 | HEPE governance | Final NO_AUTHORITY rendered-state assertion | reliable EMPTY assertion | runner parser searched static HTML tokens and produced ambiguous VERIFIED | OPEN / BLOCKS WEB-02R FULL PASS |

## Boundary
No Production access, Production deployment, real curriculum write, service-role application read, autonomous AI approval, authority elevation or PR merge is authorized or performed by this record.
