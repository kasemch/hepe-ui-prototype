# HEPE-REL-02 — Durable Outbox / Reconciliation Persistence Evidence

Environment: **NON-PRODUCTION ONLY**  
Record status: **PROPOSED CONTROLLED DESIGN RECORD**  
Schema execution: **NOT AUTHORIZED**

## Scope
HEPE-REL-02 evaluates the existing non-production persistence model, designs a durable connector outbox/reconciliation contract, prepares a non-executable schema candidate, and adds deterministic model regression. No Supabase schema mutation or data write is performed by this gate.

## Verified starting state
Repository baseline: `non-production` at `5e56896e1634fa86aeaf471bbf8c8a4c5ffe6cd5` after HEPE-REL-01 closure.

The repository `.env.example` binds the non-production Supabase project. A read-only schema inspection of that project identified reusable existing structures including `command_requests`, `command_registry`, `ui_command_bindings`, `authority_assignments`, and `audit_events`, with RLS enabled in the inspected schema.

`command_requests` already contains command-level idempotency/correlation primitives but lacks connector-specific queue expiry, per-attempt history, reconciliation records, destination-before/after verification, and connector health snapshots. No tables named `connector_outbox`, `connector_attempt`, `idempotency_record`, `reconciliation_item`, or `connector_health_snapshot` were identified.

## Design outputs
- `docs/governance/reliability/HEPE-REL-02-DURABLE-OUTBOX-DESIGN.md`
- `docs/governance/migrations/HEPE-REL-02-SCHEMA-CANDIDATE.sql`
- `scripts/hepe-rel-02-model-test.mjs`

## Schema delta
**REQUIRED**. Existing `command_requests` is partially reusable but insufficient for the REL-01 durable replay/reconciliation contract.

Candidate new entities:
- `connector_outbox`
- `connector_attempt`
- `idempotency_record`
- `reconciliation_item`
- `connector_health_snapshot`

The SQL artifact is explicitly marked **NOT AUTHORIZED FOR EXECUTION** and is not placed in an executable Supabase migration directory.

## RLS / authority candidate
Design assertions:
- outbox create/read requires active scoped academic authority;
- wrong-programme and wrong-course access is deny-by-default;
- attempt history is append-only to ordinary actors;
- reconciliation resolution requires explicitly authorized human authority;
- technical service access does not confer academic authority;
- Production-sensitive operations remain denied without explicit Production Authorization.

These are design assertions only until a separately authorized schema/RLS gate applies and tests them against the database.

## Model regression
The deterministic harness covers: completed duplicate no-op, payload mismatch conflict, authority-scope fingerprint conflict, expiry denial, stale human authority reconfirmation, ambiguous destination reconciliation, admin/destructive/production replay denial, stale non-human authority revalidation, same-scope candidate allow, cross-programme denial, wrong-course denial, explicit cross-programme candidate behavior, and expiry semantics.

Actual PASS/FAIL must come from GitHub Actions on the final PR head. This record does not pre-claim CI PASS.

## Evidence register
| Evidence ID | Evidence Type | Source | Version/Date | Authority/Owner | Relevant Contract/Assertion | Expected | Actual | Verification |
|---|---|---|---|---|---|---|---|---|
| HEPE-REL02-EVD-001 | Controlled Document | HEPE-REL-01 controlled evidence/contract | repository baseline | repository governance owner | REL-02 predecessor and persistence limitation | REL-01 controlled; durable outbox missing | matched | PASS |
| HEPE-REL02-EVD-002 | Verified System Evidence | GitHub `.env.example` on `non-production` | gate start | repository | identifies bound non-production Supabase project | project binding present | present | PASS |
| HEPE-REL02-EVD-003 | Verified System Evidence | Supabase read-only `public` schema inspection | gate start | Supabase project / database | discover reusable/missing persistence objects | inspect without mutation | `command_requests` reusable partially; connector persistence tables absent | PASS |
| HEPE-REL02-EVD-004 | Controlled Design Artifact | HEPE-REL-02 schema candidate | current branch | repository governance owner | exact proposed schema delta | non-executable candidate | prepared | PROPOSED |
| HEPE-REL02-EVD-005 | Test / Regression Evidence | GitHub Actions `governance-policy` on final PR head | pending | GitHub Actions | REL-01 regression + REL-02 model regression | SUCCESS | pending | PENDING |

## Known limitations
- No schema or RLS policy has been applied.
- No durable outbox exists yet in the database.
- No live connector queue/replay is exercised.
- Cross-scope RLS behavior is only a design/test-model candidate until database execution is separately authorized.
- Production remains out of scope.

## Gate classification before CI
HEPE-REL-02 Design: **PASS — PROPOSED**  
Schema Delta: **REQUIRED**  
RLS Candidate: **COMPLETE — DESIGN ONLY**  
Migration Artifact: **PREPARED — NOT AUTHORIZED FOR EXECUTION**  
Schema Execution: **NOT AUTHORIZED**  
Environment: **NON-PRODUCTION**  
Production Authorization: **NOT GRANTED**

Final gate closure requires final-head CI and Human Approval to merge the design record. Schema execution remains a separate future authorization even after this design PR is merged.

Conversation ≠ Audit Evidence. Controlled Baseline / Verified System Evidence prevail.
