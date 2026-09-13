# HEPE-IAM-09G — Controlled Real-User Pilot Authorization Gate

Status: NON-PRODUCTION / AUTHORIZATION GATE OPEN / EXECUTION NOT AUTHORIZED
Date: 2026-09-13
Project: HEPE Curriculum Governance & Development
Branch: `feat/hepe-iam-09-user-access`
Related PR: #40

## 1. Purpose

This gate defines the minimum conditions that must be satisfied before any controlled real-user pilot may occur.

Opening this gate does **not** itself authorize creation of a real user, sending a real invitation or authentication email, granting HEPE authority, modifying SMTP, changing RLS, modifying schema, writing application data, or deploying to production.

## 2. Authorization boundary

The current authorization is limited to:

- preparing the 09G authorization checklist;
- verifying prerequisite evidence already produced by 09F;
- identifying unresolved blockers and reconciliation items;
- preparing the exact scope of a future controlled real-user pilot;
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

09G may proceed to authorization consideration only when all prerequisite evidence is admitted and traceable.

### 3.1 Synthetic build/runtime prerequisite

Required:
- successful controlled build;
- successful controlled runtime smoke test;
- successful negative authentication-path regression;
- exact source commit / workflow run traceability.

Current status: SATISFIED by 09F controlled GitHub Actions evidence recorded in `docs/HEPE-IAM-09-RUNTIME-PREPARATION-STATUS.md`.

### 3.2 Current Vercel preview prerequisite

Current status: NOT SATISFIED / INFRASTRUCTURE HOLD.

The current IAM branch does not yet have a fresh Vercel Preview for the latest source head because the connected Vercel account reached its daily free-tier deployment limit.

This condition does not invalidate the successful controlled GitHub Actions runtime evidence, but it prevents using Vercel Preview as current rendered acceptance evidence.

## 4. Mandatory reconciliation before any real-user action

### RI-IAM-09G-01 — Supabase target binding

Repository-controlled source currently references Supabase project ref:

`lztxpjsuzqvtgyasfnyj`

Older HEPE/AcaNexa project context referenced:

`nuxhsxjwhkikyrqhstkh`

No real-user action may occur until the authoritative HEPE authentication target is independently verified from system configuration / controlled source and the reconciliation item is CLOSED.

### RI-IAM-09G-02 — Gate numbering / lineage

Earlier IAM work used a 00–08 sequence, while this controlled contract uses 09A–09G.

This is documentation/governance lineage only, but it must be mapped before a formal baseline is frozen so audit traceability is not ambiguous.

### RI-IAM-09G-03 — Candidate baseline status

`HEPE-IAM-09 — User & Access Architecture Contract` remains a controlled design baseline candidate unless separately frozen/adopted.

No real-user pilot may rely on candidate-only authority semantics without an explicit controlled decision.

## 5. Controlled pilot minimum scope candidate

A future real-user pilot, if explicitly authorized, should be limited to one named institutional account and one narrowly scoped role/scope binding.

Recommended first pilot profile:

- Environment: NON-PRODUCTION only
- User count: 1
- Authentication: institutional email / passwordless
- Automatic signup for ordinary login: disabled where supported
- HEPE profile: minimal
- Role: lowest-privilege role appropriate to the test
- Scope: one programme/course/review object only
- Academic approval authority: DENIED by default
- User administration authority: DENIED unless specifically needed
- Data writes: DENIED unless separately authorized
- Production: prohibited

## 6. Required human authorization record before execution

Before any real-user creation or email send, the decision record must explicitly state at minimum:

- Authorization ID
- Gate: HEPE-IAM-09G
- Environment: NON-PRODUCTION
- Authorized real user / institutional account
- Authorized authentication method
- Authorized Supabase project ref
- Authorized role
- Authorized scope
- Authorized authority set
- Whether invitation/email delivery is authorized
- Whether any application data write is authorized
- Expiry / cleanup requirement
- Owner / approving authority
- Date / version

If any field is missing, real-user execution remains HOLD.

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

`HEPE-IAM-09G = OPEN FOR AUTHORIZATION PREPARATION ONLY / REAL-USER EXECUTION HOLD`

09G is not a PASS/FAIL real-user pilot result yet. No real user has been created, no real email has been sent, and no HEPE business authority has been granted by opening this gate.
