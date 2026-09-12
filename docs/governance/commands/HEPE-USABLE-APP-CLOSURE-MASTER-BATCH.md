# HEPE USABLE-APP CLOSURE MASTER BATCH

PROJECT: HEPE Curriculum Governance & Development
MODE: NON-PRODUCTION ONLY / SYNTHETIC ONLY
EXECUTION: BATCH EXECUTION + EXCEPTION STOP
PRINCIPLES: EVIDENCE-FIRST / NO FABRICATION / FAIL-CLOSED / HUMAN AUTHORITY PRESERVED / CRITICAL-PATH FIRST / FEATURE FREEZE DURING CLOSURE

## 0. Authorization Boundary
Continue only within the current NON-PRODUCTION controlled-pilot development scope. This command does not authorize Production deployment, Production database writes, real institutional/student/staff data, email/SMTP, real-user provisioning, real authority grants, destructive schema changes, secret disclosure, or PR merge.

## 1. Current Usable-App Critical Path
My Academic Workspace → My Courses → Course Workspace → Quick Entry → Teaching / Assessment → Plan vs Actual → Evidence.

Use current exact branch state as the starting point. Do not substitute older previews for exact-head verification.

## 2. Closure Objective
Close a Minimum Usable Academic Workflow that allows an authenticated synthetic PREPARER persona to:
1. open My Academic Workspace;
2. see only RLS-visible courses;
3. enter Course Workspace;
4. create a synthetic teaching delivery through the approved pilot RPC;
5. create synthetic assessment evidence through the approved pilot RPC;
6. immediately observe resulting read-side changes in Teaching / Plan vs Actual / Evidence where applicable;
7. retain course context while navigating;
8. complete the flow on desktop and mobile layouts;
9. fail closed for NO_AUTHORITY;
10. clean all temporary test records and temporary auth identities.

## 3. Feature Freeze
Do not add large new modules until this closure gate is complete. Allowed changes are limited to usability, integration, RLS/security correctness, read-model propagation, synthetic test harnesses, responsive/accessibility fixes, error handling, and evidence capture required for the usable workflow.

## 4. Work-First UX Rules
- Instructor workflow first; governance remains behind the scenes.
- One Entry → Many Outputs.
- Don't Ask Twice: reuse known course, curriculum, CLO/PLO, term, and plan context when already available.
- Keep Quick Entry short enough for an after-class record.
- Preserve explicit missing-data states such as NO EVIDENCE rather than inferring completion.
- AI remains advisory only and cannot approve academic decisions.

## 5. Exact-Head Build & Preview Gate
For every code-changing commit:
- run the existing build regression;
- require dependency install PASS;
- require Next.js build/type validity PASS;
- require critical-path source assertions PASS;
- require NON-PRODUCTION boundary PASS;
- verify the Vercel Preview is READY for the exact commit SHA;
- never use an older READY preview as substitute evidence.

If any assertion fails, repair only the smallest pilot-critical issue and rerun before continuing.

## 6. Course Context Propagation
Ensure My Courses → Course Workspace preserves the selected curriculum_course_id. Extend this context into Quick Entry and downstream read views where safe, prefilling or filtering RLS-visible learning activities and assessments for the selected course. Do not create a privileged fallback if course-scoped rows are not visible.

Expected states:
- PREPARER assigned course: VERIFIED.
- NO_AUTHORITY: EMPTY or explicit authority denial as appropriate.
- unauthenticated: AUTH_REQUIRED.
- runtime unavailable: RUNTIME_NOT_CONFIGURED.
- query failure: QUERY_ERROR.

## 7. Authenticated Write-Through E2E
Use the existing synthetic persona pattern and existing masked secrets by name only. Do not reveal values.

PREPARER_A assertions:
- authenticated My Courses = VERIFIED;
- Course Workspace = VERIFIED;
- POST teaching delivery through /api/pilot-entry succeeds for a valid SYN-* course/activity;
- resulting delivery becomes visible in Teaching Record;
- Plan vs Actual changes only when supported by recorded delivery/evidence;
- assessment evidence write succeeds for valid RLS-visible assessment version;
- evidence/read model shows the created draft or linked record where the current model supports it.

NO_AUTHORITY assertions:
- My Courses = EMPTY or no visible rows;
- Course Workspace for known synthetic curriculum_course_id does not expose the course;
- direct POST teaching delivery denied;
- direct POST assessment evidence denied;
- no write residual remains.

Unauthenticated assertions:
- protected teacher pages report AUTH_REQUIRED;
- pilot-entry POST returns authentication failure;
- NON-PRODUCTION boundary remains visible.

## 8. Mandatory Cleanup
Every synthetic browser/write regression must execute cleanup even after failure:
- restore synthetic actor external identity subjects;
- delete temporary synthetic auth users;
- delete or transactionally rollback temporary delivery/evidence records created solely for the test;
- verify auth residual = 0;
- verify identity restore PASS;
- verify test-data residual = 0 where cleanup is expected.

Cleanup failure is an exception-stop condition.

## 9. Synthetic UAT — 7 Scenarios
Run and record:
1. PREPARER assigned course / My Courses / Course Workspace.
2. Teaching + assessment evidence context.
3. Plan vs Actual: positive recorded activity and explicit NO EVIDENCE case.
4. Reviewer alignment/evidence visibility without unauthorized write.
5. Programme status / teacher-to-governance navigation where supported.
6. QA gap → finding/improvement trace where existing data supports it.
7. NO_AUTHORITY negative-access case.

Each scenario record must include: Scenario ID, Persona, exact SHA, exact deployment, expected result, actual result, PASS/FAIL, evidence reference, usability note, permission note, defect priority if failed.

Conversation comments alone are not audit evidence.

## 10. Responsive & Accessibility Acceptance
Verify at minimum:
- desktop layout;
- tablet breakpoint;
- mobile ≤760 px;
- narrow mobile ≤420 px;
- navigation remains reachable;
- forms do not overflow horizontally;
- action buttons are operable by keyboard;
- visible focus state exists;
- labels remain associated with inputs;
- status changes are announced where aria-live is used;
- NON-PRODUCTION environment indicator remains visible.

Fix only pilot-critical accessibility/responsive defects before closure.

## 11. Evidence Closure
Create/update controlled evidence records only from verified system/test evidence. Minimum evidence chain:
Evidence ID → Evidence Type → Source → Version/Date → Authority/Owner → Relevant Contract/Assertion → Verification Status.

Do not admit casual conversation, draft text, AI summary, or inferred decisions as PASS evidence.

Required final closure assertions:
- BUILD=PASS
- EXACT_SHA_PREVIEW=READY
- AUTH_BOUNDARY=PASS
- RLS_PERSONA_NEGATIVE=PASS
- PREPARER_WRITE_PATH=PASS
- WRITE_TO_READ_PROPAGATION=PASS
- MY_COURSES=PASS
- COURSE_WORKSPACE=PASS
- PLAN_VS_ACTUAL_NO_FABRICATION=PASS
- RESPONSIVE=PASS
- ACCESSIBILITY_CRITICAL=PASS
- CLEANUP=PASS
- SECRET_SCAN=PASS
- NON_PRODUCTION_BOUNDARY=PASS
- NO_P0=true
- NO_P1=true

Only if all required assertions are supported by admissible evidence may the status be declared CONTROLLED PILOT READY. Otherwise declare HOLD with the exact blocker.

## 12. Exception Stop Conditions
Stop automatic continuation and report the exact blocker if any step requires:
- Production deployment or Production data write;
- real institutional/student/staff data;
- real user creation or real authority grant;
- email/SMTP;
- destructive schema change;
- security protection disablement;
- secret disclosure or logging;
- merge authorization not already explicit;
- a human academic decision that cannot be inferred.

## 13. Final Deliverable
The closure report must state only verified facts and include:
- exact final SHA;
- exact Preview deployment ID/URL status;
- build regression result;
- persona/RLS result;
- authenticated write/read propagation result;
- synthetic UAT summary;
- responsive/accessibility result;
- cleanup residual result;
- open defects/findings;
- final status: CONTROLLED PILOT READY or HOLD;
- Production Authorization: NOT GRANTED unless separately and explicitly authorized.
