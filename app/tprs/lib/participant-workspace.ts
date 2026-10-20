import 'server-only';
import { neon } from '@neondatabase/serverless';
import { authorizeLearnerSelf } from './authorization';

export type ParticipantWorkspace = {
  participantReference: string;
  stages: Array<{
    stageCode: string;
    sequenceNo: number;
    requiredHours: number;
    state: string;
    recordedHours: number;
    verifiedHours: number;
  }>;
  plcCycles: Array<{ cycleNumber: number; state: string }>;
  evidence: Array<{
    evidenceId: string;
    evidenceType: string;
    status: string;
    currentVersion: number;
    createdAt: string;
  }>;
};

export type ParticipantWorkspaceResult =
  | { allowed: false; reason: 'UNAUTHENTICATED' | 'IDENTITY_UNBOUND' | 'ACCOUNT_INACTIVE' | 'OUT_OF_SCOPE' | 'RUNTIME_NOT_CONFIGURED' }
  | { allowed: true; workspace: ParticipantWorkspace };

export async function readParticipantWorkspace(authSubject: string | null | undefined): Promise<ParticipantWorkspaceResult> {
  const authority = await authorizeLearnerSelf(authSubject);
  if (!authority.allowed) return authority;
  const url = process.env.TPRS_DATABASE_URL;
  if (!url || !authority.learnerId) return { allowed: false, reason: 'RUNTIME_NOT_CONFIGURED' };
  const sql = neon(url);

  const learners = await sql`
    SELECT learner_reference
    FROM tprs.learners
    WHERE id = ${authority.learnerId}::uuid
      AND active = true AND synthetic = false
    LIMIT 1
  `;
  if (learners.length !== 1) return { allowed: false, reason: 'OUT_OF_SCOPE' };

  const stages = await sql`
    SELECT ls.stage_code, ls.sequence_no, ls.required_hours,
           sp.state::text AS state, sp.recorded_hours, sp.verified_hours
    FROM tprs.stage_progress sp
    JOIN tprs.learning_stages ls ON ls.id = sp.stage_id AND ls.active = true
    WHERE sp.learner_id = ${authority.learnerId}::uuid
    ORDER BY ls.sequence_no
  `;
  const cycles = await sql`
    SELECT cycle_number, state::text AS state
    FROM tprs.plc_cycles
    WHERE learner_id = ${authority.learnerId}::uuid AND synthetic = false
    ORDER BY cycle_number
  `;
  const evidence = await sql`
    SELECT id, evidence_type, status::text AS status, current_version, created_at
    FROM tprs.evidence_records
    WHERE learner_id = ${authority.learnerId}::uuid AND synthetic = false
    ORDER BY created_at DESC
  `;

  const required = stages.map(row => Number(row.required_hours));
  if (stages.length !== 4 || required.join(',') !== '3,5,5,11' || required.reduce((a, b) => a + b, 0) !== 24) {
    throw new Error('TPRS_PARTICIPANT_STAGE_INVARIANT_FAILED');
  }
  if (cycles.map(row => Number(row.cycle_number)).join(',') !== '1,2,3') {
    throw new Error('TPRS_PARTICIPANT_PLC_INVARIANT_FAILED');
  }

  return {
    allowed: true,
    workspace: {
      participantReference: String(learners[0].learner_reference),
      stages: stages.map(row => ({
        stageCode: String(row.stage_code),
        sequenceNo: Number(row.sequence_no),
        requiredHours: Number(row.required_hours),
        state: String(row.state),
        recordedHours: Number(row.recorded_hours),
        verifiedHours: Number(row.verified_hours),
      })),
      plcCycles: cycles.map(row => ({ cycleNumber: Number(row.cycle_number), state: String(row.state) })),
      evidence: evidence.map(row => ({
        evidenceId: String(row.id),
        evidenceType: String(row.evidence_type),
        status: String(row.status),
        currentVersion: Number(row.current_version),
        createdAt: String(row.created_at),
      })),
    },
  };
}
