import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const captureSource = fs.readFileSync(
  path.join(process.cwd(), 'app/tprs/lib/learning-event-capture.ts'),
  'utf8',
);

describe('governed learning event capture contract', () => {
  it('is server-only and routes writes through the canonical persistence layer', () => {
    expect(captureSource).toContain("import 'server-only'");
    expect(captureSource).toContain('appendLearningEvent(event');
    expect(captureSource).toContain('{ synthetic: input.synthetic }');
  });

  it('requires explicit idempotency and provenance', () => {
    expect(captureSource).toContain('idempotencyKey: string');
    expect(captureSource).toContain('synthetic: boolean');
    expect(captureSource).toContain('TPRS_EVENT_IDEMPOTENCY_KEY_REQUIRED');
  });

  it('retains the FinLit authority boundary before persistence', () => {
    expect(captureSource).toContain('assertFinlitAuthorityBoundary(event)');
  });

  it('does not contain academic completion or clearance automation', () => {
    expect(captureSource).not.toContain('officialPass: true');
    expect(captureSource).not.toContain('officialCompletion: true');
    expect(captureSource).not.toContain('certificateEligible: true');
    expect(captureSource).not.toContain('regulatoryReady: true');
  });
});
