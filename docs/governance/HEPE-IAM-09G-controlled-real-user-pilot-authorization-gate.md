# HEPE-IAM-09G — Controlled Real-User Pilot Authorization Gate

Status: NON-PRODUCTION / AUTHORIZATION PREPARATION COMPLETE / REAL-USER EXECUTION HOLD
Date: 2026-09-13
Project: HEPE Curriculum Governance & Development
Branch: `feat/hepe-iam-09-user-access`
Related PR: #40

## 1. Purpose

This gate defines the minimum conditions that must be satisfied before any controlled real-user pilot may occur.

Opening or preparing this gate does **not** itself authorize creation of a real user, sending a real invitation or authentication email, granting HEPE authority, modifying SMTP, changing RLS, modifying schema, writing application data, merging to production-bound source, or deploying to production.

## 2. Authorization boundary

The current authorization is limited to:

- preparing the 09G authorization checklist;
- verifying prerequisite evidence already produced by 09F;
- verifying the canonical non-production Supabase target;
- preparing the exact scope of a future controlled real-user pilot;
- preparing an explicit human-authorization decision candidate;
- preserving fail-closed behavior.

The following remain prohibited unless explicitly authorized in a subsequent decision record:

- real-user creation;
- real invitation / Magic Link / OTP delivery;
- real email send;
- SMTP changes;
- authority grant;
- database data writes;
- schema modification;
- RLS modification;
- production deployment;
- production authorization.

## 3. Prerequisite evidence

### 3.1 Synthetic build/runtime prerequisite

Status: SATISFIED.

09F controlled GitHub Actions evidence records successful build, controlled runtime smoke, and negative authentication-path regression in `docs/HEPE-IAM-09-RUNTIME-PREPARATION-STATUS.md`.

### 3.2 Canonical target binding

Status: SATISFIED / VERIFIED.

Verified HEPE non-production Supabase target:

`lztxpjsuzqvtgyasfnyj` — `HEPE Curriculum Command Center Sandbox`

Evidence record:

`docs/governance/HEPE-IAM-09G-target-binding-verification.md`

### 3.3 Current Vercel preview

Status: INFRASTRUCTURE HOLD.

The current IAM branch does not have a fresh Vercel Preview for the latest source head because the connected Vercel account reached its daily free-tier deployment limit. This does not invalidate the independent controlled GitHub Actions runtime evidence, but it remains relevant to rendered-preview acceptance.

## 4. Reconciliation status

### RI-IAM-09G-01 — Supabase target binding

Status: CLOSED.

Canonical HEPE non-production target is `lztxpjsuzqvtgyasfnyj` based on verified Supabase project inventory and repository-controlled target references.

### RI-IAM-09G-02 — Gate numbering / lineage

Status: OPEN FOR CONTROLLED LINEAGE MAPPING.

Verified controlled source on `main` contains artifact `HEPE-IAM-08A.2A-SRC-001`; the present user/access architecture uses 09A–09G. No automatic renumbering or supersession is inferred.

### RI-IAM-09G-03 — Candidate baseline status

Status: OPEN.

`HEPE-IAM-09 — User & Access Architecture Contract` remains a controlled design baseline candidate unless explicitly frozen/adopted through a controlled decision.

## 5. Controlled pilot maximum-safe envelope

A future real-user pilot, if explicitly authorized, is limited to:

- Environment: NON-PRODUCTION only
- User count: maximum 1
- Account: one named institutional account
- Authentication: passwordless institutional email; exact Magic Link or Email OTP method must be explicitly selected
- Automatic ordinary-login signup: disabled where supported
- HEPE profile: minimal
- Role: lowest-privilege role explicitly approved
- Scope: exactly one programme, course, or review object
- Academic approval authority: DENIED by default
- User administration authority: DENIED by default
- Application data writes: DENIED by default
- Database/schema/RLS/SMTP modification: DENIED
- Production: prohibited
- Cleanup/revocation: mandatory

## 6. Explicit human authorization record

Prepared candidate:

`docs/governance/HEPE-IAM-09G-pilot-authorization-decision-candidate.md`

Current candidate status: NOT APPROVED / EXECUTION HOLD.

Before any real-user creation or authentication email send, the decision record must explicitly identify:

- Authorization ID
- named institutional account
- exact authentication method
- authorized role
- authorized scope
- authorized authority set
- whether invitation/authentication email delivery is authorized
- whether any application data write is authorized
- expiry / cleanup window
- approving authority / owner
- version/date

## 7. Test / regression evidence required from any future real-user pilot

Each test must record:

- Test ID
- User identity reference (non-secret)
- Authentication state
- Role
- Scope
- Requested action
- Expected result
- Actual result
- PASS/FAIL
- Source commit / deployment identifier
- Environment
- Timestamp
- Cleanup / revocation status

## 8. Cleanup requirements

Any authorized real-user pilot must end with explicit review of:

- session termination;
- invitation/session expiry as applicable;
- role/scope revocation if temporary;
- pilot-specific authority removal;
- confirmation that no production authority was introduced;
- confirmation that no unauthorized database/schema/RLS/SMTP changes occurred.

## 9. Current gate decision

`HEPE-IAM-09G = AUTHORIZATION PREPARATION COMPLETE / REAL-USER EXECUTION HOLD`

Target binding is verified and the authorization-decision structure is prepared. Real-user execution remains fail-closed because required human authorization fields are not yet explicitly approved.
