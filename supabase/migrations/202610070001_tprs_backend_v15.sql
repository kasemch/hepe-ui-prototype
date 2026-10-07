-- HEPE-TPRS / EPLC-FL backend v1.5
-- NON-PRODUCTION. Synthetic data only until Human Gate approval.
create extension if not exists pgcrypto;
create schema if not exists tprs;

create type tprs.app_role as enum ('learner','facilitator','assessor','academic_authority','qa_auditor','administrator');
create type tprs.verification_status as enum ('PENDING','VERIFIED','REJECTED','MISSING');
create type tprs.rule_status as enum ('DRAFT','PROVISIONAL','APPROVED','RETIRED');

create table tprs.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null,
  synthetic boolean not null default true,
  created_at timestamptz not null default now()
);
create table tprs.role_assignments (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references tprs.profiles(user_id) on delete cascade,
  role tprs.app_role not null, active boolean not null default true, created_at timestamptz not null default now(), unique(user_id,role)
);
create table tprs.learners (
  id uuid primary key default gen_random_uuid(), user_id uuid unique references tprs.profiles(user_id), learner_reference text unique not null,
  curriculum_version text not null, registration_status text not null check(registration_status in ('REGISTERED','INTERRUPTED','NOT_REGISTERED')),
  synthetic boolean not null default true, created_at timestamptz not null default now()
);
create table tprs.staff_assignments (
  id uuid primary key default gen_random_uuid(), staff_user_id uuid not null references tprs.profiles(user_id), learner_id uuid not null references tprs.learners(id) on delete cascade,
  scope text not null check(scope in ('FACILITATE','ASSESS','AUDIT')), active boolean not null default true, unique(staff_user_id,learner_id,scope)
);
create table tprs.stage_progress (
  id uuid primary key default gen_random_uuid(), learner_id uuid not null references tprs.learners(id) on delete cascade,
  stage_no smallint not null check(stage_no between 1 and 4), required_hours numeric(5,2) not null,
  recorded_hours numeric(5,2) not null default 0 check(recorded_hours >= 0), verified_hours numeric(5,2) not null default 0 check(verified_hours >= 0),
  state text not null default 'NOT_STARTED', synthetic boolean not null default true,
  constraint verified_not_over_recorded check(verified_hours <= recorded_hours), unique(learner_id,stage_no)
);
create table tprs.plc_cycles (
  id uuid primary key default gen_random_uuid(), learner_id uuid not null references tprs.learners(id) on delete cascade,
  cycle_no smallint not null check(cycle_no between 1 and 3), state text not null default 'NOT_STARTED', synthetic boolean not null default true, unique(learner_id,cycle_no)
);
create table tprs.academic_rules (
  id uuid primary key default gen_random_uuid(), rule_code text not null, version_no integer not null check(version_no > 0), domain text not null,
  definition jsonb not null default '{}'::jsonb, status tprs.rule_status not null default 'DRAFT', authority_reference text,
  created_at timestamptz not null default now(), unique(rule_code,version_no)
);
create table tprs.evidence_records (
  id uuid primary key default gen_random_uuid(), learner_id uuid not null references tprs.learners(id) on delete cascade,
  requirement_id text not null, activity text not null, status tprs.verification_status not null default 'PENDING', current_version integer not null default 1 check(current_version > 0),
  synthetic boolean not null default true, created_at timestamptz not null default now()
);
create table tprs.evidence_versions (
  id uuid primary key default gen_random_uuid(), evidence_id uuid not null references tprs.evidence_records(id) on delete restrict,
  version_no integer not null check(version_no > 0), storage_reference text not null, content_hash text not null,
  status tprs.verification_status not null default 'PENDING', submitted_by uuid not null references tprs.profiles(user_id), submitted_at timestamptz not null default now(),
  verifier_id uuid references tprs.profiles(user_id), verified_at timestamptz, unique(evidence_id,version_no)
);
create table tprs.assessments (
  id uuid primary key default gen_random_uuid(), learner_id uuid not null references tprs.learners(id) on delete cascade,
  target_type text not null, target_id text not null, rule_id uuid references tprs.academic_rules(id), synthetic boolean not null default true, created_at timestamptz not null default now()
);
create table tprs.assessment_attempts (
  id uuid primary key default gen_random_uuid(), assessment_id uuid not null references tprs.assessments(id) on delete restrict,
  attempt_no integer not null check(attempt_no > 0), assessor_id uuid not null references tprs.profiles(user_id), decision text not null,
  rationale text not null, result_payload jsonb not null default '{}'::jsonb, assessed_at timestamptz not null default now(), unique(assessment_id,attempt_no)
);
create table tprs.audit_events (
  id uuid primary key default gen_random_uuid(), actor_id uuid references tprs.profiles(user_id), action text not null, entity_type text not null,
  entity_id text not null, reason text, previous_state jsonb, resulting_state jsonb, correlation_id uuid not null default gen_random_uuid(),
  synthetic boolean not null default true, occurred_at timestamptz not null default now()
);

create or replace function tprs.has_role(r tprs.app_role) returns boolean language sql stable security definer set search_path=tprs,public as $$
 select exists(select 1 from tprs.role_assignments ra where ra.user_id=auth.uid() and ra.role=r and ra.active);
$$;
create or replace function tprs.owns_learner(lid uuid) returns boolean language sql stable security definer set search_path=tprs,public as $$
 select exists(select 1 from tprs.learners l where l.id=lid and l.user_id=auth.uid());
$$;
create or replace function tprs.assigned_to(lid uuid, s text) returns boolean language sql stable security definer set search_path=tprs,public as $$
 select exists(select 1 from tprs.staff_assignments a where a.staff_user_id=auth.uid() and a.learner_id=lid and a.scope=s and a.active);
$$;

alter table tprs.profiles enable row level security;
alter table tprs.learners enable row level security;
alter table tprs.staff_assignments enable row level security;
alter table tprs.stage_progress enable row level security;
alter table tprs.plc_cycles enable row level security;
alter table tprs.academic_rules enable row level security;
alter table tprs.evidence_records enable row level security;
alter table tprs.evidence_versions enable row level security;
alter table tprs.assessments enable row level security;
alter table tprs.assessment_attempts enable row level security;
alter table tprs.audit_events enable row level security;

create policy profile_self on tprs.profiles for select using(user_id=auth.uid());
create policy learner_self_or_staff on tprs.learners for select using(user_id=auth.uid() or tprs.assigned_to(id,'FACILITATE') or tprs.assigned_to(id,'ASSESS') or tprs.assigned_to(id,'AUDIT'));
create policy stage_learner_read on tprs.stage_progress for select using(tprs.owns_learner(learner_id) or tprs.assigned_to(learner_id,'FACILITATE') or tprs.assigned_to(learner_id,'ASSESS') or tprs.assigned_to(learner_id,'AUDIT'));
create policy cycle_learner_read on tprs.plc_cycles for select using(tprs.owns_learner(learner_id) or tprs.assigned_to(learner_id,'FACILITATE') or tprs.assigned_to(learner_id,'ASSESS') or tprs.assigned_to(learner_id,'AUDIT'));
create policy evidence_read on tprs.evidence_records for select using(tprs.owns_learner(learner_id) or tprs.assigned_to(learner_id,'FACILITATE') or tprs.assigned_to(learner_id,'ASSESS') or tprs.assigned_to(learner_id,'AUDIT'));
create policy evidence_insert_own on tprs.evidence_records for insert with check(tprs.owns_learner(learner_id) and synthetic=true);
create policy assessment_read on tprs.assessments for select using(tprs.owns_learner(learner_id) or tprs.assigned_to(learner_id,'ASSESS') or tprs.assigned_to(learner_id,'AUDIT'));
create policy assessment_insert_assessor on tprs.assessments for insert with check(tprs.assigned_to(learner_id,'ASSESS') and synthetic=true);
create policy rules_read on tprs.academic_rules for select using(true);
create policy rules_authority_write on tprs.academic_rules for all using(tprs.has_role('academic_authority')) with check(tprs.has_role('academic_authority'));
create policy audit_qa_read on tprs.audit_events for select using(tprs.has_role('qa_auditor') or tprs.has_role('academic_authority'));

-- Intentionally no UPDATE/DELETE policies on evidence_versions, assessment_attempts or audit_events: append-oriented baseline.
-- No certificate issuance table/action in v1.5. No real-student policy is authorized.