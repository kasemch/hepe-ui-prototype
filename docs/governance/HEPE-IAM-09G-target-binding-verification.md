# HEPE-IAM-09G — Target-Binding Verification Record

Status: NON-PRODUCTION / VERIFIED TARGET BINDING / REAL-USER EXECUTION HOLD
Date: 2026-09-13
Branch: feat/hepe-iam-09-user-access

## 1. Evidence admission

Evidence ID: EV-IAM-09G-01
Evidence Type: Verified System Evidence
Source: Supabase project inventory + project detail API
Version/Date: 2026-09-13 verification
Authority/Owner: Supabase account/project inventory available to connected user
Relevant Contract/Assertion: HEPE IAM pilot runtime target must bind to the HEPE-specific Supabase sandbox and must not silently bind to an unrelated project.
Verification Status: VERIFIED

## 2. Verified Supabase project inventory

The connected Supabase account currently contains, among others:

- `lztxpjsuzqvtgyasfnyj` — **HEPE Curriculum Command Center Sandbox** — region `ap-southeast-1` — status `ACTIVE_HEALTHY`
- `nuxhsxjwhkikyrqhstkh` — **KengKasem's Project** — region `ap-southeast-1` — status `ACTIVE_HEALTHY`

## 3. Reconciliation decision

RI-IAM-02 is reconciled for HEPE IAM purposes as follows:

- Canonical HEPE non-production Supabase target: `lztxpjsuzqvtgyasfnyj`
- Non-HEPE / unrelated project for this gate: `nuxhsxjwhkikyrqhstkh`

Reason: the former is explicitly named `HEPE Curriculum Command Center Sandbox`, while the latter is a generic separate project. This matches the current repository `.env.example` and controlled source manifest references to `lztxpjsuzqvtgyasfnyj`.

This reconciliation is limited to HEPE IAM non-production target binding. It does not authorize schema changes, RLS changes, user creation, invitation delivery, SMTP changes, authority grants, database writes, production deployment, or production use.

## 4. Gate effect

- Target-binding verification: PASS
- RI-IAM-02: CLOSED for HEPE IAM non-production target identification
- Real-user pilot execution: HOLD pending explicit authorization record for identity/user creation and invitation/email delivery

## 5. Remaining 09G prerequisites

Before any real-user action, the authorization record must explicitly state at minimum:

- authorized Supabase project: `lztxpjsuzqvtgyasfnyj`
- environment: NON-PRODUCTION
- pilot user count limit
- named user or user-selection rule
- allowed authentication method
- allowed role and scope
- explicit prohibition on academic approval authority unless separately granted
- email delivery authorization, if any
- cleanup/revocation requirement
- evidence capture requirements

Until that record exists, HEPE-IAM-09G remains preparation-only and fail-closed.
