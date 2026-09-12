-- HEPE-DATA-01 — Course Academic Context Data Foundation
-- STATUS: MIGRATION CANDIDATE ONLY / DO NOT APPLY WITHOUT EXPLICIT SCHEMA MODIFICATION AUTHORIZATION
-- ENVIRONMENT: NON-PRODUCTION ONLY
-- NO PRODUCTION / NO AI AUTHORITY / NO AUDIT EVIDENCE ADMISSION

begin;

create table if not exists public.course_description_versions (
  course_description_version_id uuid primary key default gen_random_uuid(),
  curriculum_course_id uuid not null references public.curriculum_courses(curriculum_course_id) on delete restrict,
  version_no integer not null check (version_no > 0),
  description_th text not null,
  description_en text,
  status_code text not null default 'DRAFT',
  verification_status text not null default 'UNVERIFIED',
  source_reference text,
  source_sha256 text,
  source_locator text,
  authority_status text not null default 'UNVERIFIED_SOURCE',
  effective_from date,
  effective_to date,
  is_current boolean not null default false,
  supersedes_course_description_version_id uuid references public.course_description_versions(course_description_version_id) on delete restrict,
  approved_at timestamptz,
  activated_at timestamptz,
  created_at timestamptz not null default now(),
  constraint uq_course_description_version unique(curriculum_course_id, version_no),
  constraint ck_course_description_dates check (effective_to is null or effective_from is null or effective_to >= effective_from),
  constraint ck_course_description_activation check (activated_at is null or approved_at is not null)
);

create unique index if not exists uq_course_description_current
  on public.course_description_versions(curriculum_course_id)
  where is_current = true;

comment on table public.course_description_versions is
'Versioned course descriptions for governed academic context. is_current does not imply approved or activated.';

-- Read projection deliberately exposes lifecycle/provenance fields so downstream AI cannot treat working text as approved fact.
create or replace view public.v_hepe_course_academic_context_v1
with (security_invoker = true)
as
select
  p.programme_id,
  p.programme_code,
  p.title_th as programme_title_th,
  cv.curriculum_version_id,
  cv.version_code as curriculum_version_code,
  cc.curriculum_course_id,
  c.course_id,
  c.course_code,
  c.title_th as course_title_th,
  c.title_en as course_title_en,
  c.credit_value,
  cdv.course_description_version_id,
  cdv.version_no as description_version_no,
  cdv.description_th,
  cdv.description_en,
  cdv.status_code as description_status_code,
  cdv.verification_status as description_verification_status,
  cdv.authority_status as description_authority_status,
  cdv.source_reference as description_source_reference,
  cdv.source_sha256 as description_source_sha256,
  cdv.source_locator as description_source_locator,
  cdv.is_current as description_is_current,
  cdv.approved_at as description_approved_at,
  cdv.activated_at as description_activated_at
from public.curriculum_courses cc
join public.curriculum_versions cv on cv.curriculum_version_id = cc.curriculum_version_id
join public.programmes p on p.programme_id = cv.programme_id
join public.courses c on c.course_id = cc.course_id
left join public.course_description_versions cdv
  on cdv.curriculum_course_id = cc.curriculum_course_id
 and cdv.is_current = true;

comment on view public.v_hepe_course_academic_context_v1 is
'Read-only course academic context identity + versioned description. CLO/PLO/activity/assessment remain in existing governed version tables and are joined by application query contract.';

-- RLS intentionally enabled but policies are NOT authored in this candidate.
-- Existing authority semantics must be reused and independently reviewed before apply.
alter table public.course_description_versions enable row level security;

-- No GRANT and no RLS policy here by design. Fail closed until authority/RLS binding is separately verified.

rollback;

-- NOTE: Candidate wraps in ROLLBACK intentionally to prevent accidental execution from mutating the database.
-- A separately reviewed/apply-ready migration must remove ROLLBACK only after explicit NON-PRODUCTION Schema Modification Authorization.
