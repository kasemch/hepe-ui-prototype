import { describe, expect, it } from 'vitest';
import { validateEvidenceSubmissionInput } from './evidence-submission-boundary';

const valid = {
  activityReference: 'EPLC-STAGE-1',
  requirementReference: 'REQ-EPLC-24H-V1',
  evidenceType: 'document',
  artifactReference: 'drive:file-123',
  idempotencyKey: 'submission:learner-001:0001',
};

describe('evidence submission boundary', () => {
  it('normalizes a valid submission without changing academic state', () => {
    const result = validateEvidenceSubmissionInput(valid);
    expect(result.valid).toBe(true);
    if (result.valid) {
      expect(result.value.evidenceType).toBe('DOCUMENT');
      expect(result.value.activityReference).toBe('EPLC-STAGE-1');
    }
  });

  it('rejects unsupported evidence types', () => {
    expect(validateEvidenceSubmissionInput({ ...valid, evidenceType: 'EXECUTABLE' }).valid).toBe(false);
  });

  it('rejects malformed or too-short idempotency keys', () => {
    expect(validateEvidenceSubmissionInput({ ...valid, idempotencyKey: 'short' }).valid).toBe(false);
  });

  it('rejects references containing whitespace or unsafe characters', () => {
    expect(validateEvidenceSubmissionInput({ ...valid, activityReference: 'EPLC STAGE 1' }).valid).toBe(false);
    expect(validateEvidenceSubmissionInput({ ...valid, artifactReference: '<script>' }).valid).toBe(false);
  });

  it('accepts only the bounded reference lengths', () => {
    expect(validateEvidenceSubmissionInput({ ...valid, requirementReference: `R${'x'.repeat(199)}` }).valid).toBe(true);
    expect(validateEvidenceSubmissionInput({ ...valid, requirementReference: `R${'x'.repeat(200)}` }).valid).toBe(false);
  });
});
