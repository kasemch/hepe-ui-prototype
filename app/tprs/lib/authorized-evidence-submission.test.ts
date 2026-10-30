import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';

const source = readFileSync(
  new URL('./authorized-evidence-submission.ts', import.meta.url),
  'utf8',
);

describe('authorized evidence submission contract', () => {
  it('derives identity server-side and composes authorization before persistence', () => {
    expect(source).toContain("import 'server-only'");
    expect(source).toContain('readTprsSessionIdentity()');
    expect(source).toContain('authorizeEvidenceSubmission(identity?.authSubject, input)');
    expect(source).toContain('persistEvidenceSubmission(boundary)');
  });

  it('does not accept learner or actor identity from the caller', () => {
    expect(source).toContain('input: EvidenceSubmissionInput');
    expect(source).not.toContain('learnerId: string,');
    expect(source).not.toContain('actorUserId: string,');
  });

  it('keeps real invocation behind identity activation and academic authority boundaries', () => {
    expect(source).toContain('HG-02');
    expect(source).toContain('Human Academic Clearance');
    expect(source).not.toContain('verifiedHours:');
    expect(source).not.toContain('certificateEligible');
  });
});
