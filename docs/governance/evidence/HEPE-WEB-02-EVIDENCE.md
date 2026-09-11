# HEPE-WEB-02 — Controlled Evidence Record

Environment: **NON-PRODUCTION ONLY**  
Production Authorization: **NOT GRANTED**  
PR Merge Authorization: **NOT GRANTED**

## Current classification
**HEPE-WEB-02C.2 = PASS**  
**HEPE-WEB-02C.1 = CONTROLLED / RECONCILED — PASS**  
**HEPE-WEB-02C through WEB-02G = MATERIALIZED / BUILD VERIFIED**  
**HEPE-WEB-02R = HOLD — NO_AUTHORITY DIRECT-RLS VS RENDERED-UI CONTEXT DISCREPANCY**

Conversation is not admitted as audit evidence.

## Application materialization
Controlled application bindings were added for Programme Overview, Curriculum Context, PLO/CLO Traceability, Mapping/I-R-M, Evidence, QA/CPRR, Tasks/Review Context and AI Advisory. Application reads use the existing authenticated server Supabase client and controlled RLS-preserving sources. No service-role application fallback was introduced.

Fresh Git-associated Preview for application SHA `6567c514ee6d6901fcfa083363c1f18c94268ffd` was built successfully and reached READY at deployment `dpl_BYphEvtHoFWE3PTAoj59uHxUjpLw`.

## WEB-02R integrated run 34575635352
Expected: build PASS; unauthenticated fail closed; PREPARER_A controlled surfaces readable; NO_AUTHORITY all governed surfaces EMPTY; mandatory Auth/fixture cleanup zero residual.

Verified observations:
- Static security boundary = PASS.
- Build/type validity = PASS.
- Unauthenticated `/mapping` fail-closed = PASS.
- Synthetic fixture creation = PASS.
- PREPARER_A: Programme VERIFIED; Curriculum VERIFIED; Traceability VERIFIED; Mapping VERIFIED; Evidence VERIFIED; QA VERIFIED; Tasks VERIFIED; AI EMPTY with advisory boundary present.
- Mandatory actor/Auth/fixture cleanup = PASS.
- Auth residual = 0.
- Synthetic academic fixture residual = 0.

The first integrated run reported `NOAUTH_programme_NOT_EMPTY_VERIFIED`. Its parser searched the entire returned HTML and was initially considered potentially ambiguous. A focused follow-up was therefore executed with exact parsing of `<div class="live-state">...</div>`.

## Focused NO_AUTHORITY rendered-state checks
Focused run `34576649293` parsed the actual `live-state` element and returned:

- `/programme` rendered state = `VERIFIED`
- cleanup = PASS

Therefore the earlier parser-only explanation is **not sufficient** and is superseded by verified follow-up evidence.

A second focused diagnostic run `34576962493` compared the same synthetic NO_AUTHORITY session through two paths:

- direct authenticated Supabase read of `v_hepe_programme_dashboard_v1` = **0 rows**
- rendered Preview `/programme` exact `live-state` = **VERIFIED**
- cleanup = PASS

An independent transaction-scoped PostgreSQL simulation using the NO_AUTHORITY actor and an authenticated JWT subject also returned **0 rows** from `v_hepe_programme_dashboard_v1`.

System inspection additionally confirmed:
- `v_hepe_programme_dashboard_v1` has `security_invoker=true`.
- `programmes` SELECT policy is scoped through `private.hepe_current_actor_has_authority('A0', programme_id, ..., true)`.
- `private.hepe_current_actor_id()` resolves the actor from `auth.uid()` and active actor state.
- application `getHepeServerSupabase()` uses only the configured publishable key and request cookies; no service-role fallback exists in this code path.

The evidence therefore establishes a **context discrepancy between the direct authenticated Supabase/RLS result and the rendered Next.js Preview result**. It does not support declaring an RLS leak, and it also does not support declaring the NO_AUTHORITY rendered application assertion PASS.

## Evidence register
| Evidence ID | Evidence Type | Source | Version/Date | Authority/Owner | Relevant assertion | Expected | Actual | Verification Status |
|---|---|---|---|---|---|---|---|---|
| HEPE-WEB02-EVD-R01 | Verified System Evidence | Vercel deployment `dpl_BYphEvtHoFWE3PTAoj59uHxUjpLw` | 2026-09-11 | Vercel | Exact application Preview | Git-associated PR #28 app SHA READY | SHA `6567c...` READY | PASS |
| HEPE-WEB02-EVD-R02 | Test / Regression Evidence | GitHub Actions run `34575635352` | 2026-09-11 | GitHub Actions | Build/type/security boundary | PASS | PASS | PASS |
| HEPE-WEB02-EVD-R03 | Test / Regression Evidence | GitHub Actions run `34575635352` | 2026-09-11 | GitHub Actions | PREPARER_A authenticated workflow reads | governed core surfaces readable | programme/curriculum/traceability/mapping/evidence/qa/tasks VERIFIED; AI EMPTY | PASS |
| HEPE-WEB02-EVD-R04 | Test / Regression Evidence | GitHub Actions run `34575635352` | 2026-09-11 | GitHub Actions | Mandatory cleanup | zero Auth + fixture residual, personas restored | zero residual; cleanup PASS | PASS |
| HEPE-WEB02-EVD-R05 | Test / Regression Evidence | GitHub Actions run `34576649293` | 2026-09-11 | GitHub Actions | Exact rendered NO_AUTHORITY programme state | EMPTY | `live-state=VERIFIED` | FAIL / RECONCILIATION REQUIRED |
| HEPE-WEB02-EVD-R06 | Test / Regression Evidence | GitHub Actions run `34576962493` | 2026-09-11 | GitHub Actions | Same-session direct RLS vs rendered UI | both zero/EMPTY | direct rows 0; rendered `VERIFIED` | VERIFIED CONFLICT |
| HEPE-WEB02-EVD-R07 | Test / Regression Evidence | Transaction-scoped authenticated SQL simulation | 2026-09-11 | Supabase | NO_AUTHORITY programme RLS | 0 rows | 0 rows | PASS |
| HEPE-WEB02-EVD-R08 | Verified System Evidence | PostgreSQL `pg_class`, `pg_policies`, helper definitions | 2026-09-11 | Supabase | Programme dashboard preserves RLS contract | SECURITY_INVOKER + scoped helper | confirmed | PASS |
| HEPE-WEB02-EVD-R09 | Formal Reconciliation Item | WEB-02R reconciliation | 2026-09-11 | HEPE governance | Rendered Next.js authority context must match direct RLS result | EMPTY | discrepancy unresolved | OPEN / BLOCKS WEB-02R FULL PASS |

## Controlled classification
**HEPE-WEB-02R = HOLD — APPLICATION SESSION / RENDER CONTEXT RECONCILIATION REQUIRED.**

Do not classify HEPE-WEB-02 FULL PASS until the rendered Preview is shown to use the same authenticated authority context as the direct RLS read and NO_AUTHORITY renders `EMPTY` on governed surfaces.

## Boundary
No Production access, Production deployment, real curriculum write, service-role application read, autonomous AI approval, authority elevation or PR merge is authorized or performed by this record.
