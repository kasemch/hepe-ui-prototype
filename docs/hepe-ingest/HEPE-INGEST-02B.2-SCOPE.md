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
- Google Drive file ID verified in HEPE-INGEST-02B.3: `1tCG4mCxW7DaPBJaAofb76ibEv-K5_9Ud`
- Binary pages verified: 157
- Binary byte length verified: 6,796,526
- Binary SHA-256 verified: `f580fec8bb661181cbc0dff3c58473563c4b723f2dde5e863d91667ea4ec3557`
- Programme code observed and binary-verified: 25510071103503
- Programme: Bachelor of Education Program in Health and Physical Education
- Institution: Ramkhamhaeng University

Binary admission precondition:
SATISFIED by HEPE-INGEST-02B.3 exact Source-B binary retrieval and hash verification. Parsed text, File Library snippets, conversation content, manually reconstructed text, spreadsheets or DOCX records remain prohibited substitutes for PDF binary input.

Mandatory assertions:
1. Input is PDF binary and has %PDF signature.
2. SHA-256 is computed from actual bytes.
3. Parser source ref preserves binary checksum and page-level locator.
4. Programme code 25510071103503 is extractable with provenance.
5. Total programme credits 151 are extractable with provenance.
6. Approval metadata from curriculum document is represented as candidate/controlled document content; parser does not grant authority.
7. Any blank/unavailable external approval field remains NOT_PROVIDED/UNVERIFIED; no fabrication.
8. Comparison against controlled references is read-only.
9. Differences become review/conflict items; no silent overwrite.
10. Human-review package / controlled run record is produced.
11. canonicalWriteAttempted = false.
12. No database/schema/RLS/IAM/production action occurs.

Evidence rule:
The Source-A 86-page run remains historical Test / Regression Evidence for parser mechanics. Source-B exact-binary verification is recorded separately in `docs/hepe-ingest/runs/HEPE-INGEST-02B.3-SOURCE-B-BINARY-E2E-20260911.md` and the reconciliation record. Canonical admission/import remains a separate Human Authority gate.
