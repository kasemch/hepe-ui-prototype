# HEPE-INGEST-02C.2 — Lossless Canonical Contract Review Scope

Status: **EXECUTED — DESIGN / REVIEW / SPECIFICATION ONLY**  
Environment: **NON-PRODUCTION ONLY**  
Parent: **HEPE-INGEST-02C.1 — LOGICAL CONTRACT DESIGN MATERIALIZED**  
Canonical write/import: **NOT AUTHORIZED / NOT ATTEMPTED**  
Database mutation / DDL / migration execution: **NOT AUTHORIZED / NOT ATTEMPTED**  
RLS/IAM/authority changes: **NOT AUTHORIZED / NOT ATTEMPTED**  
Production action: **NOT AUTHORIZED / NOT ATTEMPTED**  
PR merge: **NOT AUTHORIZED / NOT ATTEMPTED**

## Purpose

Transform the HEPE-INGEST-02C.1 logical design into a human-reviewable contract-change package suitable for a later explicit schema-modification authorization, while preserving strict non-production and no-write boundaries.

## Verified starting state

- PR #30 is open, draft, not merged.
- Branch: `feat/hepe-ingest-02b-real-readonly`.
- Verified Source-B binary: 157 pages, 6,796,526 bytes.
- SHA-256: `f580fec8bb661181cbc0dff3c58473563c4b723f2dde5e863d91667ea4ec3557`.
- Programme code: `25510071103503`.
- Total credits: `151`.
- Effective academic period: `ภาคการศึกษาที่ 2 ปีการศึกษา 2567`.
- University Council: meeting 6/2567, agenda 5.13, 13 May 2567.
- HEPE-INGEST-02C remains HOLD because current contracts cannot represent Source-B losslessly.

## Read-only schema verification

Current NON-PRODUCTION Supabase contracts were inspected read-only. The relevant existing structures include `programmes`, `curriculum_versions`, `courses`, `curriculum_courses`, `outcomes`, `outcome_versions`, `outcome_mappings`, `mapping_versions`, `evidence_objects`, `evidence_versions`, and `evidence_links`. RLS is enabled on these canonical tables. No schema or row mutation occurred.

## Confirmed contract gaps

1. Course raw credit pattern is not preserved by `courses.credit_value` alone.
2. Programme-version-scoped course-group hierarchy is absent.
3. `curriculum_courses` requires a concrete course and cannot represent choice/elective/requirement placeholders losslessly.
4. `outcome_mappings` is outcome-to-outcome and therefore cannot represent Course→PLO directly without semantic distortion.
5. `curriculum_versions.effective_from` is a calendar date and cannot substitute for the source academic-period wording.
6. Existing evidence objects can store source/hash references, but field/row-level curricular provenance requires a dedicated binding contract.

## Deliverables

- Canonical contract v0.1
- Schema impact analysis
- Non-executable migration design
- RLS impact design
- Future regression specification C01–C24
- Human approval package

## Evidence classification

This scope record is a **CONTROLLED REVIEW RECORD candidate** only when its provenance/version/authority are formally admitted. The design artifacts created under this gate are **DESIGN / SPECIFICATION** or **TEST SPECIFICATION**, not Test Evidence. Conversation remains CONTEXT only.

## Stop boundary

Any actual DDL, migration execution, data write, RLS/IAM change, authority change, production action, PR merge, or Audit Evidence admission requires a separate explicit authorization.