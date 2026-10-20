import 'server-only';
import { neon } from '@neondatabase/serverless';

export type EplcStageProgress = {
  stageCode: string;
  sequenceNo: number;
  requiredHours: number;
  state: string;
  recordedHours: number;
  verifiedHours: number;
};

export type EplcParticipantProgress = {
  participantReference: string;
  stages: EplcStageProgress[];
  plcCycles: Array<{ cycleNumber: number; state: string }>;
};

function databaseUrl(): string | null {
  return process.env.TPRS_DATABASE_URL || null;
}

export async function readRealEplcOperational(): Promise<EplcParticipantProgress[] | null> {
  const url = databaseUrl();
  if (!url) return null;
  const sql = neon(url);
  const rows = await sql`
    SELECT l.learner_reference AS participant_reference,
           ls.stage_code, ls.sequence_no, ls.required_hours,
           sp.state AS stage_state, sp.recorded_hours, sp.verified_hours
    FROM tprs.learners l
    JOIN tprs.enrollments e ON e.learner_id = l.id
      AND e.programme_code = 'HEPE-TPRS' AND e.status = 'ACTIVE'
    JOIN tprs.stage_progress sp ON sp.learner_id = l.id
    JOIN tprs.learning_stages ls ON ls.id = sp.stage_id AND ls.active = true
    WHERE l.active = true AND l.synthetic = false AND e.synthetic = false
    ORDER BY l.learner_reference, ls.sequence_no
  `;
  const cycleRows = await sql`
    SELECT l.learner_reference AS participant_reference,
           pc.cycle_number, pc.state
    FROM tprs.learners l
    JOIN tprs.enrollments e ON e.learner_id = l.id
      AND e.programme_code = 'HEPE-TPRS' AND e.status = 'ACTIVE'
    JOIN tprs.plc_cycles pc ON pc.learner_id = l.id
    WHERE l.active = true AND l.synthetic = false AND e.synthetic = false AND pc.synthetic = false
    ORDER BY l.learner_reference, pc.cycle_number
  `;

  const byRef = new Map<string, EplcParticipantProgress>();
  for (const row of rows) {
    const ref = String(row.participant_reference);
    const item = byRef.get(ref) ?? { participantReference: ref, stages: [], plcCycles: [] };
    item.stages.push({
      stageCode: String(row.stage_code), sequenceNo: Number(row.sequence_no),
      requiredHours: Number(row.required_hours), state: String(row.stage_state),
      recordedHours: Number(row.recorded_hours), verifiedHours: Number(row.verified_hours),
    });
    byRef.set(ref, item);
  }
  for (const row of cycleRows) {
    const ref = String(row.participant_reference);
    const item = byRef.get(ref);
    if (item) item.plcCycles.push({ cycleNumber: Number(row.cycle_number), state: String(row.state) });
  }
  return [...byRef.values()];
}

export function assertRealEplcInvariants(rows: EplcParticipantProgress[]) {
  for (const row of rows) {
    if (row.stages.length !== 4) throw new Error('TPRS_EPLC_STAGE_COUNT_INVARIANT_FAILED');
    const ordered = [...row.stages].sort((a,b) => a.sequenceNo - b.sequenceNo);
    const required = ordered.map(s => s.requiredHours);
    if (required.join(',') !== '3,5,5,11') throw new Error('TPRS_EPLC_REQUIRED_HOURS_INVARIANT_FAILED');
    if (required.reduce((a,b) => a+b, 0) !== 24) throw new Error('TPRS_EPLC_TOTAL_HOURS_INVARIANT_FAILED');
    const cycles = row.plcCycles.map(c => c.cycleNumber).sort().join(',');
    if (cycles !== '1,2,3') throw new Error('TPRS_PLC_CYCLE_INVARIANT_FAILED');
  }
}
