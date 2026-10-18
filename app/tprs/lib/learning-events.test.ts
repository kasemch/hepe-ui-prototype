import { describe, expect, it } from 'vitest';
import { assertFinlitAuthorityBoundary, toXapiReadyStatement, type LearningEvent } from './learning-events';
import { evaluateReadiness } from './domain';

const baseEvent: LearningEvent = {
  eventId: '00000000-0000-4000-8000-000000000001',
  eventType: 'eplc.hours_recorded',
  actorType: 'learner',
  actorRef: 'SYN-001',
  objectType: 'eplc_stage',
  objectRef: 'YEAR-1',
  occurredAt: '2026-10-18T00:00:00.000Z',
  recordedAt: '2026-10-18T00:00:01.000Z',
  source: 'hepe-tprs-test',
  schemaVersion: 1,
  payload: { hours: 3 },
};

describe('HEPE-TPRS learning events', () => {
  it('maps a native event to an xAPI-ready statement without external transmission', () => {
    const statement = toXapiReadyStatement(baseEvent);
    expect(statement.actor.account.name).toBe('SYN-001');
    expect(statement.object.id).toContain('eplc_stage');
    expect(statement.timestamp).toBe(baseEvent.occurredAt);
  });

  it('rejects authoritative FinLit completion semantics in event payloads', () => {
    const event: LearningEvent = {
      ...baseEvent,
      eventType: 'finlit.activity_completed_synthetic',
      objectType: 'finlit_activity',
      objectRef: 'SIM-BUDGET-01',
      payload: { officialCompletion: true },
    };
    expect(() => assertFinlitAuthorityBoundary(event)).toThrow('FINLIT_AUTHORITY_BOUNDARY_VIOLATION');
  });

  it('permits synthetic FinLit learning activity metadata', () => {
    const event: LearningEvent = {
      ...baseEvent,
      eventType: 'finlit.activity_completed_synthetic',
      objectType: 'finlit_activity',
      objectRef: 'SIM-BUDGET-01',
      payload: { scenario: 'monthly-budget', synthetic: true, reflectionSubmitted: true },
    };
    expect(() => assertFinlitAuthorityBoundary(event)).not.toThrow();
  });

  it('preserves E-PLC 3+5+5+11 and human-clearance separation', () => {
    const result = evaluateReadiness({
      id: 'SYN-001',
      displayName: 'Synthetic Learner',
      entryCohort: 'SYN',
      curriculumVersion: 'TEST',
      registrationStatus: 'REGISTERED',
      academicProgression: 'TEST',
      eplcHours: [3, 5, 5, 11],
      plcCycles: [true, true, true],
      financialLiteracy: 'VERIFIED',
      evidence: 'VERIFIED',
      humanClearance: false,
    });
    expect(result.status).toBe('READY');
    expect(result.clearanceStatus).toBe('PENDING');
  });

  it('keeps unverified FinLit requirements in REVIEW rather than fabricating completion', () => {
    const result = evaluateReadiness({
      id: 'SYN-FINLIT',
      displayName: 'Synthetic Learner',
      entryCohort: 'SYN',
      curriculumVersion: 'TEST',
      registrationStatus: 'REGISTERED',
      academicProgression: 'TEST',
      eplcHours: [3, 5, 5, 11],
      plcCycles: [true, true, true],
      financialLiteracy: 'UNVERIFIED_REQUIREMENT',
      evidence: 'VERIFIED',
      humanClearance: false,
    });
    expect(result.status).toBe('REVIEW');
    expect(result.reasons).toContain('FINLIT_REQUIREMENT_UNVERIFIED');
  });
});
