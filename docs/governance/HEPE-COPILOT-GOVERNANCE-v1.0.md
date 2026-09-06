# HEPE Copilot Governance v1.0 — Proposed Controlled Baseline

Gate: HEPE-GOV-COPILOT-01A  
Environment boundary: NON-PRODUCTION by default  
Production authorization: HUMAN ONLY

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
Human/approved gate -> bounded task -> agent branch -> implementation -> tests -> PR -> advisory AI review -> required human review -> human merge. Any production transition requires separate explicit human production authorization.

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

## Baseline status
This document is created as a **PROPOSED CONTROLLED BASELINE** by HEPE-GOV-COPILOT-01A. It becomes a Frozen/Controlled Baseline only after the required human review/approval and repository change-control process. It is not Production Authorization.
