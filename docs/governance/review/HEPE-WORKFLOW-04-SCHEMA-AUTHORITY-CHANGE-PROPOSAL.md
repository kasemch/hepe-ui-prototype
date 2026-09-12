# HEPE-WORKFLOW-04 — Schema & Authority Change Proposal Package

Status: DESIGN PROPOSAL / SEPARATE-GATE CANDIDATE / NOT AUTHORIZED FOR EXECUTION
Date: 2026-09-12
Environment: NON-PRODUCTION ONLY
Audit Evidence Status: NOT ADMITTED

## Purpose
Prepare the minimum controlled package required before any schema migration or IAM/RLS semantic change for the academic workflow implemented in HEPE-ACADEMIC-WORKFLOW-03.

## Trigger boundary
This package exists because persistent Course Offering, Instructor Assignment, role-aware content visibility, TQF lifecycle, calendar/deadline state, grade-result snapshots, verification records, document version history and improvement tracking require backend state and authority semantics. Creating those objects is outside the currently authorized batch.

## Candidate domain entities
1. academic_terms — academic year/term identity and source/version metadata.
2. course_offerings — programme/curriculum/course/term offering identity and offered/not-offered state.
3. instructor_assignments — offering-to-user assignment with effective dates and assignment role.
4. assignment_authority_holders — temporary/single-holder assignment-management authority with transfer history.
5. tqf3_records + tqf3_versions — offering-scoped TQF3 lifecycle and immutable/versioned snapshots.
6. weekly_teaching_plan_items — ordered flexible weeks with LLO/CLO/activity/assessment/rubric/evidence references.
7. assessment_plan_items — weighted assessment components and blueprint metadata.
8. academic_calendar_events — university/programme/personal layers with provenance and deadline semantics.
9. course_timeline_events — append-only workflow milestones.
10. tqf5_records + result_snapshots — regular, QA reporting and consolidated result snapshots without overwrite.
11. grade_evidence_intakes — original attachment reference, extraction candidate, human correction and verification state kept separately.
12. verification_methods + verification_records — normalized method registry and offering-scoped verification workflow.
13. improvement_items + improvement_actions — issue/recommendation/action/result lifecycle with provenance and accountable owner.
14. document_records + document_versions — document identity/version/source/status metadata; export does not alter authority.

## Candidate role semantics
- INSTRUCTOR: read/edit academic content only for assigned course offerings; may see permitted completion/status metadata outside own offerings, not other instructors' academic document content.
- PROGRAMME_CHAIR: read programme-scoped course content; programme oversight and authorised human workflow actions; no cross-programme access.
- DEPARTMENT_HEAD: read department-wide programme/course content and escalation oversight; no automatic authorship of instructor academic content.
- COURSE_ASSIGNMENT_MANAGER: manage offering/instructor assignment only; does not automatically gain TQF academic-content authority.
- REVIEWER: read/action only within assigned review queue and scope.
- PILOT_SUPER_USER: NON-PRODUCTION support/troubleshooting only; elevated access must be explicit, traceable and not equivalent to academic approval authority.

## Fail-closed authority rules
- No authority is inferred from course prefix alone.
- RAM*/EDU* remain OUT_OF_AUTHORITY_SCOPE for HEPE curriculum-improvement advisory.
- Unknown authority scope must resolve to AUTHORITY_SCOPE_UNVERIFIED and deny advisory/action until a controlled authority source confirms scope.
- View permission does not imply edit, approve, publish, activate, admit evidence or assign authority.
- AI never satisfies a human authority predicate.

## Required RLS assertion matrix for next gate
A1 assigned instructor: own offering TQF3/TQF5 content READ/WRITE ALLOW.
A2 instructor: other instructor same-programme content READ/WRITE DENY; status metadata may be ALLOW through a separate safe read model.
A3 programme chair: own-programme academic content READ ALLOW; cross-programme DENY.
A4 department head: department-wide READ ALLOW; outside-department DENY.
A5 assignment manager: assignment CREATE/UPDATE within controlled scope ALLOW; academic-content edit DENY unless independently authorised.
A6 reviewer: assigned review READ/ACTION ALLOW; unassigned review DENY.
A7 no-authority identity: academic content and assignment reads/writes DENY except explicitly public/non-sensitive read models.
A8 pilot super user: support scope only, NON-PRODUCTION, audited; academic approval action DENY unless separate academic authority exists.
A9 all roles: canonical curriculum activation/publication/Audit Evidence Admission DENY through this gate.

## Migration design constraints
- Additive/reversible first; no destructive migration in initial gate.
- Preserve current controlled curriculum tables as source references; do not duplicate or rewrite curriculum baseline to implement workflow state.
- Use UUID primary keys and explicit programme/curriculum/course/offering foreign keys.
- Prefer append-only/version tables for academic records and result snapshots.
- Include created_at/created_by/source/provenance/status/effective/supersession fields where relevant.
- Separate metadata read models from sensitive academic content to enforce status-visible/content-private behaviour.
- Grade evidence/student-sensitive content requires separate privacy review before real data use.

## Rollback requirement
Every migration must have a documented rollback/disable path. Initial pilot rollback should disable new workflow policies/read models and remove synthetic fixture rows without mutating pre-existing controlled curriculum records.

## Synthetic NAT / regression plan
Use synthetic identities only. Minimum personas: INSTRUCTOR_A assigned own course, INSTRUCTOR_B same programme different course, PROGRAMME_CHAIR_A, PROGRAMME_CHAIR_B cross-programme, DEPARTMENT_HEAD, ASSIGNMENT_MANAGER, REVIEWER_ASSIGNED, REVIEWER_UNASSIGNED, PILOT_SUPER_USER, NO_AUTHORITY.

Test positive and negative assertions for assignment, TQF content visibility, status-only read models, programme/department boundaries, reviewer queue, timeline/calendar write scope, TQF5 result-snapshot immutability, improvement ownership, document-version access, and cleanup residual=0.

## Explicitly not authorised by this document
NO schema execution; NO database write; NO RLS/IAM semantic change; NO permanent authority grant; NO real-user provisioning; NO email/SMTP; NO secret changes; NO Production; NO PR merge; NO curriculum activation/publication; NO Audit Evidence Admission.

## Proposed next gate
HEPE-WORKFLOW-04A — NON-PRODUCTION Academic Workflow Schema, Authority/RLS Foundation & Synthetic NAT.

Execution of HEPE-WORKFLOW-04A requires explicit separate authorisation because it changes schema and authority semantics.
