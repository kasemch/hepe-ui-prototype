# HEPE-GOV-COPILOT-02C — Recovery & Reconciliation Contract

Environment: NON-PRODUCTION ONLY

## Recovery sequence
DETECT → CLASSIFY → RE-READ → REVALIDATE AUTHORITY → CHECK IDEMPOTENCY → RECONCILE → RETRY ONLY IF ALLOWED → RECORD PROVENANCE.

## Required record
For any material degraded/offline recovery event record:
- Recovery ID
- Dependency / connector
- Prior state
- Current state
- Operation class
- Failed or uncertain operation
- Last verified source state
- Current verified destination state
- Idempotency key / duplicate-risk assessment
- Required authority
- Retry decision
- Actual result
- Evidence source
- Verification status

## Replay policy
READ: revalidate and repeat if safe.
WRITE: repeat only after current authorization, destination-state check, and idempotency/duplicate-risk validation.
ADMIN: never automatic replay.
DESTRUCTIVE: never automatic replay.
PRODUCTION-SENSITIVE: never automatic replay; explicit Production Authorization required.
HUMAN-GATED: prior approval is not automatically reusable if material state changed; fresh Human Authority where contract requires it.

## Evidence rule
A recovery log, AI statement, or conversation does not by itself become Audit Evidence. Admit only records meeting the HEPE evidence metadata/provenance requirement.

## Conflict rule
If recovered system state conflicts with conversation, AI summary, cached state, or draft documentation, Verified System Evidence / Controlled Baseline prevails and a Reconciliation Item is opened where needed.
