# HEPE-INGEST-02B.3 — Authoritative Source-B Binary Reconciliation & Controlled Candidate Package

Environment: **NON-PRODUCTION ONLY**  
Mode: **REAL CONTROLLED PDF BINARY / READ-ONLY / EVIDENCE-FIRST**  
Canonical write: **NOT AUTHORIZED / NOT ATTEMPTED**  
Database mutation: **NOT AUTHORIZED / NOT ATTEMPTED**  
Schema/RLS/IAM change: **NOT AUTHORIZED / NOT ATTEMPTED**  
Production action: **NOT AUTHORIZED / NOT ATTEMPTED**

## Gate classification

**HEPE-INGEST-02B.3 = PASS — SOURCE-B BINARY IDENTITY, PARSER E2E & SOURCE RECONCILIATION VERIFIED; CANONICAL ADMISSION NOT AUTHORIZED**

Conversation is not admitted as audit evidence.

## Evidence A — exact Source-B controlled PDF binary

- Evidence ID: `HEPE-EV-INGEST-02B3-SOURCEB-01`
- Evidence Type: Controlled Document / Record + Test / Regression Evidence
- Source: Google Drive stored PDF `มคอ.2 หลักสูตรศึกษาศาสตรบัณฑิต สาขาสุขศึกษาและพลศึกษา (4 ปี) (หลักสูตรปรับปรุง พ.ศ.2567).pdf`
- Google Drive file ID: `1tCG4mCxW7DaPBJaAofb76ibEv-K5_9Ud`
- Drive recorded size: `6,796,526` bytes
- Downloaded binary byte length: `6,796,526`
- Binary SHA-256: `f580fec8bb661181cbc0dff3c58473563c4b723f2dde5e863d91667ea4ec3557`
- PDF signature: `%PDF-` — PASS
- Binary page count: `157`
- Parser: `PyMuPDF native PDF text extraction`
- Source modified timestamp from Drive metadata: `2026-06-16T06:56:06.240Z`
- Relevant contract/assertion: HEPE-INGEST-02B.3 Source-B binary identity and read-only candidate extraction
- Verification Status: **PASS**

### Binary/parser assertions

| Assertion | Expected | Actual | Result |
|---|---|---|---|
| Exact PDF binary available | yes | mounted from stored Drive file | PASS |
| PDF byte signature | `%PDF-` | `%PDF-` | PASS |
| SHA-256 from exact bytes | present | `f580fec8...4ec3557` | PASS |
| Binary page count | 157 | 157 | PASS |
| Programme code | `25510071103503` | PDF page 4 | PASS |
| Total credits | 151 | pages 4, 14 and later appendix/study-plan pages | PASS |
| Effective term | ภาคการศึกษาที่ 2 ปีการศึกษา 2567 | PDF page 5 | PASS |
| University Council approval | meeting 6/2567, agenda 5.13, 13 May 2567 | PDF page 5 | PASS |
| PLO section | PLO1-PLO7 present | pages 67-68; mapping references continue later | PASS |
| Curriculum mapping | present | pages 75, 91, 108 and subsequent mapping material | PASS |
| สป.อว. approval field | preserve source truth | blank / NOT_PROVIDED_IN_PDF | PASS |
| Professional-body approval field | preserve source truth | blank / NOT_PROVIDED_IN_PDF | PASS |
| Canonical write | false | false | PASS |
| Database/schema/RLS/IAM/Production mutation | false | false | PASS |

Machine runner used: `scripts/hepe-ingest-02b3-sourceb-e2e.py`.

## Candidate/provenance observations from Source B

1. Programme identity is present on PDF page 4 and states programme code `25510071103503` and 151 credits.
2. Curriculum status on PDF page 5 states the revised curriculum B.E. 2567 is effective in semester 2 / academic year 2567.
3. The same page records University Council meeting 6/2567, agenda 5.13, dated 13 May 2567.
4. PLO1-PLO7 are explicitly stated beginning on PDF page 67. The parser does not synthesize or paraphrase them into canonical records in this gate.
5. Curriculum mapping material is physically present in the consolidated source, including course-to-PLO material in the later document sections; candidate extraction must retain page provenance.
6. The PDF preserves blank สป.อว. and professional-body fields. This gate does not infer those approvals from any other source.

## Evidence B — separate authority memorandum

- Evidence ID: `HEPE-EV-INGEST-02B3-AUTH-01`
- Evidence Type: Controlled Document / Record
- Source: Google Drive PDF `มติสภา ศษ.สุขศึกษาฯ 67.pdf`
- Drive file ID: `1Cy_kNv8zXpl58dwBsBta9CaQT-r06NYb`
- Byte length: `378,400`
- SHA-256: `7e24a21d71e1c6854881c17d1ff784613ec11bfb5532b84a2714339e0824aca9`
- PDF signature: `%PDF-` — PASS
- Page count: 1
- Visible document date: 14 May 2567
- Visible referenced University Council decision: meeting 6/2567, agenda 5.13, 13 May 2567, approving the revised B.Ed. Health and Physical Education curriculum B.E. 2567
- Verification Status: **PASS — visually verified controlled authority record**

This memorandum is maintained as separate authority provenance and is not used to overwrite any blank field in another source automatically.

## Source A ↔ Source B reconciliation

Source A (86-page edited PDF) remains valid only as parser-transport/test evidence with SHA-256 `cf7623d6292e3836d81a105c75a2d47e8d0294e26b141b7ef1fb7cb1b3091afd`.

Source B is now binary-verified as the 157-page consolidated curriculum representation. The comparison verifies:

| Dimension | Source A | Source B | Classification |
|---|---|---|---|
| PDF pages | 86 | 157 | CONTENT / REPRESENTATION DIFFERENCE |
| SHA-256 | `cf7623...91afd` | `f580fe...3557` | DISTINCT BINARY VERSIONS |
| Programme code | 25510071103503 | 25510071103503 | MATCH |
| Total credits | 151 | 151 | MATCH |
| Effective term | semester 1/2567 | semester 2/2567 | VERSION CONFLICT — Source B later approved state |
| Council approval fields | blank | meeting 6/2567, agenda 5.13, 13 May 2567 | AUTHORITY CONTEXT DIFFERENCE |
| Complete appendices/mapping | incomplete relative to B | consolidated through 157 pages | Source B stronger controlled curriculum-content source |

## Controlled workbook comparison

The accessible `RU-HEPE ฐานข้อมูลหลักสูตรและผู้สอน พ.ศ. 2567` workbook identifies the same B.Ed. Health and Physical Education curriculum, treats HED/PED courses as the department-controlled course set, and contains course rows consistent with Source-B curriculum examples such as HED1501, HED1502, HED2501-HED2504, HED3501-HED3505 and HED3701-HED3702. This comparison is **supporting consistency evidence only**; the workbook is not substituted for the approved curriculum PDF.

## Reconciliation disposition

`HEPE-REC-INGEST-02B2-SOURCE-01` may be closed for the specific question of **which document representation is the stronger approved consolidated curriculum source**:

- Source A = parser/test source variant.
- Source B = exact 157-page consolidated approved curriculum source, binary identity verified and independently supported by the separate University Council memorandum.

This disposition does **not** itself admit Source B into a production/canonical database and does not authorize import, overwrite, schema change, Production deployment, or automatic evidence admission.

## Final boundary

**HEPE-INGEST-02B.3 PASS applies to binary identity, provenance, read-only parser extraction, source comparison, and authority reconciliation only.**

Canonical curriculum admission/write remains a separate Human Authority gate.
