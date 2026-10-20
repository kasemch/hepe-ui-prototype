import 'server-only';
import { neon } from '@neondatabase/serverless';

export type TprsActor = {
  userId: string;
  authSubject: string;
  accountStatus: string;
};

export type TprsAuthority =
  | { allowed: false; reason: 'UNAUTHENTICATED' | 'IDENTITY_UNBOUND' | 'ACCOUNT_INACTIVE' | 'OUT_OF_SCOPE' | 'RUNTIME_NOT_CONFIGURED' }
  | { allowed: true; actor: TprsActor; role: 'LEARNER' | 'FACILITATOR' | 'ASSESSOR'; learnerId?: string };

export async function resolveTprsActor(authSubject: string | null | undefined): Promise<TprsActor | null> {
  if (!authSubject) return null;
  const url = process.env.TPRS_DATABASE_URL;
  if (!url) return null;
  const sql = neon(url);
  const rows = await sql`
    SELECT id, auth_subject, account_status::text AS account_status
    FROM tprs.app_users
    WHERE auth_subject = ${authSubject}
      AND synthetic = false
    LIMIT 1
  `;
  if (rows.length !== 1) return null;
  return {
    userId: String(rows[0].id),
    authSubject: String(rows[0].auth_subject),
    accountStatus: String(rows[0].account_status),
  };
}

export async function authorizeLearnerSelf(authSubject: string | null | undefined): Promise<TprsAuthority> {
  if (!authSubject) return { allowed: false, reason: 'UNAUTHENTICATED' };
  if (!process.env.TPRS_DATABASE_URL) return { allowed: false, reason: 'RUNTIME_NOT_CONFIGURED' };
  const actor = await resolveTprsActor(authSubject);
  if (!actor) return { allowed: false, reason: 'IDENTITY_UNBOUND' };
  if (actor.accountStatus !== 'ACTIVE') return { allowed: false, reason: 'ACCOUNT_INACTIVE' };
  const sql = neon(process.env.TPRS_DATABASE_URL);
  const rows = await sql`
    SELECT l.id AS learner_id
    FROM tprs.learners l
    JOIN tprs.enrollments e ON e.learner_id = l.id
    WHERE l.user_id = ${actor.userId}::uuid
      AND l.active = true AND l.synthetic = false
      AND e.programme_code = 'HEPE-TPRS' AND e.status = 'ACTIVE' AND e.synthetic = false
    LIMIT 1
  `;
  if (rows.length !== 1) return { allowed: false, reason: 'OUT_OF_SCOPE' };
  return { allowed: true, actor, role: 'LEARNER', learnerId: String(rows[0].learner_id) };
}

export async function authorizeAssignedStaff(
  authSubject: string | null | undefined,
  learnerId: string,
  requiredRole: 'FACILITATOR' | 'ASSESSOR'
): Promise<TprsAuthority> {
  if (!authSubject) return { allowed: false, reason: 'UNAUTHENTICATED' };
  if (!process.env.TPRS_DATABASE_URL) return { allowed: false, reason: 'RUNTIME_NOT_CONFIGURED' };
  const actor = await resolveTprsActor(authSubject);
  if (!actor) return { allowed: false, reason: 'IDENTITY_UNBOUND' };
  if (actor.accountStatus !== 'ACTIVE') return { allowed: false, reason: 'ACCOUNT_INACTIVE' };
  const sql = neon(process.env.TPRS_DATABASE_URL);
  const rows = await sql`
    SELECT 1
    FROM tprs.staff_assignments sa
    WHERE sa.staff_user_id = ${actor.userId}::uuid
      AND sa.learner_id = ${learnerId}::uuid
      AND upper(sa.role::text) = ${requiredRole}
      AND sa.synthetic = false
    LIMIT 1
  `;
  if (rows.length !== 1) return { allowed: false, reason: 'OUT_OF_SCOPE' };
  return { allowed: true, actor, role: requiredRole };
}
