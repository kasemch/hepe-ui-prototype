# HEPE-INGEST-02B.2 — Real PDF Binary Parser E2E & Provenance Validation

Status: PASS WITH SOURCE-RECONCILIATION CONDITION
Environment: NON-PRODUCTION
Execution date: 2026-09-11
Canonical write: NOT AUTHORIZED / NOT ATTEMPTED
Production action: NOT AUTHORIZED / NOT ATTEMPTED
Schema/RLS/IAM change: NOT AUTHORIZED / NOT ATTEMPTED

## Evidence record

- Evidence ID: `HEPE-EV-INGEST-02B2-E2E-20260911`
- Evidence Type: Test / Regression Evidence
- Source: uploaded controlled PDF binary `หลักสูตรสุขศึกษาและพลศึกษา 19.10.66 edit.pdf`
- Source SHA-256: `cf7623d6292e3836d81a105c75a2d47e8d0294e26b141b7ef1fb7cb1b3091afd`
- Source byte length: `1,329,575`
- PDF signature: `%PDF-` — PASS
- Binary page count: `86`
- Parser: PyMuPDF native PDF text extraction through `scripts/hepe-ingest-02b2-realpdf-e2e.py`
- Authority/Owner: Project Owner / Human Decision Authority for HEPE-INGEST-02B.2 scope
- Relevant Contract/Assertion: HEPE-INGEST-02B.2 binary-read-only assertions
- Verification Status: PASS WITH SOURCE-RECONCILIATION CONDITION

## Actual binary assertions

| Assertion | Expected | Actual | Result |
|---|---|---|---|
| PDF byte signature | `%PDF-` | `%PDF-` | PASS |
| SHA-256 from actual bytes | present | `cf7623d6292e3836d81a105c75a2d47e8d0294e26b141b7ef1fb7cb1b3091afd` | PASS |
| Binary page count | recorded, no fabrication | 86 | PASS |
| Programme code | `25510071103503` | extracted on PDF page 4 | PASS |
| Total credits | `151` | extracted on PDF pages 4 and 14 | PASS |
| Effective term | ภาคการศึกษาที่ 1 ปีการศึกษา 2567 | extracted on PDF pages 5 and 6 | PASS |
| Approval metadata in this binary | preserve source truth | University Council / สป.อว. / professional-body fields are blank | PASS |
| Missing approval values | NOT_PROVIDED / UNVERIFIED | preserved as not provided | PASS |
| Candidate provenance | page + source hash | retained | PASS |
| Canonical write | false | false | PASS |
| Database mutation | false | false | PASS |
| Schema/RLS/IAM change | false | false | PASS |
| Production action | false | false | PASS |

## Candidate/provenance observations

1. Programme code `25510071103503` is present on binary PDF page 4.
2. Total programme credits `151 หน่วยกิต` are present on pages 4 and 14.
3. Effective term `ภาคการศึกษาที่ 1 ปีการศึกษา 2567` is present on pages 5 and 6.
4. The source contains the PLO section and PLO1–PLO7 content later in the document; extraction must preserve exact wording and page provenance.
5. Page 5 contains blank fields for ก.บ.ม.ร., University Council, สป.อว., and professional-body approval. The parser did not infer or back-fill these values.

## Separate authority document received

A separate user-provided image record titled as a university memorandum communicating the University Council resolution was supplied in the same controlled workflow.

- Local image SHA-256: `bec739425c8d6ebed8dd8d6f04ffe60616e5b90f65b1482b72cb9655246b5f71`
- Visible authority metadata: University Council meeting 6/2567, agenda 5.13, dated 13 May 2567; memorandum dated 14 May 2567.
- Admission rule: this authority record is NOT silently written into blank fields in the curriculum PDF. It is linked as a separate authority/provenance record for Human Review.

## Reconciliation item

`HEPE-REC-INGEST-02B2-SOURCE-01`

The binary executed in this run is an 86-page edited curriculum PDF. A previously selected File Library source for the same programme was represented as a 157-page PDF. These two source representations MUST NOT be assumed identical or interchangeable without checksum/version reconciliation.

Required disposition before canonical import:
- identify authoritative curriculum document version;
- compare content/version/checksum;
- retain both source provenance records if both are valid records;
- do not overwrite one source with the other automatically.

## Gate conclusion

`HEPE-INGEST-02B.2 — PASS WITH SOURCE-RECONCILIATION CONDITION`

This PASS applies only to the real-PDF binary read-only mechanics: actual bytes -> signature/hash -> native PDF parsing -> candidate extraction -> page/source provenance -> validation -> review package boundary.

It does NOT authorize or assert:
- canonical import/write;
- production deployment;
- schema/RLS/IAM changes;
- automatic evidence admission;
- approval by สป.อว. or a professional body;
- automatic resolution of the 86-page versus 157-page source-version difference.
