-- HEPE-LOGIN-03B controlled pilot schema.
-- Mirror of the reviewed sandbox objects. Do not treat login as business authority.

create table if not exists public.hepe_login_accounts (
  user_id uuid primary key references auth.users(id) on delete cascade,
  academic_person_id uuid not null unique references public.academic_people(academic_person_id),
  username text unique,
  account_status text not null default 'SETUP_REQUIRED'
    check (account_status in ('SETUP_REQUIRED','ACTIVE','SUSPENDED','REVOKED')),
  setup_completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint hepe_login_username_format
    check (username is null or (username = lower(username) and username ~ '^[a-z][a-z0-9._-]{3,31}$')),
  constraint hepe_login_setup_consistency
    check (
      (account_status = 'SETUP_REQUIRED' and setup_completed_at is null)
      or
      (account_status in ('ACTIVE','SUSPENDED','REVOKED') and username is not null)
    )
);

alter table public.hepe_login_accounts enable row level security;
revoke all on public.hepe_login_accounts from anon, authenticated;
grant select, insert, update, delete on public.hepe_login_accounts to service_role;
drop policy if exists hepe_login_accounts_client_deny on public.hepe_login_accounts;
create policy hepe_login_accounts_client_deny
  on public.hepe_login_accounts for all to anon, authenticated
  using (false) with check (false);

create table if not exists public.hepe_login_attempts (
  attempt_id bigint generated always as identity primary key,
  username text not null,
  ip_fingerprint text not null,
  attempted_at timestamptz not null default now(),
  outcome_code text not null
    check (outcome_code in ('SUCCESS','INVALID','RATE_LIMITED','SYSTEM_ERROR')),
  constraint hepe_login_attempt_username_format
    check (username = lower(username) and username ~ '^[a-z][a-z0-9._-]{3,31}$'),
  constraint hepe_login_ip_fingerprint_format
    check (ip_fingerprint ~ '^[a-f0-9]{64}$')
);

create index if not exists hepe_login_attempts_username_time_idx
  on public.hepe_login_attempts (username, attempted_at desc);
create index if not exists hepe_login_attempts_ip_time_idx
  on public.hepe_login_attempts (ip_fingerprint, attempted_at desc);

alter table public.hepe_login_attempts enable row level security;
revoke all on public.hepe_login_attempts from anon, authenticated;
grant select, insert, delete on public.hepe_login_attempts to service_role;
grant usage, select on sequence public.hepe_login_attempts_attempt_id_seq to service_role;
drop policy if exists hepe_login_attempts_client_deny on public.hepe_login_attempts;
create policy hepe_login_attempts_client_deny
  on public.hepe_login_attempts for all to anon, authenticated
  using (false) with check (false);

-- Provision login-account rows only from an already VERIFIED person↔actor binding.
-- Username provisioning is a separate controlled action; never infer it from email alone.
insert into public.hepe_login_accounts (user_id, academic_person_id)
select u.id, b.academic_person_id
from auth.users u
join public.actors a on a.external_identity_subject = u.id::text
join public.academic_person_actor_bindings b
  on b.actor_id = a.actor_id and b.binding_status = 'VERIFIED'
where u.email_confirmed_at is not null
on conflict (user_id) do nothing;
