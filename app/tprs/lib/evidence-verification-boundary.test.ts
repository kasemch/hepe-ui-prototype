import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';

const source = readFileSync(new URL('./evidence-verification-boundary.ts', import.meta.url), 'utf8');

describe('evidence verification authorization contract', () => {
  it('is server-only and derives learner scope from evidence', () => {
    expect(source).toContain("import 'server-only'");
    expect(source).toContain('JOIN tprs.evidence_records er ON er.id = ev.evidence_id');
    expect(source).toContain('const learnerId = String(rows[0].learner_id)');
    expect(source).not.toContain('learnerId: string;\n  decision');
  });

  it('requires explicit assigned staff authority and excludes synthetic records', () => {
    expect(source).toContain("authorizeAssignedStaff(authSubject, learnerId, 'ASSESSOR')");
    expect(source).toContain("authorizeAssignedStaff(authSubject, learnerId, 'FACILITATOR')");
    expect(source).toContain('er.synthetic = false');
    expect(source).toContain('l.synthetic = false');
    expect(source).toContain('e.synthetic = false');
  });

  it('keeps verification separate from hours, completion and clearance', () => {
    expect(source).not.toContain('UPDATE tprs.stage_progress');
    expect(source).not.toContain('INSERT INTO tprs.verifications');
    expect(source).not.toContain('human_clearance_status');
    expect(source).toContain('Human Academic Clearance');
  });
});
