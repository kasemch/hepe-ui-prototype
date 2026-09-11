# HEPE-INGEST-02B.2 — Real PDF Binary Parser E2E & Provenance Validation Gate

Status: AUTHORIZED FOR NON-PRODUCTION CONTROLLED REAL-PDF READ-ONLY E2E

Environment: NON-PRODUCTION ONLY

Allowed pipeline:
REAL CONTROLLED PDF BYTES -> checksum/fingerprint -> PDF adapter -> structural parse -> candidate records -> provenance validation -> validation engine -> conflict comparison -> human-review package -> STOP

Allowed:
- read controlled real curriculum PDF bytes
- compute checksum/fingerprint
- extract text/table structure without modifying source
- generate candidate records only
- attach source page/table/row/block provenance
- validate candidate structure/references
- compare read-only against controlled reference snapshot
- generate human-review package

Not allowed:
- canonical curriculum import/write
- database mutation
- schema/RLS/IAM modification
- authority grant/revoke
- production deployment
- automatic evidence admission
- silent conflict resolution
- source modification

Target controlled source:
- Title: มคอ.2 หลักสูตรศึกษาศาสตรบัณฑิต สาขาสุขศึกษาและพลศึกษา (4 ปี) (หลักสูตรปรับปรุง พ.ศ.2567).pdf
- File Library reference: file_0000000034e4820b91cb824a711da702
- Pages observed by File Library parser: 157
- Programme code observed: 25510071103503
- Programme: Bachelor of Education Program in Health and Physical Education
- Institution: Ramkhamhaeng University

Binary admission precondition:
The E2E run MUST receive the actual PDF byte stream or a connector-provided file mount. Parsed text, File Library snippets, conversation content, or manually reconstructed text MUST NOT be substituted for PDF binary input.

Mandatory assertions:
1. Input is PDF binary and has %PDF signature.
2. SHA-256 is computed from actual bytes.
3. Parser source ref preserves binary checksum and page-level locator.
4. Programme code 25510071103503 is extractable with provenance.
5. Total programme credits 151 are extractable with provenance.
6. Approval metadata from curriculum document is represented as candidate/unverified data, not authority granted by parser.
7. Any blank/unavailable external approval field remains NOT_PROVIDED/UNVERIFIED; no fabrication.
8. Comparison against QMS reference is read-only.
9. Differences become review/conflict items; no silent overwrite.
10. Human-review package is produced.
11. canonicalWriteAttempted = false.
12. No database/schema/RLS/IAM/production action occurs.

Evidence rule:
This gate SHALL NOT be marked PASS until an executed binary run records input hash, parser version, expected result, actual result, and PASS/FAIL for each mandatory assertion.
