# HEPE-REL-01 — Connector Resilience & Failure-Mode Governance Contract

Environment: **NON-PRODUCTION ONLY**  
Status: **CONTROLLED / MERGED — human-approved PR #18 merged to `non-production` at `68299f0baa10c12bdfc16a184a153f85b8ad16e6`**  
Predecessor: `HEPE-GOV-COPILOT-02C-RECOVERY-CONTRACT.md`

## 1. Evidence and authority boundary
Conversation, AI output, cached state, or connector availability is not Audit Evidence. Verified System Evidence / Controlled Baseline prevails. Production-sensitive, destructive, admin, schema, authority-grant, secret, SMTP-send, and real-user operations remain outside this contract unless separately authorized.

## 2. Verified connector inventory basis
The existing controlled connector registry identifies GitHub, Vercel, Supabase, Google Drive, Google Calendar, Gmail, and a future-connector deny entry. Registry verification is operation-specific: GitHub is partially verified; the other named connectors remain unverified in that registry. This contract classifies resilience behavior without claiming current installation or runtime availability for unverified connectors.

| ID | System | Purpose | Capability posture | Criticality | Verification |
|---|---|---|---|---|---|
| MCP-GH-01 | GitHub | Engineering governance/source control | controlled read/write; admin human-gated | CORE for canonical source/governance | PARTIALLY VERIFIED |
| MCP-VER-01 | Vercel | Preview/deployment | read controlled; consequential writes human-gated | IMPORTANT; production-sensitive deployment CORE/HUMAN-GATED | UNVERIFIED IN REGISTRY |
| MCP-SB-01 | Supabase | Database/Auth | read controlled; writes gate-scoped; admin human-gated | CORE where authority/data truth depends on it | UNVERIFIED IN REGISTRY |
| MCP-DRV-01 | Google Drive | Controlled documents | read controlled; writes gate-scoped | IMPORTANT | UNVERIFIED IN REGISTRY |
| MCP-CAL-01 | Google Calendar | Academic scheduling | read controlled; writes gate-scoped | IMPORTANT | UNVERIFIED IN REGISTRY |
| MCP-GML-01 | Gmail | Email read/draft/send | real send human-gated | IMPORTANT | UNVERIFIED IN REGISTRY |
| MCP-FUT-00 | Future connector | Undefined | DENY | OPTIONAL until approved | NOT APPROVED |

Google AI Studio, Azure/Microsoft services, and any other connector not established by the controlled registry are **UNVERIFIED / REQUIRES EVIDENCE** under HEPE-REL-01; no operational claim is made for them.

## 3. Operation semantics
Operation classes: `READ`, `WRITE`, `ADMIN`, `DESTRUCTIVE`, `PRODUCTION-SENSITIVE`, `HUMAN-GATED`.

Execution dispositions: `AUTO-RETRY`, `QUEUE`, `REVALIDATE`, `NEVER-QUEUE`, `HUMAN-RECONFIRM`, `DENY`.

Mandatory rules:
- READ may retry only for bounded transient/network/rate-limit/5xx/timeout failures; stale/conflicting/unknown responses require revalidation.
- WRITE may queue/retry only after current authority, destination-state verification, and idempotency validation.
- ADMIN and DESTRUCTIVE operations are never automatically replayed.
- PRODUCTION-SENSITIVE operations are denied without explicit Production Authorization and are never silently replayed.
- HUMAN-GATED operations require fresh confirmation when material state or authority has changed.
- `UNKNOWN` is never treated as safe retry.

## 4. Retry / queue / revalidation policy
| Operation | Typical transient disposition | Queue | Idempotency | Authority revalidation | Destination revalidation | Human reconfirm |
|---|---|---|---|---|---|---|
| READ | AUTO-RETRY | No | No | when authority-scoped | source freshness | No |
| WRITE | QUEUE after validation | Conditional | Required | Required | Required | if human-gated/stale |
| ADMIN | NEVER-QUEUE | No | N/A | Required | Required | Required |
| DESTRUCTIVE | NEVER-QUEUE | No | N/A | Required | Required | Required |
| PRODUCTION-SENSITIVE | DENY absent explicit authorization | No | Required where applicable | Required | Required | Required |
| HUMAN-GATED | HUMAN-RECONFIRM on stale/material change | No automatic queue | Required for writes | Required | Required | Required |

Default bounded retry ceiling for READ/transient paths: 3 attempts with backoff. Queue expiry and operation-specific timeouts must be supplied by the invoking contract; absence of a defined expiry/time limit causes revalidation/deny rather than indefinite execution.

Failure classes: `TRANSIENT`, `AUTHENTICATION`, `AUTHORIZATION`, `RATE_LIMIT`, `REMOTE_5XX`, `NETWORK`, `TIMEOUT`, `STATE_CONFLICT`, `STALE_AUTHORITY`, `DUPLICATE_RISK`, `UNKNOWN`.

## 5. Canonical idempotency record
Every retriable WRITE must bind: Operation ID, Correlation ID, Idempotency Key, Actor, Authority Scope, Target Resource, Payload Fingerprint, Attempt Number, Created At, Expiry, Destination State Before, Destination State After, Final Disposition.

Rules: completed identical key/payload => no-op success; destination already at intended state => no-op success; same key with different payload => conflict/deny; ambiguous destination => reconciliation required; incomplete or stale authority => revalidation.

## 6. Command state machine
Success path: `CREATED → VALIDATED → AUTHORIZED → READY → DISPATCHED → ACKNOWLEDGED → VERIFIED → COMPLETED`.

Failure states: `RETRYABLE_FAILURE`, `REVALIDATION_REQUIRED`, `HUMAN_RECONFIRM_REQUIRED`, `CONFLICT`, `EXPIRED`, `DENIED`, `ABORTED`.

No failure state may jump directly to execution. A retryable failure must pass authority, destination-state, idempotency, and expiry checks. Human-gated stale state cannot transition back to AUTHORIZED without fresh confirmation.

## 7. Circuit breaker
States: `CLOSED`, `OPEN`, `HALF_OPEN`. Default synthetic threshold: 3 consecutive relevant failures; observation window/cooldown are connector-operation policy inputs, not global authorization. OPEN blocks immediate dispatch. CORE operations fail controlled or queue only if policy permits; IMPORTANT operations use a defined fallback; OPTIONAL operations degrade gracefully. Circuit state never overrides authority, human gates, idempotency, or Production prohibition.

## 8. Connector health model
Expose only non-secret operational metadata: runtime state (`CONNECTED`, `DEGRADED`, `OFFLINE`, `RECONCILING`), last success, last failure, failure class, consecutive failures, circuit state, queue depth, oldest queued command, pending reconciliation count, authority-revalidation pending flag, and last evidence timestamp.

## 9. Recovery sequence
Preserve the controlled 02C sequence: `DETECT → CLASSIFY → RE-READ → REVALIDATE AUTHORITY → CHECK IDEMPOTENCY → RECONCILE → RETRY ONLY IF ALLOWED → RECORD PROVENANCE`.

## 10. Implementation boundary
`lib/governance/connector-resilience.mjs` is a non-production policy foundation only. It does not bind real connectors, persist queues, alter schema, access secrets, grant authority, send mail, or deploy Production. `scripts/hepe-rel-01-test.mjs` is a synthetic deterministic regression harness.

## 11. Controlled status and limitation
The foundation became controlled through human-approved PR #18. Verified final-head GitHub Actions reported `governance-policy=success` and the synthetic regression reported `23/23 PASS`; post-merge GitHub state showed `non-production` advanced to merge SHA `68299f0baa10c12bdfc16a184a153f85b8ad16e6` with valid merge-commit signature.

Classification: **PASS WITH DOCUMENTED LIMITATION — NON-PRODUCTION**. Live remote connector availability and durable outbox persistence are outside this gate. Independent reviewer remains unavailable/deferred and separation-of-duties remains unverified. No Production Authorization is granted.
