# HEPE-INGEST-02B — Controlled Real Curriculum Read-Only Extraction Pilot

Status: AUTHORIZED FOR NON-PRODUCTION CONTROLLED REAL-DOCUMENT READ-ONLY PILOT

## Authorized scope
- Real controlled curriculum documents may be used only when provenance, version/date, source authority/owner, and document status are identifiable.
- Allowed operations: READ / EXTRACT / NORMALIZE / VALIDATE / COMPARE / HUMAN REVIEW PACKAGE.
- Parser output remains candidate data only.
- Comparison may use a read-only controlled canonical snapshot/reference where available.
- All extracted values remain UNVERIFIED until human review.
- Conflicts must be surfaced for reconciliation; no silent overwrite.

## Explicit prohibitions
- No canonical curriculum write or import.
- No database mutation of canonical curriculum records.
- No schema migration or schema modification.
- No RLS or IAM modification.
- No authority grant/revoke.
- No Audit Evidence admission by parser or AI.
- No production deployment or production authorization.
- No automatic resolution of source/version/authority conflicts.

## Preconditions for each real source
Before processing, record at minimum:
- source_document_id
- file name/type
- document title
- programme/curriculum version
- source/version/date
- authority/owner
- document status
- checksum
- ingestion batch id
- verification status

If provenance or authority is incomplete, classify the source as CONTEXT / UNVERIFIED INPUT and do not use it to support a PASS/FAIL gate conclusion.

## Human authority boundary
Extraction verification is separate from import approval. HEPE-INGEST-02B authorizes read-only extraction and comparison only. It does not authorize HEPE canonical import.

## Dependency
This gate is stacked on HEPE-INGEST-02A synthetic parser prototype evidence. The 02B branch was created from the 02A implementation head and remains dependent on 02A integration/closure.

## Evidence note
A successful parser run on a real document is not automatically Audit Evidence. Any evidence admission must independently satisfy the HEPE Audit Evidence Admission Rule.
