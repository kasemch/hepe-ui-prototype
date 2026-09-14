# HEPE RELEASE READINESS 09–10 — Security Regression Architecture & Production Gate Checklist

Status: CONTROLLED DRAFT — NON-PRODUCTION ONLY

This document is not Production Authorization and does not admit Audit Evidence.

## 1. Security Regression Architecture

Required negative and positive tests before Production authorization:

### Authentication / Identity
- unauthenticated access denied where required
- wrong user/person binding denied
- expired/revoked identity state denied
- real HUMAN A4 identity resolves to expected actor only

### Authority / Scope
- no-authority actor denied
- wrong programme denied
- expired authority denied
- revoked authority denied
- object-scoped authority does not expand to programme-wide authority
- technical actor cannot make human decision
- HUMAN decision path records human authority provenance

### Data / RLS
- learner cannot read another learner's protected data
- instructor guard denies non-instructor
- support guard denies unauthorized actor
- fail-closed tables remain inaccessible without intended policy/RPC path
- any newly proposed RLS policy is tested for least privilege

### RPC / SECURITY DEFINER
- S5 authority/identity mutation RPC unavailable outside approved path
- synthetic-only RPC rejects real programme where designed
- private helper functions are not directly exposed unless required
- write/state-change functions validate actor, role, scope, and object

### Governance
- evidence candidate cannot become admitted automatically
- DRAFT cannot become ACTIVE automatically
- VALIDATION curriculum cannot become current automatically
- Production mutation cannot be triggered from pilot workflow
- baseline promotion requires separate authority

### Runtime / App
- exact-SHA Preview verified
- required routes return expected status
- protected routes preserve auth boundary
- responsive acceptance
- accessibility serious/critical = 0 for mandatory pilot surfaces
- no horizontal overflow on required viewports

## 2. Test Evidence Contract

Every executed test must include:
- Test ID
- Scope
- Preconditions
- Expected Result
- Actual Result
- PASS/FAIL
- Tested SHA / DB state
- Cleanup status
- Evidence reference

A planned test is not test evidence.

## 3. Production Gate Checklist

Blocking gates before Production Authorization:

1. SECURITY DEFINER review disposition complete for Production-relevant surface.
2. S5 authority/identity mutation exposure decision approved and implemented/tested if authorized.
3. RLS intent classification complete for 64-table project review population.
4. Required RLS/grant remediation authorized, implemented, and regression-tested.
5. Leaked-password protection decision made; configuration changed only if separately authorized.
6. Release branch protection/integrity policy approved and enforced or formally risk-accepted.
7. Operations Runbook approved for Production use.
8. Rollback acceptance test executed with PASS evidence.
9. Final security/runtime/browser regression PASS.
10. Known limitations and residual risks documented.
11. Programme/curriculum baseline state reconciled; promotion remains separate authority decision.
12. Explicit Production Authorization obtained.
13. Audit Evidence Admission remains separate and is not implied by Production authorization.

## 4. Stop Rules

Stop for Human Decision when choosing or authorizing:
- SECURITY DEFINER exposure/remediation,
- RLS/grant mutation,
- leaked-password protection,
- repository branch/rules enforcement,
- baseline promotion,
- Production authorization,
- Audit Evidence admission.

Do not stop for further read-only analysis, drafting, regression design, rollback design, dependency mapping, or NOT_ADMITTED candidate preparation.