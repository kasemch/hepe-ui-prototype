export type ValidationGroup =
  | "COMPLETENESS"
  | "CONSISTENCY"
  | "MAPPING"
  | "ASSESSMENT"
  | "EVIDENCE";

export type ValidationSeverity = "INFO" | "WARNING" | "ERROR";
export type ValidationStatus = "PASS" | "FAIL" | "NOT_CHECKED";

export interface ValidationFinding {
  ruleId: string;
  group: ValidationGroup;
  severity: ValidationSeverity;
  status: ValidationStatus;
  objectType: string;
  objectId: string;
  message: string;
  source?: string;
  remediation?: string;
}

export interface ValidationSummary {
  ready: boolean;
  headline: string;
  blockers: number;
  findings: readonly ValidationFinding[];
}
