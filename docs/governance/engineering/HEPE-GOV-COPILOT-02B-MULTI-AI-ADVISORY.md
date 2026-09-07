# HEPE-GOV-COPILOT-02B — Multi-AI Advisory Governance

Environment: NON-PRODUCTION ONLY
Status: PROPOSED / PR VALIDATION REQUIRED
Upstream Controlled Baseline: HEPE Copilot Governance v1.0 — Frozen / Controlled Baseline

## Purpose
Define bounded advisory use of multiple AI systems without transferring Human Authority, evidence authority, Production authority, or canonical-record status to any AI system.

## Advisory domains
The following are coordination defaults, not exclusive capability claims:

| AI system | Default advisory domain | Authority status |
|---|---|---|
| GitHub Copilot | repository/code/workflow/change review | ADVISORY ONLY |
| ChatGPT | governance synthesis, architecture reasoning, cross-domain reconciliation | ADVISORY ONLY |
| Claude | independent architecture/security critique | ADVISORY ONLY |
| Gemini | document/curriculum/workspace analysis where explicitly authorized | ADVISORY ONLY |

## Mandatory rules
- No AI is final academic, governance, security, deployment, Production, schema/data-write, or authority-grant authority.
- AI consensus ≠ Human Approval.
- AI majority vote ≠ Approved Decision.
- AI output ≠ Verified System Evidence.
- AI disagreement creates or contributes to a Reconciliation Item; it does not silently rewrite the Controlled Baseline.
- Controlled Baseline / Verified System Evidence outrank all AI recommendations and summaries.
- Conversation, AI output, AI memory, AI comments, generated code and generated reviews are not Audit Evidence by themselves.
- A recommendation for Production, authority grant, secret handling, SMTP, real-user action, destructive action, or schema/data write outside authorized scope is HUMAN-GATED or DENY according to the controlling contract.

## Deduplication model
Use one canonical review question and one canonical Finding/Reconciliation Item per underlying issue. Multiple AI observations attach to that same record rather than creating duplicate findings merely because different systems reported them.

## Review outcome classes
- SUPPORTS BASELINE — advisory observation consistent with the Controlled Baseline.
- RECONCILIATION REQUIRED — AI systems disagree or recommendation conflicts with another verified source.
- UNSUPPORTED CONTEXT — recommendation lacks admissible evidence/provenance.
- HUMAN-GATED — consequential action requires explicit human authority.
- DENY — recommendation violates a controlled boundary.

## Exception Stop
Stop the affected path when an AI recommendation conflicts with a Controlled Baseline and cannot be reconciled from Verified Evidence, when a C1/C2 finding emerges, or when execution would require Production Authorization, secret/credential binding, real-user/SMTP action, authority grant, destructive operation, or unauthorized schema/data write.
