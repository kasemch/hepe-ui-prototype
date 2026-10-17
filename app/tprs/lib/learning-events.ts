export const LEARNING_EVENT_TYPES = [
  'eplc.hours_recorded',
  'eplc.stage_minimum_reached',
  'plc.cycle_started',
  'plc.evidence_submitted',
  'plc.cycle_reviewed',
  'evidence.created',
  'evidence.version_created',
  'evidence.verification_requested',
  'evidence.verified',
  'evidence.rejected',
  'evidence.conflict_detected',
  'finlit.activity_started',
  'finlit.activity_completed_synthetic',
  'finlit.requirement_unverified',
  'clearance.requested',
  'clearance.decision_recorded',
] as const;

export type LearningEventType = (typeof LEARNING_EVENT_TYPES)[number];
export type LearningEventActorType = 'learner' | 'verifier' | 'system';
export type LearningEventObjectType =
  | 'eplc_stage'
  | 'plc_cycle'
  | 'evidence'
  | 'verification'
  | 'finlit_activity'
  | 'clearance';

export type LearningEvent = {
  eventId: string;
  eventType: LearningEventType;
  actorType: LearningEventActorType;
  actorRef: string;
  objectType: LearningEventObjectType;
  objectRef: string;
  occurredAt: string;
  recordedAt: string;
  source: string;
  schemaVersion: 1;
  payload: Readonly<Record<string, unknown>>;
  context?: Readonly<Record<string, unknown>>;
  result?: Readonly<Record<string, unknown>>;
  correlationId?: string;
  causationId?: string;
};

export type XapiReadyStatement = {
  actor: { account: { homePage: string; name: string } };
  verb: { id: string; display: { 'en-US': string } };
  object: { id: string; objectType: 'Activity' };
  context?: Readonly<Record<string, unknown>>;
  result?: Readonly<Record<string, unknown>>;
  timestamp: string;
};

const VERB_IDS: Record<LearningEventType, string> = {
  'eplc.hours_recorded': 'https://w3id.org/xapi/dod-isd/verbs/experienced',
  'eplc.stage_minimum_reached': 'http://adlnet.gov/expapi/verbs/completed',
  'plc.cycle_started': 'http://adlnet.gov/expapi/verbs/initialized',
  'plc.evidence_submitted': 'http://activitystrea.ms/schema/1.0/submit',
  'plc.cycle_reviewed': 'http://id.tincanapi.com/verb/reviewed',
  'evidence.created': 'http://activitystrea.ms/schema/1.0/create',
  'evidence.version_created': 'http://activitystrea.ms/schema/1.0/update',
  'evidence.verification_requested': 'http://activitystrea.ms/schema/1.0/request',
  'evidence.verified': 'http://id.tincanapi.com/verb/approved',
  'evidence.rejected': 'http://id.tincanapi.com/verb/rejected',
  'evidence.conflict_detected': 'https://hepe.local/xapi/verbs/conflict-detected',
  'finlit.activity_started': 'http://adlnet.gov/expapi/verbs/initialized',
  'finlit.activity_completed_synthetic': 'http://adlnet.gov/expapi/verbs/completed',
  'finlit.requirement_unverified': 'https://hepe.local/xapi/verbs/requirement-unverified',
  'clearance.requested': 'http://activitystrea.ms/schema/1.0/request',
  'clearance.decision_recorded': 'https://hepe.local/xapi/verbs/decision-recorded',
};

export function toXapiReadyStatement(event: LearningEvent): XapiReadyStatement {
  return {
    actor: {
      account: {
        homePage: 'https://hepe.local/tprs',
        name: event.actorRef,
      },
    },
    verb: {
      id: VERB_IDS[event.eventType],
      display: { 'en-US': event.eventType },
    },
    object: {
      id: `https://hepe.local/tprs/${event.objectType}/${encodeURIComponent(event.objectRef)}`,
      objectType: 'Activity',
    },
    context: event.context,
    result: event.result,
    timestamp: event.occurredAt,
  };
}

export function assertFinlitAuthorityBoundary(event: LearningEvent): void {
  if (!event.eventType.startsWith('finlit.')) return;
  const forbidden = ['officialPass', 'officialCompletion', 'certificateEligible', 'regulatoryReady'];
  for (const key of forbidden) {
    if (Object.prototype.hasOwnProperty.call(event.payload, key)) {
      throw new Error(`FINLIT_AUTHORITY_BOUNDARY_VIOLATION:${key}`);
    }
  }
}
