# HEPE MCP / Connector Governance Registry v0.1

Gate: HEPE-GOV-COPILOT-01E  
Environment: NON-PRODUCTION governance registry  
Registry status: PROPOSED / verification required per connector  
Default policy: **DENY**

Technical availability does not constitute authorization. Entries below are governance classifications, not evidence that a connector is installed, enabled or operational.

| ID | Connector | Owner | Purpose | Data class | Read | Write | Admin/Destructive | Production-sensitive | Human gate | Credential rule | Failure mode | Revocation | Verification |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| MCP-GH-01 | GitHub | Repository owner | Engineering governance/source control | Repository data | CONTROLLED | CONTROLLED branch/PR | HUMAN-GATED | DENY unless separately authorized | Human merge/authority controls | Never expose tokens | DEGRADED/OFFLINE; repository remains canonical | Remove installation/access | PARTIALLY VERIFIED; operation-specific evidence required |
| MCP-VER-01 | Vercel | Project owner | Preview/deployment platform | Deployment/config metadata | CONTROLLED | HUMAN-GATED | HUMAN-GATED | HUMAN ONLY | Required for production-sensitive operation | Never expose deployment secrets | DEGRADED/OFFLINE | Revoke integration/token | UNVERIFIED IN THIS GATE |
| MCP-SB-01 | Supabase | Project owner | Database/Auth platform | Potentially sensitive academic/IAM data | CONTROLLED | GATE-SCOPED | HUMAN-GATED | HUMAN ONLY | Required for schema/data/authority-sensitive writes | Service role/secrets prohibited from prompts/repo | DEGRADED/OFFLINE | Revoke integration/credential | UNVERIFIED IN THIS GATE |
| MCP-DRV-01 | Google Drive | Account/data owner | Controlled document access | Document data; classification varies | CONTROLLED | GATE-SCOPED | HUMAN-GATED | DENY by default | Required for sensitive writes/shares | OAuth credentials never exposed | DEGRADED/OFFLINE | Disconnect integration | UNVERIFIED IN THIS GATE |
| MCP-CAL-01 | Google Calendar | Calendar owner | Academic scheduling | Calendar metadata | CONTROLLED | GATE-SCOPED | HUMAN-GATED | DENY by default | Required for consequential external changes | OAuth credentials never exposed | DEGRADED/OFFLINE | Disconnect integration | UNVERIFIED IN THIS GATE |
| MCP-GML-01 | Gmail | Mailbox owner | Email read/draft/send | Personal/communication data | CONTROLLED | HUMAN-GATED for real send | HUMAN-GATED | DENY by default | Real email sending separately authorized | Never expose OAuth/token/message secrets | DEGRADED/OFFLINE | Disconnect integration | UNVERIFIED IN THIS GATE |
| MCP-FUT-00 | Future connector | TBD | Undefined | UNKNOWN | DENY | DENY | DENY | DENY | Explicit approval required | No credentials until approved | OFFLINE by default | Do not enable/remove access | NOT APPROVED |

## Operation classes
- **AUTO** — permitted only when an approved contract explicitly allows unattended execution.
- **CONTROLLED** — bounded NON-PRODUCTION operation under an approved gate and least privilege.
- **HUMAN-GATED** — execution requires explicit human authority for the specific consequential operation.
- **DENY** — not authorized.

## Mandatory boundaries
Production deployment remains HUMAN ONLY. Real email sending requires separate authorization. Academic/system authority modification remains HUMAN ONLY. Database migration generation does not authorize execution. Connector availability, AI suggestion or prior conversation cannot elevate an operation from DENY/HUMAN-GATED to CONTROLLED/AUTO.
