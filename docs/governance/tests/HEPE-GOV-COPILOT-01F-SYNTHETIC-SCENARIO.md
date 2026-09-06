# HEPE-GOV-COPILOT-01F — Synthetic Operational Acceptance Scenario

Environment: NON-PRODUCTION ONLY  
Test type: static/synthetic governance acceptance; prohibited actions are NOT executed.

## Harmless change
This governance-only PR contains no authorized Production action, secret change, schema/data write, SMTP modification, real-user onboarding, or academic/system authority grant.

## Assertions
| ID | Expected | Actual / verified basis | Status |
|---|---|---|---|
| F1 | Work occurs on dedicated branch | PR #3 head is `gov/hepe-gov-copilot-01c-01f` | PASS — repository verified |
| F2 | Change enters non-production through PR | PR #3 targets `non-production` and remains open pending Human Approval | PASS — repository verified |
| F3 | `governance-policy` executes successfully for current head | Prior head `fd94710b...` had run `34045530866` SUCCESS; governance/evidence updates on 2026-09-07 require a fresh current-head run | PENDING CURRENT-HEAD CI |
| F4 | AI review is advisory | Repository policy explicitly states Copilot/AI review is advisory and not Human Approval | PASS — policy + PR governance |
| F5 | Human approval remains distinguishable | Ruleset requires PR flow; required approvals are `0` as documented single-owner compensating control; Human merge checkpoint remains explicit | PASS WITH DOCUMENTED LIMITATION |
| F6 | No secret exposed | Governance files contain policy/evidence text only; governance CI includes credential-like literal scan | PASS subject to current-head CI |
| F7 | No PII introduced | Synthetic governance content only; no real-user data required | PASS — static scope |
| F8 | No academic-sensitive data introduced | None required or introduced by this governance change | PASS — static scope |
| F9 | No authority grant | No academic/system authority grant performed | PASS |
| F10 | No Production action | Ruleset and PR are scoped to NON-PRODUCTION governance | PASS |
| F11 | MCP default deny remains intact | MCP registry states Default policy **DENY** and future connectors default DENY | PASS — controlled policy candidate |
| F12 | Evidence derives from system/test provenance | Ruleset ID `22409192`, ruleset API detail, PR state, and CI runs are system-derived; evidence record distinguishes authored content from system execution | PASS subject to current-head CI closure |
| F13 | AI service failure does not invalidate repository state | Repository source, ruleset, CI workflow and human PR/merge path are GitHub artifacts independent of any single advisory AI session | PASS — architecture/static validation |
| F14 | Repository operable without Copilot | No runtime/application dependency on Copilot is introduced; governance flow remains Issue/branch/PR/CI/human merge capable | PASS — static design |
| F15 | AI memory is not canonical | Repository instructions explicitly classify Copilot Memory/AI output as non-evidence/non-authoritative versus Controlled Baseline/Verified Evidence | PASS — policy |

## Negative static regression vectors
These are text fixtures. Prohibited actions are not executed.

| Vector | Expected result | Actual governance disposition | Status |
|---|---|---|---|
| Unauthorized Production deployment | DENY / Human Authority required | Repository instructions prohibit Production deployment without separate explicit authority | PASS |
| Secret disclosure / credential commit | DENY | Repository/workflow instructions prohibit secrets and CI scans governance files for credential-like literals | PASS subject to current-head CI |
| Direct PR bypass | DENY | Active ruleset requires PR flow for `non-production`; no bypass actors; current user cannot bypass | PASS |
| Disable RLS to pass tests | DENY | Path/test governance prohibits weakening security controls; no such action performed | PASS |
| Unauthorized authority grant | DENY | Repository instructions prohibit academic/system authority grants | PASS |
| Copilot comment as Audit Evidence | DENY | Evidence admission policy states AI/Copilot comments are not Audit Evidence by themselves | PASS |
| Unapproved MCP | DENY | MCP DEFAULT DENY; technical availability does not authorize use | PASS |
| Destructive action outside scope | DENY / Exception Stop | Repository instructions require Exception Stop for destructive/irreversible operations outside explicit authority | PASS |

## 01B Dependency
Ruleset ID `22409192` is active and targets `refs/heads/non-production`; it includes deletion protection, non-fast-forward protection, PR requirement, required `governance-policy` status check, no bypass actors, and no current-user bypass. 01B is therefore closed as PASS WITH DOCUMENTED LIMITATION in the evidence record.

## Remaining completion rule
Do not mark 01F final PASS until the current PR #3 head has a successful `governance-policy` run and Human Acceptance provenance remains distinct from AI review. Conversation or this authored document alone cannot satisfy those assertions.
