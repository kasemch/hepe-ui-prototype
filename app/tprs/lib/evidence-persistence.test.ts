import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

describe('evidence persistence safety contract', () => {
  it('persists only through the durable idempotency boundary', () => {
    const source = fs.readFileSync(path.join(process.cwd(), 'app/tprs/lib/evidence-persistence.ts'), 'utf8');
    expect(source).toContain('INSERT INTO tprs.evidence_records');
    expect(source).toContain('INSERT INTO tprs.evidence_versions');
    expect(source).toContain('INSERT INTO tprs.evidence_submission_idempotency');
    expect(source).toContain('ON CONFLICT (idempotency_key) DO NOTHING');
    expect(source).toContain('AND i.learner_id=${boundary.learnerId}::uuid');
    expect(source).toContain('AND i.actor_user_id=${boundary.actorUserId}::uuid');
    expect(source).toContain('false');
    expect(source).not.toContain('TPRS_EVIDENCE_IDEMPOTENCY_STORE_REQUIRED');
  });

  it('defines a durable unique idempotency key without evidence content or PII columns', () => {
    const sql = fs.readFileSync(path.join(process.cwd(), 'db/tprs-evidence-submission-idempotency.sql'), 'utf8');
    expect(sql).toContain('idempotency_key text PRIMARY KEY');
    expect(sql).toContain('evidence_id uuid NOT NULL');
    expect(sql).toContain('learner_id uuid NOT NULL');
    expect(sql).toContain('actor_user_id uuid NOT NULL');
    expect(sql).not.toMatch(/email|phone|citizen|national_id/i);
  });
});
