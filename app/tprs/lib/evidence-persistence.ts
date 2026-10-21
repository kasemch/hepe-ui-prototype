import 'server-only';
import type { EvidenceSubmissionBoundary } from './evidence-submission-boundary';

export type PersistEvidenceResult =
  | { status: 'INSERTED'; evidenceId: string; versionNo: 1 }
  | { status: 'DUPLICATE'; evidenceId: string; versionNo: number };

/**
 * Persistence remains deliberately fail-closed until the database has a durable,
 * unique submission idempotency contract. The existing evidence tables provide
 * immutable version uniqueness, but do not persist a submission idempotency key.
 *
 * Do not replace this guard with a read-before-write check: concurrent retries
 * could create duplicate real academic evidence. A schema migration must establish
 * the durable idempotency boundary first.
 */
export async function persistEvidenceSubmission(
  _boundary: Extract<EvidenceSubmissionBoundary, { allowed: true }>,
): Promise<PersistEvidenceResult> {
  throw new Error('TPRS_EVIDENCE_IDEMPOTENCY_STORE_REQUIRED');
}
