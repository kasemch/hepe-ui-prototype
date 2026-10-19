export type WorkflowState =
  | "DRAFT"
  | "IN_PROGRESS"
  | "READY_FOR_REVIEW"
  | "UNDER_REVIEW"
  | "NEEDS_REVISION"
  | "RESUBMITTED"
  | "APPROVED"
  | "ARCHIVED";

export type EvidenceState =
  | "UPLOADED"
  | "LINKED"
  | "REVIEWED"
  | "VERIFIED";

export type ActorRole =
  | "LECTURER"
  | "PROGRAMME_CHAIR"
  | "REVIEWER_QA"
  | "ADMIN"
  | "EXECUTIVE_READ_ONLY";

export interface AuthorityContext {
  actorId: string;
  roles: ActorRole[];
  programmeIds: string[];
  courseOfferingIds: string[];
}

export interface VersionToken {
  rowVersion: number;
  updatedAt: string;
}

export interface TransitionRequest {
  objectType: "TQF_DOCUMENT" | "EVIDENCE" | "REVIEW_REQUEST";
  objectId: string;
  from: string;
  to: string;
  reason?: string;
  idempotencyKey: string;
  expectedVersion: number;
}

export interface AuditEvent {
  id: string;
  actorId: string;
  actorRole: ActorRole;
  action: string;
  objectType: string;
  objectId: string;
  beforeState?: unknown;
  afterState?: unknown;
  reason?: string;
  source: "UI" | "SERVICE" | "MIGRATION";
  correlationId: string;
  requestId: string;
  createdAt: string;
}

export interface ExportManifestItem {
  name: string;
  kind: "DOCUMENT" | "EVIDENCE_INDEX" | "MAPPING" | "VALIDATION" | "REVIEW" | "APPROVAL";
  checksum?: string;
  status: "PREVIEW" | "BLOCKED" | "READY";
}

export interface ControlledExportManifest {
  id: string;
  objectId: string;
  official: false;
  label: "NON-PRODUCTION";
  items: ExportManifestItem[];
  createdAt: string;
}
