# HEPE-REL-02 — Durable Outbox / Reconciliation Persistence Evidence

Environment: **NON-PRODUCTION ONLY**  
Record status: **CONTROLLED / MERGED — human-approved PR #20 merged to `non-production` at `de4555674b7362b1e91beaef8aab89f43217584f`**  
Schema execution: **NOT AUTHORIZED**

## Scope
HEPE-REL-02 evaluates the existing non-production persistence model, designs a durable connector outbox/reconciliation contract, prepares a non-executable schema candidate, and adds deterministic model regression. No Supabase schema mutation or data write was performed by this gate.

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

The SQL artifact remains explicitly marked **NOT AUTHORIZED FOR EXECUTION** and is not placed in an executable Supabase migration directory.

## RLS / authority candidate
Controlled design assertions:
- outbox create/read requires active scoped academic authority;
- wrong-programme and wrong-course access is deny-by-default;
- attempt history is append-only to ordinary actors;
- reconciliation resolution requires explicitly authorized human authority;
- technical service access does not confer academic authority;
- Production-sensitive operations remain denied without explicit Production Authorization.

These remain design assertions until a separately authorized schema/RLS gate applies and tests them against the database.

## Model regression
The deterministic harness covers: completed duplicate no-op, payload mismatch conflict, authority-scope fingerprint conflict, expiry denial, stale human authority reconfirmation, ambiguous destination reconciliation, admin/destructive/production replay denial, stale non-human authority revalidation, same-scope candidate allow, cross-programme denial, wrong-course denial, explicit cross-programme candidate behavior, and expiry semantics.

Final PR #20 head: `0e92308fc26257ea035cdc4d47f38de00c9f5195`.

GitHub Actions check `governance-policy`, job id `102809223715`, completed with `conclusion=success` on the final PR head. Both `Verify HEPE-REL-01 synthetic connector resilience regression` and `Verify HEPE-REL-02 durable outbox model regression` completed successfully.

## Merge provenance
PR #20 was explicitly human-approved for a **NON-PRODUCTION design-only merge**. GitHub reports `merged=true` with merge SHA `de4555674b7362b1e91beaef8aab89f43217584f`. Post-merge verification showed `non-production` advanced to that SHA and the merge commit signature was verified as valid. Ruleset `22409192` remained active with `required_review_thread_resolution=true`, required `governance-policy`, and no bypass actors.

This merge did **not** authorize schema execution, database write, Production action, secrets, SMTP, authority grants, reviewer substitution, ruleset mutation, or destructive action.

## Evidence register
| Evidence ID | Evidence Type | Source | Version/Date | Authority/Owner | Relevant Contract/Assertion | Expected | Actual | Verification |
|---|---|---|---|---|---|---|---|---|
| HEPE-REL02-EVD-001 | Controlled Document | HEPE-REL-01 controlled evidence/contract | repository baseline | repository governance owner | REL-02 predecessor and persistence limitation | REL-01 controlled; durable outbox missing | matched | PASS |
| HEPE-REL02-EVD-002 | Verified System Evidence | GitHub `.env.example` on `non-production` | gate start | repository | identifies bound non-production Supabase project | project binding present | present | PASS |
| HEPE-REL02-EVD-003 | Verified System Evidence | Supabase read-only `public` schema inspection | 2026-09-10 | Supabase project / database | discover reusable/missing persistence objects | inspect without mutation | `command_requests` reusable partially; connector persistence tables absent | PASS |
| HEPE-REL02-EVD-004 | Controlled Design Artifact | HEPE-REL-02 schema candidate | PR #20 / 2026-09-10 | repository governance owner | exact proposed schema delta | non-executable candidate | prepared and merged as controlled design artifact | CONTROLLED / NOT EXECUTED |
| HEPE-REL02-EVD-005 | Test / Regression Evidence | GitHub Actions PR #20 job `102809223715` on final head `0e92308f...` | 2026-09-10 | GitHub Actions / repository | REL-01 regression + REL-02 model regression | SUCCESS | SUCCESS | PASS |
| HEPE-REL02-EVD-006 | Verified System Evidence | GitHub PR #20 | merged 2026-09-10 | repository / gate-scoped Human Approval | exact approved design PR merged | merged=true; expected head preserved | merged=true; merge SHA `de4555674b7362b1e91beaef8aab89f43217584f` | PASS |
| HEPE-REL02-EVD-007 | Verified System Evidence | GitHub `non-production` branch | post-merge 2026-09-10 | repository | branch advanced to approved merge | HEAD equals merge SHA; valid merge provenance | HEAD `de4555674b7362b1e91beaef8aab89f43217584f`; signature verified | PASS |
| HEPE-REL02-EVD-008 | Verified System Evidence | GitHub Ruleset `22409192` | post-merge 2026-09-10 | repository administrative authority | governed branch controls unchanged | active; review-thread resolution true; governance-policy required; no bypass | matched | PASS |

## Known limitations
- No schema or RLS policy has been applied.
- No durable outbox exists yet in the database.
- No live connector queue/replay is exercised.
- Cross-scope RLS behavior is only a design/test-model candidate until database execution is separately authorized.
- Production remains out of scope.
- Independent reviewer remains unavailable/deferred; separation-of-duties remains unverified.

## Final design classification
HEPE-REL-02 Design: **PASS / CONTROLLED — NON-PRODUCTION**  
Schema Delta: **REQUIRED**  
RLS Candidate: **CONTROLLED DESIGN**  
Migration Artifact: **CONTROLLED / NOT EXECUTED**  
Schema Execution: **NOT AUTHORIZED**  
Durable Outbox Runtime: **NOT IMPLEMENTED**  
Environment: **NON-PRODUCTION**  
Production Authorization: **NOT GRANTED**

Next schema execution, if pursued, requires a separate explicit `HEPE-REL-02A` Schema Modification Authorization. PR #20 approval must not be reused for that purpose.

Conversation ≠ Audit Evidence. Controlled Baseline / Verified System Evidence prevail.
