import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

describe('learning event persistence security contract', () => {
  it('keeps persistence server-only and idempotent by construction', () => {
    const source = fs.readFileSync(path.join(process.cwd(), 'app/tprs/lib/learning-event-persistence.ts'), 'utf8');
    expect(source).toContain("import 'server-only'");
    expect(source).toContain('ON CONFLICT (idempotency_key) DO NOTHING');
    expect(source).toContain('assertFinlitAuthorityBoundary(event)');
  });

  it('keeps the SQL ledger append-only and guards FinLit authority semantics', () => {
    const sql = fs.readFileSync(path.join(process.cwd(), 'db/tprs-vnext-learning-events.sql'), 'utf8');
    expect(sql).toContain('BEFORE UPDATE OR DELETE ON tprs.learning_events');
    expect(sql).toContain('TPRS_LEARNING_EVENTS_APPEND_ONLY');
    expect(sql).toContain('learning_events_finlit_authority_guard');
    expect(sql).toContain('idempotency_key text NOT NULL UNIQUE');
  });
});
