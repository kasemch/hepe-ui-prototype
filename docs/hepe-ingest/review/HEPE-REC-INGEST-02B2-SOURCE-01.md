# HEPE-REC-INGEST-02B2-SOURCE-01 — Source Reconciliation Record

Status: OPEN — MATERIAL SOURCE-VERSION DIFFERENCE IDENTIFIED
Environment: NON-PRODUCTION
Scope: HEPE-INGEST-02B.2 READ-ONLY provenance reconciliation
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
- File Library controlled-source record: `HEPE-SRC-BED-HPE-2567-MKO2-01`
- Retrieved pages: 157
- Programme code: `25510071103503`
- Total credits: 151
- Effective term stated in source: ภาคการศึกษาที่ 2 ปีการศึกษา 2567
- University Council approval: ครั้งที่ 6/2567 วาระที่ 5.13 วันที่ 13 พฤษภาคม 2567
- Appendices include curriculum mapping and later controlled-document sections beyond the 86-page binary variant.
- Role in HEPE-INGEST-02B.1: controlled curriculum source for read-only extraction and comparison

### Separate authority record
- University memorandum dated 14 May 2567 communicating the University Council resolution.
- Visible resolution: meeting 6/2567, agenda 5.13, 13 May 2567, approval of B.Ed. Health and Physical Education (4-year) revised curriculum 2567.
- This record is linked as separate authority provenance and is not silently written into Source A.

## Reconciliation findings

1. Source A and Source B refer to the same programme code and the same 151-credit curriculum family.
2. They are not the same document representation: page counts differ materially (86 vs 157) and Source B includes appendices beyond the end of Source A.
3. A material curriculum-version difference exists in the effective term: Source A states semester 1/2567 while Source B states semester 2/2567.
4. Approval metadata also differs: Source A leaves council approval blank; Source B contains the University Council resolution that is independently supported by the separate university memorandum.
5. Therefore Source A MUST NOT be treated as the authoritative approved curriculum baseline merely because it was the binary executed in the parser test.
6. Source A remains valid Test / Regression Evidence for PDF-byte transport, hashing, parsing, provenance and no-write assertions only.
7. Source B is the stronger controlled-source candidate for curriculum-content authority in this gate because it contains the later approval metadata and complete appendices. This is a source-priority assessment for Human Review, not an automatic canonical admission decision.

## Conflict classification

- Source-to-source content difference: `CONTENT_DIFFERENCE`
- Version/state difference: `VERSION_CONFLICT`
- Authority metadata difference: `AUTHORITY_CONTEXT_DIFFERENCE`
- Canonical overwrite decision: `PROHIBITED / HUMAN REVIEW REQUIRED`

## Required disposition before canonical import

- Obtain or mount the exact approved consolidated PDF binary represented by Source B.
- Compute SHA-256 and binary page count from that exact file.
- Run the same real-PDF binary E2E parser against Source B.
- Compare candidate programme/version/course/PLO/mapping/study-plan records against Source A and controlled reference workbooks.
- Preserve both source records and the separate authority memorandum in provenance.
- Do not overwrite or collapse the variants automatically.

## Current conclusion

`HEPE-REC-INGEST-02B2-SOURCE-01 — OPEN / RECONCILIATION REQUIRED BEFORE CANONICAL IMPORT`

`HEPE-INGEST-02B.2` remains `PASS WITH SOURCE-RECONCILIATION CONDITION` for binary parser mechanics only.

No canonical write, database mutation, schema/RLS/IAM change, production deployment, automatic evidence admission, or silent conflict resolution is authorized or performed by this record.
