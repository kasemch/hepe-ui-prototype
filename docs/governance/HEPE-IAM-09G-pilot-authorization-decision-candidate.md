# HEPE-IAM-09G — Controlled Real-User Pilot Authorization Decision Candidate

Status: NON-PRODUCTION / PARTIAL HUMAN AUTHORIZATION RECORDED / EXECUTION HOLD
Date: 2026-09-13
Project: HEPE Curriculum Governance & Development
Branch: `feat/hepe-iam-09-user-access`
Related PR: #40

## 1. Purpose

This record prepares and preserves the minimum explicit human-authorization fields required before any controlled real-user IAM pilot may execute.

This record remains a **decision candidate / partial authorization record**. It does not by itself authorize real-user creation, HEPE role/scope assignment, authority grant, application data writes, schema/RLS/SMTP changes, merge, production deployment, or production use.

## 2. Verified prerequisite binding

- Environment: NON-PRODUCTION
- Canonical Supabase project: `lztxpjsuzqvtgyasfnyj`
- Project name: `HEPE Curriculum Command Center Sandbox`
- Target-binding evidence: `HEPE-IAM-09G-target-binding-verification.md`
- Target-binding status: VERIFIED / PASS

## 3. Proposed maximum-safe pilot envelope

- Pilot user count limit: 1
- Account type: one named institutional account only
- Authentication family: passwordless institutional email
- Automatic ordinary-login signup: disabled where supported
- HEPE profile: minimal pilot profile only
- Role: lowest-privilege role explicitly selected for the pilot
- Scope: exactly one programme, course, or review object
- Academic approval authority: DENIED by default
- User administration authority: DENIED by default
- Application data write: DENIED by default
- Database/schema/RLS/SMTP modification: DENIED
- Production: DENIED
- Cleanup: mandatory after the test cycle

## 4. Explicit human authorization fields

The following fields have now been explicitly provided by the human user in the HEPE-IAM-09G authorization flow and are recorded here as an Approved Decision **only for the narrow field stated**:

- Authorization ID: `HEPE-IAM-09G-AUTH-PARTIAL-01`
- Gate: `HEPE-IAM-09G`
- Environment: `NON-PRODUCTION`
- Authorized Supabase project ref: `lztxpjsuzqvtgyasfnyj`
- Authorized real user / institutional account: `Kasem.ch@rumail.ru.ac.th`
- Authorized authentication method: `Magic Link`
- Invitation/authentication email delivery: `ALLOW — only to Kasem.ch@rumail.ru.ac.th for this HEPE NON-PRODUCTION pilot`
- Application data write: `NOT AUTHORIZED`
- Academic approval authority: `NOT AUTHORIZED`
- Production: `NOT AUTHORIZED`

The following fields remain unresolved and may not be inferred:

- Real-user creation: `NOT AUTHORIZED`
- Authorized role: `PENDING HUMAN DECISION`
- Authorized scope: `PENDING HUMAN DECISION`
- Authorized authority set: `PENDING HUMAN DECISION`
- Expiry / cleanup window: `PENDING HUMAN DECISION`
- Full pilot approving authority / owner: `PENDING HUMAN DECISION`
- Version/date: `v0.2 partial authorization / 2026-09-13`

## 5. Authority boundary interpretation

The user's explicit statement authorizes **Magic Link email delivery to the named institutional account only** within the HEPE NON-PRODUCTION pilot.

It does **not** expand authorization to:

- create a new Supabase Auth user if the account does not already exist;
- enable automatic signup;
- assign an HEPE profile, role, scope, or authority;
- write application data;
- change Auth provider configuration;
- change SMTP;
- change schema or RLS;
- merge PR #40;
- deploy to production.

If Magic Link delivery would require creation of a new Auth user, execution must fail closed until separate real-user creation authorization is recorded.

## 6. Remaining reconciliation items

### RI-IAM-09G-01 — Supabase target binding

Status: CLOSED.

Verified target: `lztxpjsuzqvtgyasfnyj` — HEPE Curriculum Command Center Sandbox.

### RI-IAM-09G-02 — Gate numbering / lineage

Status: governed by the controlled lineage reconciliation record. Historical IDs must not be silently rewritten.

### RI-IAM-09G-03 — Candidate baseline status

`HEPE-IAM-09 — User & Access Architecture Contract` remains a controlled design baseline candidate unless separately frozen/adopted by an Approved Decision.

## 7. Current fail-closed decision

Email delivery permission is now explicit, but real-user creation and access-binding fields remain unresolved.

Therefore:

`HEPE-IAM-09G REAL-USER EXECUTION = HOLD — PARTIAL AUTHORIZATION ONLY`

No real user may be created and no HEPE role/scope/authority may be granted from this record alone.
