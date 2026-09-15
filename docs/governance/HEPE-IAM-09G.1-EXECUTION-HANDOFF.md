# HEPE-IAM-09G.1 — Execution Handoff

Status: NON-PRODUCTION / AUTHORIZATION PREPARATION COMPLETE / HUMAN DECISION REQUIRED
Date: 2026-09-13

## Execution summary

09G.1 completed the authorized safe/read-only/documentation path through system inspection, evidence reconciliation, lineage reconciliation attempt, baseline review, source review, pilot safe-envelope preparation, preview readiness review and PR readiness assessment preparation.

No real-user creation, real email delivery, role/scope grant, database write, schema/RLS/SMTP modification, PR merge, production deployment or production authorization was performed.

## Reconciliation outcomes

- Target binding: PASS / canonical non-production target `lztxpjsuzqvtgyasfnyj`.
- RI-IAM-09G-02 gate lineage: OPEN because complete controlled evidence for HEPE-IAM-00 through HEPE-IAM-07 was not located; HEPE-IAM-08A.2A predecessor lineage is verified.
- RI-IAM-09G-03 baseline candidate: READY FOR CONTROLLED BASELINE DECISION / NOT FROZEN.

## Source architecture review

Verified source continues to represent:

- Authenticated ≠ Authorized.
- System Admin ≠ Academic Authority.
- login UI is preparation-only and disabled for real sign-in.
- effective-access UI is synthetic preview only.
- callback exchanges authentication code only and does not grant HEPE business authority.
- future real data access must be revalidated through RLS and/or trusted server-side authorization.

## Authentication contract

Planned controlled flow remains:

Controlled Invitation → Institutional Identity → Authentication → HEPE Profile → Role Binding → Scope Binding → Authority Resolution → RLS → Effective Access.

Ordinary login must not silently create uncontrolled HEPE users; `shouldCreateUser=false` remains a design requirement where the selected sign-in implementation supports it.

## Pilot safe envelope

- Environment: NON-PRODUCTION
- Supabase: `lztxpjsuzqvtgyasfnyj`
- Maximum real users: 1
- Account: one named institutional account
- Authentication: passwordless, human decision between Magic Link / Email OTP
- Role: lowest privilege explicitly selected
- Scope: exactly one controlled programme/course/review object
- Academic approval authority: DENY
- System administration: DENY unless explicitly authorized
- Application data write: DENY
- Schema change: DENY
- RLS change: DENY
- SMTP change: DENY
- Production: DENY
- Cleanup/revocation: mandatory after test cycle

## Human decision record

The existing `HEPE-IAM-09G-pilot-authorization-decision-candidate.md` remains the execution-ready decision candidate. Human fields must be explicitly completed before any real-user action.

## Preview readiness

A READY Vercel preview exists for IAM branch SHA `01153f33e26e2cb18adad6ab679dc2a83cda1c2a`, but it is not an exact-head preview for the later 09G.1 branch state. It must not be substituted as exact-head rendered acceptance evidence.

## PR readiness

PR #40 remains suitable for review consideration, but merge is outside 09G.1 authorization. Current governance conditions include the open historical lineage reconciliation and the requirement for a separate human baseline/adoption decision.

## Final gate state

`HEPE-IAM-09G.1 = HOLD — HUMAN AUTHORIZATION REQUIRED`

Reason: the technical baseline is ready for a human controlled-baseline decision, while any real-user pilot still requires explicit user, authentication method, role, scope, authority, email-delivery, cleanup and approving-authority decisions.
