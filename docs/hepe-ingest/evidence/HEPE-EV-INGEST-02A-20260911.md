# HEPE-EV-INGEST-02A-20260911

Evidence Type: Test / Regression Evidence
Source: GitHub Actions — HEPE-INGEST-02A Synthetic Parser Acceptance
Source Run IDs: 34573809536 (push), 34573812615 (pull_request)
Source Commit SHA: 55a7f7962d3fd80780733caaa3c82770ac31bc48
Version/Date: HEPE-INGEST-02A synthetic parser prototype / 2026-09-11
Authority/Owner: HEPE Project Owner; automated execution by GitHub Actions
Relevant Contract/Assertion: HEPE-INGEST-01D ING-D01 through ING-D20, plus ING-X01 through ING-X03 extension assertions
Verification Status: VERIFIED — SYNTHETIC / NON-PRODUCTION ONLY

## Scope boundary

- NON-PRODUCTION ONLY
- SYNTHETIC FIXTURES ONLY
- PDF/DOCX/XLSX logical synthetic extraction paths
- Candidate/review output only
- No real curriculum import
- No canonical curriculum write
- No schema/RLS/IAM change
- No production deployment
- No authority or Audit Evidence admission action by parser

## Executed result

Contractual tests: 20
Extension tests: 3
Total executed: 23
PASS: 23
FAIL: 0
canonicalWriteAttempted: false
Scope boundary check: PASS
HEPE Copilot Governance Check on same head SHA: SUCCESS

## Contractual assertions

ING-D01 valid synthetic XLSX candidate generation — PASS
ING-D02 valid synthetic DOCX candidate generation — PASS
ING-D03 valid synthetic PDF provenance preservation — PASS
ING-D04 duplicate source detection by checksum — PASS
ING-D05 unsupported XLSX template version blocked — PASS
ING-D06 missing Programme rejected — PASS
ING-D07 duplicate PLO rejected — PASS
ING-D08 duplicate Course rejected — PASS
ING-D09 valid credit notation accepted — PASS
ING-D10 study-plan credit mismatch rejected — PASS
ING-D11 invalid I-R-M rejected — PASS
ING-D12 broken PLO reference rejected — PASS
ING-D13 unknown study-plan Course rejected — PASS
ING-D14 low-confidence extraction routed to human review — PASS
ING-D15 unreadable source blocked without fabrication — PASS
ING-D16 AI-assisted extraction remains unverified and routes to human review — PASS
ING-D17 repeated identical input is semantically idempotent — PASS
ING-D18 parser-version change is recorded for reprocessing comparison — PASS
ING-D19 human correction preserves extracted value and source provenance — PASS
ING-D20 parser does not attempt canonical write — PASS

## Extension assertions

ING-X01 PDF/DOCX/XLSX normalized semantics equivalent — PASS
ING-X02 content conflict requires human reconciliation — PASS
ING-X03 synthetic fixture classification remains explicit — PASS

## Admission boundary

This record supports only the HEPE-INGEST-02A synthetic non-production prototype assertions listed above. It does not authorize or evidence real-curriculum extraction, canonical import, production deployment, schema modification, RLS/IAM modification, or production data write.
