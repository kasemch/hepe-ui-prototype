import { validateHED3505 } from "../validation/engine";
import { HED3505_TQF3_VERSIONS } from "../versioning/model";
import type { ControlledExportManifest, ExportArtifact } from "./model";

function checksum(input: string) {
  let hash = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return `fnv1a32:${(hash >>> 0).toString(16).padStart(8, "0")}`;
}

export function generateHED3505ControlledManifest(): ControlledExportManifest {
  const validation = validateHED3505();
  const version = HED3505_TQF3_VERSIONS[0];

  const getReviewState = (): ControlledExportManifest["reviewState"] => "NOT_SUBMITTED";
  const getApprovalState = (): ControlledExportManifest["approvalState"] => "MISSING";
  const reviewState = getReviewState();
  const approvalState = getApprovalState();

  const artifactBase = [
    ["hed3505-mko3", "HED3505_MKO3.preview.pdf", "DOCUMENT", version.snapshotHash, validation.ready ? "READY_FOR_PREVIEW" : "BLOCKED", "structured version model"],
    ["hed3505-evidence", "evidence-index.preview.json", "EVIDENCE_INDEX", `evidence:${validation.blockers}`, validation.blockers === 0 ? "READY_FOR_PREVIEW" : "BLOCKED", "validation + evidence read model"],
    ["hed3505-mapping", "mapping-summary.preview.csv", "MAPPING_SUMMARY", "mapping:candidate", "PREVIEW", "controlled mapping display state"],
    ["hed3505-validation", "validation-report.preview.json", "VALIDATION_REPORT", validation.headline, "READY_FOR_PREVIEW", "validation engine"],
    ["hed3505-review", "review-record.preview.json", "REVIEW_RECORD", reviewState, "BLOCKED", "review governance prototype"],
    ["hed3505-approval", "approval-record.preview.json", "APPROVAL_RECORD", approvalState, "BLOCKED", "human authority gate"],
  ] as const;

  const generatedAt = "NON-PRODUCTION-SYNTHETIC";
  const artifacts: ExportArtifact[] = artifactBase.map(([artifactId, name, kind, source, status, provenance]) => ({
    artifactId,
    name,
    kind,
    sourceObject: "HED3505-MKO3",
    version: version.versionNumber,
    status,
    checksum: checksum(`${artifactId}|${source}|${version.snapshotHash}`),
    generatedAt,
    provenance,
    official: false,
  }));

  const blockers = [
    ...validation.findings.filter(f => f.status === "FAIL").map(f => `${f.ruleId}: ${f.message}`),
    "REVIEW: ยังไม่มี review completion",
    "APPROVAL: ยังไม่มี authorized approval record",
  ];

  const packageStatus = validation.ready && reviewState === "COMPLETE" && approvalState === "PRESENT"
    ? "READY_FOR_PREVIEW"
    : "BLOCKED";

  return {
    manifestId: "manifest:HED3505-MKO3:v0.4:prototype",
    objectId: "HED3505-MKO3",
    versionId: version.id,
    validationState: validation.ready ? "PASS" : "BLOCKED",
    reviewState,
    approvalState,
    packageStatus,
    blockers,
    artifacts,
    packageHash: checksum(artifacts.map(a => a.checksum).join("|")),
    createdAt: generatedAt,
    official: false,
    labels: ["NON-PRODUCTION", "UNOFFICIAL", "NOT FOR INSTITUTIONAL SUBMISSION"],
  };
}
