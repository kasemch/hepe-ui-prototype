# HEPE-REL-02 — Durable Outbox / Reconciliation Persistence Design

Environment: **NON-PRODUCTION ONLY**  
Status: **PROPOSED CONTROLLED DESIGN — SCHEMA EXECUTION NOT AUTHORIZED**  
Predecessor: `HEPE-REL-01-CONNECTOR-RESILIENCE-CONTRACT.md`

## 1. Verified current-state basis
The repository binds the non-production Supabase project through `.env.example`. A read-only schema inspection of the bound project shows that `public.command_requests` already provides partial reusable primitives: `command_request_id`, `idempotency_key`, `actor_id`, `command_code`, `target_object_id`, `request_hash`, `status`, `correlation_id`, timestamps, `result_reference`, and `error_code`. Existing authority/provenance structures include `authority_assignments`, `audit_events`, `command_registry`, and `ui_command_bindings`, all with RLS enabled where inspected.

No existing tables named `connector_outbox`, `connector_attempt`, `idempotency_record`, `reconciliation_item`, or `connector_health_snapshot` were identified in the inspected public schema. Therefore REL-02 classifies `command_requests` as **EXISTING / REUSABLE PARTIALLY**, while durable connector-specific persistence remains **MISSING**.

## 2. Logical data contract
Candidate entities:

### `connector_outbox`
Durable command envelope. Candidate fields: `outbox_id uuid PK`, `operation_id text`, `correlation_id uuid`, `idempotency_key text`, `connector_id text`, `operation_class text`, `actor_id uuid`, `authority_assignment_id uuid`, `programme_id uuid null`, `course_id uuid null`, `governed_object_id uuid null`, `target_resource text`, `payload_fingerprint text`, `state text`, `attempt_no int`, `created_at timestamptz`, `expires_at timestamptz`, `last_verified_at timestamptz null`, `destination_state_before jsonb null`, `destination_state_after jsonb null`, `failure_class text null`, `final_disposition text null`, `provenance_reference text null`.

### `connector_attempt`
Append-only attempt history. Candidate fields: `attempt_id uuid PK`, `outbox_id uuid FK`, `attempt_no int`, `started_at`, `finished_at`, `failure_class`, `remote_ack_reference`, `destination_verification`, `authority_revalidated boolean`, `idempotency_verified boolean`, `outcome`.

### `idempotency_record`
Canonical replay guard. Candidate fields: `idempotency_record_id uuid PK`, `idempotency_key text UNIQUE`, `operation_id text`, `connector_id text`, `payload_fingerprint text`, `authority_scope_fingerprint text`, `target_resource text`, `first_seen_at`, `expires_at`, `completion_state`, `completed_at`, `result_reference`.

### `reconciliation_item`
Ambiguous or conflicting state. Candidate fields: `reconciliation_item_id uuid PK`, `outbox_id uuid FK`, `reason_code text`, `opened_at`, `resolved_at`, `resolution_status`, `resolved_by_actor_id uuid null`, `resolution_notes text null`, `evidence_reference text null`.

### `connector_health_snapshot`
Non-secret operational health. Candidate fields: `snapshot_id uuid PK`, `connector_id text`, `runtime_state text`, `circuit_state text`, `last_success_at`, `last_failure_at`, `last_failure_class`, `consecutive_failures int`, `queue_depth int`, `oldest_queued_at`, `pending_reconciliation_count int`, `authority_revalidation_pending boolean`, `captured_at`.

## 3. State and invariant contract
Success path: `CREATED → VALIDATED → AUTHORIZED → READY → DISPATCHED → ACKNOWLEDGED → VERIFIED → COMPLETED`.

Failure states: `RETRYABLE_FAILURE`, `REVALIDATION_REQUIRED`, `HUMAN_RECONFIRM_REQUIRED`, `CONFLICT`, `EXPIRED`, `DENIED`, `ABORTED`.

Required invariants:
- Same idempotency key + different payload fingerprint => `CONFLICT / DENY`.
- Completed identical idempotency key => `NO-OP SUCCESS`.
- Expired queue item => `DENY`.
- Ambiguous destination => `RECONCILIATION_REQUIRED`.
- Stale/expired authority => `HUMAN_RECONFIRM_REQUIRED` where human-gated, otherwise authority revalidation.
- ADMIN and DESTRUCTIVE operations => never automatic replay.
- PRODUCTION-SENSITIVE => deny absent explicit Production Authorization.
- Queue persistence must never extend authority validity beyond the underlying authority assignment.
- A technical service identity does not acquire academic authority by writing or reading outbox records.

## 4. RLS / authority candidate
Design only; not applied.

Candidate policy posture:
- Authenticated academic actors may create an outbox record only for operations for which an active scoped `authority_assignment` and valid `command_registry` entry exist.
- Reads are limited to the actor's authorized programme/course/object scope, with governance roles able to inspect broader scope only where an explicit assignment permits it.
- Attempt history is append-only to ordinary actors; mutation of previous attempts is denied.
- Reconciliation resolution requires an explicitly authorized human actor; the workflow runner may create technical state records but may not resolve academic authority conflicts.
- Cross-programme and wrong-course access are denied by default unless an explicit `CROSS_PROGRAMME` or `SYSTEM` scope assignment permits it.
- Service-role usage, if ever introduced, is a technical bypass surface and requires separate explicit control; it must not be treated as Human Authority.

## 5. Migration candidate posture
The accompanying SQL artifact is **NOT AUTHORIZED FOR EXECUTION**. It is a design candidate only. It proposes new tables, constraints, indexes, RLS enablement, and placeholder policy comments. No schema tool, SQL execution, migration apply, or data write is authorized by this gate.

## 6. Schema delta assessment
Schema delta: **REQUIRED**.

Reason: existing `command_requests` is useful for command-level idempotency and correlation but does not provide durable connector-specific queue state, per-attempt history, ambiguity reconciliation, connector health snapshots, queue expiry, or explicit destination-before/after verification fields.

Execution status: **SCHEMA AUTHORIZATION REQUIRED**.

## 7. Rollback candidate
If later authorized and applied, rollback should drop REL-02 policies/indexes first, then child tables `connector_attempt` and `reconciliation_item`, followed by `connector_health_snapshot`, `idempotency_record`, and `connector_outbox`. Rollback must itself be a separately authorized schema operation and must preserve exported audit/provenance evidence where retention rules require it.

## 8. Security considerations
- No payload body should be persisted if a fingerprint/reference is sufficient.
- Secrets, bearer tokens, SMTP credentials, private keys, or raw authentication assertions are prohibited from these tables.
- `authority_assignment_id` should be captured at validation/dispatch time for provenance but revalidated before replay.
- Connector health metadata must remain non-secret.
- Any future cleanup/purge mechanism must be retention-policy governed and must not silently delete audit-relevant provenance.

No Production Authorization. Conversation ≠ Audit Evidence. Controlled Baseline / Verified System Evidence prevail.
