# HEPE Release Readiness 04 — Security Remediation Decision Package

Status: CONTROLLED DRAFT / NON-PRODUCTION ONLY
Date: 2026-09-14

## Boundary
This document prepares security remediation decisions only. It does not authorize Production deployment, IAM change, authority creation, schema/privilege mutation, baseline promotion, or Audit Evidence admission.

## Verified findings

### F-SEC-01 — SECURITY DEFINER exposure surface
- Supabase linter-visible/public set previously identified: 24 authenticated-callable SECURITY DEFINER functions.
- Full database inspection found 75 SECURITY DEFINER functions for which role `authenticated` has EXECUTE and schema USAGE is available on `public`, `private`, and `hed3505_live`.
- Critical function: `public.hepe_people_01b2h_bind_current_programme_chair()` can create/bind a HUMAN actor and authority assignment after controlled identity and source checks. This function requires explicit exposure/design decision before Production.
- 5 learner read functions are self-scoped by `auth.uid()`.
- 1 learner state-change function is self-scoped and state guarded.
- 13 HED3505 instructor functions have instructor checks.
- 2 pilot write functions are synthetic-programme guarded.
- 2 support workflow functions use actor/support-role controls.
- Remaining private/hed3505_live functions require explicit least-privilege review before Production even where used only as internal helpers.

### F-SEC-02 — RLS enabled without policies
Project-domain set:
- `public`: 50 tables
- `hed3505_live`: 14 tables

Observed privilege posture:
- `hed3505_live`: 14/14 have no direct anon/auth table privileges. Current behavior is consistent with mediated/fail-closed access candidates.
- `public`: 47/50 have direct grants to anon/auth, but no RLS policies; current direct access remains fail-closed because no policy permits rows. This is configuration debt and future-change risk rather than evidence of current row exposure.
- `public`: 3/50 have no direct anon/auth privilege.

Required per-table classification before Production:
1. INTENTIONAL_DENY_BY_DEFAULT
2. SECURITY_DEFINER_MEDIATED_ACCESS
3. REFERENCE_READ_POLICY_REQUIRED
4. ROLE_SCOPED_POLICY_REQUIRED
5. DIRECT_GRANT_SHOULD_BE_REVOKED
6. LEGACY/TEST FIXTURE — REMOVE OR ISOLATE

### F-SEC-03 — Leaked password protection
Current security advisor state: DISABLED.
Decision required before Production: enable, or document an explicit risk acceptance with owner and rationale.

### F-REL-01 — Release branch integrity
Branch: `feat/hepe-controlled-pilot-03`
- branch protection: OFF
- current head at last readback: `f75f2a06c5627f97c45ecdf9e37eb0ec2abe24bc`
- current head signature: UNSIGNED

Decision required before Production: establish protected release branch / ruleset and commit-integrity policy.

## Remediation design recommendations

### R1 — Authority-creating RPC
Recommended default: remove generic `authenticated` EXECUTE exposure from `hepe_people_01b2h_bind_current_programme_chair` and move authority creation behind a controlled administrative command/gate with explicit audit correlation. Do not change until Human Authority approves the design.

### R2 — SECURITY DEFINER least privilege
Build a complete function registry with columns:
function → schema → business purpose → caller role → internal guard → data mutation → authority effect → Production necessity → proposed EXECUTE roles → decision.
Revoke broad/default execute only after regression plan is approved.

### R3 — RLS policy intent matrix
For every project-domain no-policy table, record:
table → direct grants → application use → expected caller → intended access path → policy/deny decision → owner → regression tests.
Do not add permissive policies merely to silence a linter.

### R4 — Direct grants
For public tables with broad anon/auth grants but intentional deny-by-default, prefer reducing grants where the application uses RPC/read models instead of direct tables. Preserve fail-closed behavior during migration.

### R5 — Password protection
Enable leaked-password protection before Production unless Human Authority explicitly accepts the risk.

### R6 — Branch and commit integrity
Before Production, require a protected release path, required checks, and a defined signed-commit policy or documented equivalent integrity control.

## Human decision points
The following require explicit Human Authority and must stop automation:
1. Approve remediation strategy for authority-creating RPC exposure.
2. Approve whether leaked-password protection will be enabled.
3. Approve RLS intent for tables that genuinely need direct authenticated/anonymous access.
4. Approve release branch protection / commit-signing policy.
5. Approve any DDL, GRANT/REVOKE, RLS policy, Auth configuration, IAM, or authority mutation.
6. Approve baseline promotion and Production Authorization separately.
7. Approve Audit Evidence admission separately.

## Safe continuation allowed without further approval
Automation may continue to:
- build function and table inventories;
- generate proposed migrations without applying them;
- build regression test plans and expected-result matrices;
- inspect dependencies/call sites;
- prepare rollback scripts/specifications;
- run read-only verification;
- prepare controlled documentation;
- create NOT_ADMITTED evidence candidates;
- prepare final decision packets.

Production remains HOLD until the required Human Authority decisions are resolved.
