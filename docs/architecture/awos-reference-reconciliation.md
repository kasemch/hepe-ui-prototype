# HEPE Department Platform — AWOS Reference Architecture Reconciliation Addendum

Status: SANDBOX-12 Architecture Addendum  
Mode: NON-PRODUCTION / REUSE-FIRST / EVIDENCE-FIRST  
Source relationship: AWOS is a personal Academic Work Operating System and remains a separate system boundary.

## 1. Boundary Decision

AWOS remains the personal control plane for an individual academic user.

HEPE Department Platform remains the organisational operating platform for the Department of Physical Education.

They may interoperate, but authority, canonical organisational records, student records, official approvals, audit records, and departmental workflows must remain owned by HEPE.

### Permanent separation

- AWOS personal task/project state must not become departmental canonical truth.
- HEPE authority assignments must not be inferred from AWOS.
- HEPE student/course/approval data must not be copied into AWOS as a second canonical database.
- Public GitHub Pages remains a publication layer, not an internal canonical store.

## 2. AWOS Concepts Adopted as HEPE Patterns

The following AWOS ideas are adopted as reusable interaction/architecture patterns:

- Command Center
- Planner / Calendar aggregation
- Project/task work graph
- Research lifecycle
- Teaching workspace
- Curriculum & QA traceability
- Document Intelligence
- One Evidence → Many Uses
- Publication/profile output pipeline
- Analytics and reporting
- Universal Search
- Quick Capture
- Notification Engine
- Evidence-Grounded AI Assistant

They are adapted to department-level authority and scope.

## 3. Mapping to Existing HEPE 12-Module Architecture

| AWOS capability | HEPE owner module | Decision |
|---|---|---|
| Command Center | M01 Command Center | REUSE / EXTEND |
| Today / Planner | M11 Department Operations | ADAPT as department calendar/deadline view |
| Projects / Tasks | M11 Department Operations | ADD controlled work items |
| Calendar | M11 Department Operations | REUSE academic_calendar_events + integration |
| Research Command | M08 Research & Academic Work | ADD lifecycle workspace |
| Teaching Hub | M04 Course & Teaching + M05 LMS | REUSE / EXTEND |
| Curriculum & QA | M03 Curriculum + M09 QA | REUSE |
| Document Studio | M10 Evidence & Document Hub | REUSE document_records/document_versions |
| Evidence Hub | M10 Evidence & Document Hub | REUSE evidence core |
| Publications & Profile | M08 Research + M12 Analytics/Reporting | REUSE publication registry |
| Analytics & Reports | M12 Analytics & Reporting | EXTEND |
| Universal Search | Shared Service | ADD |
| Quick Capture | Shared Service | ADD |
| Notification Engine | Shared Service | ADD |
| Evidence-Grounded AI | Shared Service | ADD as Ask HEPE |

## 4. Departmental Subsystems Added from AWOS Reference

### 4.1 Meeting, Agenda & Resolution Tracking
Owner: M11 Department Operations

Required entities candidate:
- meetings
- meeting_agenda_items
- meeting_participants
- meeting_resolutions
- resolution_circulations
- resolution_votes
- resolution_action_items

Existing reusable primitives:
- programme_verification_resolutions
- audit_events
- command_requests
- document_records / document_versions
- academic_calendar_events

Rules:
- Digital voting never substitutes statutory signature requirements unless explicitly authorised.
- Resolution result must preserve quorum/rule basis and authority context.
- Action items may create controlled work items but do not grant authority.

### 4.2 Course Request Portal
Owner: M11 Department Operations + M03 Curriculum + M04 Course & Teaching

Request types:
- OPEN_NEW_OFFERING
- ADD_OFFERING
- CANCEL_OFFERING

Candidate lifecycle:
DRAFT → SUBMITTED → DEPARTMENT_REVIEW → MEETING/RESOLUTION → APPROVED/RETURNED/REJECTED → IMPLEMENTED

Metadata must be filled from canonical programme/course/course-offering data, not free text when a canonical ID exists.

### 4.3 Smart Task Delegation
Owner: M11 Department Operations

Candidate objects:
- work_items
- work_item_assignments
- work_item_events
- work_item_links

AI may polish informal instructions into official wording, but:
- original input must be retained,
- AI-generated wording is a draft,
- human confirmation is required before official circulation,
- assignment does not create governance authority.

### 4.4 Document Intelligence & Smart Dispatch
Owner: M10 Evidence & Document Hub

Reuse:
- document_records
- document_versions
- provenance fields
- command/audit infrastructure

Add only if needed:
- document_classifications
- document_routing_rules
- document_dispatches
- document_access_events

Authoritative file storage may remain Google Drive or other approved external storage; HEPE owns metadata, state, provenance and access policy.

### 4.5 Ask HEPE
Owner: Shared Service

Evidence-grounded assistant must:
- retrieve only authorised records,
- cite document/evidence sources,
- respect role/scope/privacy,
- never convert model output directly into official approval,
- log privileged retrieval/action requests where required.

## 5. Department Academic Work Graph

Person/Actor
→ Authority
→ Programme/Course/Teaching
→ Work Item / Request / Meeting
→ Document
→ Evidence
→ Outcome / Resolution / Publication
→ Report / Public Release

This extends, but does not replace, the existing HEPE canonical graph.

## 6. Shared Service Architecture

### Universal Search
Searchable domains:
- People
- Programmes
- Courses
- Teaching
- Students where authorised
- Documents
- Evidence
- Meetings
- Requests
- Work Items
- Research
- Publications

Search result visibility must be filtered server-side before result rendering.

### Quick Capture
Input example:
"เตรียมวาระทวนสอบข้อสอบ HED3505 ภายในศุกร์นี้"

Proposed extraction:
- object type: work item / agenda candidate
- due date
- course context
- suggested owner
- suggested priority

No automatic official submission.

### Notification Engine
Severity:
- CRITICAL
- WARNING
- NOTICE

Notifications derive from governed state and deadline rules.
Avoid notification floods by aggregation/deduplication.

### Ask HEPE
RAG/search must be permission-aware at retrieval time, not filtered only after generation.

## 7. Public/Private Boundary

Internal HEPE:
- drafts
- student data
- assessment/grades
- meeting drafts
- votes
- internal resolutions
- QA working evidence
- research working records
- restricted documents

Public layer:
- approved programme information
- approved course information
- approved publications/resources
- explicitly released public datasets

Flow:
Internal Record → Review → Approved for Publication → Public Dataset → GitHub Pages

No direct public access to canonical internal tables.

## 8. Existing Schema Reuse Findings

Already present and reusable:
- academic_calendar_events
- document_records
- document_versions
- command_requests
- audit_events
- programme_verification_resolutions
- hepe_publication_registry
- hepe_publication_audits
- evidence core
- curriculum/TQF core

Not currently found as generic canonical subsystems:
- meetings/agenda
- generic resolution circulation/voting
- departmental work items/tasks
- course request portal
- notification engine
- universal search index
- Ask HEPE retrieval contract

These are controlled additive candidates for SANDBOX-12/13; do not create parallel copies of existing canonical entities.

## 9. Implementation Order

1. Department Operations data model
2. Meeting/Resolution model
3. Course Request model
4. Work Item / Delegation model
5. Shared Notification model
6. Universal Search projection
7. Ask HEPE retrieval contract
8. UI integration
9. Security/RLS regression
10. Synthetic pilot acceptance

## 10. Stop Conditions

STOP if any design:
- makes AWOS the authority source for HEPE,
- duplicates Person/Programme/Course/Evidence masters,
- grants authority from task assignment or teaching assignment,
- exposes student/internal data through search/AI,
- publishes directly from internal canonical tables,
- introduces real data into current sandbox.

## 11. Decision

AWOS is accepted as a reference architecture and interoperability partner.

HEPE remains a separate organisational platform with its own canonical data, authority, audit and publication boundaries.

The approved direction is:

REUSE CONCEPTS → MAP TO HEPE MODULES → ADD ONLY MISSING SUBSYSTEMS → SECURITY FIRST → SYNTHETIC PILOT.
