export type ExportArtifactKind =
  | "DOCUMENT"
  | "EVIDENCE_INDEX"
  | "MAPPING_SUMMARY"
  | "VALIDATION_REPORT"
  | "REVIEW_RECORD"
  | "APPROVAL_RECORD";

export type ExportArtifactStatus =
  | "PREVIEW"
  | "BLOCKED"
  | "READY_FOR_PREVIEW"
  | "OFFICIAL_LOCKED";

export interface ExportArtifact {
  artifactId: string;
  name: string;
  kind: ExportArtifactKind;
  sourceObject: string;
  version: string;
  status: ExportArtifactStatus;
  checksum: string;
  generatedAt: string;
  provenance: string;
  official: false;
}

export interface ControlledExportManifest {
  manifestId: string;
  objectId: string;
  versionId: string;
  validationState: "PASS" | "BLOCKED";
  reviewState: "NOT_SUBMITTED" | "UNDER_REVIEW" | "NEEDS_REVISION" | "COMPLETE";
  approvalState: "MISSING" | "PRESENT";
  packageStatus: "BLOCKED" | "READY_FOR_PREVIEW" | "OFFICIAL_LOCKED";
  blockers: readonly string[];
  artifacts: readonly ExportArtifact[];
  packageHash: string;
  createdAt: string;
  official: false;
  labels: readonly ["NON-PRODUCTION", "UNOFFICIAL", "NOT FOR INSTITUTIONAL SUBMISSION"];
}
