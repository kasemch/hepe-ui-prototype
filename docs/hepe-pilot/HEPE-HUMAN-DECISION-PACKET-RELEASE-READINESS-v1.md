# HEPE HUMAN DECISION PACKET — RELEASE READINESS v1

Status: CONTROLLED DRAFT — HUMAN DECISION REQUIRED
Environment: NON-PRODUCTION

This packet consolidates decisions to minimize repeated approvals. Approval must be interpreted per item/scope. Production Authorization and Audit Evidence Admission are NOT implied by approval of security items.

## Decision Class A — Security Decisions

### HD-01 Authority/Identity Mutation RPC Exposure
Verified fact: `public.hepe_people_01b2h_bind_current_programme_chair()` is SECURITY DEFINER, executable by authenticated, and can create/bind HUMAN actor and authority assignment when its internal controlled-source checks pass.

Options:
A. Revoke generic authenticated EXECUTE and expose only through a controlled administrative command/service path.
B. Retain authenticated EXECUTE with strengthened one-time/idempotent command authorization and audit correlation.
C. Move execution behind a privileged service role and remove direct authenticated execution.
D. Defer; keep NON-PRODUCTION only and prohibit Production use.

Recommended: A or C, with preference for A if existing command governance can mediate the operation cleanly. Do not change until security migration authorization is granted.

### HD-02 Leaked Password Protection
Verified state: disabled.

Options:
A. Enable before Production and regression-test sign-in/recovery flows.
B. Keep disabled with explicit documented risk acceptance.

Recommended: A.

### HD-03 RLS / Direct-Grant Intent
Verified review population: 64 project-domain RLS-enabled tables with zero policies.

Provisional classes:
- 14 `hed3505_live`: RLS-B mediated-access candidates; no direct anon/auth table privileges.
- 18 reference/framework tables: RLS-E read-only review; broad grants currently exist but RLS remains fail-closed.
- 8 personnel tables: RLS-H human decision.
- 7 controlled-source MR30 tables: RLS-H human decision.
- 7 evidence-governance tables: RLS-H human decision.
- 3 governance requirement tables: RLS-H human decision.
- 3 test/reconciliation tables: RLS-G review.
- 4 other fail-closed intent review tables.

Options:
A. Adopt least-privilege remediation: preserve mediated access for `hed3505_live`, restrict/revoke unnecessary broad direct grants, and add narrowly scoped policies only where direct access is an explicit business requirement.
B. Keep current fail-closed state for all 64 through pilot; defer Production classification.
C. Add direct policies broadly to eliminate linter warnings.

Recommended: A. Option C is not recommended.

### HD-04 Release Branch Protection Policy
Verified state: controlled-pilot branch unprotected; unsigned commits observed.

Options:
A. Enforce protected release branch/ruleset before Production: PR required, required CI, no force push, deletion restricted, exact-SHA acceptance.
B. Retain current branch behavior with explicit risk acceptance.

Recommended: A.

### HD-05 Commit Integrity Policy
Options:
A. Require signed commits for controlled release refs.
B. Accept unsigned commits only when commit provenance is otherwise verified by protected PR/CI/deployment SHA controls.
C. No integrity policy.

Recommended: B as minimum practical control; A if operationally feasible.

### HD-06 Security Migration Authorization
This decision does NOT specify exact SQL. It authorizes preparation and application only after exact migration files, tests, rollback plan, and impact analysis are reviewed.

Options:
A. Authorize security remediation implementation in NON-PRODUCTION only, subject to fail-closed tests and rollback.
B. Authorize preparation only; no apply.
C. Defer.

Recommended: A for NON-PRODUCTION only. Production remains separately prohibited.

## Decision Class B — Governance / Baseline

### HD-07 Baseline Promotion
Current state: Programme DRAFT; Curriculum DRAFT; `is_current=false`.

No recommendation to promote automatically. Decision should occur only after technical/security closure and controlled-source governance review.

Current recommended outcome: DEFER.

## Decision Class C — Production Authorization

### HD-08 Production Authorization
NOT READY FOR APPROVAL IN THIS PACKET.

Current recommended outcome: HOLD.

Explicit Production Authorization must be a separate later decision after security remediation, rollback PASS, final regression PASS, operations approval, and release-integrity closure.

## Decision Class D — Audit Evidence Admission

### HD-09 Audit Evidence Admission
NOT INCLUDED in security approval.

Current recommended outcome: NO ADMISSION / DEFER.

Evidence candidates remain `NOT_ADMITTED` until a separate formal admission gate verifies provenance, authority, assertion, and verification status.

## Recommended Consolidated Human Choice

Recommended security package:
- HD-01: A (or C if service-role mediation is architecturally preferred)
- HD-02: A
- HD-03: A
- HD-04: A
- HD-05: B minimum; A if feasible
- HD-06: A — NON-PRODUCTION remediation only
- HD-07: DEFER
- HD-08: HOLD / NO PRODUCTION AUTHORIZATION
- HD-09: DEFER / NOT_ADMITTED

Approval of HD-01 through HD-06 must not be interpreted as approval of HD-07, HD-08, or HD-09.