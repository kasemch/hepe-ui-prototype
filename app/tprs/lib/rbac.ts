export type Role='STUDENT'|'ADVISOR'|'EPLC_COORDINATOR'|'VERIFIER'|'PROGRAMME_COMMITTEE'|'PROGRAMME_CHAIR'|'SYSTEM_ADMIN';
export type Permission='READ_SELF'|'READ_COHORT'|'SUBMIT_EVIDENCE'|'VERIFY_EVIDENCE'|'REVIEW_CLEARANCE'|'MANAGE_REQUIREMENTS'|'READ_AUDIT';

export const rolePermissions: Readonly<Record<Role,readonly Permission[]>>={
 STUDENT:['READ_SELF','SUBMIT_EVIDENCE'],
 ADVISOR:['READ_COHORT'],
 EPLC_COORDINATOR:['READ_COHORT'],
 VERIFIER:['READ_COHORT','VERIFY_EVIDENCE'],
 PROGRAMME_COMMITTEE:['READ_COHORT','REVIEW_CLEARANCE','READ_AUDIT'],
 PROGRAMME_CHAIR:['READ_COHORT','REVIEW_CLEARANCE','MANAGE_REQUIREMENTS','READ_AUDIT'],
 SYSTEM_ADMIN:['READ_COHORT','MANAGE_REQUIREMENTS','READ_AUDIT']
};

export function can(role:Role|null|undefined,permission:Permission){
 if(!role) return false;
 return rolePermissions[role]?.includes(permission) ?? false;
}

export function requirePermission(role:Role|null|undefined,permission:Permission){
 if(!can(role,permission)) throw new Error('TPRS_ACCESS_DENIED');
}
