# HEPE-SUPPORT-01B — Applied Migration Manifest

Status: NON-PRODUCTION CONTROLLED PILOT / APPLIED
Audit Evidence Status: EVIDENCE CANDIDATE ONLY / NOT ADMITTED
Supabase Project: `lztxpjsuzqvtgyasfnyj`
Date: 2026-09-13

## Applied migrations

1. `20260913065235` — `hepe_support_01b_persistent_support_foundation_v2`
2. `20260913065258` — `hepe_support_01b_function_privilege_lock`

## Persistent entities

- `public.support_tickets`
- `public.support_ticket_events` — append-only for authenticated runtime
- `public.support_ticket_links`
- `public.support_ticket_attachments` — metadata only; object storage not authorized
- `public.support_role_bindings` — Support-only authority binding, separate from academic authority

## Runtime functions

- `public.hepe_support_create_ticket(...)`
- `public.hepe_support_transition_ticket(...)`
- `private.hepe_current_actor_has_support_role(text[], uuid)`
- `private.hepe_current_actor_can_read_support_ticket(uuid)`

## Security boundaries

- Anonymous privileged runtime access denied.
- Support scope is fail-closed and exact-programme based.
- Support roles do not inherit Programme Chair, Department Head, curriculum activation/publication, Audit Evidence, or Production authority.
- Direct normal-runtime update/delete of support event history is not exposed.
- `canonical_mutation_allowed=false`, `audit_evidence_status=NOT_ADMITTED`, `production=false` are enforced by the Support ticket contract.
- Attachment persistence is metadata-only; `storage_reference` must remain null through authenticated insert policy under SUPPORT-01B.

## Synthetic NAT result

Controlled synthetic personas exercised: requester, triager, agent, manager, no-authority/AI, and cross-programme actor.

Verified results:
- requester ticket creation: PASS
- OPEN → TRIAGED → ASSIGNED → IN_PROGRESS → RESOLVED → USER_VERIFICATION → CLOSED: PASS
- traceability link metadata insert: PASS
- attachment metadata insert with no storage reference: PASS
- no-authority ticket visibility: DENY / zero visible rows
- cross-programme ticket visibility: DENY / zero visible rows
- anonymous lifecycle RPC call: DENY
- no-authority transition: DENY
- cross-programme transition: DENY
- unauthorized storage reference insert: DENY by RLS
- academic authority assignments for Support NAT actors: 0
- mandatory synthetic cleanup residual: tickets=0 / events=0 / bindings=0 / actors=0

## Reconciliation note

The first migration attempt failed transactionally before schema creation because a function privilege statement used an incorrect signature. Verification confirmed no partial Support tables existed. The corrected migration was then applied, followed by a separate function privilege-lock migration using verified function identities.

## Explicit non-authorizations preserved

No Production deployment, real-user provisioning, real email/SMTP, secret action, object-storage bucket/policy creation, canonical curriculum mutation, academic authority expansion, Formal Finding creation, curriculum activation/publication, PR merge, or Audit Evidence admission was performed.
