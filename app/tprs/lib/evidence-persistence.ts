import 'server-only';
import { randomUUID } from 'node:crypto';
import { neon } from '@neondatabase/serverless';
import type { EvidenceSubmissionBoundary } from './evidence-submission-boundary';

export type PersistEvidenceResult =
  | { status: 'INSERTED'; evidenceId: string; versionNo: 1 }
  | { status: 'DUPLICATE'; evidenceId: string; versionNo: number };

function databaseUrl(): string {
  const url = process.env.TPRS_DATABASE_URL;
  if (!url) throw new Error('TPRS_DATABASE_NOT_CONFIGURED');
  return url;
}

/**
 * Persists a participant's first immutable evidence version after authorization.
 * The database idempotency row is the durable retry boundary.
 * Submission never implies verification, verified hours, completion, or clearance.
 */
export async function persistEvidenceSubmission(
  boundary: Extract<EvidenceSubmissionBoundary, { allowed: true }>,
): Promise<PersistEvidenceResult> {
  const sql = neon(databaseUrl());
  const input = boundary.normalized;
  const evidenceId = randomUUID();
  const versionId = randomUUID();

  const rows = await sql.transaction([
    sql`
      INSERT INTO tprs.evidence_records (
        id, learner_id, activity_reference, requirement_reference,
        evidence_type, current_version, status, privacy_class, synthetic
      )
      SELECT
        ${evidenceId}::uuid, ${boundary.learnerId}::uuid,
        ${input.activityReference}, ${input.requirementReference},
        ${input.evidenceType}, 1, 'SUBMITTED'::tprs.evidence_status, 'P2', false
      WHERE NOT EXISTS (
        SELECT 1 FROM tprs.evidence_submission_idempotency
        WHERE idempotency_key=${input.idempotencyKey}
      )
      RETURNING id
    `,
    sql`
      INSERT INTO tprs.evidence_versions (
        id, evidence_id, version_no, storage_reference, source_type,
        submitted_by, synthetic
      )
      SELECT
        ${versionId}::uuid, ${evidenceId}::uuid, 1,
        ${input.artifactReference}, 'REFERENCE', ${boundary.actorUserId}::uuid, false
      WHERE EXISTS (
        SELECT 1 FROM tprs.evidence_records WHERE id=${evidenceId}::uuid
      )
      RETURNING id
    `,
    sql`
      INSERT INTO tprs.evidence_submission_idempotency (
        idempotency_key, evidence_id, learner_id, actor_user_id, synthetic
      )
      SELECT
        ${input.idempotencyKey}, ${evidenceId}::uuid, ${boundary.learnerId}::uuid,
        ${boundary.actorUserId}::uuid, false
      WHERE EXISTS (
        SELECT 1 FROM tprs.evidence_records WHERE id=${evidenceId}::uuid
      )
      ON CONFLICT (idempotency_key) DO NOTHING
      RETURNING evidence_id
    `,
  ]);

  if (rows[0]?.length) {
    return { status: 'INSERTED', evidenceId, versionNo: 1 };
  }

  const existing = await sql`
    SELECT i.evidence_id, er.current_version
    FROM tprs.evidence_submission_idempotency i
    JOIN tprs.evidence_records er ON er.id=i.evidence_id
    WHERE i.idempotency_key=${input.idempotencyKey}
      AND i.learner_id=${boundary.learnerId}::uuid
      AND i.actor_user_id=${boundary.actorUserId}::uuid
      AND i.synthetic=false AND er.synthetic=false
    LIMIT 1
  `;
  if (!existing.length) throw new Error('TPRS_EVIDENCE_IDEMPOTENCY_RESOLUTION_FAILED');

  return {
    status: 'DUPLICATE',
    evidenceId: String(existing[0].evidence_id),
    versionNo: Number(existing[0].current_version),
  };
}
