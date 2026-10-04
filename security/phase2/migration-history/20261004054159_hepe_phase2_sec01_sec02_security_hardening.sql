-- Applied migration mirror
-- Supabase project: HEPE Curriculum Command Center Sandbox
-- Migration version: 20261004054159
-- Migration name: hepe_phase2_sec01_sec02_security_hardening
-- Applied via Supabase migration history after HG-P2B-02.
-- Scope: SEC-01 + SEC-02 only.

alter view public.hepe_data_api_grant_audit_v1
  set (security_invoker = true);
alter view public.hepe_data_api_surface_classification_v1
  set (security_invoker = true);
alter view public.hepe_data_api_remediation_plan_v1
  set (security_invoker = true);

revoke all on table public.hepe_data_api_grant_audit_v1 from anon, authenticated;
revoke all on table public.hepe_data_api_surface_classification_v1 from anon, authenticated;
revoke all on table public.hepe_data_api_remediation_plan_v1 from anon, authenticated;

grant select on table public.hepe_data_api_grant_audit_v1 to service_role;
grant select on table public.hepe_data_api_surface_classification_v1 to service_role;
grant select on table public.hepe_data_api_remediation_plan_v1 to service_role;

revoke execute on function public.hepe_fast_tqf_assignment_admin_context() from anon;
revoke execute on function public.hepe_fast_tqf_assignment_upsert(text,text,text,text,text,boolean) from anon;
revoke execute on function public.hepe_fast_tqf_assignment_upsert_batch(text,text,text,text[],text,boolean) from anon;
revoke execute on function public.hepe_fast_tqf_bind_person_account(uuid,text) from anon;
revoke execute on function public.hepe_fast_tqf_bind_person_account(text,uuid,text) from anon;
revoke execute on function public.hepe_fast_tqf_instructor_registry_add_candidate(text,text,text) from anon;
revoke execute on function public.hepe_fast_tqf_instructor_registry_context() from anon;
revoke execute on function public.hepe_fast_tqf_teaching_team_context(text,text[],text,text) from anon;
revoke execute on function public.hepe_fast_tqf_teaching_team_save(text,text[],text,text,uuid,uuid[]) from anon;
