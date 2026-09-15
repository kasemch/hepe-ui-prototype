# HEPE-INGEST-02B.2 / 02B.3 — Binary E2E Preflight Record

Status: EXCEPTION STOP — SOURCE-B BINARY HANDOFF REQUIRED

Date: 2026-09-11
Environment: NON-PRODUCTION

Controlled Source-B target:
- File Library ID: `file_0000000034e4820b91cb824a711da702`
- Title: มคอ.2 หลักสูตรศึกษาศาสตรบัณฑิต สาขาสุขศึกษาและพลศึกษา (4 ปี) (หลักสูตรปรับปรุง พ.ศ.2567).pdf
- File Library parser exposes 157 parsed pages.
- Programme code represented in controlled records: `25510071103503`.
- Total credits represented in controlled records: `151`.
- Effective term represented in controlled records: ภาคการศึกษาที่ 2 ปีการศึกษา 2567.
- University Council approval represented in controlled records: ครั้งที่ 6/2567 วาระที่ 5.13 วันที่ 13 พฤษภาคม 2567.

Preflight implementation:
- Binary signature and SHA-256 harness exists at `scripts/hepe-ingest-02b2-binary-preflight.mjs`.
- Real-PDF parser contract exists at `scripts/hepe-ingest-02b2-realpdf-e2e.py`.
- Gate contract exists at `docs/hepe-ingest/HEPE-INGEST-02B.2-SCOPE.md`.

Execution blocker:
The current File Library interface exposes parsed text/multimodal document content and controlled reference records but does not expose the exact 157-page Source-B PDF byte stream or a mounted binary file path to the execution runner. Under HEPE evidence admission and no-fabrication rules, parsed text MUST NOT be reconstructed into a fake PDF or substituted with a proposal PDF, spreadsheet, DOCX registry, conversation summary or the already-hashed 86-page Source-A variant.

Current verified observations:
- Source-B existence/content context is supported by controlled records.
- Exact Source-B binary SHA-256 is NOT YET VERIFIED.
- Exact Source-B byte length is NOT YET VERIFIED.
- Exact Source-B binary page count is NOT YET VERIFIED.
- Source-B parser E2E is NOT EXECUTED.
- Source-A binary mechanics remain `PASS WITH SOURCE-RECONCILIATION CONDITION` and are not promoted to Source-B authority.

Required next condition:
Mount or otherwise expose the exact controlled 157-page PDF binary to the execution environment. Once available, continue automatically within the READ-ONLY gate:
actual bytes -> PDF signature -> SHA-256 -> byte/page count -> parser -> candidate records -> page provenance -> Source-A/reference comparison -> Human Review Package -> STOP.

Current classifications:
- `HEPE-INGEST-02B.2 = PASS WITH SOURCE-RECONCILIATION CONDITION` for Source-A binary parser mechanics only.
- `HEPE-INGEST-02B.3 = EXCEPTION STOP — SOURCE-B BINARY PROVENANCE REQUIRED`.
- canonical import = NOT AUTHORIZED.

No canonical write, DB mutation, schema/RLS/IAM change, Production action, automatic evidence admission, silent conflict resolution or PR merge occurred.
