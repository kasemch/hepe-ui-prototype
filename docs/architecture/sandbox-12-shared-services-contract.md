# HEPE SANDBOX-12 — Shared Services Contract
## Universal Search / Quick Capture / Notification / Ask HEPE

Status: NON-PRODUCTION / SYNTHETIC PILOT

## 1. Universal Search

Current implemented RPC:
- public.hepe_department_search(text, integer)

Security model:
- SECURITY INVOKER
- RLS is applied before results are returned
- anon EXECUTE denied
- authenticated EXECUTE only
- no global search index that bypasses source RLS

Currently searchable:
- authorised Programmes
- authorised Meetings
- authorised Work Items
- authorised Course Requests
- own Notifications

Evidence is intentionally excluded from generic search until a dedicated evidence-safe search RPC is available. This is a fail-closed decision.

## 2. Quick Capture

Quick Capture is not a canonical object.

Flow:
1. User enters informal text.
2. AI/parser proposes:
   - candidate type
   - programme/course context
   - due date
   - priority
   - suggested owner
   - suggested official wording
3. Candidate remains client/session draft.
4. User reviews.
5. Confirmed candidate is sent to an authorised guarded RPC for the chosen canonical target:
   - Work Item
   - Agenda Item
   - Course Request
   - Document Draft
6. Audit begins only when canonical creation/official submission occurs.

No automatic official submission.

## 3. Notification Engine

Canonical table:
- department_notifications

Implemented:
- self-scoped SELECT via RLS
- public.hepe_notification_mark_read(uuid)
- recipient-only state transition
- anon denied
- authenticated direct UPDATE revoked

Planned generation rules:
- deadline due
- authority expiry
- course request state change
- meeting agenda/resolution state
- work item assignment/due
- evidence gap

Deduplication:
- deduplication_key
- future cooldown/aggregation logic

## 4. Ask HEPE

Ask HEPE is an evidence-grounded assistant over permission-safe retrieval contracts.

Retrieval sequence:
Actor → Role/Scope → Safe Search/RPC → Sources → Answer → Source references

The model may:
- search
- summarise
- explain
- draft
- suggest next workflow step

The model may not autonomously:
- approve
- freeze
- supersede
- vote
- grade
- publish
- grant authority

## 5. Evidence Search Gap

Generic Evidence projection currently fails closed for ordinary authenticated callers because security_invoker reaches underlying evidence tables for which the role has no direct grants.

Decision:
DO NOT broaden table grants.

Required next design:
- evidence-specific safe search RPC
- explicit result fields only
- programme/evidence scope check inside guarded contract
- no content/body leakage beyond authorised metadata
- source citation capability

## 6. Ask HEPE Source Classes

Priority:
1. VERIFIED evidence
2. APPROVED documents
3. canonical records
4. authorised DRAFT/UNVERIFIED working records with explicit status label

Every answer should preserve source status.

## 7. Search Negative Tests

- Student search for meeting title → 0
- Lecturer B search for Programme A meeting → 0
- System Admin search for academic meeting/request → 0
- Programme Chair A search for Programme B operations → 0
- anonymous search RPC → cannot execute

## 8. Search Positive Tests

- Lecturer A finds meeting/work item assigned/participating
- Programme Chair A finds Programme A meeting/work item/request
- Department Head finds department + programme scoped operations
- Notification recipient can find own notification only

## 9. UI Surfaces

Shared surfaces planned:
- Universal Search
- Quick Capture
- Notification Inbox
- Ask HEPE

These are interaction services layered over canonical domains, not replacement masters.
