import 'server-only';
import { randomUUID } from 'node:crypto';
import { appendLearningEvent, type AppendLearningEventResult } from './learning-event-persistence';
import {
  LEARNING_EVENT_TYPES,
  assertFinlitAuthorityBoundary,
  type LearningEvent,
  type LearningEventActorType,
  type LearningEventObjectType,
  type LearningEventType,
} from './learning-events';

export type CaptureLearningEventInput = {
  eventType: LearningEventType;
  actorType: LearningEventActorType;
  actorRef: string;
  objectType: LearningEventObjectType;
  objectRef: string;
  occurredAt?: string;
  source: string;
  payload?: Readonly<Record<string, unknown>>;
  context?: Readonly<Record<string, unknown>>;
  result?: Readonly<Record<string, unknown>>;
  correlationId?: string;
  causationId?: string;
  idempotencyKey: string;
  synthetic: boolean;
};

const EVENT_TYPES = new Set<string>(LEARNING_EVENT_TYPES);
const ACTOR_TYPES = new Set<LearningEventActorType>(['learner', 'verifier', 'system']);
const OBJECT_TYPES = new Set<LearningEventObjectType>([
  'eplc_stage',
  'plc_cycle',
  'evidence',
  'verification',
  'finlit_activity',
  'clearance',
]);

function required(value: string, error: string): string {
  const normalized = value.trim();
  if (!normalized) throw new Error(error);
  return normalized;
}

function validateInput(input: CaptureLearningEventInput): void {
  if (!EVENT_TYPES.has(input.eventType)) throw new Error('TPRS_EVENT_TYPE_INVALID');
  if (!ACTOR_TYPES.has(input.actorType)) throw new Error('TPRS_EVENT_ACTOR_TYPE_INVALID');
  if (!OBJECT_TYPES.has(input.objectType)) throw new Error('TPRS_EVENT_OBJECT_TYPE_INVALID');
  required(input.actorRef, 'TPRS_EVENT_ACTOR_REF_REQUIRED');
  required(input.objectRef, 'TPRS_EVENT_OBJECT_REF_REQUIRED');
  required(input.source, 'TPRS_EVENT_SOURCE_REQUIRED');
  required(input.idempotencyKey, 'TPRS_EVENT_IDEMPOTENCY_KEY_REQUIRED');
}

export async function captureLearningEvent(
  input: CaptureLearningEventInput,
): Promise<AppendLearningEventResult> {
  validateInput(input);
  const now = new Date().toISOString();
  const event: LearningEvent = {
    eventId: randomUUID(),
    eventType: input.eventType,
    actorType: input.actorType,
    actorRef: input.actorRef.trim(),
    objectType: input.objectType,
    objectRef: input.objectRef.trim(),
    occurredAt: input.occurredAt ?? now,
    recordedAt: now,
    source: input.source.trim(),
    schemaVersion: 1,
    payload: input.payload ?? {},
    context: input.context,
    result: input.result,
    correlationId: input.correlationId,
    causationId: input.causationId,
  };

  assertFinlitAuthorityBoundary(event);
  return appendLearningEvent(event, input.idempotencyKey.trim(), { synthetic: input.synthetic });
}
