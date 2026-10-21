import 'server-only';
import { authorizeLearnerSelf } from './authorization';

export const ALLOWED_EVIDENCE_TYPES = ['DOCUMENT', 'IMAGE', 'VIDEO', 'LINK', 'REFLECTION'] as const;
export type AllowedEvidenceType = (typeof ALLOWED_EVIDENCE_TYPES)[number];

export type EvidenceSubmissionInput = {
  activityReference: string;
  requirementReference: string;
  evidenceType: string;
  artifactReference: string;
  idempotencyKey: string;
};

export type EvidenceSubmissionBoundary =
  | { allowed: false; reason: 'UNAUTHENTICATED' | 'IDENTITY_UNBOUND' | 'ACCOUNT_INACTIVE' | 'OUT_OF_SCOPE' | 'RUNTIME_NOT_CONFIGURED' | 'INVALID_INPUT' }
  | { allowed: true; actorUserId: string; learnerId: string; normalized: EvidenceSubmissionInput & { evidenceType: AllowedEvidenceType } };

const SAFE_REFERENCE = /^[A-Za-z0-9][A-Za-z0-9._:/-]{0,199}$/;
const IDEMPOTENCY_KEY = /^[A-Za-z0-9][A-Za-z0-9._:-]{15,127}$/;

function normalize(value: string): string {
  return value.trim();
}

export function validateEvidenceSubmissionInput(input: EvidenceSubmissionInput):
  | { valid: false }
  | { valid: true; value: EvidenceSubmissionInput & { evidenceType: AllowedEvidenceType } } {
  const activityReference = normalize(input.activityReference);
  const requirementReference = normalize(input.requirementReference);
  const evidenceType = normalize(input.evidenceType).toUpperCase();
  const artifactReference = normalize(input.artifactReference);
  const idempotencyKey = normalize(input.idempotencyKey);

  if (!SAFE_REFERENCE.test(activityReference)) return { valid: false };
  if (!SAFE_REFERENCE.test(requirementReference)) return { valid: false };
  if (!SAFE_REFERENCE.test(artifactReference)) return { valid: false };
  if (!IDEMPOTENCY_KEY.test(idempotencyKey)) return { valid: false };
  if (!ALLOWED_EVIDENCE_TYPES.includes(evidenceType as AllowedEvidenceType)) return { valid: false };

  return {
    valid: true,
    value: {
      activityReference,
      requirementReference,
      evidenceType: evidenceType as AllowedEvidenceType,
      artifactReference,
      idempotencyKey,
    },
  };
}

export async function authorizeEvidenceSubmission(
  authSubject: string | null | undefined,
  input: EvidenceSubmissionInput
): Promise<EvidenceSubmissionBoundary> {
  const authority = await authorizeLearnerSelf(authSubject);
  if (authority.allowed === false) return authority;
  if (!authority.learnerId) return { allowed: false, reason: 'OUT_OF_SCOPE' };

  const validated = validateEvidenceSubmissionInput(input);
  if (validated.valid === false) return { allowed: false, reason: 'INVALID_INPUT' };

  return {
    allowed: true,
    actorUserId: authority.actor.userId,
    learnerId: authority.learnerId,
    normalized: validated.value,
  };
}

// This module intentionally performs no database write. Persistence is introduced only
// after the authorization, idempotency, provenance, and versioning contracts are validated.
// Submission must never imply verification, verified hours, completion, or academic clearance.
