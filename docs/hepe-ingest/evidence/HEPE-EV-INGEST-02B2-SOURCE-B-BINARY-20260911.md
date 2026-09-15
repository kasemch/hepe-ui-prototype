# HEPE-EV-INGEST-02B2-SOURCE-B-BINARY-20260911

Evidence ID: `HEPE-EV-INGEST-02B2-SOURCE-B-BINARY-20260911`
Evidence Type: Test / Regression Evidence
Environment: NON-PRODUCTION
Gate: `HEPE-INGEST-02B.2 — Real PDF Binary Parser E2E & Provenance Validation`
Date: 2026-09-11
Authority/Owner: Project Owner / Human Decision Authority for the authorized read-only gate
Relevant Assertion: exact Source B raw binary fingerprint + same-parser candidate/provenance comparison
Verification Status: `PASS — RAW BINARY EXECUTED / SOURCE RECONCILIATION CLOSURE ELIGIBLE`

## Source B raw-binary provenance

- Provider: connected Google Drive
- Google Drive file ID: `1tCG4mCxW7DaPBJaAofb76ibEv-K5_9Ud`
- Title: `มคอ.2 หลักสูตรศึกษาศาสตรบัณฑิต สาขาสุขศึกษาและพลศึกษา (4 ปี) (หลักสูตรปรับปรุง พ.ศ.2567).pdf`
- MIME type: `application/pdf`
- Provider file size: 6,796,526 bytes
- Runtime byte length: 6,796,526 bytes
- PDF signature: `%PDF-` — PASS
- Physical page count: 157 — PASS
- SHA-256: `f580fec8bb661181cbc0dff3c58473563c4b723f2dde5e863d91667ea4ec3557`
- Parser: PyMuPDF native PDF text extraction

## Candidate records extracted from raw binary

| Candidate | Value | Provenance |
|---|---|---|
| Programme code | `25510071103503` | physical page 4 |
| Total credits | `151` | physical pages 4, 14, 135–142 |
| Effective term | `ภาคการศึกษาที่ 2 ปีการศึกษา 2567` | physical page 5 |
| PLO section | present | physical pages 103–108 |
| University Council agenda | `5.13` | physical page 5 |
| University Council date | `13 พฤษภาคม 2567` | physical page 5 |
| สป.อว. approval field | blank / not provided in this binary | physical page 5 |
| Professional-body approval field | blank / not provided in this binary | physical page 5 |

The raw page-5 text also states University Council meeting `6/2567`; the first source-neutral harness revision did not fully normalize that token because of dotted formatting in the PDF text layer. This is a parser-normalization limitation, not a source-content absence, and does not affect the mandatory binary identity assertions.

## Same-parser comparison against Source A

Source A: `หลักสูตรสุขศึกษาและพลศึกษา 19.10.66 edit.pdf`

| Assertion | Source A | Source B | Result |
|---|---|---|---|
| SHA-256 | `cf7623d6292e3836d81a105c75a2d47e8d0294e26b141b7ef1fb7cb1b3091afd` | `f580fec8bb661181cbc0dff3c58473563c4b723f2dde5e863d91667ea4ec3557` | DIFFERENT BINARY |
| Physical pages | 86 | 157 | DIFFERENT REPRESENTATION |
| Programme code | 25510071103503 | 25510071103503 | MATCH |
| Total credits | 151 | 151 | MATCH |
| Effective term | semester 1 / 2567 | semester 2 / 2567 | CONTENT DIFFERENCE |
| Binary E2E assertions | PASS | PASS | PARSER MECHANICS PASS |

## Harness finding and repair

The original 02B.2 harness hard-coded Source A's effective term (`semester 1 / 2567`). Running that unchanged harness against Source B correctly produced `binaryE2EAssertions=FAIL` solely because the source-specific hard-coded term was absent. This exposed a test-harness defect rather than a Source B defect.

The harness was therefore generalized to extract the effective term and approval metadata from the binary instead of assuming Source A values. Repository repair commit: `b7418fcae07ff975d8e295864cf97e11d595ee04`.

After the source-neutral repair, Source B binary E2E result: `PASS`.

## Safety / write-boundary assertions

- `canonicalWriteAttempted=false`
- `databaseMutationAttempted=false`
- `schemaRlsIamChangeAttempted=false`
- `productionActionAttempted=false`
- No automatic Audit Evidence admission was performed.
- No source was silently overwritten or promoted to canonical data.

## Disposition

The exact 157-page Source B raw binary is now fingerprinted and has passed the same-parser read-only E2E after removal of the source-specific test-harness assumption. The binary evidence confirms that Source A and Source B are materially different representations of the same programme identity, and Source B is the complete 157-page representation consistent with the controlled-content record used for this reconciliation.

This evidence supports closure of `HEPE-REC-INGEST-02B2-SOURCE-01` only. It does not authorize canonical import, production deployment, schema/RLS/IAM changes, or Audit Evidence admission of curriculum content.
