# HEPE-GOV-COPILOT-02C — AI / Connector Degraded-Mode Governance

Environment: NON-PRODUCTION ONLY
Status: PROPOSED / PR VALIDATION REQUIRED
Upstream Controlled Baseline: HEPE Copilot Governance v1.0 — Frozen / Controlled Baseline

## State model
Every governed AI/connector dependency is classified as one of:
- CONNECTED — expected capability is available and current state is validated.
- DEGRADED — capability is partially available or unreliable; continue only with reduced, non-escalating behavior.
- OFFLINE — capability unavailable; use manual/repository-native path where possible.
- RECONCILING — service has returned and current state is being revalidated before writes or consequential actions resume.

Applies to GitHub Copilot, ChatGPT, Claude, Gemini, MCP connectors, GitHub connector, and future governed connectors.

## Non-escalation rule
Failure, timeout, partial availability, stale state, or recovery must never elevate permissions, authority, data access, deployment scope, or evidence status.

## Required continuity
Loss of any AI/connector must not remove the authoritative repository source, Controlled Baseline, applicable tests/CI, Human Decision path, manual engineering path, or audit/evidence provenance.

## Operation classes and recovery
| Operation class | Recovery behavior |
|---|---|
| READ | Revalidate source/state before relying on it. |
| WRITE | Require idempotency/revalidation and current authorization. |
| ADMIN | Never auto-replay; fresh controlled authorization required. |
| DESTRUCTIVE | Never auto-replay. |
| PRODUCTION-SENSITIVE | Never auto-replay; separate explicit Production Authorization required. |
| HUMAN-GATED | Fresh Human Authority required; prior approval is not silently reused. |

## Connector recovery rules
- Reconnection does not imply authorization.
- Queued or failed writes are not blindly replayed.
- If destination state may have changed, re-read before retry.
- If idempotency cannot be established, stop and reconcile rather than duplicate a write.
- Any baseline conflict, C1/C2 finding, authority ambiguity, or security-control ambiguity is an Exception Stop.

## AI-specific rules
- AI outage cannot invalidate a repository record that remains otherwise verifiable.
- AI return from OFFLINE does not grant authority or convert previous AI output into evidence.
- Conflicting AI outputs remain advisory and route through the 02B Reconciliation Contract.
- No AI is a single point of academic, governance, security, deployment, or production authority.

## Exception Stop
Stop the affected path for Production Authorization, secret/credential binding, real-user/SMTP action, authority grant, destructive operation, schema/data write outside authorized scope, failed required CI not safely repairable, C1/C2 finding, or Controlled Baseline contradiction.
