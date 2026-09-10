# HEPE-REL-03 — Application Runtime Binding Evidence

Environment: **NON-PRODUCTION ONLY**  
Record status: **PROPOSED CONTROLLED EVIDENCE RECORD — READ BINDING + SYNTHETIC WRITE REGRESSION VERIFIED / PREVIEW RUNTIME ACCEPTANCE HOLD**  
Production Authorization: **NOT GRANTED**

## Scope
This gate binds the controlled HEPE interface to authenticated, RLS-preserving reads from the authoritative NON-PRODUCTION Supabase project and the REL-02A persistence foundation. HEPE-REL-03A received explicit Human Authority for a **SYNTHETIC DATABASE WRITE TEST ONLY**. HEPE-REL-03B authorizes PREVIEW build/runtime acceptance only. None of these gates authorize Production, schema/RLS modification, secret/environment mutation, SMTP, real-user authority change, or real external connector writes.

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

Verified read-model sources include:
- `v_hepe_review_queue_v1`
- `v_hepe_evidence_projection_v1`
- `read_model_registry`

The read-model registry contains five active SECURITY_INVOKER models: `RM_REVIEW_QUEUE`, `RM_EVIDENCE_HEALTH`, `RM_PROGRAMME_DASHBOARD`, `RM_CPRR`, and `RM_COMMAND_AVAILABILITY`.

## Verified RLS posture
- `connector_outbox` SELECT requires scoped A0 authority and coherent scope.
- `connector_outbox` INSERT/UPDATE requires scoped A1 authority and excludes PRODUCTION-SENSITIVE inserts.
- `connector_attempt` SELECT/INSERT is scoped through the owning outbox and current actor authority.
- `reconciliation_item` SELECT is scoped through outbox authority; human resolution requires HUMAN actor plus A3 authority.
- `connector_health_snapshot` SELECT requires an authenticated mapped actor; INSERT requires SYSTEM role-class authority.
- `reviews` and `evidence_objects` SELECT are programme-scoped through current actor A0 authority.
- `read_model_registry` is authenticated-select only.

REL-03/03A did not weaken or bypass these policies.

## Synthetic authenticated RLS read regression
Database-session test with synthetic JWT claims only:

Authorized PREPARER_A (`A2`, programme scope `SYN-HEPE-A`):
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

Expected: scoped ALLOW for authorized actor and DENY/no governed rows for actor without authority.  
Actual: matched expectation.  
Status: **PASS**.

## HEPE-REL-03A synthetic database write regression
Authorization scope: explicit Human Authority for `HEPE-REL-03A SYNTHETIC DATABASE WRITE TEST` only.

All writes used synthetic identities and connector id `SYNTHETIC_REL03A`; all acknowledgement references were explicitly synthetic and no remote connector was called.

| Test ID | Expected | Actual | Status |
|---|---|---|---|
| REL03A-W01 | RLS-scoped synthetic outbox insert ALLOW | inserted | PASS |
| REL03A-W02 | idempotency record insert ALLOW | inserted | PASS |
| REL03A-W03 | `CREATED→VALIDATED→AUTHORIZED→READY→DISPATCHED→ACKNOWLEDGED→VERIFIED→COMPLETED` | COMPLETED | PASS |
| REL03A-W04 | `DISPATCHED→CONFLICT` opens reconciliation | CONFLICT + OPEN reconciliation | PASS |
| REL03A-W05 | `RETRYABLE_FAILURE→READY` requires revalidation | revalidated READY then ABORTED | PASS |
| REL03A-W06 | `CREATED→DENIED` allowed | DENIED | PASS |
| REL03A-W07 | expired command can transition to EXPIRED | EXPIRED | PASS |
| REL03A-W08 | SYSTEM actor can insert synthetic health snapshot | 1 synthetic snapshot | PASS |
| REL03A-I01 | duplicate same key rejected | unique_violation | PASS |
| REL03A-I02 | same key conflicting payload rejected | unique_violation | PASS |
| REL03A-R01 | PREPARER_A reads only own scoped synthetic outbox rows | 5 rows | PASS |
| REL03A-CLEANUP | zero residual REL-03A fixtures | zero residual | PASS |

Synthetic ACK used: `SYNTHETIC-ACK-REL03A-MAIN`. This is not evidence of a live remote connector acknowledgement.

## Application implementation
Branch: `feat/hepe-rel-03-runtime-binding`

Implemented:
- `lib/hepe/server-supabase.ts`: server-side Supabase client using the existing runtime-binding contract and request cookies; publishable key only; no service-role fallback.
- `app/[module]/page.tsx`: authenticated RLS reads for `/runtime`, `/outbox`, `/reconciliation`, `/evidence`, `/reviews`.
- explicit states: `RUNTIME_NOT_CONFIGURED`, `AUTH_REQUIRED`, `QUERY_ERROR`, `EMPTY`, `VERIFIED`.
- no fabricated fallback metrics.
- no auth mutation in Server Components.
- no schema or RLS mutation.

## HEPE-REL-03B Preview acceptance attempt
Expected source head before evidence updates: `b4ca3cf43d042bde670c039e1f784652d857d39c`.

A controlled **PREVIEW ONLY** deployment was created from runtime-surface source files fetched verbatim from that head.

Preview evidence:
- Deployment ID: `dpl_GfXkbzHThv5kK6FXhLiwYw7oLoU5`
- Hostname: `hepe-ui-prototype-dt73fsyy9-kasemch-3467s-projects.vercel.app`
- Target: Preview / no Production target
- State: READY
- Next.js: 15.5.24
- dependency install: PASS
- compile: PASS
- type validity check: PASS
- serverless functions created: PASS
- deployment completed: PASS
- `/runtime`: HTTP 200 request observed in serverless runtime logs
- deployment response retained `x-robots-tag: noindex`

### Preview provenance limitation
This deployment was a manually submitted **controlled runtime-surface bundle** sourced from the application/runtime files of the PR head. It was **not** a Git-associated full-repository deployment and therefore cannot prove full exact-head repository deployment provenance.

### Browser/runtime acceptance blocker
The Preview rendered `/runtime` with state `RUNTIME_NOT_CONFIGURED` and no service-role bypass or fabricated fallback data. This is fail-closed, but it does not satisfy authenticated PREPARER_A / NO_AUTHORITY browser-session acceptance because Preview runtime environment binding was absent.

Result:
- Preview build: **PASS WITH PROVENANCE LIMITATION**
- unauthenticated/protected boundary: **PASS — fail closed / no governed data exposed**
- authenticated PREPARER_A browser runtime: **HOLD — runtime binding unavailable in Preview**
- NO_AUTHORITY browser runtime: **HOLD — same Preview binding blocker**
- UI truth semantics: **PASS for observed `RUNTIME_NOT_CONFIGURED` state**

## HEPE-REL-03C runtime-environment binding exception stop
Date: 2026-09-10.

Verified system facts:
- Vercel project `prj_ILMW6fZGJVhOdq1M2zKaxXmzRZcH` is reachable and latest Preview remains `dpl_GfXkbzHThv5kK6FXhLiwYw7oLoU5`.
- The available Vercel connector surface supports project/deployment inspection, preview deploy, logs and protected URL access but does **not** expose a project environment-variable mutation action.
- Supabase project `lztxpjsuzqvtgyasfnyj` has an active modern publishable key and an active legacy anon key; key values are intentionally not copied into this evidence record.
- Vercel documentation confirms Preview environment variables can be scoped to the `preview` target and, where needed, to a Git branch.

Therefore HEPE-REL-03C reached the defined **Exception Stop** at the minimum human-only configuration boundary. No secret/environment mutation was attempted through unsupported tooling.

Required human-only action before automation can resume:
1. In Vercel project `hepe-ui-prototype`, add/reuse `NEXT_PUBLIC_SUPABASE_URL` for **Preview only** with value `https://lztxpjsuzqvtgyasfnyj.supabase.co`.
2. Add/reuse `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` for **Preview only**, using the existing active modern publishable key from Supabase project `lztxpjsuzqvtgyasfnyj` without exposing it in repository files or chat output.
3. Do not target Production and do not modify any other environment variable.

After this binding is completed, resume REL-03C from Preview redeploy and authenticated browser acceptance. This configuration action is operational setup, not Production Authorization.

## Evidence register
| Evidence ID | Evidence Type | Source | Version/Date | Authority/Owner | Relevant Assertion | Expected | Actual | Verification |
|---|---|---|---|---|---|---|---|---|
| HEPE-REL03-EVD-001 | Controlled Baseline | `non-production` | 2026-09-10 | Repository | WEB-01B/UI starting state | controlled | SHA `9a66662e...` | PASS |
| HEPE-REL03-EVD-002 | Verified System Evidence | Supabase table/policy inspection | 2026-09-10 | Supabase | REL-02A + RLS foundation | present/scoped | verified | PASS |
| HEPE-REL03-EVD-003 | Verified System Evidence | `read_model_registry` | 2026-09-10 | Supabase | active security-invoker models | present | 5 verified | PASS |
| HEPE-REL03-EVD-004 | Test / Regression Evidence | Supabase synthetic RLS read | 2026-09-10 | Supabase | PREPARER_A ALLOW / NO_AUTHORITY DENY | scoped | matched | PASS |
| HEPE-REL03-EVD-005 | Test / Regression Evidence | Supabase synthetic write harness | 2026-09-10 | Explicit Human gate authority / Supabase | lifecycle/idempotency/failure paths | all PASS | 12/12 PASS | PASS |
| HEPE-REL03-EVD-006 | Test / Regression Evidence | Supabase cleanup verification | 2026-09-10 | Supabase | zero residual REL03A fixtures | zero | zero | PASS |
| HEPE-REL03-EVD-007 | Test / Regression Evidence | Vercel Preview `dpl_GfX...` | 2026-09-10 | Vercel Preview | runtime-surface compile/type/deploy | PASS | READY; compile/type PASS | PASS WITH PROVENANCE LIMITATION |
| HEPE-REL03-EVD-008 | Test / Regression Evidence | Vercel `/runtime` + runtime logs | 2026-09-10 | Vercel Preview | unauthenticated/protected request exposes no governed data | fail closed | `RUNTIME_NOT_CONFIGURED`; HTTP 200; no governed data | PASS |
| HEPE-REL03-EVD-009 | Verified System Evidence | Vercel connector capability + project inspection | 2026-09-10 | Vercel | can environment binding be mutated by available connector | available action required | no env-var mutation action exposed | VERIFIED LIMITATION |
| HEPE-REL03-EVD-010 | Verified System Evidence | Supabase publishable key registry | 2026-09-10 | Supabase | active publishable key exists | active | verified without repository disclosure | PASS |
| HEPE-REL03-EVD-011 | Test / Regression Evidence | authenticated browser session | 2026-09-10 | NON-PRODUCTION Preview | PREPARER_A/NO_AUTHORITY RLS-visible behavior | PASS | blocked pending Preview env binding | HOLD |

## Current classification
HEPE-REL-03A: **PASS — SYNTHETIC DATABASE RUNTIME VERIFIED / CLEANUP PASS**  
HEPE-REL-03B: **HOLD — PREVIEW BUILD VERIFIED WITH PROVENANCE LIMITATION / AUTHENTICATED BROWSER RUNTIME BLOCKED BY PREVIEW ENVIRONMENT BINDING**  
HEPE-REL-03C: **EXCEPTION STOP — MINIMUM HUMAN-ONLY PREVIEW ENVIRONMENT BINDING REQUIRED**  
HEPE-REL-03 overall: **PASS WITH CONDITIONS / NOT YET CONTROLLED-RECONCILED FULL PASS**  
Live Remote Connector: **NOT VERIFIED / NOT AUTHORIZED**  
Production Authorization: **NOT GRANTED**

Conversation ≠ Audit Evidence. Controlled Baseline / Verified System Evidence prevail.
