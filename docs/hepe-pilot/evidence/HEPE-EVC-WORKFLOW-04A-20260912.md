# HEPE Evidence Candidate — WORKFLOW-04A

Admission Status: **EVIDENCE CANDIDATE ONLY — NOT ADMITTED TO AUDIT EVIDENCE SET**

Evidence Candidate ID: HEPE-EVC-WORKFLOW-04A-20260912
Evidence Type Candidate: Verified System Evidence + Test / Regression Evidence
Environment: NON-PRODUCTION ONLY
Source: Supabase project `lztxpjsuzqvtgyasfnyj`; GitHub branch `feat/hepe-academic-workflow-03-exec`
Version/Date: 2026-09-12
Authority/Owner: Explicit user authorization `Approve` for gate `HEPE-WORKFLOW-04A` only
Relevant Contract: Academic Workflow Schema + Authority/RLS Foundation + Synthetic NAT
Verification Status: PASS WITH SCOPE LIMITATIONS — NOT ADMITTED

## Applied migration
Migration `hepe_workflow_04a_academic_workflow_foundation_v2` completed successfully.

## Synthetic NAT assertions executed
1. INSTRUCTOR_A own-offering TQF3 READ — PASS.
2. NO_AUTHORITY TQF3 READ DENY — PASS.
3. PROGRAMME_CHAIR own-programme TQF3 READ — PASS.
4. INSTRUCTOR_A own-offering TQF3 WRITE — PASS (transaction rolled back).
5. COURSE_ASSIGNMENT_MANAGER assignment WRITE — PASS (transaction rolled back).
6. NO_AUTHORITY TQF3 WRITE DENY — PASS.
7. Synthetic cleanup residual — PASS: actors=0; temporary authority assignments=0; synthetic offerings=0.

## Boundary verification
- New role definitions: COURSE_ASSIGNMENT_MANAGER, DEPARTMENT_HEAD, PILOT_SUPER_USER.
- No permanent role holder assignment remains.
- No real user created.
- No email/SMTP action.
- No secret mutation.
- No Production deployment.
- No canonical curriculum write/activation/publication.
- No Audit Evidence Admission.
- No PR merge.

## Scope limitations / next hardening
- Department-wide RLS remains unimplemented until a controlled programme→department binding is verified.
- Reviewer-specific workflow policies are not yet expanded beyond the existing review subsystem.
- TQF5/result snapshot/calendar/timeline/verification tables are created with RLS enabled but write semantics remain fail-closed until dedicated sub-gates define exact actor actions.
- Grade Evidence Intake with real/student-sensitive data is not enabled.
- Exact-SHA Vercel/browser acceptance for the post-04A repository head is not asserted by this evidence candidate.

Admission into the HEPE Audit Evidence Set requires a separate Evidence Admission action under the HEPE Audit Evidence Admission Rule.
