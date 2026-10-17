import 'server-only';
import { neon } from '@neondatabase/serverless';
import { assertFinlitAuthorityBoundary, type LearningEvent } from './learning-events';

function databaseUrl(): string | null {
  return process.env.TPRS_DATABASE_URL || null;
}

export type AppendLearningEventResult =
  | { status: 'INSERTED'; eventId: string }
  | { status: 'DUPLICATE'; eventId: string };

export async function appendLearningEvent(
  event: LearningEvent,
  idempotencyKey: string,
): Promise<AppendLearningEventResult> {
  assertFinlitAuthorityBoundary(event);
  if (!idempotencyKey.trim()) throw new Error('TPRS_EVENT_IDEMPOTENCY_KEY_REQUIRED');
  const url = databaseUrl();
  if (!url) throw new Error('TPRS_DATABASE_NOT_CONFIGURED');
  const sql = neon(url);

  const rows = await sql`
    INSERT INTO tprs.learning_events (
      id,event_type,actor_type,actor_ref,object_type,object_ref,
      occurred_at,recorded_at,source,schema_version,payload,context,result,
      correlation_id,causation_id,idempotency_key,synthetic
    ) VALUES (
      ${event.eventId}::uuid,${event.eventType},${event.actorType},${event.actorRef},
      ${event.objectType},${event.objectRef},${event.occurredAt}::timestamptz,
      ${event.recordedAt}::timestamptz,${event.source},${event.schemaVersion},
      ${JSON.stringify(event.payload)}::jsonb,${event.context ? JSON.stringify(event.context) : null}::jsonb,
      ${event.result ? JSON.stringify(event.result) : null}::jsonb,
      ${event.correlationId ?? null}::uuid,${event.causationId ?? null}::uuid,
      ${idempotencyKey},true
    )
    ON CONFLICT (idempotency_key) DO NOTHING
    RETURNING id
  `;

  if (rows.length) return { status: 'INSERTED', eventId: String(rows[0].id) };

  const existing = await sql`
    SELECT id FROM tprs.learning_events WHERE idempotency_key=${idempotencyKey} LIMIT 1
  `;
  if (!existing.length) throw new Error('TPRS_EVENT_IDEMPOTENCY_RESOLUTION_FAILED');
  return { status: 'DUPLICATE', eventId: String(existing[0].id) };
}
