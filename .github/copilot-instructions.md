# HEPE Copilot Repository Instructions

Gate: HEPE-GOV-COPILOT-01A / HEPE-GOV-COPILOT-01C hardening
Environment: NON-PRODUCTION by default

## Authority boundary
- AI/Copilot is an advisory and bounded engineering execution layer, never the final academic, governance, security, deployment, or production authority.
- Conversation, AI output, Copilot comments, Copilot Memory, generated code, and generated reviews are not Audit Evidence by themselves.
- Controlled Baselines and Verified System Evidence override AI-generated summaries or inferred decisions.
- Never infer Production Authorization from approval of design, review, prototype, sandbox, test, or non-production work.

## Change control
- Make implementation changes through a dedicated branch and Pull Request. Do not bypass protected-branch controls.
- Generated code must pass applicable tests and human review before acceptance.
- Test before acceptance: do not represent a change as accepted when required tests/regression have not executed successfully for the applicable revision.
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
- Connector degradation must not elevate authority or weaken controls. Treat unavailable integrations as DEGRADED/OFFLINE and preserve repository, human workflow, tests, and audit provenance; reconcile only after revalidation.
- Do not blindly replay HUMAN-GATED, ADMIN, DESTRUCTIVE, or PRODUCTION-SENSITIVE operations after connector recovery.

## Exception Stop
- Continue safe NON-PRODUCTION work within the approved gate, but stop the affected path when a genuine Human Authority, unresolved C1/C2 finding, secret/credential binding, real-user/SMTP action, destructive action, Production-sensitive operation, unauthorized schema/data write, or Controlled Baseline contradiction is encountered.
- Do not bypass CI, review, RLS, branch rules, or other security controls to avoid an Exception Stop.

## Evidence admission and provenance
Before treating an artifact as HEPE Audit Evidence, identify: Evidence ID, Evidence Type, Source, Version/Date, Authority/Owner, Relevant Contract/Assertion, and Verification Status. For test evidence also record Expected, Actual, and PASS/FAIL. Otherwise classify it as CONTEXT / DISCUSSION / UNVERIFIED INPUT.
- Generated or authored content does not prove its own execution or system state; verify provenance from the authoritative system/test source.
