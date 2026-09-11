export type SourceFormat = 'PDF' | 'DOCX' | 'XLSX';

export type VerificationStatus =
  | 'EXTRACTED'
  | 'VALIDATED'
  | 'NEEDS_REVIEW'
  | 'CONFLICT'
  | 'VERIFIED'
  | 'REJECTED';

export type Confidence = 'HIGH' | 'MEDIUM' | 'LOW';

export type EntityType =
  | 'PROGRAMME'
  | 'CURRICULUM_VERSION'
  | 'PLO'
  | 'COURSE'
  | 'PLO_COURSE'
  | 'IRM'
  | 'STUDY_PLAN_ITEM';

export interface SourceRef {
  sourceDocumentId: string;
  pageNumber?: number;
  sectionHeading?: string;
  tableReference?: string;
  rowReference?: string;
  columnReference?: string;
  sheetName?: string;
  cellRange?: string;
  paragraphReference?: string;
}

export interface CandidateRecord {
  candidateId: string;
  ingestionBatchId: string;
  entityType: EntityType;
  businessKey: string;
  fields: Record<string, unknown>;
  rawFields?: Record<string, unknown>;
  sourceRef: SourceRef;
  sourceFormat: SourceFormat;
  confidence: Record<string, Confidence>;
  verificationStatus: VerificationStatus;
}

export type ValidationResultCode = 'PASS' | 'WARNING' | 'FAIL' | 'NOT_APPLICABLE' | 'UNVERIFIED';

export interface ValidationResult {
  ruleId: string;
  candidateId: string;
  fieldName?: string;
  expectedCondition: string;
  actualValue?: unknown;
  severity: 'CRITICAL' | 'MAJOR' | 'MINOR' | 'INFORMATIONAL';
  result: ValidationResultCode;
  message: string;
}

export type ConflictType =
  | 'DUPLICATE'
  | 'FORMAT_DIFFERENCE'
  | 'CONTENT_DIFFERENCE'
  | 'VERSION_CONFLICT'
  | 'SOURCE_CONFLICT'
  | 'AUTHORITY_CONFLICT'
  | 'RELATIONSHIP_CONFLICT'
  | 'MISSING_CANONICAL_TARGET';

export interface ConflictResult {
  conflictId: string;
  type: ConflictType;
  candidateId: string;
  severity: 'CRITICAL' | 'MAJOR' | 'MINOR';
  details: string;
  requiresHumanReview: boolean;
}

export interface ParserBatchResult {
  ingestionBatchId: string;
  sourceDocumentId: string;
  sourceFormat: SourceFormat;
  candidates: CandidateRecord[];
  validations: ValidationResult[];
  conflicts: ConflictResult[];
  canonicalWriteAttempted: false;
}
