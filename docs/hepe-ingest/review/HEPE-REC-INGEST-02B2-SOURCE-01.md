# HEPE-REC-INGEST-02B2-SOURCE-01 — Source Reconciliation Record

Status: OPEN — SOURCE-B BINARY NOT YET VERIFIED
Environment: NON-PRODUCTION
Scope: HEPE-INGEST-02B.2 / 02B.3 READ-ONLY provenance reconciliation
Canonical write/import: NOT AUTHORIZED
Production action: NOT AUTHORIZED

## Compared source representations

### Source A — binary parser test source
- File: `หลักสูตรสุขศึกษาและพลศึกษา 19.10.66 edit.pdf`
- Binary SHA-256: `cf7623d6292e3836d81a105c75a2d47e8d0294e26b141b7ef1fb7cb1b3091afd`
- Binary pages: 86
- Programme code: `25510071103503`
- Total credits: 151
- Effective term stated in source: ภาคการศึกษาที่ 1 ปีการศึกษา 2567
- University Council approval fields in the PDF: blank
- Role in HEPE-INGEST-02B.2: real-PDF binary parser fixture / source variant

### Source B — consolidated curriculum source selected for 02B.1
- Controlled-source record: `HEPE-SRC-BED-HPE-2567-MKO2-01`
- Evidence-register record: `EV-001` identifies the curriculum specification as 157 pages.
- Programme code: `25510071103503`
- Total credits: 151
- Effective term represented in controlled reference records: ภาคการศึกษาที่ 2 ปีการศึกษา 2567
- University Council approval represented in controlled reference records: ครั้งที่ 6/2567 วาระที่ 5.13 วันที่ 13 พฤษภาคม 2567
- Controlled reference workbooks also represent 92 courses, 7 PLOs and a 151-credit study plan; these are reference records and are not substituted for the missing Source-B binary.
- Role in HEPE-INGEST-02B.1/02B.3: stronger controlled-source candidate for curriculum-content authority, subject to exact-binary verification.

### Separate authority record
- University memorandum dated 14 May 2567 communicating the University Council resolution.
- Visible resolution: meeting 6/2567, agenda 5.13, 13 May 2567, approval of B.Ed. Health and Physical Education (4-year) revised curriculum 2567.
- This record remains separate authority provenance and MUST NOT be silently written into Source A.

## HEPE-INGEST-02B.3 continuation check — 2026-09-11

A File Library search was executed for the exact 157-page curriculum binary using programme code, total credits, effective term, council-resolution metadata, curriculum title and appendix/PLO markers.

Verified observations:
- controlled registers and derived workbooks consistently identify a 157-page curriculum specification for this programme;
- the current retrievable search results did not expose the exact 157-page PDF binary itself as a directly hashable file object;
- therefore no SHA-256, byte length or binary page-count assertion for Source B is admitted at this stage;
- no attempt was made to substitute an 80-page proposal, spreadsheet, DOCX registry, 86-page PDF or other derived record for the missing Source-B binary.

Evidence admission classification for this continuation:
- Evidence Register / controlled workbook references = CONTROLLED RECORDS supporting existence/content context only;
- exact Source-B PDF binary = NOT YET VERIFIED;
- Source-B binary SHA-256 = NOT AVAILABLE;
- Source-B parser E2E = NOT EXECUTED;
- canonical import readiness = BLOCKED by binary provenance gap.

## Reconciliation findings

1. Source A and Source B refer to the same programme code and the same 151-credit curriculum family.
2. They are not established as the same document representation; Source A is 86 pages while controlled records identify Source B as 157 pages.
3. A material curriculum-version difference exists in the represented effective term: Source A states semester 1/2567 while controlled Source-B records state semester 2/2567.
4. Approval context also differs: Source A leaves council approval blank; Source-B controlled records contain the University Council resolution independently supported by the separate university memorandum.
5. Source A MUST NOT be promoted to the authoritative approved curriculum baseline merely because it has a verified binary hash.
6. Source A remains valid Test / Regression Evidence for PDF-byte transport, hashing, parsing, provenance and no-write assertions only.
7. Source B remains the stronger controlled-source candidate for curriculum-content authority, but exact binary provenance is a mandatory precondition before canonical admission/import.
8. Derived spreadsheets/workbooks MAY be used as comparison/reference evidence but MUST NOT be used as a replacement binary provenance source.

## Conflict classification

- Source-to-source content difference: `CONTENT_DIFFERENCE`
- Version/state difference: `VERSION_CONFLICT`
- Authority metadata difference: `AUTHORITY_CONTEXT_DIFFERENCE`
- Source-B binary provenance: `BINARY_NOT_YET_VERIFIED`
- Canonical overwrite decision: `PROHIBITED / HUMAN REVIEW REQUIRED`

## Required disposition before canonical import

- Mount or otherwise make available the exact approved consolidated 157-page PDF binary represented by Source B.
- Compute SHA-256, byte length and binary page count from that exact file.
- Run `scripts/hepe-ingest-02b2-realpdf-e2e.py` or the same parser contract against Source B.
- Compare programme/version/course/PLO/mapping/study-plan candidates against Source A and controlled reference workbooks.
- Preserve Source A, Source B and the separate authority memorandum as distinct provenance records.
- Do not overwrite or collapse variants automatically.

## Current conclusion

`HEPE-INGEST-02B.3 — EXCEPTION STOP / SOURCE-B BINARY PROVENANCE REQUIRED`

`HEPE-REC-INGEST-02B2-SOURCE-01 — OPEN / RECONCILIATION REQUIRED BEFORE CANONICAL IMPORT`

`HEPE-INGEST-02B.2` remains `PASS WITH SOURCE-RECONCILIATION CONDITION` for binary parser mechanics only.

No canonical write, database mutation, schema/RLS/IAM change, production deployment, automatic evidence admission, silent conflict resolution, or PR merge is authorized or performed by this record.
