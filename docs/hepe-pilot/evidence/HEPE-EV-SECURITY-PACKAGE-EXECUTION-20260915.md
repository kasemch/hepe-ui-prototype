# HEPE Security Package Execution Record — 2026-09-15

Status: VERIFIED SYSTEM EVIDENCE CANDIDATE / NOT_ADMITTED
Environment: NON-PRODUCTION ONLY
Project: HEPE Curriculum Governance & Development

## Authorization scope
Human approval covered Security Package HD-01 through HD-06 for NON-PRODUCTION only.

Not authorized by this package:
- Production deployment or Production mutation
- baseline promotion
- DRAFT → ACTIVE / validation → approved/current
- Audit Evidence admission
- unrelated IAM or authority creation

## Applied database remediations

### HD-01 — Authority/identity mutation RPC
Applied migration: `hepe_release05_restrict_authority_binding_rpc`

Result:
- `public.hepe_people_01b2h_bind_current_programme_chair()` generic EXECUTE revoked from `authenticated`, `anon`, and `PUBLIC`.
- Function remains present for owner/service-controlled administrative execution.

### HD-03 / HD-06 — Fail-closed table grants
Applied migration: `hepe_release06_revoke_failclosed_table_grants`

Result:
- For public tables with RLS enabled and zero policies, unnecessary direct anon/authenticated table privileges were revoked.
- Before remediation, 47 such public tables had direct anon/authenticated privileges.
- After remediation, direct privilege count = 0.
- No permissive RLS policies were added.

### HD-03 / HD-06 — private schema hardening and reconciliation
Initial hardening migrations:
- `hepe_release06_restrict_private_schema_authenticated_surface`
- `hepe_release06_remove_public_execute_private_functions`

Initial result:
- private authenticated direct surface was reduced to zero.

Regression exception:
- authenticated execution of `public.hepe_get_people_responsibility_coverage('2569','1')` failed with `permission denied for schema private`.
- cause: public SECURITY INVOKER wrappers and a security-invoker view legitimately depend on selected `private.*` helpers.

Reconciliation migrations:
- `hepe_release06_reconcile_private_wrapper_access`
- `hepe_release06_minimize_private_helper_execute`

Final least-privilege result:
- `authenticated` retains schema `private` USAGE only because SECURITY INVOKER wrappers require it.
- anon retains no private schema USAGE.
- PUBLIC and anon direct private-function EXECUTE remain revoked.
- authenticated private SECURITY DEFINER EXECUTE surface is reduced to 15 required helper dependencies, not the temporary broad 70-function restore.
- verified wrappers execute without schema-permission regression:
  - `public.hepe_get_people_responsibility_coverage('2569','1')`
  - `public.v_hepe_people_reconciliation_queue_v1`

## Regression readback — final reconciled posture
Verified:
- authority assignments = 13
- programme status = DRAFT
- curriculum status = DRAFT
- curriculum is_current = false
- critical S5 RPC authenticated EXECUTE = false
- public RLS/no-policy tables with anon/auth direct privileges = 0
- private schema authenticated USAGE = true, required by SECURITY INVOKER wrappers
- private schema anon USAGE = false
- authenticated SECURITY DEFINER direct-execute population in `private` = 15 required dependencies

## Rollback acceptance
Test: `HEPE-ROLLBACK-SECURITY-PRIV-01`

A transactional restore simulation was executed and then rolled back. The test verified that simulated prior privilege posture did not persist after `ROLLBACK`.

Status: PASS
Cleanup: PASS — no simulated restore state persisted.

Note: this test occurred before the final private-helper allowlist reconciliation. A final-posture rollback verification is required for closure evidence and must expect the 15-helper authenticated private surface rather than zero.

## Security advisor after remediation
Observed:
- `authenticated_security_definer_function_executable`: 24 → 23
- critical S5 authority-binding RPC no longer appears in that exposed-public warning set
- `rls_enabled_no_policy`: remains 64 because policy count was intentionally not changed; this is a review population, not 64 confirmed vulnerabilities
- leaked-password protection remains disabled and requires a Supabase Auth configuration action

The remaining 23 public SECURITY DEFINER warnings are not automatically classified as vulnerabilities. They include self-scoped learner, role-guarded instructor, synthetic-only pilot, and support workflow functions and remain subject to intended-exposure review/regression.

## Repository / release integrity state
Development source branch: `feat/hepe-controlled-pilot-03`.

Controlled NON-PRODUCTION release lane discovered and verified:
- branch: `non-production`
- repository ruleset: `HEPE Non-Production Governance`
- enforcement: active
- pull request required
- required status check: `governance-policy`
- non-fast-forward and deletion restrictions enabled
- no bypass actors
- latest verified branch commit observed with a valid GitHub signature

Accordingly, the feature branch is treated as a development source, while controlled promotion should occur through PR into the protected `non-production` lane.

## Remaining platform-control dependency
HD-02 remains incomplete in execution evidence:
- Supabase leaked-password protection is still disabled.
- Current connected Supabase tools do not expose an Auth configuration mutation action for this setting.

## Evidence limitation
This record is a candidate only. It is not automatically admitted to the Audit Evidence Set.

## Boundary confirmation
- Production authorization: NO
- baseline promotion: NO
- Audit Evidence admission: NO
- new user created: NO
- new actor created: NO
- new authority assignment created by this security package: NO
