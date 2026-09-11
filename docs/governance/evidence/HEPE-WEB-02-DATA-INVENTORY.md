# HEPE-WEB-02A — Controlled Data Inventory & Read-Model Mapping

Environment: **NON-PRODUCTION ONLY**  
Status: **CONTROLLED SYSTEM INVENTORY — PARTIAL COVERAGE / EXCEPTION IDENTIFIED**  
Production Authorization: **NOT GRANTED**

## Evidence admission
This record is based on direct Supabase system inspection of project `lztxpjsuzqvtgyasfnyj` and repository inspection of `kasemch/hepe-ui-prototype`. Conversation text is not used as Audit Evidence.

## Active controlled read models
The `read_model_registry` currently exposes five active SECURITY_INVOKER read models:

| Read Model | Relation | Family | WEB-02 use |
|---|---|---|---|
| RM_PROGRAMME_DASHBOARD | `v_hepe_programme_dashboard_v1` | PROGRAMME | Programme identity + controlled programme counts |
| RM_REVIEW_QUEUE | `v_hepe_review_queue_v1` | REVIEW | Tasks / review / approval context |
| RM_EVIDENCE_HEALTH | `v_hepe_evidence_projection_v1` | EVIDENCE | Evidence Explorer / provenance health |
| RM_CPRR | `v_hepe_cprr_projection_v1` | CPRR | QA / CPRR workflow |
| RM_COMMAND_AVAILABILITY | `hepe_get_command_availability` | WORK_QUEUE | command availability / authority-aware action context |

## Domain sources present but not yet exposed through a controlled academic read model
The database contains the following RLS-enabled academic foundation tables:

- `programmes`
- `curriculum_versions`
- `courses`
- `curriculum_courses`
- `outcomes`
- `outcome_versions`
- `outcome_mappings`
- `mapping_versions`

System inspection found RLS enabled on these tables. For `curriculum_versions`, `courses`, `curriculum_courses`, `outcomes`, `outcome_versions`, `outcome_mappings`, and `mapping_versions`, no SELECT policies are currently registered. They therefore cannot serve as a usable authenticated PREPARER_A read surface without a separately authorized security/schema gate.

## WEB-02 coverage

### WEB-02B Programme Overview
**PARTIAL CONTROLLED SOURCE AVAILABLE.** `v_hepe_programme_dashboard_v1` can materialize programme identity, canonical identifier, programme status, update timestamp, open review count, open finding count, open action count and stale evidence count under the existing SECURITY_INVOKER contract.

Current curriculum-version detail, course registry and programme-outcome registry do not yet have a usable controlled read-model surface. UI must show `DATA_NOT_AVAILABLE` rather than infer or hard-code values.

### WEB-02C PLO/CLO/I-R-M Mapping
**CONTROLLED READ-MODEL GAP.** Academic mapping foundation exists in `outcomes`, `outcome_versions`, `outcome_mappings`, `mapping_versions`, `courses`, and `curriculum_courses`, but these RLS-enabled tables currently have no SELECT policies and there is no active SECURITY_INVOKER PLO/CLO mapping read model in `read_model_registry`.

Proceeding to display actual PLO/CLO/I-R-M rows would therefore require one of the following, neither authorized by HEPE-WEB-02: a new controlled read model / SQL function, or new SELECT RLS policies. Hard-coded curriculum data would violate the no-fabrication rule.

**Result: EXCEPTION STOP is required at WEB-02C unless a separate authorization creates the controlled mapping read surface.**

### WEB-02D Evidence Explorer
**CONTROLLED SOURCE AVAILABLE:** `v_hepe_evidence_projection_v1`.

### WEB-02E QA / CPRR
**CONTROLLED SOURCE AVAILABLE:** `v_hepe_cprr_projection_v1`. No inferred readiness percentage is authorized.

### WEB-02F Tasks / Approval
**CONTROLLED SOURCE AVAILABLE:** `v_hepe_review_queue_v1`; `hepe_get_command_availability` is registered for authority-aware command context. No autonomous approval is authorized.

### WEB-02G AI Advisory
AI may consume only the same authenticated controlled read context already visible to the user. It has no write, approval, authority-elevation, baseline-mutation, or Audit-Evidence-admission authority.

## Evidence register

| Evidence ID | Evidence Type | Source | Version/Date | Authority/Owner | Assertion | Verification Status |
|---|---|---|---|---|---|---|
| HEPE-WEB02-EVD-A01 | Verified System Evidence | Supabase `read_model_registry` | 2026-09-11 | Supabase | Five active SECURITY_INVOKER HEPE read models exist | PASS |
| HEPE-WEB02-EVD-A02 | Verified System Evidence | PostgreSQL `information_schema` | 2026-09-11 | Supabase | Academic programme/curriculum/outcome/mapping tables exist | PASS |
| HEPE-WEB02-EVD-A03 | Verified System Evidence | PostgreSQL `pg_class` | 2026-09-11 | Supabase | Academic foundation tables are RLS enabled | PASS |
| HEPE-WEB02-EVD-A04 | Verified System Evidence | PostgreSQL `pg_policies` | 2026-09-11 | Supabase | Required mapping/curriculum foundation tables currently have no SELECT policies | VERIFIED LIMITATION |
| HEPE-WEB02-EVD-A05 | Formal Reconciliation Item | WEB-02A inventory | 2026-09-11 | HEPE governance | PLO/CLO/I-R-M requires a controlled read surface before materialization | OPEN / BLOCKS WEB-02C |

## Boundary
No schema change, RLS change, IAM change, database write, Production deployment or PR merge is authorized by this inventory record.
