import 'server-only';
import { neon } from '@neondatabase/serverless';

export type RealEvidenceRow = {
  evidenceId: string;
  participantReference: string;
  evidenceType: string;
  status: string;
  currentVersion: number;
  createdAt: string;
};

export async function readRealEvidence(): Promise<RealEvidenceRow[] | null> {
  const url = process.env.TPRS_DATABASE_URL;
  if (!url) return null;
  const sql = neon(url);
  const rows = await sql`
    SELECT er.id AS evidence_id, l.learner_reference AS participant_reference,
           er.evidence_type, er.status::text AS evidence_status,
           er.current_version, er.created_at
    FROM tprs.evidence_records er
    JOIN tprs.learners l ON l.id = er.learner_id
    JOIN tprs.enrollments e ON e.learner_id = l.id
      AND e.programme_code = 'HEPE-TPRS' AND e.status = 'ACTIVE'
    WHERE l.active = true AND l.synthetic = false
      AND e.synthetic = false AND er.synthetic = false
    ORDER BY l.learner_reference, er.created_at DESC
  `;
  return rows.map(row => ({
    evidenceId: String(row.evidence_id),
    participantReference: String(row.participant_reference),
    evidenceType: String(row.evidence_type),
    status: String(row.evidence_status),
    currentVersion: Number(row.current_version),
    createdAt: String(row.created_at),
  }));
}
