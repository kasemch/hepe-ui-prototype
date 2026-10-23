BEGIN;

-- Durable retry boundary for real/synthetic evidence submissions.
-- This table stores no evidence body and no PII; it binds one caller-provided
-- idempotency key to one evidence record and actor/learner scope.
CREATE TABLE IF NOT EXISTS tprs.evidence_submission_idempotency (
  idempotency_key text PRIMARY KEY,
  evidence_id uuid NOT NULL REFERENCES tprs.evidence_records(id),
  learner_id uuid NOT NULL REFERENCES tprs.learners(id),
  actor_user_id uuid NOT NULL REFERENCES tprs.app_users(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  synthetic boolean NOT NULL
);

ALTER TABLE tprs.evidence_submission_idempotency
  ADD CONSTRAINT evidence_submission_idempotency_key_nonblank
  CHECK (length(trim(idempotency_key)) >= 16);

CREATE INDEX IF NOT EXISTS evidence_submission_idempotency_learner_idx
  ON tprs.evidence_submission_idempotency (learner_id, created_at DESC);

COMMIT;
