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

### HD-03 / HD-06 — private schema hardening
Applied migration: `hepe_release06_restrict_private_schema_authenticated_surface`

Applied migration: `hepe_release06_remove_public_execute_private_functions`

Result:
- `authenticated` and `anon` lost direct `USAGE` on schema `private`.
- direct EXECUTE on private functions revoked from `authenticated`, `anon`, and inherited `PUBLIC`.
- default function EXECUTE privileges in `private` hardened for future postgres-owned functions.
- authenticated SECURITY DEFINER direct-execute count in `private` = 0.

## Regression readback
Verified after migration:
- authority assignments = 13
- programme status = DRAFT
- curriculum status = DRAFT
- curriculum is_current = false
- critical S5 RPC authenticated EXECUTE = false
- public RLS/no-policy tables with anon/auth direct privileges = 0
- private schema authenticated USAGE = false
- private authenticated SECURITY DEFINER direct-execute count = 0

## Security advisor after remediation
Observed:
- `authenticated_security_definer_function_executable`: 24 → 23
- critical S5 authority-binding RPC no longer appears in that exposed-public warning set
- `rls_enabled_no_policy`: remains 64 because policy count was intentionally not changed; this remains a review population, not 64 confirmed vulnerabilities
- leaked-password protection remains disabled and requires an Auth configuration action outside the currently available Supabase mutation tools

## Repository / release integrity state
Current controlled-pilot branch remains unprotected and latest reviewed commit remains unsigned. Repository connector available in this execution can read protection/rulesets but does not expose branch-protection mutation.

## Evidence limitation
This record is a candidate only. It is not automatically admitted to the Audit Evidence Set.

## Boundary confirmation
- Production authorization: NO
- baseline promotion: NO
- Audit Evidence admission: NO
- new user created: NO
- new actor created: NO
- new authority assignment created by this security package: NO
