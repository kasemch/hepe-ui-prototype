import 'server-only';
import { neon } from '@neondatabase/serverless';
import { authorizeAssignedStaff, type TprsAuthority } from './authorization';

export type EvidenceVerificationDecision = 'VERIFIED' | 'REJECTED';
export type EvidenceVerificationInput = {
  evidenceVersionId: string;
  decision: EvidenceVerificationDecision;
  reason: string;
};
export type EvidenceVerificationBoundary =
  | { allowed: false; reason: 'INVALID_INPUT' | 'EVIDENCE_NOT_FOUND' | 'UNAUTHENTICATED' | 'IDENTITY_UNBOUND' | 'ACCOUNT_INACTIVE' | 'OUT_OF_SCOPE' | 'RUNTIME_NOT_CONFIGURED' }
  | { allowed: true; actorUserId: string; learnerId: string; evidenceVersionId: string; decision: EvidenceVerificationDecision; reason: string; role: 'FACILITATOR' | 'ASSESSOR' };

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function denied(authority: Extract<TprsAuthority, { allowed: false }>): EvidenceVerificationBoundary {
  return { allowed: false, reason: authority.reason };
}

/**
 * Authorization-only boundary. It performs no academic mutation.
 * The learner scope is derived from the evidence record; callers cannot choose it.
 */
export async function authorizeEvidenceVerification(
  authSubject: string | null | undefined,
  input: EvidenceVerificationInput,
): Promise<EvidenceVerificationBoundary> {
  if (!UUID.test(input.evidenceVersionId) || !['VERIFIED', 'REJECTED'].includes(input.decision) || input.reason.trim().length < 3 || input.reason.trim().length > 1000) {
    return { allowed: false, reason: 'INVALID_INPUT' };
  }
  const url = process.env.TPRS_DATABASE_URL;
  if (!url) return { allowed: false, reason: 'RUNTIME_NOT_CONFIGURED' };
  const sql = neon(url);
  const rows = await sql`
    SELECT er.learner_id
    FROM tprs.evidence_versions ev
    JOIN tprs.evidence_records er ON er.id = ev.evidence_id
    JOIN tprs.learners l ON l.id = er.learner_id
    JOIN tprs.enrollments e ON e.learner_id = l.id
    WHERE ev.id = ${input.evidenceVersionId}::uuid
      AND er.synthetic = false
      AND l.synthetic = false AND l.active = true
      AND e.synthetic = false AND e.programme_code = 'HEPE-TPRS' AND e.status = 'ACTIVE'
    LIMIT 1
  `;
  if (rows.length !== 1) return { allowed: false, reason: 'EVIDENCE_NOT_FOUND' };
  const learnerId = String(rows[0].learner_id);

  // Either explicitly assigned role may make an evidence decision. Both paths are deny-by-default.
  let authority = await authorizeAssignedStaff(authSubject, learnerId, 'ASSESSOR');
  if (!authority.allowed) authority = await authorizeAssignedStaff(authSubject, learnerId, 'FACILITATOR');
  if (!authority.allowed) return denied(authority);

  return {
    allowed: true,
    actorUserId: authority.actor.userId,
    learnerId,
    evidenceVersionId: input.evidenceVersionId,
    decision: input.decision,
    reason: input.reason.trim(),
    role: authority.role as 'FACILITATOR' | 'ASSESSOR',
  };
}

// Deliberately no verification persistence or verified-hours mutation here.
// Verification does not imply completion, certification, Financial Literacy completion,
// or Human Academic Clearance. Those remain separately governed academic decisions.
