# HEPE-ACADEMIC-WORKFLOW-03 — TQF5 Result Lifecycle Candidate

Status: DOMAIN DESIGN CANDIDATE · NON-PRODUCTION · NO DATABASE WRITE

## Separation of dimensions
The system must distinguish:
1. Teaching Term
2. Examination Cycle
3. Reporting Period / QA Cut-off

These dimensions may end at different times.

## Result events
- `REGULAR_EXAM_RESULT`
- `MAKEUP_EXAM_RESULT`
- `QA_REPORTING_SNAPSHOT`
- `CONSOLIDATED_ACADEMIC_RESULT`

Original result events must not be overwritten when makeup results arrive.

## Term 1 candidate flow
TQF3 → teaching → regular exam/result → makeup cycle → consolidated TQF5 result → verification / closure, subject to controlled institutional rules.

## Term 2 / Summer candidate flow
regular exam/result → TQF5 QA-reporting snapshot at the applicable cut-off → QA reporting closes → later makeup cycle → post-cut-off consolidated academic result.

The post-cut-off consolidated result must not silently rewrite the historical QA reporting snapshot.

## Grade Evidence Intake
Candidate input types:
- camera/photo
- image upload
- PDF
- structured grade file

Image/PDF extraction is advisory only. Extracted values remain `UNVERIFIED` until the instructor confirms them.

Candidate derived values may include enrolment/result counts, grade distribution, regular pass/fail, makeup pass/fail and consolidated outcomes. No personal student data should be surfaced outside authorized scope.

## Verification dependency
A verification record must identify which result snapshot was used. `QA_REPORTING_SNAPSHOT` and later `CONSOLIDATED_ACADEMIC_RESULT` are distinct provenance-bearing objects.

## Controlled-source warning
The exact institutional rule for how TQF5 is formally finalized and how makeup results are incorporated must be bound to a controlled Ramkhamhaeng University source before becoming a hard-coded compliance rule.

## Boundary
No canonical result write, OCR runtime, student-grade import, schema migration, production deployment or Audit Evidence admission is authorized by this document.
