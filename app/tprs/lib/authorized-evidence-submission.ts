import 'server-only';
import { readTprsSessionIdentity } from './session-identity';
import {
  authorizeEvidenceSubmission,
  type EvidenceSubmissionBoundary,
  type EvidenceSubmissionInput,
} from './evidence-submission-boundary';
import {
  persistEvidenceSubmission,
  type PersistEvidenceResult,
} from './evidence-persistence';

export type AuthorizedEvidenceSubmissionResult =
  | { ok: false; reason: Extract<EvidenceSubmissionBoundary, { allowed: false }>['reason'] }
  | { ok: true; persistence: PersistEvidenceResult };

/**
 * Server-only composition boundary for participant evidence submission.
 * Identity is derived from the authenticated server session; callers never
 * provide learnerId, actorUserId, verification, completion, or clearance state.
 */
export async function submitAuthorizedEvidence(
  input: EvidenceSubmissionInput,
): Promise<AuthorizedEvidenceSubmissionResult> {
  const identity = await readTprsSessionIdentity();
  const boundary = await authorizeEvidenceSubmission(identity?.authSubject, input);

  if (boundary.allowed === false) {
    return { ok: false, reason: boundary.reason };
  }

  const persistence = await persistEvidenceSubmission(boundary);
  return { ok: true, persistence };
}

// This service intentionally does not expose a public route or server action yet.
// Real participant invocation remains gated by real identity activation (HG-02).
// Submission remains distinct from verification, verified hours, completion,
// certification, and Human Academic Clearance.
