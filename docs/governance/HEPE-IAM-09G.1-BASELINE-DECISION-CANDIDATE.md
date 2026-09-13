# HEPE-IAM-09G.1 — Controlled Baseline Decision Candidate

Status: NON-PRODUCTION / DECISION CANDIDATE / NOT FROZEN
Date: 2026-09-13
Subject: `HEPE-IAM-09 — User & Access Architecture Contract`

## Technical review result

Classification: **A. READY FOR CONTROLLED BASELINE DECISION**

The candidate contract is consistent with the verified current source implementation and controlled regression evidence in the following respects:

- `Authenticated ≠ Authorized` is explicitly preserved in login and callback surfaces.
- `System Administration ≠ Academic Authority` is explicitly preserved in the User & Access contract/UI.
- Effective access is modeled as identity + profile + role + scope + authority + validity/object state + RLS result.
- UI visibility is not represented as the final authorization boundary.
- RLS or trusted server-side authorization is required before real data access.
- least-privilege and fail-closed behavior are explicit requirements.
- real-user creation, real email delivery, role/scope grants, schema/RLS/SMTP changes, application data writes, production deployment and production use remain outside current authority.
- synthetic build/runtime and negative auth-path regression evidence exists for the IAM source path.
- the canonical non-production Supabase target has been independently verified as `lztxpjsuzqvtgyasfnyj` — HEPE Curriculum Command Center Sandbox.

## Conditions

1. This candidate is not a Frozen/Controlled Baseline until a human Approved Decision explicitly adopts it.
2. `RI-IAM-09G-02` remains open because the complete historical 00–08 lineage cannot be reconstructed from current controlled repository evidence.
3. Approval of this architecture baseline must not be interpreted as approval for any real-user pilot action.

## Decision candidate

A human authority may approve the following narrowly scoped decision:

> Adopt `HEPE-IAM-09 — User & Access Architecture Contract` as the controlled NON-PRODUCTION IAM architecture baseline for HEPE, subject to the HEPE Audit Evidence Admission Rule and the explicit authority boundaries in the contract.

Approval of this baseline **does not constitute**:

- real-user authorization;
- invitation / Magic Link / OTP email authorization;
- role/scope or academic/business authority grant;
- database data-write authorization;
- schema modification authorization;
- RLS modification authorization;
- SMTP modification authorization;
- merge authorization;
- deployment authorization;
- production authorization.

## Current decision state

`RI-IAM-09G-03 = READY FOR HUMAN BASELINE DECISION / NOT YET FROZEN`
