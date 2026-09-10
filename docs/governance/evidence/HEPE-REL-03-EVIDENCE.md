# HEPE-REL-03 — Application Runtime Binding Evidence

Environment: **NON-PRODUCTION ONLY**  
Record status: **PROPOSED CONTROLLED EVIDENCE RECORD — READ BINDING + SYNTHETIC WRITE REGRESSION VERIFIED / EXACT-HEAD PREVIEW PENDING**  
Production Authorization: **NOT GRANTED**

## Scope
This gate binds the controlled HEPE interface to authenticated, RLS-preserving reads from the authoritative NON-PRODUCTION Supabase project and the REL-02A persistence foundation. HEPE-REL-03A additionally received explicit Human Authority for a **SYNTHETIC DATABASE WRITE TEST ONLY**. This did not authorize Production, schema/RLS modification, real connector mutation, SMTP, secret mutation, real-user authority change, or external-system writes.

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

At system-inspection time before REL-03A writes, the authoritative database contained 5 `reviews` rows and 0 rows in `connector_outbox`, `connector_attempt`, `reconciliation_item`, `connector_health_snapshot`, and `evidence_objects`. These counts are system-inspection evidence only; the application itself must continue to respect session RLS and may see fewer rows.

## Verified RLS posture
Repository-independent database inspection verified:
- `connector_outbox` SELECT requires scoped A0 authority and coherent scope.
- `connector_outbox` INSERT/UPDATE requires scoped A1 authority and excludes PRODUCTION-SENSITIVE insert operations.
- `connector_attempt` SELECT/INSERT is scoped through the owning outbox and current actor authority.
- `reconciliation_item` SELECT is scoped through outbox authority; human resolution requires HUMAN actor plus A3 authority.
- `connector_health_snapshot` SELECT requires an authenticated mapped actor; INSERT requires SYSTEM role-class authority.
- `reviews` and `evidence_objects` SELECT are programme-scoped through current actor A0 authority.
- `read_model_registry` is authenticated-select only.

REL-03/03A did not weaken or bypass these policies for the tested application/RLS paths.

## Synthetic authenticated RLS read regression
A database-session test was executed with `role authenticated` and synthetic JWT subject claims only.

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

## HEPE-REL-03A synthetic database write regression
Authorization scope: explicit Human Authority for `HEPE-REL-03A SYNTHETIC DATABASE WRITE TEST` only.

Execution used synthetic identities and synthetic connector id `SYNTHETIC_REL03A`; no external connector was called and all acknowledgement references were explicitly synthetic.

Test results:

| Test ID | Expected | Actual | Status |
|---|---|---|---|
| REL03A-W01 | RLS-scoped synthetic outbox insert ALLOW for PREPARER_A | inserted | PASS |
| REL03A-W02 | idempotency record insert ALLOW when bound to same outbox envelope | inserted | PASS |
| REL03A-W03 | `CREATED→VALIDATED→AUTHORIZED→READY→DISPATCHED→ACKNOWLEDGED→VERIFIED→COMPLETED` | COMPLETED | PASS |
| REL03A-W04 | `DISPATCHED→CONFLICT` opens human-governed reconciliation | CONFLICT + OPEN reconciliation | PASS |
| REL03A-W05 | `RETRYABLE_FAILURE→READY` requires revalidation | revalidated READY then ABORTED | PASS |
| REL03A-W06 | negative terminal path `CREATED→DENIED` | DENIED | PASS |
| REL03A-W07 | actual expiry permits transition to EXPIRED | EXPIRED | PASS |
| REL03A-W08 | SYSTEM actor may insert synthetic connector-health snapshot | 1 visible synthetic snapshot | PASS |
| REL03A-I01 | same connector + same idempotency key cannot create duplicate dispatch | unique_violation | PASS |
| REL03A-I02 | same connector + same key with conflicting payload cannot create second dispatch | unique_violation | PASS |
| REL03A-R01 | PREPARER_A can read only own scoped synthetic outbox fixtures | 5 scoped rows visible during test | PASS |
| REL03A-CLEANUP | zero residual REL-03A synthetic fixtures after test | outbox=0; idempotency=0; health=0; dependent attempt/reconciliation fixtures removed first | PASS |

The completed lifecycle used a deterministic **synthetic acknowledgement** (`SYNTHETIC-ACK-REL03A-MAIN`). It is not evidence of a live remote connector acknowledgement.

The conflict test intentionally created an OPEN reconciliation item and did not auto-resolve it. The item was removed during authorized test cleanup together with the synthetic outbox fixtures.

Cleanup was executed only against fixtures created by this gate (`connector_id='SYNTHETIC_REL03A'`). No pre-existing rows were removed.

## Application implementation
Branch: `feat/hepe-rel-03-runtime-binding`

Implemented:
- `lib/hepe/server-supabase.ts`: server-side Supabase client bound to the existing runtime-binding contract and request cookies; publishable key only; no service-role fallback.
- `app/[module]/page.tsx`: dynamic authenticated RLS reads for `/runtime`, `/outbox`, `/reconciliation`, `/evidence`, and `/reviews`.
- explicit states: `RUNTIME_NOT_CONFIGURED`, `AUTH_REQUIRED`, `QUERY_ERROR`, `EMPTY`, `VERIFIED`.
- no fabricated fallback metrics or synthetic production-like records.
- no auth mutation in Server Components.
- no schema or RLS mutation.

## Evidence register
| Evidence ID | Evidence Type | Source | Version/Date | Authority/Owner | Relevant Assertion | Expected | Actual | Verification |
|---|---|---|---|---|---|---|---|---|
| HEPE-REL03-EVD-001 | Controlled Baseline | `non-production` | 2026-09-10 | Repository | WEB-01B/UI baseline starting state | controlled | SHA `9a66662e08b3cbcd89d42f2f4cc52ca4549623e4` | PASS |
| HEPE-REL03-EVD-002 | Verified System Evidence | Supabase table inventory | 2026-09-10 | Supabase project | REL-02A tables exist with RLS | present/RLS | verified | PASS |
| HEPE-REL03-EVD-003 | Verified System Evidence | Supabase `pg_policies` inspection | 2026-09-10 | Supabase project | runtime sources preserve actor/authority scope | scoped policies | verified | PASS |
| HEPE-REL03-EVD-004 | Verified System Evidence | `read_model_registry` | 2026-09-10 | Supabase project | active security-invoker read models exist | present | 5 active models verified | PASS |
| HEPE-REL03-EVD-005 | Verified System Evidence | Supabase runtime counts | 2026-09-10 | Supabase project | current persistence/read-model row state known before test | inspect only | reviews=5; REL-02A runtime queues/snapshots=0; evidence_objects=0 | PASS |
| HEPE-REL03-EVD-006 | Controlled Implementation Record | `feat/hepe-rel-03-runtime-binding` | 2026-09-10 | Repository | authenticated RLS read binding implemented | frontend/server read binding | implemented | PASS — repository state |
| HEPE-REL03-EVD-007 | Test / Regression Evidence | GitHub Actions governance-policy | 2026-09-10 | GitHub Actions | governance contract on runtime-binding PR | SUCCESS | prior exact head passed; recheck required after this evidence commit | PASS WITH FINAL-HEAD RECHECK |
| HEPE-REL03-EVD-008 | Test / Regression Evidence | Supabase authenticated synthetic RLS read | 2026-09-10 | Supabase NON-PRODUCTION | PREPARER_A sees programme-scoped review rows; NO_AUTHORITY sees none | scoped ALLOW / DENY | PREPARER_A review_queue=5; NO_AUTHORITY all governed reads=0 | PASS |
| HEPE-REL03-EVD-009 | Test / Regression Evidence | Supabase synthetic write harness | 2026-09-10 | Explicit gate-scoped Human Authority / Supabase NON-PRODUCTION | outbox lifecycle, synthetic ACK, failure paths, idempotency and cleanup | all assertions PASS | 12/12 assertions PASS | PASS |
| HEPE-REL03-EVD-010 | Test / Regression Evidence | Supabase cleanup verification | 2026-09-10 | Supabase NON-PRODUCTION | no residual REL-03A fixtures | zero | zero for `SYNTHETIC_REL03A` scope | PASS |
| HEPE-REL03-EVD-011 | Test / Regression Evidence | Vercel exact-head preview build | pending | CI / Preview | compile/type/dynamic route build | PASS | NOT YET VERIFIED | PENDING |
| HEPE-REL03-EVD-012 | Test / Regression Evidence | authenticated browser/runtime read | pending | NON-PRODUCTION application runtime | browser session enforces RLS-visible read states | PASS | NOT YET VERIFIED | PENDING |

## Current classification
HEPE-REL-03A: **PASS WITH CONDITIONS — SYNTHETIC DATABASE RUNTIME VERIFIED / EXACT-HEAD PREVIEW + BROWSER RUNTIME VERIFICATION PENDING**  
Application Runtime Read Binding: **IMPLEMENTED IN SOURCE**  
RLS Synthetic Read Regression: **PASS**  
Synthetic Outbox Lifecycle: **PASS**  
Synthetic Attempt Persistence: **PASS**  
Synthetic Reconciliation Path: **PASS**  
Idempotency Regression: **PASS**  
Synthetic Health Snapshot: **PASS**  
Synthetic Fixture Cleanup: **PASS**  
Live Remote Connector: **NOT VERIFIED / NOT AUTHORIZED**  
Production Authorization: **NOT GRANTED**

Conversation ≠ Audit Evidence. Controlled Baseline / Verified System Evidence prevail.
