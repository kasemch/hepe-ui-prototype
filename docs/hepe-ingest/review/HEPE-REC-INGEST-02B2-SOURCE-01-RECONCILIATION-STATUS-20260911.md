# HEPE-REC-INGEST-02B2-SOURCE-01 — Source Reconciliation Status

Status: OPEN — 157-PAGE RAW BINARY REQUIRED BEFORE CLOSURE
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
- Important structural observation: the table of contents references appendices at printed pages 99, 106, 108, 117, 132 and 143 although the actual PDF binary contains only 86 physical pages. This is consistent with an edited/incomplete representation and MUST NOT be treated as proof of the complete controlled curriculum.

## Source B — 157-page File Library representation

- Programme: หลักสูตรศึกษาศาสตรบัณฑิต สาขาวิชาสุขศึกษาและพลศึกษา (4 ปี) (หลักสูตรปรับปรุง พ.ศ. 2567)
- File Library parsed length: 157 pages
- Raw PDF binary available to execution runtime: NO
- SHA-256: NOT AVAILABLE — MUST NOT BE FABRICATED
- Programme code: `25510071103503`
- Total credits: 151
- Effective term stated in source: ภาคการศึกษาที่ 2 ปีการศึกษา 2567
- University Council approval stated in source: ครั้งที่ 6/2567 วาระที่ 5.13 วันที่ 13 พฤษภาคม 2567
- สป.อว. / professional-body fields in inspected source: blank
- Appendices represented through at least printed page 140 and parsed document length 157 pages.

## Verified content-level comparison

| Assertion | 86-page binary | 157-page parsed source | Reconciliation result |
|---|---|---|---|
| Programme identity | Health & Physical Education B.Ed. 4-year | same | MATCH |
| Programme code | 25510071103503 | 25510071103503 | MATCH |
| Total credits | 151 | 151 | MATCH |
| Curriculum version label | revised 2567 | revised 2567 | MATCH |
| Effective term | semester 1 / 2567 | semester 2 / 2567 | CONTENT DIFFERENCE |
| University Council metadata | blank | 6/2567, agenda 5.13, 13 May 2567 | CONTENT DIFFERENCE |
| Physical / represented extent | 86 binary pages | 157 parsed pages | VERSION / REPRESENTATION DIFFERENCE |
| Appendix completeness | table of contents points beyond binary end | appendices represented to later pages | CONTENT COMPLETENESS DIFFERENCE |
| Raw SHA-256 | available | unavailable | BINARY COMPARISON BLOCKED |

## File Library duplicate caution

More than one File Library object has been observed with a title corresponding to the 157-page curriculum. Matching parsed content or titles alone does not prove byte identity. Each valid controlled source must retain its own source object identity until raw-byte checksum reconciliation is possible.

## Current disposition

1. Source A remains valid Test / Regression Evidence for real-PDF binary mechanics only.
2. Source B has stronger document-level indicators for curriculum completeness and University Council approval metadata, but its raw bytes have not been handed to the binary execution environment.
3. The two sources MUST NOT be merged, overwritten, or automatically promoted to canonical data.
4. Reconciliation CANNOT be closed until Source B raw binary is available and the same parser records `%PDF` signature, SHA-256, physical page count, candidate records and provenance.
5. No canonical import, production action, schema/RLS/IAM change, authority change, or automatic Audit Evidence admission is authorized by this record.

## Required closure execution

`157-page PDF raw bytes -> %PDF signature -> SHA-256 -> physical page count -> same real-PDF parser -> candidate records -> source/page provenance -> semantic comparison against Source A -> conflict matrix -> Human Review disposition -> reconciliation close/retain decision`

Verification Status: `OPEN / CONTENT DIFFERENCES VERIFIED / RAW-BINARY CLOSURE BLOCKED`
