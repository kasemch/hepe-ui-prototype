# HEPE-ACADEMIC-WORKFLOW-03 — Master Functional, Authority, UX & Lifecycle Architecture

Status: APPROVED DESIGN DIRECTION / NON-PRODUCTION IMPLEMENTATION BASELINE CANDIDATE
Date: 2026-09-12
Environment: NON-PRODUCTION ONLY
Audit Evidence Status: NOT ADMITTED

## 1. Purpose
Consolidate HEPE requirements for course assignment, role-aware visibility, TQF3/TQF5/verification lifecycle, weekly teaching planning, assessment design, document output, calendar/deadline management, escalation, curriculum improvement, and adaptive dashboards before further schema/IAM/RLS changes.

## 2. Non-production boundary
This architecture does not authorize Production deployment, canonical curriculum activation/publication, permanent IAM/RLS expansion, real-user provisioning, email/SMTP changes, secret changes, destructive migration, or Audit Evidence admission.

## 3. Core domain chain
Academic Term → Course Offering → Instructor Assignment → TQF3 → Weekly Teaching Plan → Assessment/Evidence → TQF5 → Verification → Course Improvement → Programme Improvement → Curriculum Improvement Hub → Human Decision → Curriculum Revision.

## 4. Course offering and assignment
- Academic work binds to Course Offering, not only Course Master.
- A course may have different instructors by term.
- One temporary Course Assignment Authority holder during pilot; future holder determined by department.
- Instructor sees content only for assigned offerings.
- Other instructors may see completion/status metadata only, never other-course TQF content.
- Programme Chair sees all course content within own programme scope.
- Department Head sees all programme/course content within department scope.
- Pilot Super User may support NON-PRODUCTION pilot under elevated-access banner and audit trail; super-user status is not academic approval authority by default.

## 5. Role-aware visibility model
Instructor: status visibility across permitted programme context; content visibility/edit only own assigned offerings.
Programme Chair: full read within own programme; action/oversight according to workflow; accountable owner for curriculum-improvement actions.
Department Head: read oversight across department programmes; escalation and follow-up; no automatic edit of instructor academic content.
Course Assignment Manager: assignment authority only.
Reviewer: review-queue scoped visibility/action.
Pilot Super User: temporary non-production support scope; no automatic academic approval authority.

## 6. TQF3 workspace
TQF3 shall support:
- governed course context and course description when available;
- multiple editable CLOs with human confirmation;
- flexible weekly plan, add/remove/reorder/duplicate weeks; no fixed 15-week hard-code;
- each week links LLO → CLO → PLO context → Active Learning → Assessment Activity → Rubric → Evidence;
- AI teaching-plan advisory with rationale, alignment gap detection and Accept/Edit/Reject/Defer;
- assessment-weight proposal and rebalancing; user may add/remove/edit components; validation total=100%;
- assessment blueprint/test method;
- recommended books/resources with provenance status;
- appendix support for sample exam items, marking scheme, rubrics and blueprints;
- completeness/quality pre-submission gate separating ERROR/WARNING/ADVISORY.

## 7. TQF lifecycle
For a course offering:
NOT_STARTED → DRAFT → REVIEW_READY → REVIEW → READY/APPROVED_AS_DEFINED → TEACHING → TQF5_INITIAL → VERIFICATION → CLOSED.
Courses not offered may hold TQF3 as PREPARED_NOT_OFFERED and must not inflate term-offering completion denominator.
A course offering without an eligible TQF3 cannot be treated as having completed TQF5/verification workflow.

## 8. TQF5 and examination-result lifecycle
System must preserve regular-exam and makeup-exam results as separate events; no silent overwrite.
Use distinct Teaching Term, Examination Cycle and Reporting Period.
Term 1 may consolidate makeup results within the academic-year reporting period where applicable.
Term 2/Summer may require a QA Reporting Snapshot before the later makeup cycle and a later Consolidated Academic Result snapshot after makeup results.
Terms such as FINAL/PRELIMINARY are implementation candidates until controlled institutional guidance is verified; safe internal states include INITIAL_RESULT, QA_REPORTING_SNAPSHOT, WAITING_FOR_MAKEUP_RESULT, CONSOLIDATED_RESULT.

## 9. Grade Evidence Intake
Instructor may upload/photo-capture grade submission evidence (image/PDF/file candidate) for assisted extraction.
OCR/AI output is always a candidate requiring human verification before use.
Preserve source file provenance, extraction result, corrections and verified result separately.

## 10. Verification registry
Different courses may use different verification methods. Maintain a normalized Verification Method Registry so programme/department reporting can aggregate heterogeneous methods without forcing one method.

## 11. Completion analytics
Per term, calculate separately:
- offered courses denominator;
- TQF3 started/completed/on-time/overdue;
- TQF5 initial/reporting snapshot completed;
- consolidated TQF5 completed where applicable;
- verification completed;
- out-of-authority courses separated from deficiency states.
Status/timeliness and academic quality/completeness are distinct dimensions.

## 12. Compliance & escalation
Calendar deadline → reminders → Instructor action → Programme Chair follow-up → Department Head escalation → resolution → trend analysis.
Support levels include DUE_SOON, OVERDUE_L1, OVERDUE_L2, OVERDUE_L3, RESOLVED.
Actions may include remind, request reason, revised deadline, support request, escalation and resolution note.
Late submission is not itself an academic-quality deficiency.

## 13. Calendar engine
Three layers:
1. University Academic Calendar
2. Department/Programme Calendar
3. My Academic Tasks
Academic dates must be source/version aware and not hard-coded permanently.
Dashboard may derive Upcoming, Due Soon, Overdue, Blocked.

## 14. Document Output & Print Center
TQF3, TQF5, verification and summary reports require Preview / Print / Export PDF / Export Word architecture.
Support full document, summary and appendix outputs.
Each output carries document ID, version, term, course, owner, generated date and status.
Document export does not automatically admit the document to Audit Evidence.

## 15. Curriculum Improvement Hub
Separate categories such as programme structure, PLO, CLO/alignment, content, teaching, assessment, verification, learners, resources/personnel, stakeholder feedback and policy/other.
Improvement item structure: ID, issue, source/provenance, recommendation, practice/action plan, accountable owner, priority, due date, status, implementation result/evidence.
AI Recommendation ≠ Finding ≠ Approved Action.
Programme Chair is accountable owner for implementation within programme.
Department Head monitors cross-programme implementation and overdue/recurring items.
Programme instructors may see improvement recommendations and permitted progress but do not automatically change disposition/ownership.
Support Next Curriculum Revision Backlog, carry-forward, recurring-issue detection, impact traceability and curriculum-revision readiness.

## 16. Adaptive Academic Command Center
Use all approved dashboard concepts as a component pattern library; choose visualization by information type and role.
Common layers:
- My Work / Action cards
- My Courses
- TQF3/TQF5/Verification progress
- Academic Calendar
- Upcoming deadlines
- Course timeline
- Alerts/escalations
- Programme health when authorized
- Department portfolio when authorized
- Curriculum Improvement Hub when authorized
- Document/print actions
- Support/System Health for pilot super user

One information → one best visualization:
- progress → progress bar/donut;
- deadlines → calendar/timeline;
- overdue → action queue;
- alignment → matrix/traceability diagram;
- longitudinal trends → chart;
- document details → structured form;
- course history → timeline.

## 17. AI advisory principles
AI is embedded contextually, not a separate authority screen.
AI may recommend CLOs, LLOs, weekly activities, assessment weights, rubric criteria, exam blueprints, marking schemes, resources, alignment gaps and recurring issues.
AI cannot approve, activate, publish, grant authority, admit Audit Evidence, or silently modify controlled baseline.
Every recommendation must be explainable and human-dispositioned.

## 18. Priority build sequence
A. Adaptive dashboard shell + role-specific component architecture
B. Course Offering / Assignment logical contract
C. Flexible TQF3 weekly-plan + assessment/rubric prototype
D. Calendar/deadline/timeline prototype
E. TQF lifecycle and TQF5 result-state prototype
F. Verification registry/aggregation prototype
G. Curriculum Improvement Hub prototype
H. Document print/export architecture
I. Authority/IAM/RLS schema proposal and formal gate
J. Controlled implementation + regression only after explicit schema/authority authorization

## 19. Required quality gates
- TypeScript/build/static governance checks
- No-fabrication assertions
- role/visibility negative tests once backend authority exists
- responsive acceptance desktop/tablet/mobile
- scoped automated accessibility checks; no claim of full WCAG conformance without separate audit
- exact-SHA preview verification
- mandatory cleanup for temporary pilot authority/test state

## 20. Evidence classification
This document records the approved design direction from the current gate. It is a controlled repository design record candidate but is NOT admitted to the Audit Evidence Set until provenance/authority/version/verification are formally registered under the HEPE Audit Evidence Admission Rule.
