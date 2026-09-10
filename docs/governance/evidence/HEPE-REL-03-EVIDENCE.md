# HEPE-REL-03 — Application Runtime Binding Evidence

Environment: **NON-PRODUCTION ONLY**  
Record status: **PROPOSED CONTROLLED EVIDENCE RECORD — APPLICATION READ BINDING IMPLEMENTED / BUILD PREVIEW PENDING**  
Production Authorization: **NOT GRANTED**

## Scope
This gate binds the controlled HEPE interface to authenticated, RLS-preserving reads from the authoritative NON-PRODUCTION Supabase project and the REL-02A persistence foundation. This execution does not authorize schema/RLS changes, database fixture writes, real connector mutation, SMTP, secret mutation, real-user authority change or Production deployment.

## Controlled starting point
- Repository: `kasemch/hepe-ui-prototype`
- Authoritative branch: `non-production`
- Starting SHA: `9a66662e08b3cbcd89d42f2f4cc52ca4549623e4`
- HEPE-WEB-01B: CONTROLLED / RECONCILED — PASS — NON-PRODUCTION
- HEPE Academic Interface Baseline v1.0: FROZEN / CONTROLLED
- HEPE-REL-02A: CONTROLLED / RECONCILED — PASS — NON-PRODUCTION

## Verified database foundation
Authoritative Supabase project: `lztxpjsuzqvtgyasfnyj`.

Verified RLS-enabled REL-02A persistence tables:
- `connector_outbox`
- `connector_attempt`
- `idempotency_record`
- `reconciliation_item`
- `connector_health_snapshot`

Verified existing academic/read-model sources used by the binding:
- `v_hepe_review_queue_v1`
- `v_hepe_evidence_projection_v1`
- `read_model_registry`

The `read_model_registry` contains five active SECURITY_INVOKER models including `RM_REVIEW_QUEUE`, `RM_EVIDENCE_HEALTH`, `RM_PROGRAMME_DASHBOARD`, `RM_CPRR`, and `RM_COMMAND_AVAILABILITY`.

At system-inspection time the authoritative database contained 5 `reviews` rows and 0 rows in `connector_outbox`, `connector_attempt`, `reconciliation_item`, `connector_health_snapshot`, and `evidence_objects`. These counts are system-inspection evidence only; the application itself must continue to respect session RLS and may see fewer rows.

## Verified RLS posture
Repository-independent database inspection verified:
- `connector_outbox` SELECT requires scoped A0 authority and coherent scope.
- `connector_outbox` INSERT/UPDATE requires scoped A1 authority and excludes PRODUCTION-SENSITIVE insert operations.
- `connector_attempt` SELECT/INSERT is scoped through the owning outbox and current actor authority.
- `reconciliation_item` SELECT is scoped through outbox authority; human resolution requires HUMAN actor plus A3 authority.
- `connector_health_snapshot` SELECT requires an authenticated mapped actor; INSERT requires SYSTEM role-class authority.
- `reviews` and `evidence_objects` SELECT are programme-scoped through current actor A0 authority.
- `read_model_registry` is authenticated-select only.

REL-03 does not weaken or bypass these policies.

## Synthetic authenticated RLS read regression
A database-session test was executed with `role authenticated` and synthetic JWT subject claims only. No rows were inserted, updated or deleted.

Authorized synthetic PREPARER_A (`A2`, programme scope `SYN-HEPE-A`) visibility:
- review queue: 5
- evidence projection: 0
- outbox: 0
- reconciliation: 0
- runtime health: 0

Synthetic NO_AUTHORITY visibility:
- review queue: 0
- evidence projection: 0
- outbox: 0
- reconciliation: 0
- runtime health: 0

Expected result: programme-authorized synthetic actor may read only RLS-visible rows; actor without authority sees no governed rows.  
Actual result: matched expectation.  
Status: **PASS**.

## Application implementation
Branch: `feat/hepe-rel-03-runtime-binding`

Implemented:
- `lib/hepe/server-supabase.ts`: server-side Supabase client bound to the existing runtime-binding contract and request cookies; publishable key only; no service-role fallback.
- `app/[module]/page.tsx`: dynamic authenticated RLS reads for `/runtime`, `/outbox`, `/reconciliation`, `/evidence`, and `/reviews`.
- explicit states: `RUNTIME_NOT_CONFIGURED`, `AUTH_REQUIRED`, `QUERY_ERROR`, `EMPTY`, `VERIFIED`.
- no fabricated fallback metrics or synthetic production-like records.
- no auth mutation in Server Components.
- no schema, RLS or database mutation.

## Evidence register
| Evidence ID | Evidence Type | Source | Version/Date | Authority/Owner | Relevant Assertion | Expected | Actual | Verification |
|---|---|---|---|---|---|---|---|---|
| HEPE-REL03-EVD-001 | Controlled Baseline | `non-production` | 2026-09-10 | Repository | WEB-01B/UI baseline starting state | controlled | SHA `9a66662e08b3cbcd89d42f2f4cc52ca4549623e4` | PASS |
| HEPE-REL03-EVD-002 | Verified System Evidence | Supabase table inventory | 2026-09-10 | Supabase project | REL-02A tables exist with RLS | present/RLS | verified | PASS |
| HEPE-REL03-EVD-003 | Verified System Evidence | Supabase `pg_policies` inspection | 2026-09-10 | Supabase project | runtime sources preserve actor/authority scope | scoped policies | verified | PASS |
| HEPE-REL03-EVD-004 | Verified System Evidence | `read_model_registry` | 2026-09-10 | Supabase project | active security-invoker read models exist | present | 5 active models verified | PASS |
| HEPE-REL03-EVD-005 | Verified System Evidence | Supabase runtime counts | 2026-09-10 | Supabase project | current persistence/read-model row state known | inspect only | reviews=5; REL-02A runtime queues/snapshots=0; evidence_objects=0 | PASS |
| HEPE-REL03-EVD-006 | Controlled Implementation Record | `feat/hepe-rel-03-runtime-binding` | 2026-09-10 | Repository | authenticated RLS read binding implemented | frontend/server read binding | implemented | PASS — repository state |
| HEPE-REL03-EVD-007 | Test / Regression Evidence | GitHub Actions governance-policy | 2026-09-10 | GitHub Actions | governance contract on runtime-binding PR | SUCCESS | SUCCESS on prior implementation head; final-head rerun required after evidence update | PASS WITH FINAL-HEAD RECHECK |
| HEPE-REL03-EVD-008 | Test / Regression Evidence | Supabase authenticated synthetic RLS read | 2026-09-10 | Supabase NON-PRODUCTION | PREPARER_A sees programme-scoped review rows; NO_AUTHORITY sees none | scoped ALLOW / DENY | PREPARER_A review_queue=5; NO_AUTHORITY all governed reads=0 | PASS |
| HEPE-REL03-EVD-009 | Test / Regression Evidence | Vercel/CI exact-head build | pending | CI / Preview | compile/type/build | PASS | NOT YET VERIFIED | PENDING |

## Current classification
HEPE-REL-03: **PASS WITH CONDITIONS — AUTHENTICATED RLS READ BINDING IMPLEMENTED AND RLS REGRESSION PASS / EXACT-HEAD BUILD PREVIEW PENDING**  
Application Runtime Read Binding: **IMPLEMENTED IN SOURCE**  
RLS Synthetic Read Regression: **PASS**  
REL-02A Persistence Read Binding: **IMPLEMENTED IN SOURCE**  
Synthetic Connector Dispatch: **NOT EXECUTED — DATABASE WRITE AUTHORIZATION NOT INFERRED**  
Live Remote Connector: **NOT VERIFIED / NOT AUTHORIZED**  
Production Authorization: **NOT GRANTED**

Conversation ≠ Audit Evidence. Controlled Baseline / Verified System Evidence prevail.
