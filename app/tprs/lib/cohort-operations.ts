import 'server-only';
import { neon } from '@neondatabase/serverless';

export type CohortKpi = {
  total: number;
  active: number;
  pendingVerification: number;
  blocked: number;
};

export type CohortOperationalRow = {
  participantReference: string;
  sourceNo: number;
  operationalStatus: 'ACTIVE' | 'PENDING_VERIFICATION' | 'BLOCKED' | 'UNRESOLVED';
  participantStatus: string;
  readiness: string;
  studyYear: number | null;
  entryYearBe: number | null;
  sourceRow: number;
};

function databaseUrl(): string | null {
  return process.env.TPRS_DATABASE_URL || null;
}

export async function readCohortKpi(): Promise<CohortKpi | null> {
  const url = databaseUrl();
  if (!url) return null;
  const sql = neon(url);
  const rows = await sql`SELECT total, active, pending_verification, blocked FROM tprs.v_hepe_cohort_kpi`;
  const row = rows[0];
  if (!row) return null;
  return {
    total: Number(row.total),
    active: Number(row.active),
    pendingVerification: Number(row.pending_verification),
    blocked: Number(row.blocked),
  };
}

export async function readCohortOperational(): Promise<CohortOperationalRow[] | null> {
  const url = databaseUrl();
  if (!url) return null;
  const sql = neon(url);
  const rows = await sql`
    SELECT participant_reference, source_no, operational_status,
           participant_status, readiness, study_year, entry_year_be, source_row
    FROM tprs.v_hepe_cohort_operational
    ORDER BY source_no
  `;
  return rows.map(row => ({
    participantReference: String(row.participant_reference),
    sourceNo: Number(row.source_no),
    operationalStatus: String(row.operational_status) as CohortOperationalRow['operationalStatus'],
    participantStatus: String(row.participant_status),
    readiness: String(row.readiness),
    studyYear: row.study_year == null ? null : Number(row.study_year),
    entryYearBe: row.entry_year_be == null ? null : Number(row.entry_year_be),
    sourceRow: Number(row.source_row),
  }));
}

export function assertCohortInvariants(kpi: CohortKpi, rows: CohortOperationalRow[]) {
  if (kpi.total !== rows.length) throw new Error('TPRS_COHORT_GRAIN_INVARIANT_FAILED');
  if (kpi.total !== kpi.active + kpi.pendingVerification + kpi.blocked) {
    throw new Error('TPRS_COHORT_KPI_RECONCILIATION_FAILED');
  }
  const refs = new Set(rows.map(row => row.participantReference));
  if (refs.size !== rows.length) throw new Error('TPRS_COHORT_DUPLICATE_PARTICIPANT_FAILED');
}
