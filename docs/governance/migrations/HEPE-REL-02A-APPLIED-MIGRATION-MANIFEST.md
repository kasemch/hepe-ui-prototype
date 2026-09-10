# HEPE-REL-02A — Applied Migration Manifest

Environment: **NON-PRODUCTION ONLY**  
Supabase project: `lztxpjsuzqvtgyasfnyj`  
Production Authorization: **NOT GRANTED**

## Applied migration lineage

1. `20260910095843_hepe_rel_02a_durable_outbox_rls`
   - created `connector_outbox`, `connector_attempt`, `idempotency_record`, `reconciliation_item`, `connector_health_snapshot`
   - created primary/foreign keys, idempotency uniqueness, queue/correlation/scope indexes
   - enabled RLS on all five tables
   - added initial scoped SELECT/INSERT policies, HUMAN reconciliation UPDATE policy, SYSTEM health-snapshot insert policy
   - denied `PRODUCTION-SENSITIVE` outbox rows by schema check

2. `20260910095950_hepe_rel_02a_scope_coherence_and_state_guard`
   - added `private.hepe_rel02a_scope_coherent(...)`
   - added `private.hepe_rel02a_enforce_outbox_transition()` and transition trigger
   - hardened course/programme and governed-object/programme coherence
   - added owner-scoped outbox UPDATE with state-machine enforcement

3. `20260910100232_hepe_rel_02a_exact_authority_binding`
   - added `private.hepe_rel02a_assignment_authorizes(...)`
   - repaired exact authority-assignment provenance defect found by initial NAT-14
   - requires the referenced `authority_assignment_id` itself, not another assignment owned by the actor, to authorize the row scope

4. `20260910100317_hepe_rel_02a_expiry_guard`
   - denied insertion of already-expired outbox commands
   - denied active transition of expired commands except controlled terminal disposition
   - retained revalidation-before-retry-to-READY requirement

## Final schema posture

All five REL-02A tables exist with RLS enabled. Final policy counts verified from PostgreSQL catalog:

- `connector_outbox`: 3
- `connector_attempt`: 2
- `idempotency_record`: 2
- `reconciliation_item`: 3
- `connector_health_snapshot`: 2

## Runtime boundaries

This manifest records only the NON-PRODUCTION durable persistence foundation. It does not authorize or claim:

- Production deployment
- Production connector execution
- real-user authority changes
- secret or SMTP changes
- automatic ADMIN/DESTRUCTIVE replay
- Production-sensitive operation execution

## Rollback posture

Rollback is not authorized by this record. Any rollback must be separately scoped and must preserve audit/provenance evidence before dropping REL-02A objects.

Conversation ≠ Audit Evidence. Controlled Baseline / Verified System Evidence prevail.
