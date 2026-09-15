# HEPE-INGEST-02C.2 — RLS Impact Design

Classification: **DESIGN / SPECIFICATION**  
Environment: **NON-PRODUCTION ONLY**  
RLS modification: **NOT AUTHORIZED / NOT ATTEMPTED**

## Security premise

HEPE authentication does not imply academic authority. Existing HEPE contracts separate actor identity, role, authority level and explicit scope through `authority_assignments`. New curriculum entities must inherit that principle.

## Scope derivation

Each proposed canonical curriculum entity must resolve to a programme scope through `curriculum_version_id`, and where applicable to a course scope through `curriculum_course_id -> course_id`.

No policy should depend only on `created_by`, ownership metadata, email domain, UI role label, AI origin or client-supplied programme ID.

## Persona matrix — future expected behavior

| Persona | Read same programme | Prepare/write candidate or draft | Verify/review | Activate/import canonical | Cross-programme |
|---|---:|---:|---:|---:|---:|
| Programme Chair with active programme authority | ALLOW | ALLOW within authority contract | ALLOW subject SoD/COI | HUMAN-GATED only if explicitly authorized | DENY unless explicit cross-programme authority |
| Course Owner / Preparer | ALLOW relevant scope | ALLOW course-scoped preparation where contract permits | DENY independent verification of own work unless alternate governance path explicitly allows | DENY | DENY |
| Reviewer | ALLOW assigned review scope | DENY creation where reviewer role conflicts with SoD | ALLOW only with active review assignment + COI clear | DENY unless separately decision-authorized | DENY |
| Department authority | ALLOW within explicit department/programme assignments | according to active scoped authority | according to active scoped authority and SoD | HUMAN-GATED only at authorized level | DENY without cross-programme assignment |
| No-authority persona | DENY protected curricular reads unless public/read contract exists | DENY | DENY | DENY | DENY |
| Cross-programme persona without target assignment | DENY target programme | DENY | DENY | DENY | DENY |

## Entity-specific policy implications

### CurriculumAcademicPeriod
Read/write governed by curriculum-version programme scope. Calendar-date binding should require provenance and appropriate preparation/review authority.

### CourseOfferingPattern
Course-scoped preparers may prepare only for courses covered by their active assignment and matching curriculum programme. Cross-course and cross-programme writes must deny.

### CurriculumCourseGroup / Membership
Programme-scoped structure. Course membership changes can affect programme structure and therefore should require programme-level preparation authority rather than mere course ownership.

### StudyPlanEntry / ChoicePool
Programme-scoped. Because study-plan semantics affect curriculum structure, creation/modification should require explicit programme preparation authority. Reviewer cannot self-create review targets.

### CurriculumCoursePloMapping
Programme-version + course scope. A course preparer may prepare mappings for assigned courses if the future authority contract permits; reviewer verification requires independent review assignment. Cross-course writes must deny.

### CurricularProvenanceBinding
Provenance should be append-only or tightly controlled relative to the governed record. A user must not be able to rebind an existing canonical record to a different source hash/page without an authorized supersession path.

## Separation of duties

Future policies/RPC commands must preserve:
- preparer ≠ final independent reviewer where required;
- COI/recusal handling;
- current authority revalidation at decision/import time;
- no queued/stale authority replay;
- no AI or connector process acquiring authority beyond the initiating human scope.

## Negative tests required in HEPE-INGEST-02D

1. no-authority create/read DENY;
2. cross-programme read/write DENY;
3. course preparer wrong-course write DENY;
4. reviewer create target DENY;
5. expired/revoked authority DENY;
6. mismatched programme/course lineage DENY;
7. provenance rebinding without supersession authority DENY;
8. canonical activation/import without explicit authorized command DENY.

## Current disposition

`RLS DESIGN = COMPLETE FOR REVIEW / NO POLICY CREATED / NO POLICY MODIFIED`