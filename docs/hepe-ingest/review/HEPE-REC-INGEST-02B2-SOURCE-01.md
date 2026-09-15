# HEPE-REC-INGEST-02B2-SOURCE-01 — Source Reconciliation Record

Status: **RESOLVED FOR SOURCE IDENTITY / AUTHORITY RECONCILIATION — CANONICAL ADMISSION NOT AUTHORIZED**
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
- Role: real-PDF parser/test source variant; valid Test / Regression Evidence for PDF-byte transport, hashing, parsing and no-write assertions.

### Source B — exact consolidated curriculum source
- File: `มคอ.2 หลักสูตรศึกษาศาสตรบัณฑิต สาขาสุขศึกษาและพลศึกษา (4 ปี) (หลักสูตรปรับปรุง พ.ศ.2567).pdf`
- Google Drive file ID: `1tCG4mCxW7DaPBJaAofb76ibEv-K5_9Ud`
- Downloaded binary byte length: `6,796,526`
- Binary SHA-256: `f580fec8bb661181cbc0dff3c58473563c4b723f2dde5e863d91667ea4ec3557`
- Binary pages: 157
- Programme code: `25510071103503` — PDF page 4
- Total credits: 151 — PDF pages 4 and 14, with later study-plan/appendix repetitions
- Effective term: ภาคการศึกษาที่ 2 ปีการศึกษา 2567 — PDF page 5
- University Council approval: meeting 6/2567, agenda 5.13, 13 May 2567 — PDF page 5
- PLO1-PLO7 section begins on PDF page 67
- Curriculum mapping material is present in the consolidated source, including later course-to-PLO tables
- Role: stronger approved consolidated curriculum-content source; exact binary identity verified under HEPE-INGEST-02B.3.

### Separate authority record
- File: `มติสภา ศษ.สุขศึกษาฯ 67.pdf`
- Google Drive file ID: `1Cy_kNv8zXpl58dwBsBta9CaQT-r06NYb`
- Byte length: `378,400`
- SHA-256: `7e24a21d71e1c6854881c17d1ff784613ec11bfb5532b84a2714339e0824aca9`
- Binary pages: 1
- Visible memorandum date: 14 May 2567
- Visible referenced resolution: University Council meeting 6/2567, agenda 5.13, 13 May 2567, approving the revised B.Ed. Health and Physical Education curriculum B.E. 2567.
- This record remains separate authority provenance and is not silently written into any blank external-approval field.

## HEPE-INGEST-02B.3 executed binary verification — 2026-09-11

The exact Source-B 157-page PDF binary was located in connected Google Drive, streamed to the controlled execution environment, hashed from the actual bytes, and parsed with the same native-PDF read-only contract.

Verified results:
- `%PDF-` byte signature = PASS
- SHA-256 = `f580fec8bb661181cbc0dff3c58473563c4b723f2dde5e863d91667ea4ec3557`
- byte length = `6,796,526`
- binary page count = `157`
- programme code `25510071103503` = page 4 / PASS
- 151 total credits = pages 4 and 14 / PASS
- effective term semester 2 / 2567 = page 5 / PASS
- University Council meeting 6/2567, agenda 5.13, 13 May 2567 = page 5 / PASS
- PLO section = present / PASS
- curriculum mapping material = present / PASS
- สป.อว. and professional-body approval fields remain blank in the curriculum PDF and are preserved as NOT_PROVIDED_IN_PDF
- canonical write = false
- database mutation = false
- schema/RLS/IAM change = false
- Production action = false

Machine runner: `scripts/hepe-ingest-02b3-sourceb-e2e.py`.
Controlled run record: `docs/hepe-ingest/runs/HEPE-INGEST-02B.3-SOURCE-B-BINARY-E2E-20260911.md`.

## Reconciliation findings

1. Source A and Source B are distinct binary/document versions, not interchangeable copies.
2. They refer to the same programme code and 151-credit curriculum family.
3. Source A states semester 1/2567 and has blank council fields; Source B states semester 2/2567 and carries University Council approval metadata.
4. Source B contains the consolidated 157-page representation with complete later sections/appendices and mapping material absent from the shorter Source-A representation.
5. The separate one-page university memorandum independently corroborates the council meeting/agenda/date and curriculum approval represented in Source B.
6. Source A remains admissible Test / Regression Evidence for parser mechanics only and MUST NOT be promoted as the approved consolidated curriculum baseline.
7. Source B is now binary-verified as the stronger approved consolidated curriculum source for subsequent controlled human-admission review.
8. Derived spreadsheets/workbooks remain supporting comparison evidence only; they do not replace Source-B binary provenance.

## Conflict disposition

- Source-to-source content difference: `CONFIRMED / EXPLAINED BY DISTINCT VERSION REPRESENTATIONS`
- Version/state difference: `RESOLVED FOR SOURCE PRIORITY — SOURCE B REPRESENTS LATER APPROVED CONSOLIDATED STATE`
- Authority metadata difference: `RESOLVED FOR SOURCE PRIORITY — SOURCE B + SEPARATE COUNCIL MEMORANDUM`
- Source-B binary provenance: `VERIFIED`
- Canonical overwrite/import decision: `NOT AUTHORIZED / SEPARATE HUMAN AUTHORITY GATE REQUIRED`

## Current conclusion

`HEPE-INGEST-02B.3 = PASS — SOURCE-B BINARY IDENTITY, PARSER E2E & SOURCE RECONCILIATION VERIFIED; CANONICAL ADMISSION NOT AUTHORIZED`

`HEPE-REC-INGEST-02B2-SOURCE-01 = RESOLVED FOR SOURCE IDENTITY / AUTHORITY RECONCILIATION`

`HEPE-INGEST-02B.2` remains `PASS WITH SOURCE-RECONCILIATION CONDITION` for Source-A binary parser mechanics; that condition is now satisfied by the Source-B reconciliation record, without granting canonical import authority.

No canonical write, database mutation, schema/RLS/IAM change, Production deployment, automatic evidence admission, silent overwrite, or PR merge is authorized or performed by this record.
