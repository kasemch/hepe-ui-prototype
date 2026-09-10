# HEPE-REL-01 — Connector Resilience Evidence Package

Environment: **NON-PRODUCTION ONLY**  
Record status: **PROPOSED CONTROLLED EVIDENCE RECORD — effective only after human-approved merge to `non-production`**

## Scope
HEPE-REL-01 establishes a non-production connector-resilience policy foundation, deterministic synthetic regression harness, and controlled design contract. It does not bind real connectors or authorize Production, schema/data mutation, real-user authority, SMTP send, secrets, or destructive/admin replay.

## Controlled starting state
Authoritative starting branch: `non-production` at `313366660d8e74bb48ddb4666c8f4e03b992d214` (verified before branch creation). Ruleset `22409192` was verified active with `required_review_thread_resolution=true`, required approvals `0`, code-owner review disabled, `governance-policy` required, deletion/non-fast-forward/creation rules retained, and no bypass actors.

## Source evidence used
1. `docs/governance/HEPE-MCP-CONNECTOR-REGISTRY-v0.1.md` — connector governance registry; GitHub partially verified, Vercel/Supabase/Drive/Calendar/Gmail unverified in that gate, future connector denied by default.
2. `docs/governance/reliability/HEPE-GOV-COPILOT-02C-RECOVERY-CONTRACT.md` — controlled recovery sequence and replay constraints.
3. GitHub Ruleset `22409192` — verified system configuration state before HEPE-REL-01 work.

## Connector inventory / criticality
Only connectors supported by controlled repository records are admitted as registry-derived context: GitHub, Vercel, Supabase, Google Drive, Google Calendar, Gmail, and Future Connector. Google AI Studio and Microsoft/Azure remain `UNVERIFIED / REQUIRES EVIDENCE` for this gate because the controlled connector registry inspected for HEPE-REL-01 does not establish them as approved runtime connectors.

Criticality is operation-sensitive: canonical GitHub source/governance operations are CORE; Supabase operations are CORE where system/authority truth depends on them; Vercel/Drive/Calendar/Gmail are IMPORTANT by default with specific production-sensitive or consequential actions remaining HUMAN-GATED; future/unapproved connectors are OPTIONAL/DENY until approved.

## Policy implementation
Implementation file: `lib/governance/connector-resilience.mjs`.

Implemented controls:
- operation and failure taxonomies;
- retry/queue/revalidation classifier;
- idempotency decision guard;
- command-state revalidation guard;
- circuit-breaker transitions;
- non-secret connector registry snapshot aligned to the controlled registry.

The module has no network calls, persistence, secrets, schema access, user data, SMTP, authority mutation, deployment, or Production binding.

## Failure-mode regression scope
Synthetic harness: `scripts/hepe-rel-01-test.mjs`.

Assertions implemented:
- REL01-T01 READ timeout → bounded auto-retry disposition.
- REL01-T02 stale/conflicting READ → revalidate.
- REL01-T03 WRITE timeout before acknowledgement → queue only after prerequisites.
- REL01-T04 timeout after remote success → idempotent no-op.
- REL01-T05 duplicate retry → no second write.
- REL01-T06 same key/different payload → conflict.
- REL01-T07 expired queued write → deny.
- REL01-T08 authentication failure → revalidate.
- REL01-T09 authorization failure → revalidate.
- REL01-T10 stale human authority → human reconfirm.
- REL01-T11 remote 5xx READ → bounded retry disposition.
- REL01-T12 rate-limited validated WRITE → queue disposition.
- REL01-T13 offline/unknown destination WRITE → revalidate.
- REL01-T14 threshold opens circuit.
- REL01-T15 cooldown moves OPEN → HALF_OPEN.
- REL01-T16 successful probe closes circuit.
- REL01-T17 ADMIN replay → never queue.
- REL01-T18 DESTRUCTIVE replay → never queue.
- REL01-T19 Production-sensitive replay without explicit authorization → deny.
- REL01-T20 ambiguous destination → reconciliation required.
- REL01-T21 failed retry with unknown destination → revalidation required.
- REL01-T22 human-gated state does not silently reauthorize.
- REL01-T23 UNKNOWN failure is never a safe retry.

## Expected automated evidence
The existing `governance-policy` workflow is extended in this branch to execute the synthetic harness whenever HEPE-REL-01 implementation, tests, or governance files change. Actual PASS/FAIL must come from the GitHub Actions check on the final PR head; this proposed record does not pre-claim runtime PASS.

## Security / authority assertions
Expected outcomes:
- retry cannot bypass authority;
- WRITE retry requires destination/idempotency checks;
- stale human authority cannot silently execute;
- ADMIN and DESTRUCTIVE replay are blocked from automatic queueing;
- Production-sensitive replay is denied absent explicit Production Authorization;
- UNKNOWN failure requires revalidation;
- circuit state cannot elevate authority.

## Evidence register
| Evidence ID | Evidence Type | Source | Version/Date | Authority/Owner | Assertion | Verification |
|---|---|---|---|---|---|---|
| HEPE-REL01-EVD-001 | Controlled Document source | HEPE-MCP-CONNECTOR-REGISTRY-v0.1.md | repository version at gate start | repository governance owner | approved connector classification basis | VERIFIED AS REPOSITORY SOURCE; operation availability remains per-record status |
| HEPE-REL01-EVD-002 | Controlled Document source | HEPE-GOV-COPILOT-02C-RECOVERY-CONTRACT.md | repository version at gate start | repository governance owner | recovery/replay sequence | VERIFIED AS REPOSITORY SOURCE |
| HEPE-REL01-EVD-003 | Verified System Evidence | GitHub Ruleset 22409192 | observed before branch creation | repository administrative authority | governance controls unchanged before work | VERIFIED |
| HEPE-REL01-EVD-004 | Test / Regression Evidence | GitHub Actions `governance-policy` on HEPE-REL-01 PR head | pending | GitHub Actions / repository | synthetic REL01-T01..T23 | PENDING PR CHECK |

## Known limitations
- No real connector outage or remote connector write is exercised by this foundation.
- Vercel, Supabase, Drive, Calendar, Gmail runtime availability is not established by this gate.
- Google AI Studio and Microsoft/Azure connector status is unverified in the inspected controlled registry.
- No durable outbox/queue persistence exists; adding persistence would require a separately authorized schema/data gate.
- Independent reviewer remains unavailable/deferred; separation-of-duties remains unverified.

## Final classification before PR validation
`HEPE-REL-01 = PROPOSED / TEST EVIDENCE PENDING`.

PASS may be assigned only after final-head GitHub Actions verification shows the synthetic regression and governance checks succeeded, the PR diff is within scope, there are no unresolved C1/C2 findings, and Human Approval authorizes merge.

No Production Authorization. Conversation ≠ Audit Evidence. Controlled Baseline / Verified System Evidence prevail.
