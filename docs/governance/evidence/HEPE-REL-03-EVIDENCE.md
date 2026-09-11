# HEPE-REL-03 — Application Runtime Binding Evidence

Environment: **NON-PRODUCTION ONLY**  
Record status: **CONTROLLED / RECONCILED — PASS — SYNTHETIC NON-PRODUCTION RUNTIME**  
Production Authorization: **NOT GRANTED**  
PR #28 Merge Authorization: **NOT GRANTED**

## Scope
HEPE-REL-03 binds the controlled HEPE interface to authenticated, RLS-preserving reads from the authoritative NON-PRODUCTION Supabase project and the REL-02A persistence foundation. It does not authorize Production deployment, schema/RLS changes, real-user authority changes, SMTP changes, privileged application fallback, live connector writes, or PR merge.

## Controlled baseline
- Repository: `kasemch/hepe-ui-prototype`
- Base branch: `non-production`
- Controlled starting SHA: `9a66662e08b3cbcd89d42f2f4cc52ca4549623e4`
- Authoritative Supabase project: `lztxpjsuzqvtgyasfnyj`
- Vercel project: `hepe-ui-prototype`
- REL-02A persistence foundation and RLS: previously verified PASS
- WEB-01B: previously controlled/reconciled PASS — NON-PRODUCTION

## Runtime implementation under test
Branch: `feat/hepe-rel-03-runtime-binding`

Application behavior:
- server-side Supabase client uses the configured publishable key and request cookies only;
- no service-role fallback in the application read path;
- authenticated reads for `/runtime`, `/outbox`, `/reconciliation`, `/evidence`, `/reviews`;
- truthful states: `RUNTIME_NOT_CONFIGURED`, `AUTH_REQUIRED`, `QUERY_ERROR`, `EMPTY`, `VERIFIED`;
- no fabricated fallback metrics;
- no schema/RLS mutation from REL-03.

## Prior verified foundation
### Synthetic database RLS regression
PREPARER_A, scoped to programme `SYN-HEPE-A`:
- review queue = 5
- evidence projection = 0
- outbox = 0
- reconciliation = 0
- runtime health = 0

NO_AUTHORITY:
- review queue = 0
- evidence projection = 0
- outbox = 0
- reconciliation = 0
- runtime health = 0

Status: **PASS**.

### REL-03A synthetic database write regression
Synthetic lifecycle, idempotency, conflict/reconciliation, retry/revalidation, denied/expired paths, system health snapshot and cleanup were verified. Final cleanup showed zero residual REL-03A fixtures.

Status: **PASS — SYNTHETIC DATABASE RUNTIME VERIFIED / CLEANUP PASS**.

## Preview/runtime blocker lineage and reconciliation
Earlier Preview attempts correctly failed closed at successive boundaries: missing runtime environment binding, missing GitHub Actions secret references, unavailable Auth Admin invocation surfaces, Preview transport failure, SSR session-cookie recognition failure, and finally a mismatched Preview publishable-key binding.

These intermediate failures are retained as historical diagnostic evidence only; they do not override the later verified closure evidence below.

### D.3F masked Actions secret binding verification
GitHub Actions run `34565416865` verified the presence of the two required masked NON-PRODUCTION bindings without revealing values:
- Supabase Auth Admin binding: PRESENT
- Vercel automation bypass binding: PRESENT

No secret values were admitted to this evidence record.

Status: **PASS**.

### D.3G.1 transport repair
A Git-associated protected Preview became directly reachable through the authorized automation bypass path. `/runtime` returned HTTP 200 and no longer returned `RUNTIME_NOT_CONFIGURED`.

Status: **PASS**.

### D.3G.2 SSR cookie diagnostic
Verified diagnostic facts:
- Supabase SSR client created one auth cookie for the authoritative project;
- the same cookie name reached the Next.js server;
- server-side session decoding showed a session and session user;
- `auth.getUser()` still rejected the session at that time;
- key-fingerprint comparison showed the Preview runtime publishable-key binding did not match the current controlled publishable key used to create the session;
- synthetic diagnostic Auth residual after cleanup = 0.

Reconciliation: the blocker was reclassified from cookie transport failure to **stale/mismatched Vercel Preview runtime publishable-key binding**. No IAM/RLS/schema repair was made.

Status: **VERIFIED ROOT CAUSE / CLEANUP PASS**.

## D.3G.3 fresh Preview after runtime-key correction
A fresh Git-associated Preview was triggered only after the Preview-scoped environment binding was corrected.

Verified Preview provenance:
- Deployment ID: `dpl_SwfgsrFhy5bCNHVyGqig4RtfPD1C`
- Hostname: `hepe-ui-prototype-hik8bpx6x-kasemch-3467s-projects.vercel.app`
- Git commit SHA: `002f37ceec773a67d66e3eae7db68b0e1c0f0e08`
- Git branch: `feat/hepe-rel-03-runtime-binding`
- Git PR: `28`
- `githubDeployment`: `1`
- source: `git`
- state: `READY`
- Production target: none

Status: **PASS — FRESH GIT-ASSOCIATED NON-PRODUCTION PREVIEW**.

## D.3G.3 authenticated persona E2E
GitHub Actions run: `34571133277`  
Job: `authenticated-e2e`  
Conclusion: **SUCCESS**.

The test used exactly two ephemeral synthetic Auth principals and temporarily rebound only `actors.external_identity_subject` for the existing PREPARER_A and NO_AUTHORITY actors. Genuine Supabase sessions and SSR auth cookies were used; no forged JWT/cookie path and no service-role application read path were used.

### PREPARER_A actual result
- `/reviews`: **PASS — 5 rows / VERIFIED**
- all visible review rows were programme `SYN-HEPE-A`
- `/evidence`: **PASS — 0 rows / EMPTY**
- `/outbox`: **PASS — 0 rows / EMPTY**
- `/reconciliation`: **PASS — 0 rows / EMPTY**
- `/runtime`: **PASS — 0 rows / EMPTY**

### NO_AUTHORITY actual result
- `/reviews`: **PASS — 0 rows / EMPTY**
- `/evidence`: **PASS — 0 rows / EMPTY**
- `/outbox`: **PASS — 0 rows / EMPTY**
- `/reconciliation`: **PASS — 0 rows / EMPTY**
- `/runtime`: **PASS — 0 rows / EMPTY**

Required negative assertions were satisfied for the tested authenticated paths:
- no `AUTH_REQUIRED` after valid session;
- no `RUNTIME_NOT_CONFIGURED`;
- no `QUERY_ERROR`;
- no cross-programme review exposure for PREPARER_A;
- no governed rows for NO_AUTHORITY;
- no fabricated data fallback.

Status: **PASS — AUTHENTICATED RLS APPLICATION E2E**.

## Mandatory rollback and cleanup
GitHub Actions run `34571133277` verified after the authenticated E2E:
- PREPARER_A original subject restored: PASS
- PREPARER_A authority assignment count: 1
- NO_AUTHORITY original subject restored: PASS
- NO_AUTHORITY authority assignment count: 0
- synthetic Auth residual: 0
- mandatory cleanup: PASS

Independent post-run Supabase verification reconfirmed:
- PREPARER_A subject = `10000000-0000-0000-0000-000000000001`
- PREPARER_A authority assignment count = 1
- NO_AUTHORITY subject = `10000000-0000-0000-0000-000000000006`
- NO_AUTHORITY authority assignment count = 0
- D.3G.3 synthetic Auth residual = 0

Temporary D.3G.3 workflow and redeploy-trigger scaffolding were removed after evidence capture.

Status: **PASS — ZERO RESIDUAL / AUTHORITY POSTURE RESTORED**.

## Stage 2 governance closure verification
Evidence reconciliation head `508d2edd9dfbad65a29625ae21160e3bcb0da06a` was verified before this final classification update:
- PR #28 remained OPEN / NOT MERGED;
- `HEPE Copilot Governance Check` run `34571375557` completed with conclusion `success` on that exact evidence head;
- repository ruleset `22409192`, `HEPE Non-Production Governance`, remained `active` on `refs/heads/non-production`;
- the ruleset required `governance-policy` and review-thread resolution and had no bypass actors;
- the PR review-comment endpoint returned an empty list, therefore unresolved inline review threads = 0.

This final classification commit must itself receive the same `governance-policy` success before the gate is treated as closed in execution reporting.

## Evidence register
| Evidence ID | Evidence Type | Source | Version/Date | Authority/Owner | Relevant assertion | Expected | Actual | Verification |
|---|---|---|---|---|---|---|---|---|
| HEPE-REL03-EVD-001 | Controlled Baseline | `non-production` | 2026-09-10 | Repository | controlled starting state | controlled | SHA `9a66662e...` | PASS |
| HEPE-REL03-EVD-002 | Verified System Evidence | Supabase | 2026-09-10 | Supabase | REL-02A + RLS foundation | present/scoped | verified | PASS |
| HEPE-REL03-EVD-003 | Test / Regression Evidence | Supabase synthetic RLS read | 2026-09-10 | Supabase | PREPARER_A scoped ALLOW / NO_AUTHORITY DENY | scoped | matched | PASS |
| HEPE-REL03-EVD-004 | Test / Regression Evidence | REL-03A synthetic write harness | 2026-09-10 | Explicit Human gate authority / Supabase | lifecycle/idempotency/failure paths | PASS | verified | PASS |
| HEPE-REL03-EVD-005 | Test / Regression Evidence | REL-03A cleanup | 2026-09-10 | Supabase | zero residual | zero | zero | PASS |
| HEPE-REL03-EVD-006 | Verified System Evidence | GitHub Actions run `34565416865` | 2026-09-11 | GitHub Actions | required masked bindings present | both present | both present | PASS |
| HEPE-REL03-EVD-007 | Test / Regression Evidence | D.3G.1 protected Preview | 2026-09-11 | Vercel/GitHub Actions | Preview transport + runtime configured | reachable | HTTP 200; runtime configured | PASS |
| HEPE-REL03-EVD-008 | Test / Regression Evidence | D.3G.2 SSR diagnostic | 2026-09-11 | GitHub Actions/Vercel | isolate cookie vs runtime-key cause | provenance-resolvable | cookie arrived; session decoded; runtime key mismatch isolated | PASS / ROOT CAUSE VERIFIED |
| HEPE-REL03-EVD-009 | Verified System Evidence | Vercel deployment `dpl_SwfgsrFhy5bCNHVyGqig4RtfPD1C` | 2026-09-11 | Vercel | fresh Git-associated Preview after binding correction | READY / PR #28 / exact SHA | READY / PR #28 / SHA `002f37ce...` | PASS |
| HEPE-REL03-EVD-010 | Test / Regression Evidence | GitHub Actions run `34571133277` | 2026-09-11 | GitHub Actions | PREPARER_A authenticated RLS behavior | scoped rows only | reviews 5; remaining four modules 0 | PASS |
| HEPE-REL03-EVD-011 | Test / Regression Evidence | GitHub Actions run `34571133277` | 2026-09-11 | GitHub Actions | NO_AUTHORITY authenticated denial | zero governed rows | zero across five modules | PASS |
| HEPE-REL03-EVD-012 | Test / Regression Evidence | GitHub Actions run `34571133277` | 2026-09-11 | GitHub Actions | rollback/cleanup | restore + zero residual | restored; counts 1/0; residual 0 | PASS |
| HEPE-REL03-EVD-013 | Verified System Evidence | Supabase post-run verification | 2026-09-11 | Supabase | independent cleanup confirmation | original subjects, authority 1/0, residual 0 | matched | PASS |
| HEPE-REL03-EVD-014 | Verified System Evidence | GitHub Actions run `34571375557` on SHA `508d2edd...` | 2026-09-11 | GitHub Actions | evidence-head governance policy | success | success | PASS |
| HEPE-REL03-EVD-015 | Controlled Baseline | GitHub ruleset `22409192` | 2026-09-11 | Repository Governance | non-production governance active | active | active; no bypass | PASS |
| HEPE-REL03-EVD-016 | Verified System Evidence | PR #28 review comments API | 2026-09-11 | GitHub | unresolved inline review threads | 0 | 0 | PASS |

## Final classification
HEPE-REL-03 Stage 1 Technical Acceptance: **PASS**.  
HEPE-REL-03 Stage 2 Evidence/Governance Reconciliation: **PASS**, subject only to the required status check succeeding on this final classification commit itself.  
HEPE-REL-03 overall: **CONTROLLED / RECONCILED — PASS — SYNTHETIC NON-PRODUCTION RUNTIME** after that final-head check succeeds.

Live Remote Connector: **NOT VERIFIED / NOT AUTHORIZED**.  
Production Authorization: **NOT GRANTED**.  
PR #28 Merge Authorization: **NOT GRANTED**.

Conversation ≠ Audit Evidence. Controlled Baseline / Verified System Evidence prevail.
