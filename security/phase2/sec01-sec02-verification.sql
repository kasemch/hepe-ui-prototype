-- HEPE Phase 2B SEC-01/SEC-02 verification queries
-- Run after sandbox apply only.

-- A. View options + client privileges
select c.relname as view_name,
       c.reloptions,
       has_table_privilege('anon', c.oid, 'SELECT') as anon_select,
       has_table_privilege('authenticated', c.oid, 'SELECT') as authenticated_select,
       has_table_privilege('service_role', c.oid, 'SELECT') as service_role_select
from pg_class c
join pg_namespace n on n.oid=c.relnamespace
where n.nspname='public'
  and c.relname in (
    'hepe_data_api_grant_audit_v1',
    'hepe_data_api_surface_classification_v1',
    'hepe_data_api_remediation_plan_v1'
  )
order by c.relname;

-- Expected:
-- security_invoker=true
-- anon_select=false
-- authenticated_select=false
-- service_role_select=true

-- B. Fast TQF anonymous EXECUTE must be false
select p.proname,
       pg_get_function_identity_arguments(p.oid) as args,
       has_function_privilege('anon', p.oid, 'EXECUTE') as anon_execute,
       has_function_privilege('authenticated', p.oid, 'EXECUTE') as authenticated_execute
from pg_proc p
join pg_namespace n on n.oid=p.pronamespace
where n.nspname='public'
  and p.proname in (
    'hepe_fast_tqf_assignment_admin_context',
    'hepe_fast_tqf_assignment_upsert',
    'hepe_fast_tqf_assignment_upsert_batch',
    'hepe_fast_tqf_bind_person_account',
    'hepe_fast_tqf_instructor_registry_add_candidate',
    'hepe_fast_tqf_instructor_registry_context',
    'hepe_fast_tqf_teaching_team_context',
    'hepe_fast_tqf_teaching_team_save'
  )
order by p.proname, args;

-- Expected: anon_execute=false for every returned row.
