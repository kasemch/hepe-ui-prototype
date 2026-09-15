# HEPE-INGEST-02B.1 — First Real Curriculum Read-Only Extraction Run

Status: EXECUTED — READ-ONLY PILOT / HUMAN REVIEW REQUIRED
Environment: NON-PRODUCTION
Source: HEPE-SRC-BED-HPE-2567-MKO2-01
Comparison reference: HEPE-REF-BED-HPE-2567-QMS-v1.1
Canonical write/import: NOT ATTEMPTED / NOT AUTHORIZED
Database mutation: NOT ATTEMPTED

## Run method

This first controlled real-document run used the actual File Library PDF source and extracted/retrieved source text from the real curriculum document, then compared selected curriculum assertions against the existing QMS v1.1 workbook as a read-only comparison reference. This run did not pass the binary PDF file through the repository parser adapter executable; therefore it validates the real-document read/extract/compare governance path and selected semantic outputs, but it is not yet evidence that the repository binary parser adapter can ingest this PDF end-to-end.

## Selected extraction scope

1. Programme identity and curriculum code
2. Degree / programme title
3. Total credits
4. Effective term
5. University Council approval metadata
6. PLO set PLO1–PLO7
7. Curriculum structure totals
8. Selected course-level semantic comparison
9. Provenance completeness and conflict handling

## Extracted source assertions and comparison

| Assertion | Real PDF source | QMS v1.1 comparison reference | Result |
|---|---|---|---|
| Curriculum code | 25510071103503 | 25510071103503 | MATCH |
| Programme TH | หลักสูตรศึกษาศาสตรบัณฑิต สาขาวิชาสุขศึกษาและพลศึกษา (4 ปี) | same | MATCH |
| Programme EN | Bachelor of Education Program in Health and Physical Education | same | MATCH |
| Curriculum version | หลักสูตรปรับปรุง พ.ศ. 2567 | same | MATCH |
| Total credits | 151 | 151 | MATCH |
| Effective term | ภาคการศึกษาที่ 2 ปีการศึกษา 2567 | same | MATCH |
| General Education | 24 credits | 24 credits | MATCH |
| Specialized Courses | 121 credits | 121 credits | MATCH |
| Teaching Profession | 42 credits | 42 credits | MATCH |
| Major Courses | 79 credits | 79 credits | MATCH |
| Health Education major total | 39 credits | 39 credits | MATCH |
| Physical Education major total | 40 credits | 40 credits | MATCH |
| Free Electives | 6 credits | 6 credits | MATCH |
| PLO count | 7 | 7 | MATCH |

## PLO semantic verification

The comparison workbook records PLO1–PLO7 with source references to printed page 64 / PDF page 67 and marks the records Pending Review. Real-source retrieval independently confirmed the curriculum PLO section and exact/near-exact semantic text for PLO3–PLO7, including:

- PLO3: application of concepts/principles/theory/content in the major to design and develop basic-education learning, K3.
- PLO4: practice of Health and Physical Education learning management, assessment and teaching techniques, S2.
- PLO5: ethics, teacher professional ethics, public-mindedness and teacher identity, A5.
- PLO6: teacher characteristics, creativity, participation, leadership, social responsibility, Growth Mindset and lifelong learning, C.
- PLO7: teaching-profession practice in schools, classroom management and parent/community relationships, S3.

No semantic conflict was identified in the inspected PLO subset. Full byte-for-byte verification of all PLO text is deferred to the binary-parser execution stage.

## Selected course-level comparison

HED2503 was selected as a known controlled example. Existing controlled/reference data identifies HED2503 เพศวิถีศึกษา / Sexuality Education as a 3-credit course using credit notation 3(3-0-6). This is consistent with the curriculum-derived QMS data and other controlled HEPE course references. No canonical record was changed by this run.

## Approval provenance finding

The PDF states University Council approval at meeting 6/2567, agenda 5.13, dated 13 May 2567. The inspected PDF copy leaves the สป.อว. recognition/acknowledgement date fields blank. This is retained as source-state information and is not silently completed from conversation or memory.

Finding ID: HEPE-FND-INGEST-02B1-001
Type: PROVENANCE / EXTERNAL-RECOGNITION FIELD INCOMPLETE IN SOURCE COPY
Severity: INFORMATIONAL for this READ-ONLY extraction pilot
Disposition: HUMAN REVIEW / do not infer later recognition status from this source copy

## Human review package

Review items:
- HR-01 Confirm that HEPE-SRC-BED-HPE-2567-MKO2-01 is the intended university-authoritative curriculum copy for subsequent parser binary testing.
- HR-02 Confirm whether an externally acknowledged/updated source copy exists if สป.อว. recognition metadata is required for a later admission/import gate.
- HR-03 Review the extracted Programme, Curriculum Structure and PLO candidate semantics before any later controlled import gate.
- HR-04 Keep QMS v1.1 as comparison reference only while its records remain Pending Review.

## Run result

READ: PASS
EXTRACT selected assertions: PASS
NORMALIZE selected assertions: PASS
COMPARE selected assertions: PASS
CONFLICT handling: PASS — no silent resolution
HUMAN REVIEW PACKAGE: GENERATED
CANONICAL WRITE: NOT ATTEMPTED
REAL-DOCUMENT BINARY PARSER ADAPTER E2E: NOT EXECUTED IN THIS RUN

Overall: PASS WITH CONDITION — HEPE-INGEST-02B.1 real-document read/extract/compare pilot completed for the selected semantic scope. Condition: a later controlled run must pass the actual source PDF bytes through the repository parser adapter before claiming binary-parser E2E acceptance.

## Evidence classification

This record may support a controlled read-only pilot finding because it identifies source, version/date, owner/authority visible in the document, assertions inspected and verification status. It does not authorize canonical curriculum admission/import and does not extend to production.
