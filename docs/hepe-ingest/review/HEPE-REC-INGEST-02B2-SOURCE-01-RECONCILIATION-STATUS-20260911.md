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
- Important structural observation: the table of contents references appendices beyond the physical end of the binary. This is consistent with an edited/incomplete representation and MUST NOT be treated as proof of the complete controlled curriculum.

## Source B — directly inspected 157-page File Library source

- File Library object ID: `file_00000000373481fa9046f1584c01190d`
- Display title: `หลักสูตรศึกษาศาสตรบัณฑิต สาขาสุขศึกษาและพลศึกษา (4 ปี) 2567.pdf`
- Programme: หลักสูตรศึกษาศาสตรบัณฑิต สาขาวิชาสุขศึกษาและพลศึกษา (4 ปี) (หลักสูตรปรับปรุง พ.ศ. 2567)
- File Library page count observed directly: 157 pages
- Raw PDF binary available to execution runtime: NO
- SHA-256: NOT AVAILABLE — MUST NOT BE FABRICATED
- Programme code: `25510071103503`
- Total credits: 151
- Effective term stated in source: ภาคการศึกษาที่ 2 ปีการศึกษา 2567
- University Council approval stated in source: ครั้งที่ 6/2567 วาระที่ 5.13 วันที่ 13 พฤษภาคม 2567
- สป.อว. / professional-body fields in inspected source: blank
- Table of contents directly inspected: main curriculum through printed page 87; Appendix A begins printed page 89; Appendix B 121; Appendix C 123; Appendix D 129; Appendix E 131; Appendix F 140.
- This source was directly inspected through File Library multimodal/full-document access on 2026-09-11. This establishes document/content identity and page extent, but does NOT establish byte identity or SHA-256.

## Verified content-level comparison

| Assertion | 86-page binary | 157-page directly inspected source | Reconciliation result |
|---|---|---|---|
| Programme identity | Health & Physical Education B.Ed. 4-year | same | MATCH |
| Programme code | 25510071103503 | 25510071103503 | MATCH |
| Total credits | 151 | 151 | MATCH |
| Curriculum version label | revised 2567 | revised 2567 | MATCH |
| Effective term | semester 1 / 2567 | semester 2 / 2567 | CONTENT DIFFERENCE |
| University Council metadata | blank | 6/2567, agenda 5.13, 13 May 2567 | CONTENT DIFFERENCE |
| Physical / represented extent | 86 binary pages | 157 File Library pages | VERSION / REPRESENTATION DIFFERENCE |
| Appendix completeness | source ends before referenced later appendices | appendices represented through Appendix F | CONTENT COMPLETENESS DIFFERENCE |
| Raw SHA-256 | available | unavailable | BINARY COMPARISON BLOCKED |

## Authority and admission boundary

The direct inspection materially strengthens Source B as the curriculum-content authority candidate. It does NOT by itself admit Source B into an Audit Evidence Set, does NOT replace an Evidence Admission decision, and does NOT authorize canonical import. File Library page/content access is not a substitute for raw-byte fingerprinting when the gate requires SHA-256 and same-parser binary E2E.

## File Library duplicate caution

More than one File Library object may have a similar title. Matching parsed content or titles alone does not prove byte identity. The object ID above is now the designated Source B identity for this reconciliation until the exact raw binary is handed to the parser runtime.

## Current disposition

1. Source A remains valid Test / Regression Evidence for real-PDF binary mechanics only.
2. Source B is the stronger controlled-source candidate for curriculum-content authority and its 157-page identity, key metadata, approval metadata and appendix extent have been directly inspected.
3. Source A and Source B MUST NOT be merged, overwritten, or automatically promoted to canonical data.
4. Reconciliation CANNOT be closed until the exact Source B raw binary is available and the same parser records `%PDF` signature, SHA-256, physical page count, candidate records and provenance.
5. No canonical import, production action, schema/RLS/IAM change, authority change, or automatic Audit Evidence admission is authorized by this record.

## Required closure execution

`exact Source B raw bytes -> %PDF signature -> SHA-256 -> physical page count -> same real-PDF parser -> candidate records -> source/page provenance -> semantic comparison against Source A -> conflict matrix -> Human Review disposition -> reconciliation close/retain decision`

## Binary handoff acceptance rule

A future file may close the blocker only if all of the following are verified: programme code `25510071103503`; 157 physical pages; curriculum title/version match Source B; key page-5 approval metadata matches; appendices extend through Appendix F; and raw SHA-256 is calculated from the handed-off bytes. Any mismatch opens a new source identity/reconciliation item instead of silently replacing Source B.

Verification Status: `OPEN / SOURCE-B CONTENT IDENTITY VERIFIED / RAW-BINARY HASH AND SAME-PARSER CLOSURE BLOCKED`
