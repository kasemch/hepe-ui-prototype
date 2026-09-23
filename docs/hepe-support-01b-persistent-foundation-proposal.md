# HEPE-SUPPORT-01B — Persistent Support Record, Attachment Metadata, Support Authority & RLS Foundation

Status: PROPOSAL ONLY / NOT AUTHORIZED FOR EXECUTION
Environment: NON-PRODUCTION ONLY
Predecessor: HEPE-SUPPORT-01 source/runtime controlled pilot candidate

## Purpose
Provide persistent multi-user support records without allowing Support workflow to mutate canonical curriculum, grant academic authority, create formal findings automatically, send real email, or admit Audit Evidence automatically.

## Proposed entities

### public.support_tickets
Fields:
- ticket_id uuid primary key
- ticket_number text unique not null
- created_at timestamptz not null default now()
- created_by_actor_id uuid not null
- programme_id uuid null
- curriculum_version_id uuid null
- course_offering_id uuid null
- course_code text null
- module_code text not null
- page_path text not null
- entity_type text null
- entity_id text null
- ticket_category text not null
- severity text not null
- priority text not null
- title text not null
- description text not null
- reproduction_steps text null
- expected_result text null
- actual_result text null
- environment text not null check (environment = 'NON-PRODUCTION')
- application_sha text not null
- deployment_id text null
- browser text null
- viewport text null
- support_status text not null
- assigned_to_actor_id uuid null
- assigned_group text null
- resolution_summary text null
- resolution_code text null
- resolved_at timestamptz null
- verified_by_user_at timestamptz null
- closed_at timestamptz null
- reopened_at timestamptz null
- provenance_status text not null
- source_reference text not null
- authority_scope text not null default 'SUPPORT_ONLY'
- canonical_mutation_allowed boolean not null default false check (canonical_mutation_allowed = false)
- audit_evidence_status text not null default 'NOT_ADMITTED' check (audit_evidence_status = 'NOT_ADMITTED')
- production boolean not null default false check (production = false)

Constraints:
- category restricted to the controlled Support taxonomy
- severity restricted to SEV-1..SEV-4
- status restricted to OPEN/TRIAGED/ASSIGNED/IN_PROGRESS/RESOLVED/USER_VERIFICATION/CLOSED/REOPENED
- Support records cannot represent canonical mutation or Audit Evidence admission

Indexes:
- created_by_actor_id, created_at desc
- programme_id, support_status
- course_offering_id, support_status
- assigned_to_actor_id, support_status
- ticket_category, severity, support_status
- module_code, created_at desc

### public.support_ticket_events
Append-only ticket history:
- event_id uuid primary key
- ticket_id uuid not null references support_tickets
- event_type text not null
- from_status text null
- to_status text null
- actor_id uuid not null
- comment_text text null
- event_payload jsonb not null default '{}'
- provenance_status text not null
- created_at timestamptz not null default now()

Normal runtime: INSERT/SELECT only. UPDATE/DELETE denied. Any privileged synthetic cleanup path must require an explicit test marker and remain unavailable to authenticated runtime users.

### public.support_ticket_links
Traceability references only; no target mutation:
- link_id uuid primary key
- ticket_id uuid not null references support_tickets
- target_type text not null
- target_reference text not null
- relation_type text not null
- provenance_status text not null
- created_by_actor_id uuid not null
- created_at timestamptz not null default now()

Candidate target types: PROGRAMME, CURRICULUM_VERSION, COURSE, COURSE_OFFERING, MODULE, PAGE, ENTITY, GITHUB_ISSUE, COMMIT, PULL_REQUEST, VERCEL_DEPLOYMENT, TEST_RUN, EVIDENCE_CANDIDATE, RECONCILIATION_ITEM, FORMAL_FINDING.

A FORMAL_FINDING link may reference an already-authorized finding only and must never create or promote a finding.

### public.support_ticket_attachments
Metadata only in 01B:
- attachment_id uuid primary key
- ticket_id uuid not null references support_tickets
- file_name text not null
- media_type text not null
- byte_size bigint null
- storage_reference text null
- sha256 text null
- provenance_status text not null
- uploaded_by_actor_id uuid not null
- created_at timestamptz not null default now()

SUPPORT-01B does NOT authorize object-storage bucket creation or storage policy. `storage_reference` may remain null pending a separate storage authorization gate.

## Deferred entity
`support_knowledge_articles` is deferred unless persistence is demonstrably required. Prefer a later SUPPORT-02 knowledge-governance gate to minimize schema expansion.

## Candidate support authority model
Logical support roles remain separate from academic authority:
- REQUESTER
- SUPPORT_TRIAGER
- SUPPORT_AGENT
- SUPPORT_MANAGER
- ACADEMIC_OWNER
- SYSTEM_ADMIN_SUPPORT

No role shall be inferred automatically from Programme Chair, Department Head, Reviewer, Instructor, or other academic/system roles. Any support-role binding requires a controlled source and explicit support scope.

## Proposed RLS semantics — fail closed
- Anonymous: no privileged read/write.
- Requester: create own ticket, read own tickets, append permitted requester events/comments; cannot triage, assign, resolve, or close another ticket.
- Support Triager: read tickets within verified support scope and perform triage/category/severity/assignment transitions only.
- Support Agent: read assigned/in-scope tickets, add events/comments, move ASSIGNED → IN_PROGRESS → RESOLVED where authorized.
- Support Manager: support-scope oversight and reassignment only; no academic authority inheritance.
- Academic Owner: support review/verification only where separately bound; no canonical mutation through Support.
- SYSTEM_ADMIN_SUPPORT: technical support administration only; no curriculum activation/publication or Audit Evidence admission.
- Cross-programme reads/writes: DENY unless verified controlled support authority explicitly covers that programme.
- Normal runtime DELETE: DENY.

## Candidate lifecycle write paths
- Create Ticket → append TICKET_CREATED event
- Triage → validated state transition + STATUS_CHANGED event
- Assign → assignment update + TICKET_ASSIGNED event
- Resolve → resolution fields + RESOLVED event
- User Verify → verified_by_user_at + USER_VERIFICATION event
- Close/Reopen → validated transition + corresponding event

If ticket mutation + event append must be atomic, use a transaction-safe RPC created only under separately authorized SUPPORT-01B.

## Required negative tests
1. anonymous privileged insert/update/read DENY;
2. requester cannot triage/assign/resolve/close another ticket;
3. cross-programme access DENY without verified support scope;
4. support role does not grant Programme Chair/Department Head/curriculum authority;
5. Support cannot write PLO/CLO/I-R-M/curriculum/result canonical tables;
6. ticket cannot admit Audit Evidence;
7. AI identity cannot close/approve/grant authority;
8. attachment metadata cannot create arbitrary storage access;
9. Production environment rows/endpoints rejected;
10. real-email action absent from 01B.

## Synthetic NAT plan
Synthetic actors: requester, triager, agent, manager, no-authority, cross-programme actor.
Use synthetic programme/course-offering context only where existing controlled test fixtures permit.

Positive tests:
- requester create/read own ticket
- triage
- assigned-agent lifecycle
- requester verification
- controlled reopen
- traceability link insert
- attachment metadata insert

Negative tests:
- no-authority
- anonymous
- cross-programme
- academic-authority escalation
- canonical mutation attempt
- Audit Evidence admission attempt

## Cleanup plan
Delete synthetic support_ticket_events, links, attachment metadata, tickets, temporary support-authority bindings, and synthetic actors in dependency order through a controlled test cleanup path. Final residual count for every synthetic entity must equal 0.

## Rollback
Rollback shall remove only SUPPORT-01B-specific policies/functions/indexes/tables in reverse dependency order after verifying no non-synthetic controlled records exist. Never cascade into existing HEPE academic entities.

## Authority implications
SUPPORT-01B introduces persistent Support data writes and Support-specific RLS semantics, therefore separate explicit authorization is required. It does not authorize Production, real users, email/SMTP, secret actions, canonical curriculum mutation, formal Finding creation, academic authority expansion, PR merge, activation/publication, or Audit Evidence Admission.

## Minimum authorization required
Authorize HEPE-SUPPORT-01B on NON-PRODUCTION Supabase project `lztxpjsuzqvtgyasfnyj` to create only the proposed persistent Support tables, transaction-safe lifecycle functions/RPC if required, Support-specific RLS policies, and synthetic NAT harness with mandatory cleanup residual=0, while preserving all existing HEPE prohibitions and Human Authority boundaries.
