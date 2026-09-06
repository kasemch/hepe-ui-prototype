# HEPE Copilot Governance v1.0 — Frozen / Controlled Baseline

Gate: HEPE-GOV-COPILOT-01A → 01F  
Environment boundary: NON-PRODUCTION governance baseline  
Production authorization: HUMAN ONLY  
Baseline effective condition: this status becomes authoritative only after this dedicated baseline-closure change is human-approved and merged to `non-production` through the governed repository process.

> THIS CONTROLLED BASELINE IS NOT PRODUCTION AUTHORIZATION.

## Capability policy

| Capability | Status | Rule |
|---|---|---|
| Copilot Chat | ENABLE | Analyze, explain, draft and assist |
| IDE Chat | ENABLE | HEPE development within authorized scope |
| Copilot CLI | CONDITIONAL | No automatic destructive/production commands |
| Code completion | ENABLE | Must pass applicable test/review |
| Code Review | ENABLE | Advisory only; not final authority |
| Coding Agent | CONTROLLED | Branch/PR only |
| Copilot Memory | CONTROLLED | No secrets/PII/credentials/academic-sensitive data; non-authoritative |
| MCP Servers | RESTRICTED | DEFAULT DENY + explicit allowlist |
| Copilot Spaces | CONTROLLED | Separate Engineering / Documentation / Academic contexts |
| Commit-message generation | ENABLE | Human remains responsible for commit meaning |
| Preview features | NON-PROD | Never a required production dependency without separate approval |
| Autonomous review | ENABLE | Advisory only |
| Cloud Agent | CONTROLLED | NON-PRODUCTION + bounded task + branch/PR |
| Production deployment | HUMAN ONLY | AI cannot approve or authorize production |

## Authority hierarchy
1. Verified System Evidence / Controlled Baseline
2. Explicit approved gate-scoped human decisions
3. Repository instructions and controlled specifications
4. Verified repository/runtime state
5. AI/Copilot memory, comments and conversation as non-authoritative context

## Mandatory prohibitions
AI must not independently:
- authorize or execute production deployment;
- grant academic/system authority;
- expose, store or commit secrets/credentials;
- treat conversation, generated content, Copilot review, or Copilot Memory as Audit Evidence;
- bypass branch/PR controls;
- expand a gate-scoped approval into schema, data-write, deployment or production authorization;
- use an unapproved MCP connector for sensitive operations.

## MCP policy
Default state is DENY. Each allowed MCP server/connector must have an identified owner, purpose, permitted operations, data classification, environment, and revocation path. Technical availability is not authorization.

## Agent execution model
Human/approved gate -> bounded task -> agent branch -> implementation -> tests -> PR -> advisory AI review -> required human decision -> human merge. Any production transition requires separate explicit human production authorization.

## Evidence admission
Conversation != Audit Evidence. AI-generated material remains CONTEXT / DISCUSSION / UNVERIFIED INPUT unless it meets the HEPE Evidence Admission Requirement with provenance, authority and verification.

## Acceptance assertions
- A1 AI-generated changes reach the target branch only through the required change-control path.
- A2 AI/Copilot review cannot substitute final human authority.
- A3 AI cannot grant academic/system authority.
- A4 secrets/credentials/PII/academic-sensitive data are prohibited from AI memory/context.
- A5 MCP is default-deny except explicitly approved connectors.
- A6 production deployment/authorization is human-only.
- A7 AI memory/comments/generated content are not Audit Evidence by themselves.
- A8 governance changes retain repository provenance and review/test records.

## Technical closure provenance
- HEPE-GOV-COPILOT-01A: human-approved and merged to `non-production`.
- HEPE-GOV-COPILOT-01B: PASS WITH DOCUMENTED LIMITATION; ruleset ID `22409192` is ACTIVE for `refs/heads/non-production`, requiring PR flow and `governance-policy`, blocking deletion/non-fast-forward, with no bypass actors.
- HEPE-GOV-COPILOT-01C: PASS after instruction hardening for test-before-acceptance, degraded/offline connector behavior, Exception Stop and evidence provenance.
- HEPE-GOV-COPILOT-01D: PASS for proportionate path-specific governance on current repository paths.
- HEPE-GOV-COPILOT-01E: PASS for MCP/connector default-deny governance registry.
- HEPE-GOV-COPILOT-01F: technical PASS with explicit Human Acceptance; PR #3 merged to `non-production` at merge commit `5be205dffb8fa68b5586551b606c2ad1c9c55101` after current-head `governance-policy` run `34067135702` succeeded.

## Documented limitations
- Independent reviewer separation-of-duties has not been verified; required approving review count is `0` under the single-owner compensating-control model.
- Required review-thread resolution is not enforced by the current ruleset.
- These limitations do not permit AI review to substitute Human Authority and do not authorize Production.

## Baseline status
**FROZEN / CONTROLLED BASELINE — NON-PRODUCTION GOVERNANCE BASELINE**, subject to human approval and merge of this dedicated baseline-closure change. Until that merge occurs, this branch content remains a proposed controlled change rather than the authoritative baseline.

THIS CONTROLLED BASELINE IS NOT PRODUCTION AUTHORIZATION.
