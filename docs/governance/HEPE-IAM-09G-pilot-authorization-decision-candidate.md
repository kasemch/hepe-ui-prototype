# HEPE-IAM-09G — Controlled Real-User Pilot Authorization Decision Candidate

Status: NON-PRODUCTION / DECISION CANDIDATE / EXECUTION HOLD
Date: 2026-09-13
Project: HEPE Curriculum Governance & Development
Branch: `feat/hepe-iam-09-user-access`
Related PR: #40

## 1. Purpose

This record prepares the minimum explicit human-authorization fields required before any controlled real-user IAM pilot may execute.

This record is a **decision candidate only**. It is not an Approved Decision and does not itself authorize real-user creation, invitation/email delivery, authority grant, database writes, schema/RLS/SMTP changes, merge, deployment to production, or production use.

## 2. Verified prerequisite binding

- Environment: NON-PRODUCTION
- Canonical Supabase project: `lztxpjsuzqvtgyasfnyj`
- Project name: `HEPE Curriculum Command Center Sandbox`
- Target-binding evidence: `HEPE-IAM-09G-target-binding-verification.md`
- Target-binding status: VERIFIED / PASS

## 3. Proposed maximum-safe pilot envelope

The following values may be treated as a safe upper boundary for authorization consideration, but they are not execution authority until the required human fields are explicitly approved.

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

## 4. Required explicit human authorization fields

Execution remains HOLD until every field below has an explicit value and approval provenance.

- Authorization ID: `PENDING`
- Gate: `HEPE-IAM-09G`
- Environment: `NON-PRODUCTION`
- Authorized Supabase project ref: `lztxpjsuzqvtgyasfnyj`
- Authorized real user / institutional account: `PENDING HUMAN IDENTIFICATION`
- Authorized authentication method: `PENDING HUMAN DECISION` (Magic Link or Email OTP)
- Authorized role: `PENDING HUMAN DECISION`
- Authorized scope: `PENDING HUMAN DECISION`
- Authorized authority set: `PENDING HUMAN DECISION`
- Invitation/authentication email delivery: `NOT AUTHORIZED UNTIL EXPLICITLY APPROVED`
- Application data write: `NOT AUTHORIZED`
- Expiry / cleanup window: `PENDING HUMAN DECISION`
- Owner / approving authority: `PENDING HUMAN IDENTIFICATION`
- Version/date: `v0.1 candidate / 2026-09-13`

## 5. Remaining reconciliation items

### RI-IAM-09G-01 — Supabase target binding

Status: CLOSED.

Verified target: `lztxpjsuzqvtgyasfnyj` — HEPE Curriculum Command Center Sandbox.

### RI-IAM-09G-02 — Gate numbering / lineage

Verified controlled source on `main` contains artifact `HEPE-IAM-08A.2A-SRC-001`, while the current IAM architecture branch uses 09A–09G.

Current status: OPEN FOR CONTROLLED LINEAGE MAPPING.

No renumbering or implied supersession is authorized by this candidate record.

### RI-IAM-09G-03 — Candidate baseline status

`HEPE-IAM-09 — User & Access Architecture Contract` remains a controlled design baseline candidate.

Current status: OPEN. Explicit freeze/adoption is required before it can be treated as a Frozen/Controlled Baseline.

## 6. Fail-closed decision

Because the real-user identity, authentication method, role, scope, authority set, email-delivery permission, cleanup window, and approving authority are not yet explicitly authorized:

`HEPE-IAM-09G REAL-USER EXECUTION = HOLD`

No real user may be created and no real authentication email may be sent from this record alone.
