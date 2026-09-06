# HEPE Copilot Repository Instructions

Gate: HEPE-GOV-COPILOT-01A
Environment: NON-PRODUCTION by default

## Authority boundary
- AI/Copilot is an advisory and bounded engineering execution layer, never the final academic, governance, security, deployment, or production authority.
- Conversation, AI output, Copilot comments, Copilot Memory, generated code, and generated reviews are not Audit Evidence by themselves.
- Controlled Baselines and Verified System Evidence override AI-generated summaries or inferred decisions.
- Never infer Production Authorization from approval of design, review, prototype, sandbox, test, or non-production work.

## Change control
- Make implementation changes through a dedicated branch and Pull Request. Do not bypass protected-branch controls.
- Generated code must pass applicable tests and human review before acceptance.
- Copilot Code Review and autonomous review are advisory only and must not substitute for required human approval.
- Do not grant academic authority, system authority, roles, memberships, or production privileges.
- Do not deploy to production or authorize production deployment.

## Data and secrets
- Never place secrets, credentials, tokens, passwords, private keys, PII, or academic-sensitive data in source, prompts, comments, Copilot Memory, Spaces, logs, fixtures, or documentation.
- Use synthetic identities and synthetic test data for non-production testing unless a controlled requirement explicitly states otherwise.
- Do not modify SMTP, real-user onboarding, production data, or production credentials without a separate explicit authorization.

## Commands and agents
- CLI/agent operations must be bounded to the approved task and non-production scope.
- Destructive commands, irreversible operations, production commands, secret changes, schema/data writes outside an authorized gate, and authority grants require explicit human authorization and must not be inferred.
- Coding/Cloud Agents must work branch/PR-only.

## MCP and external tools
- MCP policy is DEFAULT DENY. Use only explicitly approved connectors/servers and only for the authorized operation.
- A connector being technically available does not constitute authorization to use it for sensitive or production operations.

## Evidence admission
Before treating an artifact as HEPE Audit Evidence, identify: Evidence ID, Evidence Type, Source, Version/Date, Authority/Owner, Relevant Contract/Assertion, and Verification Status. Otherwise classify it as CONTEXT / DISCUSSION / UNVERIFIED INPUT.
