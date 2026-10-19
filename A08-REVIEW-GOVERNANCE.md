# A08 — Review / Revision Governance

Status: NON-PRODUCTION · NO BACKEND WORKFLOW MUTATION

Implemented UI/control surfaces:
- /review — Review Queue
- /review/HED3505/workspace — HED3505 Review Workspace
- /review/HED3505/revision — Revision Workspace

Governance:
- HED3505 is separated from the legacy HED2503 reviewer workspace.
- Findings/comments can be represented in prototype UI.
- Request Revision is preview-only.
- Resubmit is locked because no write path is enabled.
- Final Approve is locked because real authority binding is not enabled.
- No automatic approval.
