import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

type Row = { participantReference: string };
type Kpi = { total:number; active:number; pendingVerification:number; blocked:number };

function assertContract(kpi: Kpi, rows: Row[]) {
  if (kpi.total !== rows.length) throw new Error('TPRS_COHORT_GRAIN_INVARIANT_FAILED');
  if (kpi.total !== kpi.active + kpi.pendingVerification + kpi.blocked) throw new Error('TPRS_COHORT_KPI_RECONCILIATION_FAILED');
  if (new Set(rows.map(r => r.participantReference)).size !== rows.length) throw new Error('TPRS_COHORT_DUPLICATE_PARTICIPANT_FAILED');
}

const rows: Row[] = [
  { participantReference:'HEPE-A' },
  { participantReference:'HEPE-B' },
  { participantReference:'HEPE-C' },
];

describe('HEPE cohort operational contract', () => {
  it('reconciles exactly one participant per row', () => {
    expect(() => assertContract({ total:3, active:1, pendingVerification:1, blocked:1 }, rows)).not.toThrow();
  });

  it('rejects duplicate participant grain', () => {
    expect(() => assertContract({ total:4, active:2, pendingVerification:1, blocked:1 }, [...rows, rows[0]])).toThrow('TPRS_COHORT_DUPLICATE_PARTICIPANT_FAILED');
  });

  it('rejects KPI reconciliation drift', () => {
    expect(() => assertContract({ total:3, active:2, pendingVerification:1, blocked:1 }, rows)).toThrow('TPRS_COHORT_KPI_RECONCILIATION_FAILED');
  });

  it('keeps the real-cohort query contract free of direct sensitive contact fields', () => {
    const source = fs.readFileSync(path.join(process.cwd(), 'app/tprs/lib/cohort-operations.ts'), 'utf8');
    expect(source).not.toMatch(/national_id|citizen|phone|\bemail\b/i);
    expect(source).toContain("import 'server-only'");
    expect(source).toContain('v_hepe_cohort_operational');
    expect(source).toContain('v_hepe_cohort_kpi');
    expect(source).toContain('TPRS_COHORT_KPI_RECONCILIATION_FAILED');
    expect(source).toContain('TPRS_COHORT_DUPLICATE_PARTICIPANT_FAILED');
  });

  it('does not fall back to synthetic fixtures on the real-cohort page', () => {
    const source = fs.readFileSync(path.join(process.cwd(), 'app/tprs/cohort/page.tsx'), 'utf8');
    expect(source).not.toContain('syntheticStudents');
    expect(source).toContain('no real cohort data rendered');
  });
});
