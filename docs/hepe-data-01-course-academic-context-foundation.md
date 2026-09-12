# HEPE-DATA-01 — Course Academic Context Data Foundation

STATUS: DESIGN / MIGRATION CANDIDATE ONLY
ENVIRONMENT: NON-PRODUCTION ONLY
SCHEMA MODIFICATION: NOT AUTHORIZED / NOT APPLIED
AI AUTHORITY: NONE
AUDIT EVIDENCE ADMISSION: DISABLED
PILOT COURSE: HED2503

## 1. Objective
Create a governed academic context layer that can retrieve one course as a single context package for human-controlled AI assistance without fabricating missing academic data.

## 2. Reuse existing canonical structures
Do not duplicate existing governed entities:
- courses / curriculum_courses / curriculum_versions
- outcomes / outcome_versions for CLO/PLO
- outcome_mappings and curriculum_course_plo_mappings
- assessments / assessment_versions / assessment_outcome_links
- learning activities / learning_activity_versions / learning_activity_outcome_links
- evidence/provenance structures

## 3. Missing capability
Current `courses` and `v_hepe_course_registry_v1` do not contain versioned course descriptions. Add a versioned description entity rather than mutating the base course identity table.

### Proposed table: course_description_versions
- course_description_version_id uuid PK
- curriculum_course_id uuid FK -> curriculum_courses
- version_no integer
- description_th text
- description_en text
- status_code text
- verification_status text
- source_reference text
- source_sha256 text nullable
- source_locator text nullable
- authority_status text
- effective_from date nullable
- effective_to date nullable
- is_current boolean
- supersedes_course_description_version_id uuid nullable
- approved_at timestamptz nullable
- activated_at timestamptz nullable
- created_at timestamptz

Key rule: `is_current=true` does not mean approved/activated. Approval/activation remain explicit governed states.

## 4. Read model
Proposed view/function `v_hepe_course_academic_context_v1` / query contract returns:
- programme and curriculum version
- course identity, title, credits, group
- current permitted course description version + provenance
- controlled course→PLO I-R-M
- CLO versions and statuses
- CLO→PLO mappings
- linked learning activity versions
- linked assessment versions
- provenance / verification status per component

## 5. AI context boundary
AI may:
- analyze retrieved controlled/working context
- propose CLO revisions/additions
- explain alignment rationale
- flag missing/contradictory context
- propose activity/assessment ideas

AI may not:
- approve or activate records
- silently replace controlled data
- write canonical data
- infer missing source text as fact
- admit content into Audit Evidence

All AI proposals must be separately marked `AI_PROPOSAL / UNVERIFIED` until a human accepts them.

## 6. HED2503 pilot source status
Candidate working TQF3 contains:
- course description TH/EN
- CLO1–CLO4
- PLO discussion
- weekly learning plan/LLOs
- assessment plan and rubrics

Source authority is not proven as official approved master. Therefore any ingestion must use status `WORKING_SOURCE_CANDIDATE` or equivalent, never APPROVED solely from document completeness.

## 7. Pilot test assertions
DATA01-A1: HED2503 course identity resolves from controlled curriculum.
DATA01-A2: description TH/EN returns from versioned source with provenance.
DATA01-A3: controlled course→PLO mapping remains PLO3 / R unless verified baseline says otherwise.
DATA01-A4: multiple CLO records are retrievable independently.
DATA01-A5: each CLO can expose status/source independently.
DATA01-A6: AI context endpoint returns no fabricated values when any component is missing.
DATA01-A7: no canonical write occurs from AI proposal.
DATA01-A8: no Audit Evidence Admission occurs.
DATA01-A9: unauthenticated production access is not created.
DATA01-A10: RLS semantics are preserved unless separately authorized.

## 8. Gate to implementation
Before applying DDL or inserting HED2503 academic context records, require explicit authorization for:
1. NON-PRODUCTION Schema Modification for HEPE-DATA-01.
2. NON-PRODUCTION Data Write for HED2503 pilot candidate records.
These authorizations do not imply Production, publication, activation, approval, or Audit Evidence Admission.
