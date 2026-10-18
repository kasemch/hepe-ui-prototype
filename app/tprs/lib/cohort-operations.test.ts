import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { assertCohortInvariants, type CohortOperationalRow } from './cohort-operations';

const rows: CohortOperationalRow[] = [
  { participantReference:'HEPE-A', sourceNo:1, operationalStatus:'ACTIVE', participantStatus:'ACTIVE_OR_UNCONFIRMED', readiness:'READY', studyYear:2, entryYearBe:2568, sourceRow:7 },
  { participantReference:'HEPE-B', sourceNo:2, operationalStatus:'PENDING_VERIFICATION', participantStatus:'PENDING_STUDENT_ACTION', readiness:'WARNING', studyYear:2, entryYearBe:2568, sourceRow:8 },
  { participantReference:'HEPE-C', sourceNo:3, operationalStatus:'BLOCKED', participantStatus:'WITHDRAWN', readiness:'BLOCKED', studyYear:2, entryYearBe:2568, sourceRow:9 },
];

describe('HEPE cohort operational contract', () => {
  it('reconciles exactly one participant per row', () => {
    expect(() => assertCohortInvariants({ total:3, active:1, pendingVerification:1, blocked:1 }, rows)).not.toThrow();
  });

  it('rejects duplicate participant grain', () => {
    expect(() => assertCohortInvariants({ total:4, active:2, pendingVerification:1, blocked:1 }, [...rows, rows[0]])).toThrow('TPRS_COHORT_DUPLICATE_PARTICIPANT_FAILED');
  });

  it('rejects KPI reconciliation drift', () => {
    expect(() => assertCohortInvariants({ total:3, active:2, pendingVerification:1, blocked:1 }, rows)).toThrow('TPRS_COHORT_KPI_RECONCILIATION_FAILED');
  });

  it('keeps the real-cohort query contract free of direct sensitive contact fields', () => {
    const source = fs.readFileSync(path.join(process.cwd(), 'app/tprs/lib/cohort-operations.ts'), 'utf8');
    expect(source).not.toMatch(/national_id|citizen|phone|\bemail\b/i);
    expect(source).toContain('v_hepe_cohort_operational');
    expect(source).toContain('v_hepe_cohort_kpi');
  });

  it('does not fall back to synthetic fixtures on the real-cohort page', () => {
    const source = fs.readFileSync(path.join(process.cwd(), 'app/tprs/cohort/page.tsx'), 'utf8');
    expect(source).not.toContain('syntheticStudents');
    expect(source).toContain('no real cohort data rendered');
  });
});
