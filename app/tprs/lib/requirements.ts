export type RequirementAuthority = 'VERIFIED' | 'UNVERIFIED_REQUIREMENT';
export type RequirementVersion = {
  id: string;
  framework: 'EPLC' | 'FINANCIAL_LITERACY';
  version: string;
  applicableCurriculum: string;
  effectiveFrom: string;
  authority: RequirementAuthority;
  sourceNote: string;
};

export const requirementRegistry: RequirementVersion[] = [
  {
    id:'REQ-EPLC-24H-V1', framework:'EPLC', version:'1.0', applicableCurriculum:'BED-HEPE-2567', effectiveFrom:'2567', authority:'VERIFIED',
    sourceNote:'Controlled HEPE-TPRS baseline: four-stage E-PLC progression 3+5+5+11 hours; Cycle 1–3 required.'
  },
  {
    id:'REQ-FINLIT-PENDING', framework:'FINANCIAL_LITERACY', version:'pending-authority', applicableCurriculum:'BED-HEPE-2567', effectiveFrom:'2567', authority:'UNVERIFIED_REQUIREMENT',
    sourceNote:'Workflow exists; authoritative completion criteria intentionally not encoded pending controlled evidence.'
  }
];
