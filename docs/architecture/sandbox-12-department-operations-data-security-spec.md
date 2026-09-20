# HEPE SANDBOX-12 — Department Operations Data Model & Security Contract

Status: APPROVED DESIGN CANDIDATE  
Mode: NON-PRODUCTION / SYNTHETIC ONLY / ADDITIVE  
Authority source: existing HEPE authority_assignments + roles + private.hepe_current_actor_has_authority()

## 1. Scope

This specification covers the missing organisational primitives identified by the AWOS reference reconciliation:

1. Work Items / Delegation
2. Meetings / Agenda / Resolutions
3. Course Requests
4. Notifications

Universal Search, Quick Capture and Ask HEPE remain service/projection layers over governed records and do not receive independent canonical masters at this stage.

## 2. Reuse Before Add

Existing canonical entities reused directly:

- actors
- academic_people
- programmes
- courses
- course_offerings
- academic_terms
- authority_assignments
- roles
- governed_objects
- document_records / document_versions
- evidence_objects / evidence_versions / evidence_links
- academic_calendar_events
- command_requests
- audit_events
- programme_verification_resolutions

No duplicate Person, Programme, Course, Teaching Instance, Document, Evidence, Authority or Audit tables are permitted.

## 3. Entity Specifications

### 3.1 department_work_items

Purpose: controlled departmental work/task object.

Fields:
- work_item_id uuid PK
- programme_id uuid nullable FK programmes
- course_id uuid nullable FK courses
- source_resolution_id uuid nullable FK meeting_resolutions
- title text required
- description text nullable
- priority_code text: CRITICAL | HIGH | NORMAL | WAITING
- status_code text: DRAFT | OPEN | IN_PROGRESS | WAITING | COMPLETED | CANCELLED
- due_at timestamptz nullable
- created_by_actor_id uuid FK actors
- created_at / updated_at
- synthetic_only boolean default true

Invariant:
Work item never grants authority.

### 3.2 department_work_item_assignments

Purpose: assignment of work item to actor.

Fields:
- work_item_assignment_id uuid PK
- work_item_id uuid FK
- assignee_actor_id uuid FK actors
- assigned_by_actor_id uuid FK actors
- assignment_status: ACTIVE | COMPLETED | WITHDRAWN
- assigned_at
- completed_at nullable
- source_reference text
- synthetic_only boolean

Unique:
(work_item_id, assignee_actor_id) for active semantics.

### 3.3 department_meetings

Purpose: organisational meeting/circulation container.

Fields:
- meeting_id uuid PK
- programme_id uuid nullable FK
- meeting_code text unique
- meeting_type: DEPARTMENT | PROGRAMME | CIRCULATION
- title
- status_code: DRAFT | AGENDA_LOCKED | IN_MEETING | RESOLUTION_RECORDED | VERIFIED | CLOSED | CANCELLED
- starts_at / ends_at nullable
- calendar_event_id uuid nullable FK academic_calendar_events
- source_reference text
- created_by_actor_id
- synthetic_only
- timestamps

Scope:
programme_id null = department scope.
programme_id non-null = programme scope.

### 3.4 department_meeting_agenda_items

Fields:
- agenda_item_id uuid PK
- meeting_id uuid FK
- agenda_no text
- title
- agenda_type: INFORMATION | CONSIDERATION | APPROVAL | FOLLOW_UP
- related_document_id uuid nullable FK document_records
- related_course_id uuid nullable FK courses
- status_code: DRAFT | READY | CONSIDERED | WITHDRAWN
- created_by_actor_id
- timestamps

### 3.5 department_meeting_participants

Fields:
- meeting_participant_id uuid PK
- meeting_id uuid FK
- actor_id uuid FK
- participant_role: CHAIR | SECRETARY | MEMBER | INVITEE
- voting_eligible boolean
- attendance_status: INVITED | PRESENT | ABSENT | EXCUSED
- synthetic_only
- unique meeting + actor

Participant membership does not create HEPE authority.

### 3.6 department_meeting_resolutions

Purpose: generic meeting resolution, distinct from programme_verification_resolutions but able to reference/specialise it later.

Fields:
- meeting_resolution_id uuid PK
- meeting_id uuid FK
- agenda_item_id uuid nullable FK
- resolution_code text
- resolution_text text
- resolution_status: DRAFT | APPROVED | REJECTED | SUPERSEDED
- resolved_at nullable
- approved_by_actor_id nullable FK actors
- authority_assignment_id nullable FK authority_assignments
- source_references jsonb
- supersedes_resolution_id nullable self-FK
- synthetic_only
- timestamps

Approval requires explicit authority assignment; participant/vote alone is insufficient.

### 3.7 department_resolution_votes

Fields:
- resolution_vote_id uuid PK
- meeting_resolution_id uuid FK
- actor_id uuid FK
- vote_value: APPROVE | DISAPPROVE | ABSTAIN
- voted_at
- acknowledgement_only boolean default true
- synthetic_only
- unique resolution + actor

Legal/digital-signature semantics are explicitly NOT inferred.

### 3.8 department_course_requests

Purpose: controlled request for academic offering actions.

Fields:
- course_request_id uuid PK
- request_type: OPEN_NEW_OFFERING | ADD_OFFERING | CANCEL_OFFERING
- programme_id uuid FK
- curriculum_version_id uuid FK
- course_id uuid FK
- academic_term_id uuid FK
- existing_course_offering_id uuid nullable FK
- request_status: DRAFT | SUBMITTED | DEPARTMENT_REVIEW | MEETING_OR_CIRCULATION | APPROVED | RETURNED | REJECTED | IMPLEMENTED | CANCELLED
- rationale text
- requested_by_actor_id uuid FK
- meeting_resolution_id uuid nullable FK
- implementation_reference text nullable
- synthetic_only
- timestamps

Invariant:
APPROVED does not automatically mutate course_offerings.
Implementation requires a separate controlled command.

### 3.9 department_notifications

Purpose: governed user notification record.

Fields:
- notification_id uuid PK
- recipient_actor_id uuid FK
- severity: CRITICAL | WARNING | NOTICE
- notification_type text
- title
- body
- source_object_type text
- source_object_id uuid nullable
- deduplication_key text nullable
- status_code: UNREAD | READ | DISMISSED
- available_at / expires_at
- created_at
- synthetic_only

Only recipient may read/update read state; notification does not grant record access beyond its underlying object.

## 4. RLS Matrix

### Work Items
- Assignee: SELECT own assigned items.
- Creator: SELECT own created items.
- Programme Chair: SELECT programme-scoped items for own programme.
- Department Head: SELECT all department/programme items.
- System Admin: no academic work access by default.
- Student: deny.

Mutation during first migration wave: service/guarded RPC only; direct authenticated INSERT/UPDATE/DELETE denied.

### Meetings
- Participant: SELECT meeting in which actor is a participant.
- Programme Chair: SELECT programme meetings in own scope.
- Department Head: SELECT all.
- System Admin: deny academic meeting content.
- Student: deny.

Direct mutation denied initially.

### Course Requests
- Requestor: SELECT own request.
- Programme Chair: SELECT requests in own programme.
- Department Head: SELECT all.
- System Admin: deny academic request content.
- Student: deny.

Direct mutation denied initially.

### Notifications
- Recipient: SELECT own notifications; UPDATE only status fields through guarded RPC in later wave.
- All other actors: deny.
- anon: deny.

## 5. Authority Levels

Recommended management levels:
- Programme-level operational preparation: A2+ with PROGRAMME_CHAIR / COURSE_OWNER / PREPARER where command permits.
- Programme review/governance: A4 PROGRAMME_CHAIR.
- Department governance / resolution approval: A5 DEPARTMENT_HEAD.
- SYSTEM_ADMIN is never an academic substitute.

## 6. Audit Requirements

Audit mandatory for:
- meeting status transition
- agenda lock
- vote recording
- resolution approval/supersession
- course request submission/review/decision/implementation
- work item official assignment/withdrawal/completion
- notification generation for privileged governance events

Audit record must preserve actor, authority_assignment where relevant, programme, object, action, correlation_id and timestamp.

## 7. Negative Tests

- Student → department meeting = DENY
- Student → course request = DENY
- Lecturer unassigned/nonparticipant → meeting = DENY
- System Admin → resolution approval = DENY
- System Admin → programme course request review = DENY
- Programme Chair A → Programme B meeting/request = DENY
- Work assignee → academic approval because of assignment = DENY
- Anonymous → all new tables = DENY
- Notification A → Notification B = DENY

## 8. Positive Tests

- Department Head A5 → department/programme meeting = ALLOW
- Department Head A5 → resolution governance = ALLOW via guarded command
- Programme Chair A → Programme A meeting/request = ALLOW
- Meeting participant → assigned meeting read = ALLOW
- Work assignee → assigned work item read = ALLOW
- Notification recipient → own notification = ALLOW

## 9. Migration Strategy

Wave 1:
- create tables
- FK/check constraints
- indexes for RLS and joins
- enable RLS
- revoke anon
- grant authenticated SELECT only where RLS can safely filter
- no direct general mutation

Wave 2:
- guarded RPCs for create/submit/review/resolve/assign/read-state
- audit integration
- idempotency/correlation
- synthetic fixtures
- regression

Wave 3:
- search projection
- notification generation rules
- quick capture candidate creation
- Ask HEPE retrieval contract

## 10. Search & AI Rule

Universal Search and Ask HEPE must retrieve from permission-safe projections/RPCs.
Never index or expose restricted snippets into a globally readable search index.

## 11. Production Boundary

All records in current wave must be synthetic_only=true.
No official meeting, vote, course request, assignment or notification may be created.
