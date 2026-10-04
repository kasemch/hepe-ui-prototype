# HG-P2B-02 — Sandbox Remediation Evidence

Date: 2026-10-04
Target: HEPE Curriculum Command Center Sandbox
Scope: SEC-01 + SEC-02 only
Status: APPLIED TO SANDBOX / VERIFIED / NOT MERGED

## Pre-change snapshot
Captured before mutation.

### SEC-01 before
All three target views had:
- security_invoker unset
- anon SELECT = true
- authenticated SELECT = true
- service_role SELECT = true

### SEC-02 before
All target Fast TQF administrative RPC signatures had:
- anon EXECUTE = true

Authenticated/service_role grants varied and were preserved.

## Applied changes

### SEC-01
- Set security_invoker=true on:
  - public.hepe_data_api_grant_audit_v1
  - public.hepe_data_api_surface_classification_v1
  - public.hepe_data_api_remediation_plan_v1
- REVOKE ALL from anon, authenticated
- GRANT SELECT to service_role

### SEC-02
Revoked anon EXECUTE from the reviewed Fast TQF administrative RPC signatures only.
No function body was changed.
No authenticated/service_role grant was intentionally removed.

## Post-change verification

### Security views
All three target views now report:
- security_invoker=true
- anon SELECT=false
- authenticated SELECT=false
- service_role SELECT=true

Service-role regression probe:
- SELECT from public.hepe_data_api_grant_audit_v1 succeeded
- observed row_count=205

### Fast TQF RPC grants
All reviewed Fast TQF administrative RPC signatures now report:
- anon EXECUTE=false

Authenticated regression probe:
- public.hepe_fast_tqf_assignment_admin_context() remained executable under authenticated role
- without an authenticated JWT/actor context, the function returned AUTH_REQUIRED
- this confirms grant preservation and internal authorization guard remains active

## Supabase Security Advisor before/after

Before:
- security_definer_view: ERROR x3
- anon_security_definer_function_executable: WARN x10
- function_search_path_mutable: WARN x2
- authenticated_security_definer_function_executable: WARN x145
- auth_leaked_password_protection: WARN x1
- rls_enabled_no_policy: INFO x89

After:
- security_definer_view: 0
- anon_security_definer_function_executable: WARN x1
- function_search_path_mutable: WARN x2
- authenticated_security_definer_function_executable: WARN x145
- auth_leaked_password_protection: WARN x1
- rls_enabled_no_policy: INFO x89

The remaining anonymous SECURITY DEFINER finding is intentionally outside this change:
- public.hed3505_progress_sync(...)
- tracked separately as SEC-03

## Acceptance

SEC-01: PASS
SEC-02: PASS
SEC-03: HOLD / SEPARATE THREAT MODEL

## Governance state
- Sandbox only
- No production action
- No merge to main
- No public release
- No SEC-03 behavior change
- Stop at Human Gate before merge/release
