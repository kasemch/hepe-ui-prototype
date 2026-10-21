import 'server-only';
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
 * Persists the first immutable evidence version for an already-authorized learner.
 * artifactReference is stored as a reference only; this service does not upload files.
 * Submission never implies verification, verified hours, completion, or clearance.
 */
export async function persistEvidenceSubmission(
  boundary: Extract<EvidenceSubmissionBoundary, { allowed: true }>,
): Promise<PersistEvidenceResult> {
  const sql = neon(databaseUrl());
  const input = boundary.normalized;

  const rows = await sql.transaction([
    sql`
      SELECT id, current_version
      FROM tprs.evidence_records
      WHERE learner_id=${boundary.learnerId}::uuid
        AND activity_reference=${input.activityReference}
        AND requirement_reference=${input.requirementReference}
        AND synthetic=false
      ORDER BY created_at DESC
      LIMIT 1
    `,
  ]);

  const existing = rows[0]?.[0];
  if (existing && Number(existing.current_version) > 0) {
    return {
      status: 'DUPLICATE',
      evidenceId: String(existing.id),
      versionNo: Number(existing.current_version),
    };
  }

  const evidenceId = crypto.randomUUID();
  const versionId = crypto.randomUUID();

  await sql.transaction([
    sql`
      INSERT INTO tprs.evidence_records (
        id, learner_id, activity_reference, requirement_reference,
        evidence_type, current_version, status, privacy_class, synthetic
      ) VALUES (
        ${evidenceId}::uuid, ${boundary.learnerId}::uuid,
        ${input.activityReference}, ${input.requirementReference},
        ${input.evidenceType}, 1, 'SUBMITTED'::tprs.evidence_status, 'P2', false
      )
    `,
    sql`
      INSERT INTO tprs.evidence_versions (
        id, evidence_id, version_no, storage_reference, source_type,
        submitted_by, synthetic
      ) VALUES (
        ${versionId}::uuid, ${evidenceId}::uuid, 1,
        ${input.artifactReference}, 'REFERENCE', ${boundary.actorUserId}::uuid, false
      )
    `,
    sql`
      INSERT INTO tprs.audit_events (
        actor_id, action, object_type, object_id, resulting_state, reason, synthetic
      ) VALUES (
        ${boundary.actorUserId}::uuid, 'EVIDENCE_SUBMITTED', 'evidence', ${evidenceId},
        ${JSON.stringify({ status: 'SUBMITTED', version: 1 })}::jsonb,
        'Participant evidence submission; verification remains pending', false
      )
    `,
  ]);

  return { status: 'INSERTED', evidenceId, versionNo: 1 };
}
