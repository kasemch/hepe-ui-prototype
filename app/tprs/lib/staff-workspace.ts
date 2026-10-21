import 'server-only';
import { neon } from '@neondatabase/serverless';
import { resolveTprsActor } from './authorization';

export type StaffWorkspaceResult =
  | { allowed: false; reason: 'UNAUTHENTICATED' | 'IDENTITY_UNBOUND' | 'ACCOUNT_INACTIVE' | 'OUT_OF_SCOPE' | 'RUNTIME_NOT_CONFIGURED' }
  | { allowed: true; assignments: Array<{ participantReference: string; role: 'FACILITATOR' | 'ASSESSOR'; learnerId: string }> };

export async function readStaffWorkspace(authSubject: string | null | undefined): Promise<StaffWorkspaceResult> {
  if (!authSubject) return { allowed: false, reason: 'UNAUTHENTICATED' };
  const url = process.env.TPRS_DATABASE_URL;
  if (!url) return { allowed: false, reason: 'RUNTIME_NOT_CONFIGURED' };
  const actor = await resolveTprsActor(authSubject);
  if (!actor) return { allowed: false, reason: 'IDENTITY_UNBOUND' };
  if (actor.accountStatus !== 'ACTIVE') return { allowed: false, reason: 'ACCOUNT_INACTIVE' };

  const sql = neon(url);
  const rows = await sql`
    SELECT l.id AS learner_id, l.learner_reference, upper(sa.role::text) AS role
    FROM tprs.staff_assignments sa
    JOIN tprs.learners l ON l.id = sa.learner_id
    JOIN tprs.enrollments e ON e.learner_id = l.id
    WHERE sa.staff_user_id = ${actor.userId}::uuid
      AND sa.synthetic = false
      AND upper(sa.role::text) IN ('FACILITATOR', 'ASSESSOR')
      AND l.active = true AND l.synthetic = false
      AND e.programme_code = 'HEPE-TPRS' AND e.status = 'ACTIVE' AND e.synthetic = false
    ORDER BY l.learner_reference, upper(sa.role::text)
  `;
  if (rows.length === 0) return { allowed: false, reason: 'OUT_OF_SCOPE' };

  return {
    allowed: true,
    assignments: rows.map(row => ({
      participantReference: String(row.learner_reference),
      role: String(row.role) as 'FACILITATOR' | 'ASSESSOR',
      learnerId: String(row.learner_id),
    })),
  };
}
