-- HEPE-TPRS vNext learning event ledger
-- NON-PRODUCTION / ADDITIVE / SYNTHETIC-PILOT BASELINE

BEGIN;

CREATE TABLE IF NOT EXISTS tprs.learning_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type text NOT NULL,
  actor_type text NOT NULL CHECK (actor_type IN ('learner','verifier','system')),
  actor_ref text NOT NULL,
  object_type text NOT NULL CHECK (object_type IN ('eplc_stage','plc_cycle','evidence','verification','finlit_activity','clearance')),
  object_ref text NOT NULL,
  occurred_at timestamptz NOT NULL,
  recorded_at timestamptz NOT NULL DEFAULT now(),
  source text NOT NULL,
  schema_version integer NOT NULL DEFAULT 1 CHECK (schema_version = 1),
  payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  context jsonb,
  result jsonb,
  correlation_id uuid,
  causation_id uuid,
  idempotency_key text NOT NULL UNIQUE,
  synthetic boolean NOT NULL DEFAULT true,
  CONSTRAINT learning_events_finlit_authority_guard CHECK (
    event_type NOT LIKE 'finlit.%'
    OR NOT (
      payload ? 'officialPass'
      OR payload ? 'officialCompletion'
      OR payload ? 'certificateEligible'
      OR payload ? 'regulatoryReady'
    )
  )
);

CREATE INDEX IF NOT EXISTS learning_events_actor_idx
  ON tprs.learning_events(actor_ref, occurred_at DESC);
CREATE INDEX IF NOT EXISTS learning_events_type_idx
  ON tprs.learning_events(event_type, occurred_at DESC);
CREATE INDEX IF NOT EXISTS learning_events_object_idx
  ON tprs.learning_events(object_type, object_ref, occurred_at DESC);
CREATE INDEX IF NOT EXISTS learning_events_correlation_idx
  ON tprs.learning_events(correlation_id) WHERE correlation_id IS NOT NULL;

CREATE OR REPLACE FUNCTION tprs.reject_learning_event_mutation()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  RAISE EXCEPTION 'TPRS_LEARNING_EVENTS_APPEND_ONLY';
END;
$$;

DROP TRIGGER IF EXISTS learning_events_append_only ON tprs.learning_events;
CREATE TRIGGER learning_events_append_only
BEFORE UPDATE OR DELETE ON tprs.learning_events
FOR EACH ROW EXECUTE FUNCTION tprs.reject_learning_event_mutation();

CREATE OR REPLACE VIEW tprs.analytics_participant_event_summary_v AS
SELECT
  actor_ref,
  count(*) AS event_count,
  min(occurred_at) AS first_event_at,
  max(occurred_at) AS latest_event_at,
  count(*) FILTER (WHERE event_type LIKE 'eplc.%') AS eplc_event_count,
  count(*) FILTER (WHERE event_type LIKE 'plc.%') AS plc_event_count,
  count(*) FILTER (WHERE event_type LIKE 'evidence.%') AS evidence_event_count,
  count(*) FILTER (WHERE event_type LIKE 'finlit.%') AS finlit_event_count
FROM tprs.learning_events
GROUP BY actor_ref;

CREATE OR REPLACE VIEW tprs.analytics_evidence_flow_v AS
SELECT
  object_ref AS evidence_reference,
  count(*) AS event_count,
  min(occurred_at) AS first_event_at,
  max(occurred_at) AS latest_event_at,
  bool_or(event_type = 'evidence.verified') AS has_verified_event,
  bool_or(event_type = 'evidence.rejected') AS has_rejected_event,
  bool_or(event_type = 'evidence.conflict_detected') AS has_conflict_event
FROM tprs.learning_events
WHERE object_type = 'evidence'
GROUP BY object_ref;

-- The ledger is server-workflow owned. Application roles receive no mutation grant here.
-- Existing privileges are intentionally not broadened by this migration.

COMMIT;
