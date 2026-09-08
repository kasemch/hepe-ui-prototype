# HEPE-GOV-COPILOT-02C — Live Drill Execution Gate Preparation

Environment: NON-PRODUCTION ONLY
Status: PREPARED / EXECUTION NOT AUTHORIZED
Upstream baseline: HEPE Copilot Governance v1.0 — Frozen / Controlled Baseline
Upstream runbook: HEPE-GOV-COPILOT-02C — NON-PRODUCTION Live Degraded-Mode Drill Runbook

## Authority boundary
This controlled record prepares the execution gate only. It does not authorize live write simulation, Production deployment/configuration, Production credentials, real-user actions, SMTP, authority grants, destructive actions, ruleset changes, or schema/data writes outside the exact synthetic target defined below.

Conversation is not Audit Evidence. AI output is advisory unless independently admitted under the HEPE Evidence Admission Rule.

## Deterministic drill identity
Drill ID: `LDM-2026-09-08-R01`
Idempotency token: `HEPE-LDM-2026-09-08-R01-IDEMPOTENT-001`
Synthetic marker: `HEPE_SYNTHETIC_DRILL=true`
Environment marker: `NON_PRODUCTION_ONLY=true`

## Proposed synthetic target
Repository: `kasemch/hepe-ui-prototype`
Proposed temporary branch: `test/hepe-ldm-2026-09-08-r01`
Protected target: NO — must not be `non-production`, `main`, or any Production-bound branch.
Proposed synthetic artifact path:
`docs/governance/tests/runtime/LDM-2026-09-08-R01-synthetic-write.txt`

The temporary branch and synthetic artifact MUST NOT be created until separate explicit execution approval is supplied.

## Allowed write scope for the execution gate
If separately authorized, the only consequential write allowed for LDM-03 is creation/read-back/conditional retry of the single synthetic artifact on the dedicated temporary test branch. No other repository content may be modified by the drill.

Artifact content must include exactly the drill ID, idempotency token, synthetic marker, NON-PRODUCTION marker, and a run timestamp/provenance line. No secret, credential, personal data, real-user data, academic authority data, SMTP data, or Production value may be included.

## Idempotency mechanism
Before any retry:
1. Read the exact target path on the exact temporary branch.
2. If an artifact containing the deterministic idempotency token already exists, classify the first write as LANDED and do not retry.
3. If the path does not exist and repository state is verified current, a single retry may occur only within the authorized execution gate.
4. If destination state is ambiguous or cannot be re-read, STOP — do not retry.

Duplicate acceptance criterion: exactly one artifact containing the idempotency token exists after the test.

## Proposed drill cases and evidence anchors

### LDM-01 — AI advisory unavailable
Execution method: intentionally omit one advisory AI from a bounded governance read/review task.
Expected: repository source, Controlled Baseline, CI and Human Decision path remain usable; no bypass or authority elevation.
Evidence source: repository reads, applicable CI/status, execution record.

### LDM-02 — Connector read unavailable
Execution method: exercise a reversible unavailable/denied read path with no consequential write.
Expected: DEGRADED/OFFLINE classification, repository-native/manual fallback where available, no permission broadening, recovery requires re-read.
Evidence source: failed read response + successful authoritative re-read through allowed path.

### LDM-03 — Synthetic write idempotency
Execution method: single synthetic artifact on the dedicated temporary test branch only.
Expected: destination-state revalidation before retry and exactly one artifact after recovery.
Evidence source: branch/path fetches, commit provenance, duplicate-count verification.

### LDM-04 — ADMIN replay prohibition
Execution method: no-op descriptor only. No administrative mutation.
Expected: AUTO-REPLAY = DENY; real ADMIN action requires fresh controlled authorization.

### LDM-05 — Recovery reconciliation
Execution method: compare last verified state to fresh repository state after simulated recovery.
Expected: DEGRADED/OFFLINE → RECONCILING → CONNECTED only after validation; conflicts open reconciliation instead of overwrite.

### LDM-06 — Permission non-escalation
Execution method: compare governed ruleset/repository permission posture before and after drill.
Expected: no broadening and ruleset `22409192` unchanged.

### LDM-07 — Replay matrix
WRITE: conditional only after current-state + authorization + idempotency checks.
ADMIN: never auto-replay.
DESTRUCTIVE: never auto-replay.
PRODUCTION-SENSITIVE: never auto-replay; separate Production Authorization required.
HUMAN-GATED: fresh applicable Human Authority when contract requires it.

## Evidence record schema
For each executed case record:
Evidence ID → Evidence Type → Test ID → Source → Version/Date → Authority/Owner → Scope → Preconditions → Expected → Actual → Evidence Source → Run/Revision → Verification Status → Recovery Result.

Expected evidence classifications include Verified System Evidence, Test/Regression Evidence, Approved Decision, or Controlled Record as applicable. Conversation/AI narrative alone remains CONTEXT / DISCUSSION / UNVERIFIED INPUT.

## Cleanup plan
If the execution gate is approved and the synthetic write test is executed:
1. Verify exactly one synthetic artifact exists before cleanup.
2. Record its commit/path/idempotency token as test evidence.
3. Remove the temporary synthetic branch/artifact only if cleanup is separately safe and permitted by the execution gate.
4. Verify `non-production` HEAD and ruleset `22409192` are unchanged by the drill.
5. Verify no Production target, Production credential, real user, SMTP, authority, or destructive operation was touched.
6. Record cleanup result with expected/actual/PASS-FAIL.

## Stop conditions
Stop immediately for any Production target/credential, real-user/SMTP action, authority grant, destructive operation, ruleset modification, write outside the exact synthetic target, permission escalation, ambiguous destination state, unprovable idempotency, failed required CI not safely repairable, C1/C2 finding, or Controlled Baseline contradiction.

## Human execution checkpoint
Execution status: **HOLD — HUMAN ACTION REQUIRED**.

Separate explicit approval must name this gate and authorize only the NON-PRODUCTION live drill on the defined synthetic target before the temporary branch or synthetic artifact is created.

Reviewer hardening is a separate workstream and remains blocked until Human Authority supplies a named candidate GitHub username for permission and independence verification.

This record is not Production Authorization and does not claim Production Readiness.
