# HEPE-WEB-02A / 02C.1 — Controlled Data Inventory & Read-Model Mapping

Environment: **NON-PRODUCTION ONLY**  
Status: **CONTROLLED SYSTEM INVENTORY — READ-SURFACE GAP RESOLVED / POSITIVE FIXTURE LIMITATION OPEN**  
Production Authorization: **NOT GRANTED**

## Evidence admission
This record is based on direct Supabase system inspection of project `lztxpjsuzqvtgyasfnyj` and repository inspection of `kasemch/hepe-ui-prototype`. Conversation text is not used as Audit Evidence.

## Active controlled read models
The controlled registry now contains the original five active SECURITY_INVOKER read models plus four academic read surfaces created under HEPE-WEB-02C.1.

| Read Model | Relation | Family | WEB-02 use |
|---|---|---|---|
| RM_PROGRAMME_DASHBOARD | `v_hepe_programme_dashboard_v1` | PROGRAMME | Programme identity + controlled programme counts |
| RM_REVIEW_QUEUE | `v_hepe_review_queue_v1` | REVIEW | Tasks / review / approval context |
| RM_EVIDENCE_HEALTH | `v_hepe_evidence_projection_v1` | EVIDENCE | Evidence Explorer / provenance health |
| RM_CPRR | `v_hepe_cprr_projection_v1` | CPRR | QA / CPRR workflow |
| RM_COMMAND_AVAILABILITY | `hepe_get_command_availability` | WORK_QUEUE | command availability / authority-aware action context |
| RM_CURRICULUM_CONTEXT | `v_hepe_curriculum_context_v1` | PROGRAMME | programme + curriculum version context |
| RM_COURSE_REGISTRY | `v_hepe_course_registry_v1` | PROGRAMME | programme-scoped curriculum course registry |
| RM_OUTCOME_REGISTRY | `v_hepe_outcome_registry_v1` | PROGRAMME | programme-scoped PLO/CLO registry |
| RM_OUTCOME_MAPPING | `v_hepe_outcome_mapping_v1` | PROVENANCE | controlled PLO/CLO/I-R-M mapping + mapping-version provenance |

All four WEB-02C.1 views were verified with `security_invoker=true` and are granted to `authenticated` while `anon` SELECT privilege is absent.

## Academic foundation sources and RLS exposure
The database contains the following RLS-enabled academic foundation tables:

- `programmes`
- `curriculum_versions`
- `courses`
- `curriculum_courses`
- `outcomes`
- `outcome_versions`
- `outcome_mappings`
- `mapping_versions`

HEPE-WEB-02C.1 added only scoped `SELECT` policies required for the authenticated read surface. No existing policy was removed or weakened. The policies resolve programme scope through the existing `private.hepe_current_actor_has_authority('A0', ...)` authority contract.

## WEB-02 coverage after C.1

### WEB-02B Programme Overview
`v_hepe_programme_dashboard_v1` remains the authoritative programme dashboard surface. `v_hepe_curriculum_context_v1`, `v_hepe_course_registry_v1`, and `v_hepe_outcome_registry_v1` are now available for controlled curriculum/course/outcome detail when programme-scoped records exist.

### WEB-02C PLO/CLO/I-R-M Mapping
The prior read-surface blocker is resolved at the database/security-contract level. `v_hepe_outcome_registry_v1` and `v_hepe_outcome_mapping_v1` now provide authenticated SECURITY_INVOKER surfaces for PLO/CLO and mapping-version provenance.

However, direct system inspection verified that the authorized synthetic programme `SYN-HEPE-A` currently has **zero curriculum versions, zero curriculum courses, zero PLO rows, zero CLO rows, and zero outcome mappings**. Therefore the required positive assertion “PREPARER_A can read same-programme PLO/CLO/Course/Mapping rows” cannot be executed without either writing synthetic curriculum fixtures or changing authority scope, both prohibited by the current gate.

The correct current UI state for those surfaces is therefore `EMPTY` / `DATA_NOT_AVAILABLE`, not fabricated academic data.

### WEB-02D Evidence Explorer
Controlled source remains `v_hepe_evidence_projection_v1`.

### WEB-02E QA / CPRR
Controlled source remains `v_hepe_cprr_projection_v1`. No inferred readiness percentage is authorized.

### WEB-02F Tasks / Approval
Controlled source remains `v_hepe_review_queue_v1`; `hepe_get_command_availability` remains the authority-aware command-context surface. No autonomous approval is authorized.

### WEB-02G AI Advisory
AI may consume only authenticated controlled read context already visible to the user. It has no write, approval, authority-elevation, baseline-mutation, or Audit-Evidence-admission authority.

## Verified authority observations

PREPARER_A under its original synthetic subject sees exactly one programme dashboard row, `SYN-HEPE-A`. It sees zero rows in the new curriculum/course/outcome/mapping views because that programme has no corresponding controlled records.

NO_AUTHORITY under its original subject sees zero programme-dashboard rows and zero rows across all four new academic read surfaces.

`anon` has no SELECT privilege on the four new views; `authenticated` has SELECT privilege.

## Evidence register

| Evidence ID | Evidence Type | Source | Version/Date | Authority/Owner | Assertion | Verification Status |
|---|---|---|---|---|---|---|
| HEPE-WEB02-EVD-A01 | Verified System Evidence | Supabase `read_model_registry` | 2026-09-11 | Supabase | Original five active SECURITY_INVOKER HEPE read models exist | PASS |
| HEPE-WEB02-EVD-C101 | Verified System Evidence | Migration `hepe_web_02c1_controlled_academic_read_surface` | 2026-09-11 | Supabase | Minimum scoped SELECT policies and four academic read views created | PASS |
| HEPE-WEB02-EVD-C102 | Verified System Evidence | PostgreSQL `pg_class.reloptions` | 2026-09-11 | Supabase | Four new views are `security_invoker=true` | PASS |
| HEPE-WEB02-EVD-C103 | Verified System Evidence | Supabase `read_model_registry` | 2026-09-11 | Supabase | Four new read models are active and registered as SECURITY_INVOKER | PASS |
| HEPE-WEB02-EVD-C104 | Test / Regression Evidence | Authenticated SQL session — PREPARER_A | 2026-09-11 | HEPE non-production test | PREPARER_A sees only `SYN-HEPE-A` at programme level and no cross-programme data | PASS |
| HEPE-WEB02-EVD-C105 | Test / Regression Evidence | Authenticated SQL session — NO_AUTHORITY | 2026-09-11 | HEPE non-production test | NO_AUTHORITY sees zero rows across programme/curriculum/course/outcome/mapping read surfaces | PASS |
| HEPE-WEB02-EVD-C106 | Verified System Evidence | PostgreSQL relation privileges | 2026-09-11 | Supabase | `anon` SELECT absent; `authenticated` SELECT present on new views | PASS |
| HEPE-WEB02-EVD-C107 | Verified System Evidence | Controlled data inventory for `SYN-HEPE-A` | 2026-09-11 | Supabase | No curriculum/course/PLO/CLO/mapping fixture exists for required positive read assertion | VERIFIED LIMITATION |
| HEPE-WEB02-EVD-C108 | Formal Reconciliation Item | WEB-02C.1 regression | 2026-09-11 | HEPE governance | Positive same-programme academic-data assertion remains untestable without prohibited fixture or authority mutation | OPEN / BLOCKS C.1 FULL PASS |

## Controlled classification

**HEPE-WEB-02C.1 = HOLD — READ-SURFACE FOUNDATION PASS / POSITIVE FIXTURE ASSERTION NOT EXECUTABLE.**

The database/security blocker is resolved. WEB-02C application materialization may display controlled `EMPTY` / `DATA_NOT_AVAILABLE` states, but the gate may not be classified FULL PASS and WEB-02D→WEB-02R must not be auto-closed until the required positive same-programme read assertion is satisfied under a separately authorized synthetic-fixture or equivalent controlled test gate.

## Boundary
No curriculum data mutation, authority change, IAM redesign, Production configuration, Production deployment, real-data ingestion or PR merge was performed.