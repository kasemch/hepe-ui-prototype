# HEPE-INGEST-02A — Synthetic Parser Prototype Build

Status: AUTHORIZED FOR NON-PRODUCTION SYNTHETIC-ONLY PROTOTYPE BUILD

Scope:
- Synthetic fixtures only
- PDF/DOCX/XLSX parser prototype
- Candidate dataset output only
- Validation and conflict detection only
- Human-review package generation only
- No real curriculum import
- No canonical registry write
- No schema/RLS/IAM change
- No production deployment
- No authority/evidence admission action

Parent specifications:
- HEPE-INGEST-01 — Curriculum Source Intake & Structured Extraction Contract
- HEPE-INGEST-01A — Canonical Curriculum Import Data Dictionary & Mapping Specification
- HEPE-INGEST-01B — Controlled XLSX Import Template + PDF/DOCX Extraction Mapping Contract
- HEPE-INGEST-01C — Curriculum Parser Logical Architecture + Extraction Pipeline & Validation Engine Contract
- HEPE-INGEST-01D — Parser Implementation Specification, Test Fixture Set & Synthetic Curriculum Acceptance Matrix

Security invariant:
The parser MUST stop at candidate/review output and MUST NOT possess or invoke a canonical curriculum write path.

Evidence note:
This file records the implementation scope in source control. Test specifications are not Test/Regression Evidence until executed with expected result, actual result and PASS/FAIL status.
