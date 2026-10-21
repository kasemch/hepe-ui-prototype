import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

describe('evidence persistence safety contract', () => {
  it('fails closed until durable idempotency migration is applied', () => {
    const source = fs.readFileSync(path.join(process.cwd(), 'app/tprs/lib/evidence-persistence.ts'), 'utf8');
    expect(source).toContain('TPRS_EVIDENCE_IDEMPOTENCY_STORE_REQUIRED');
    expect(source).not.toContain('INSERT INTO tprs.evidence_records');
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
