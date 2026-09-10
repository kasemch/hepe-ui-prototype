-- HEPE-REL-02 — DURABLE OUTBOX / RECONCILIATION PERSISTENCE
-- STATUS: NOT AUTHORIZED FOR EXECUTION
-- ENVIRONMENT: NON-PRODUCTION DESIGN ARTIFACT ONLY
-- This file is a schema candidate. Do not apply without a separate explicit schema authorization.

create table if not exists public.connector_outbox (
  outbox_id uuid primary key default gen_random_uuid(),
  operation_id text not null,
  correlation_id uuid not null default gen_random_uuid(),
  idempotency_key text not null,
  connector_id text not null,
  operation_class text not null check (operation_class in ('READ','WRITE','ADMIN','DESTRUCTIVE','PRODUCTION-SENSITIVE','HUMAN-GATED')),
  actor_id uuid not null references public.actors(actor_id),
  authority_assignment_id uuid references public.authority_assignments(authority_assignment_id),
  programme_id uuid references public.programmes(programme_id),
  course_id uuid references public.courses(course_id),
  governed_object_id uuid references public.governed_objects(governed_object_id),
  target_resource text not null,
  payload_fingerprint text not null,
  state text not null check (state in ('CREATED','VALIDATED','AUTHORIZED','READY','DISPATCHED','ACKNOWLEDGED','VERIFIED','COMPLETED','RETRYABLE_FAILURE','REVALIDATION_REQUIRED','HUMAN_RECONFIRM_REQUIRED','CONFLICT','EXPIRED','DENIED','ABORTED')),
  attempt_no integer not null default 0 check (attempt_no >= 0),
  created_at timestamptz not null default now(),
  expires_at timestamptz not null,
  last_verified_at timestamptz,
  destination_state_before jsonb,
  destination_state_after jsonb,
  failure_class text,
  final_disposition text,
  provenance_reference text,
  constraint connector_outbox_expiry_after_creation check (expires_at > created_at)
);

create unique index if not exists connector_outbox_idempotency_uq
  on public.connector_outbox(idempotency_key, connector_id);
create index if not exists connector_outbox_correlation_idx on public.connector_outbox(correlation_id);
create index if not exists connector_outbox_state_expiry_idx on public.connector_outbox(state, expires_at);
create index if not exists connector_outbox_scope_idx on public.connector_outbox(programme_id, course_id);

create table if not exists public.connector_attempt (
  attempt_id uuid primary key default gen_random_uuid(),
  outbox_id uuid not null references public.connector_outbox(outbox_id) on delete restrict,
  attempt_no integer not null check (attempt_no > 0),
  started_at timestamptz not null default now(),
  finished_at timestamptz,
  failure_class text,
  remote_ack_reference text,
  destination_verification jsonb,
  authority_revalidated boolean not null default false,
  idempotency_verified boolean not null default false,
  outcome text not null,
  unique(outbox_id, attempt_no)
);

create table if not exists public.idempotency_record (
  idempotency_record_id uuid primary key default gen_random_uuid(),
  idempotency_key text not null,
  operation_id text not null,
  connector_id text not null,
  payload_fingerprint text not null,
  authority_scope_fingerprint text not null,
  target_resource text not null,
  first_seen_at timestamptz not null default now(),
  expires_at timestamptz not null,
  completion_state text not null,
  completed_at timestamptz,
  result_reference jsonb,
  unique(idempotency_key, connector_id)
);

create table if not exists public.reconciliation_item (
  reconciliation_item_id uuid primary key default gen_random_uuid(),
  outbox_id uuid not null references public.connector_outbox(outbox_id) on delete restrict,
  reason_code text not null,
  opened_at timestamptz not null default now(),
  resolved_at timestamptz,
  resolution_status text not null default 'OPEN' check (resolution_status in ('OPEN','RESOLVED','SUPERSEDED')),
  resolved_by_actor_id uuid references public.actors(actor_id),
  resolution_notes text,
  evidence_reference text
);

create table if not exists public.connector_health_snapshot (
  snapshot_id uuid primary key default gen_random_uuid(),
  connector_id text not null,
  runtime_state text not null check (runtime_state in ('CONNECTED','DEGRADED','OFFLINE','RECONCILING')),
  circuit_state text not null check (circuit_state in ('CLOSED','OPEN','HALF_OPEN')),
  last_success_at timestamptz,
  last_failure_at timestamptz,
  last_failure_class text,
  consecutive_failures integer not null default 0 check (consecutive_failures >= 0),
  queue_depth integer not null default 0 check (queue_depth >= 0),
  oldest_queued_at timestamptz,
  pending_reconciliation_count integer not null default 0 check (pending_reconciliation_count >= 0),
  authority_revalidation_pending boolean not null default false,
  captured_at timestamptz not null default now()
);

alter table public.connector_outbox enable row level security;
alter table public.connector_attempt enable row level security;
alter table public.idempotency_record enable row level security;
alter table public.reconciliation_item enable row level security;
alter table public.connector_health_snapshot enable row level security;

-- RLS CANDIDATE ONLY — policies intentionally not executable in this gate.
-- Required future policy assertions:
-- 1. actor create/read limited by active authority_assignment scope;
-- 2. wrong-programme and wrong-course denied by default;
-- 3. connector_attempt append-only to ordinary actors;
-- 4. reconciliation resolution requires explicitly authorized human actor;
-- 5. service-role technical access never equals academic authority;
-- 6. Production-sensitive operations remain denied absent explicit Production Authorization.

-- ROLLBACK CANDIDATE ONLY — NOT AUTHORIZED:
-- drop table public.connector_attempt;
-- drop table public.reconciliation_item;
-- drop table public.connector_health_snapshot;
-- drop table public.idempotency_record;
-- drop table public.connector_outbox;
