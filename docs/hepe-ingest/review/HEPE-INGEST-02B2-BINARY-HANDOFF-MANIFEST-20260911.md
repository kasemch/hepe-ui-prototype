# HEPE-INGEST-02B.2 — Source B Binary Handoff Manifest

Status: PREPARED — WAITING FOR EXACT RAW BINARY
Environment: NON-PRODUCTION
Date: 2026-09-11
Parent Reconciliation: HEPE-REC-INGEST-02B2-SOURCE-01
Scope: READ / EXTRACT / NORMALIZE / VALIDATE / COMPARE / HUMAN REVIEW ONLY
Canonical write/import: NOT AUTHORIZED
Production: NOT AUTHORIZED

## Purpose

Define the exact acceptance and execution contract for the 157-page approved curriculum PDF before the remaining binary-parser reconciliation can be closed. This record is a controlled execution manifest, not evidence that the binary has already been received or parsed.

## Expected Source B identity

- File Library object observed during review: `file_00000000373481fa9046f1584c01190d`
- Display title: `หลักสูตรศึกษาศาสตรบัณฑิต สาขาสุขศึกษาและพลศึกษา (4 ปี) 2567.pdf`
- Programme: ศึกษาศาสตรบัณฑิต สาขาวิชาสุขศึกษาและพลศึกษา (4 ปี) (หลักสูตรปรับปรุง พ.ศ. 2567)
- Programme code: `25510071103503`
- Total credits: `151`
- Expected represented document length: `157 pages`
- Effective term in reviewed source: `ภาคการศึกษาที่ 2 ปีการศึกษา 2567`
- University Council metadata in reviewed source: `ครั้งที่ 6/2567 วาระที่ 5.13 วันที่ 13 พฤษภาคม 2567`
- Appendix extent: complete long-form representation including later appendices through at least printed page 140

These attributes are identity checks only. They MUST NOT be used to fabricate binary metadata.

## Raw-binary acceptance checks

The handed-off file is accepted for the closure run only when all checks below pass:

1. File signature begins with `%PDF`.
2. Physical page count is exactly 157.
3. Programme code `25510071103503` is present in extracted content.
4. Total credits `151` is present and structurally attributable to the programme.
5. Curriculum title/version matches the revised 2567 B.Ed. Health and Physical Education programme.
6. Effective term is consistent with `ภาคการศึกษาที่ 2 ปีการศึกษา 2567`.
7. University Council approval metadata is consistent with meeting `6/2567`, agenda `5.13`, date `13 May 2567`.
8. Later appendices are physically present; the file is not an 86-page edited subset with a long-form table of contents only.
9. SHA-256 is computed directly from received raw bytes.
10. Source filename/path, byte size, SHA-256, parser version and execution timestamp are captured in the run record.

Any failure opens a new SOURCE_IDENTITY_MISMATCH item; it does not overwrite Source B.

## Mandatory same-parser closure sequence

`raw PDF bytes -> signature check -> SHA-256 -> physical page count -> native PDF extraction -> candidate records -> field/page provenance -> validation -> conflict comparison against Source A -> human-review package -> reconciliation disposition`

## Required candidate assertions

At minimum the closure run must produce and compare:

- programme identity / programme code
- curriculum version/year
- total credits
- effective term
- programme structure totals
- PLO set and source locators
- representative course records and descriptions
- approval metadata exactly as present in the PDF
- explicit null/not-provided preservation for fields not present
- appendix/completeness markers
- source/page provenance for each material assertion

## Comparison baseline

Source A parser-mechanics binary:

- file: `หลักสูตรสุขศึกษาและพลศึกษา 19.10.66 edit.pdf`
- physical pages: 86
- SHA-256: `cf7623d6292e3836d81a105c75a2d47e8d0294e26b141b7ef1fb7cb1b3091afd`
- effective term: semester 1 / 2567
- council fields: blank
- status: valid Test / Regression Evidence for real-PDF parser mechanics only; not authoritative curriculum baseline

## No-write invariants

The closure run MUST report:

- `canonicalWriteAttempted=false`
- `databaseMutationAttempted=false`
- `schemaChangeAttempted=false`
- `rlsChangeAttempted=false`
- `iamChangeAttempted=false`
- `productionActionAttempted=false`
- `automaticEvidenceAdmissionAttempted=false`

## Closure rule

Reconciliation may be closed only after exact Source B raw bytes pass identity checks and the same parser produces candidate/provenance results that are reviewed against Source A. Content-level agreement alone, File Library object identity alone, title similarity, or parsed-text equality is insufficient for binary closure.

Verification Status: `PREPARED / EXECUTION-READY / RAW-BINARY PENDING`
