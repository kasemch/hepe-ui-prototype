# HEPE-GOV-COPILOT-02C — NON-PRODUCTION Live Degraded-Mode Drill Runbook

Environment: NON-PRODUCTION ONLY
Status: PROPOSED DESIGN — EXECUTION NOT YET AUTHORIZED BY THIS DOCUMENT

## Purpose
Validate the 02C degraded-mode governance contract with reversible, synthetic, non-destructive live checks while preserving Human Authority, repository controls, evidence provenance, and Production boundaries.

## Preconditions
- Target branch/environment is NON-PRODUCTION.
- Controlled Baseline and 02C extension records are retrievable from repository.
- Ruleset `22409192` remains ACTIVE for `refs/heads/non-production`.
- Required `governance-policy` CI is available.
- No Production credentials, Production deployment target, real users, SMTP, authority grants, or destructive operations are in scope.
- Each test uses synthetic data or no data write.

## Evidence schema
For every executed case record:
Test ID → Scope → Preconditions → Expected → Actual → Evidence Source → Revision/Run → Authority → PASS/FAIL → Recovery Result.

Conversation or AI narrative is not evidence by itself.

## Drill cases

### LDM-01 — AI advisory unavailable
Simulate one advisory AI as unavailable by intentionally not invoking it during a bounded governance task.

Expected:
- repository source, Controlled Baseline, issue/branch/PR/CI path and Human Decision remain available;
- no control is bypassed;
- missing AI advice is recorded as capability degradation, not as an authority gap.

### LDM-02 — Connector read unavailable
Use a reversible connector-denial or unavailable-path test where no consequential write is attempted.

Expected:
- operation moves to DEGRADED/OFFLINE;
- manual repository-native read path is used if available;
- no permission broadening occurs;
- recovery requires re-read/revalidation.

### LDM-03 — Synthetic write retry / idempotency
Use only a harmless synthetic write target specifically created for the drill, such as a temporary test artifact on an unprotected test branch, with a deterministic idempotency token in content.

Procedure:
1. Read destination state.
2. Attempt one synthetic write.
3. Simulate uncertainty before retry by withholding acknowledgement from the test harness rather than damaging the repository.
4. Re-read destination.
5. Retry only if destination state proves the first write did not land.

Expected:
- no duplicate synthetic artifact;
- destination-state revalidation occurs before retry;
- retry decision is evidence-backed.

### LDM-04 — ADMIN recovery prohibition
Model an ADMIN-class operation as a no-op test fixture; do not invoke an actual administrative mutation.

Expected:
- automatic replay = DENY;
- fresh controlled authorization required before any real ADMIN action.

### LDM-05 — Recovery reconciliation
After a simulated connector return, re-fetch authoritative repository state and compare with last verified state.

Expected:
- state transitions OFFLINE/DEGRADED → RECONCILING → CONNECTED only after validation;
- stale cached state is not trusted;
- conflicts create a Reconciliation Item rather than silent overwrite.

### LDM-06 — No permission escalation
During all simulated outage/recovery cases, verify no temporary broadening of repository, connector, AI, data, or deployment permissions.

Expected: PASS only if effective permissions remain unchanged.

### LDM-07 — No blind replay
Prepare synthetic queued-operation descriptors for WRITE, ADMIN, DESTRUCTIVE, PRODUCTION-SENSITIVE and HUMAN-GATED classes without executing prohibited classes.

Expected:
- WRITE: conditional retry after idempotency + current-state + authorization checks;
- ADMIN: never auto-replay;
- DESTRUCTIVE: never auto-replay;
- PRODUCTION-SENSITIVE: never auto-replay and separate Production Authorization required;
- HUMAN-GATED: applicable fresh Human Authority required when contract demands it.

## Stop conditions
Stop immediately for:
- any Production target or credential exposure;
- any real-user/SMTP action;
- any authority grant;
- any destructive action;
- any schema/data write outside the synthetic drill target;
- any permission broadening;
- any inability to prove idempotency for a retry;
- failed required CI not safely repairable;
- C1/C2 finding or Controlled Baseline contradiction.

## Acceptance criteria
The live drill may be classified PASS only when:
1. All executed cases have Expected/Actual/PASS-FAIL evidence.
2. At least one real degraded/offline read path is exercised safely.
3. At least one synthetic write recovery path demonstrates destination-state revalidation and no duplicate result.
4. No permission escalation occurs.
5. No ADMIN/DESTRUCTIVE/PRODUCTION-SENSITIVE operation is auto-replayed.
6. Repository/Controlled Baseline/Human Decision remain available without any one AI service.
7. Recovery provenance is retained.

## Execution authority boundary
This runbook authorizes no drill execution by itself. A separate explicit NON-PRODUCTION live-drill execution gate must identify the synthetic target, allowed write path, expected rollback/cleanup, and human checkpoint before any live write simulation is performed.

This document is not Production Authorization and must not be used to infer it.
