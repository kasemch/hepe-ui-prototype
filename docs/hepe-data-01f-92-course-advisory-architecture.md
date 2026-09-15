# HEPE-DATA-01F — 92-Course Curriculum Improvement Advisory Architecture

## Boundary
- NON-PRODUCTION ONLY
- Architecture / application contract only
- No automatic recommendation generation for courses without sufficient context
- No governed curriculum write
- No schema / RLS / authority semantic change in this batch
- No activation / publication / PR merge / Production deployment
- No Audit Evidence Admission

## Objective
Scale the HED2503 advisory pattern to the 92-course controlled curriculum without treating missing context as facts and without allowing AI proposals to mutate the current baseline.

## Per-Course Context Envelope
Each course advisory envelope should contain:
1. Course identity and curriculum version
2. Canonical credit pattern
3. Versioned course description and authority status
4. Current Course→PLO / I-R-M mapping
5. Governed CLOs, when available
6. Working/draft CLO candidate source, when available
7. Learning activities / weekly plan context
8. Assessment / rubric context
9. Evidence / verification context
10. Provenance and authority classification for every layer
11. Missing-context warnings
12. AI recommendation layer, stored separately from baseline

## Context Sufficiency Gate
AI advisory generation is allowed only when:
- controlled course identity is available;
- current curriculum version is known;
- course description or an explicitly classified candidate source is available;
- PLO/I-R-M baseline is available or explicitly marked missing;
- provenance and authority status can be displayed;
- missing fields are preserved as missing rather than inferred as current truth.

If the gate is not met, result = `INSUFFICIENT_CONTEXT_FOR_AI_ADVISORY`.

## Recommendation Registry Contract
Recommended logical shape (application-level contract; not a database migration authorization):
- recommendation_set_id
- programme_code
- curriculum_version_code
- course_code
- recommendation_id
- topic
- current_baseline_summary
- proposed_change
- rationale
- source_context_refs
- missing_context
- ai_generated = true/false
- human_disposition = null | ACCEPT_CANDIDATE | EDIT_CANDIDATE | REJECT_CANDIDATE | DEFER_CANDIDATE
- status = APPROVED_FOR_CONSIDERATION / UNDER_HUMAN_REVIEW / ACCEPTED_FOR_DRAFTING / REJECTED / DEFERRED / CONTROLLED_CHANGE_PROPOSAL
- current_baseline_effect = NONE until separately authorized controlled change
- audit_evidence_status = NOT_ADMITTED by default

## Human Review Queue
AI recommendation → Human review → Accept/Edit/Reject/Defer candidate → Controlled Change Proposal → Separate formal curriculum decision → only then any authorized baseline mutation.

No AI state is an authority grant.

## Batch Expansion Rule
HED2503 remains the pilot reference implementation. For the remaining 91 courses:
- inventory context first;
- classify context sufficiency;
- do not auto-generate recommendations for insufficient-context courses;
- generate recommendations only within a separately authorized advisory batch or human-initiated course review;
- never copy HED2503 CLOs, activities, assessments or recommendations to another course by analogy.

## Regression Assertions
1. Current baseline and proposed change render as separate layers.
2. AI recommendation has only candidate dispositions: Accept/Edit/Reject/Defer.
3. Course Review contains no baseline-write action.
4. Course context API preserves source mode / provenance / missing-context status.
5. No canonical activation or publication action is introduced.
6. Audit Evidence Admission remains disabled.
7. Production and PR merge remain untouched.
8. No schema/RLS/authority semantics changed by DATA-01D→01F.
