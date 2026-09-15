# HEPE-REC-INGEST-02B2-SOURCE-01 — Source Reconciliation Status

Status: CLOSED — SOURCE B RAW BINARY VERIFIED / SAME-PARSER E2E PASS
Environment: NON-PRODUCTION
Date: 2026-09-11
Scope: READ / EXTRACT / NORMALIZE / VALIDATE / COMPARE / HUMAN REVIEW ONLY
Canonical write/import: NOT AUTHORIZED
Production: NOT AUTHORIZED

## Reconciliation objective

Determine whether the 86-page edited PDF and the 157-page curriculum source are the same authoritative curriculum version, a draft/final pair, or different controlled representations before any future canonical import decision.

## Source A — executed binary

- File: `หลักสูตรสุขศึกษาและพลศึกษา 19.10.66 edit.pdf`
- Raw binary available to execution runtime: YES
- Binary page count: 86
- SHA-256: `cf7623d6292e3836d81a105c75a2d47e8d0294e26b141b7ef1fb7cb1b3091afd`
- Programme code: `25510071103503`
- Total credits: 151
- Effective term stated in source: ภาคการศึกษาที่ 1 ปีการศึกษา 2567
- University Council approval fields in this source: blank
- สป.อว. / professional-body fields: blank
- Structural observation: the table of contents references appendices beyond the physical end of the binary. Source A is therefore retained as parser-mechanics Test / Regression Evidence and not selected as the complete controlled curriculum representation.

## Source B — exact 157-page raw binary

- Provider: connected Google Drive
- Google Drive file ID: `1tCG4mCxW7DaPBJaAofb76ibEv-K5_9Ud`
- Title: `มคอ.2 หลักสูตรศึกษาศาสตรบัณฑิต สาขาสุขศึกษาและพลศึกษา (4 ปี) (หลักสูตรปรับปรุง พ.ศ.2567).pdf`
- Raw PDF binary handed to execution runtime: YES
- Provider/runtime byte length: 6,796,526 bytes
- PDF signature: `%PDF-` — PASS
- Physical page count: 157 — PASS
- SHA-256: `f580fec8bb661181cbc0dff3c58473563c4b723f2dde5e863d91667ea4ec3557`
- Programme code: `25510071103503`
- Total credits: 151
- Effective term: ภาคการศึกษาที่ 2 ปีการศึกษา 2567
- University Council metadata on physical page 5: meeting 6/2567, agenda 5.13, 13 May 2567
- สป.อว. / professional-body fields in this binary: blank / not provided
- PLO section detected on physical pages 103–108
- Appendices and later curriculum material extend beyond Source A's physical end.

## Same-parser E2E result

The original 02B.2 harness contained a source-specific assumption hard-coding Source A's effective term. Running it unchanged against Source B produced a controlled FAIL on that assertion while `%PDF`, SHA-256, 157 pages, programme code, credits and PLO extraction succeeded. This exposed a test-harness defect, not a Source B defect.

The harness was repaired to extract the effective term and approval metadata from the source binary rather than assuming semester 1/2567. Repair commit: `b7418fcae07ff975d8e295864cf97e11d595ee04`.

After repair, the same read-only binary harness produced:

- Source A binary E2E: PASS
- Source B binary E2E: PASS
- Source A effective term: semester 1 / 2567
- Source B effective term: semester 2 / 2567
- Source A pages: 86
- Source B pages: 157
- Binary hashes: different

Detailed Test / Regression Evidence: `HEPE-EV-INGEST-02B2-SOURCE-B-BINARY-20260911`.

## Verified comparison

| Assertion | Source A — 86-page binary | Source B — 157-page binary | Reconciliation result |
|---|---|---|---|
| Programme identity | Health & Physical Education B.Ed. 4-year | same | MATCH |
| Programme code | 25510071103503 | 25510071103503 | MATCH |
| Total credits | 151 | 151 | MATCH |
| Curriculum version label | revised 2567 | revised 2567 | MATCH |
| Effective term | semester 1 / 2567 | semester 2 / 2567 | CONTENT DIFFERENCE |
| University Council metadata | blank | 6/2567, agenda 5.13, 13 May 2567 | CONTENT DIFFERENCE |
| Physical extent | 86 pages | 157 pages | REPRESENTATION DIFFERENCE |
| Appendix completeness | incomplete against own TOC | later material physically present | CONTENT COMPLETENESS DIFFERENCE |
| SHA-256 | `cf7623...b3091afd` | `f580fe...4ec3557` | DIFFERENT BINARY |
| Same-parser E2E | PASS | PASS | PARSER MECHANICS VERIFIED |

## Human-authority disposition within authorized gate

The project owner previously directed that the exact approved 157-page PDF be run through the same parser, compared against the 86-page representation, and the reconciliation then be closed before any import step. The verified binary result satisfies that instructed closure condition.

Disposition:

1. `HEPE-REC-INGEST-02B2-SOURCE-01` is CLOSED.
2. Source B is selected as the controlled 157-page curriculum representation for any future import-candidate review.
3. Source A remains retained as Test / Regression Evidence for parser mechanics and as a superseded/incomplete representation for reconciliation history; it is not silently deleted or overwritten.
4. This closure does NOT admit Source B curriculum content into the Audit Evidence Set automatically.
5. This closure does NOT authorize canonical import/write, production, DB mutation, schema/RLS/IAM change, authority change, or deployment.
6. Any future import must open a separate explicit import/admission gate and preserve Source B SHA-256 and provenance.

Verification Status: `CLOSED / SOURCE-B RAW BINARY VERIFIED / SAME-PARSER E2E PASS / NO CANONICAL WRITE`
