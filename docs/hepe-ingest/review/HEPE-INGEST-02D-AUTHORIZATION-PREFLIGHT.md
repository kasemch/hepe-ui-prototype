# HEPE-INGEST-02D — Authorization Preflight

Status: **PREPARED / NOT AUTHORIZED FOR EXECUTION**  
Environment: **NON-PRODUCTION ONLY**  
Parent: **HEPE-INGEST-02C.2 — DESIGN / CONTRACT REVIEW COMPLETE**

## Purpose

Prepare the next gate so a Human Schema Modification Decision can authorize implementation without ambiguity. This record does not itself authorize DDL, migration, RLS change, data write, canonical import, IAM change, authority change, Production action or PR merge.

## Proposed next gate

**HEPE-INGEST-02D — NON-PRODUCTION SCHEMA EXTENSION, RLS IMPLEMENTATION, SYNTHETIC MIGRATION & LOSSLESS REGRESSION GATE**

### Proposed implementation scope

1. Additive NON-PRODUCTION schema extension sufficient to implement the approved lossless canonical contract design for:
   - academic effective periods;
   - course credit-pattern preservation;
   - curriculum course-group hierarchy/membership;
   - study-plan entries and choice semantics;
   - first-class Course→PLO I-R-M relationships;
   - mandatory source provenance binding.
2. Implement only the RLS policies necessary for the new structures, preserving the existing authority model and programme/course scope boundaries.
3. Run schema/migration precheck and verified rollback preparation.
4. Use synthetic data first.
5. Execute synthetic migration/regression before any real curriculum dry-run.
6. Run the C01–C24 regression specification.
7. A real Source-B dry-run, if included after synthetic PASS, remains NON-PRODUCTION and must not activate or publish canonical curriculum data.
8. Stop on any authority, provenance, cross-programme, rollback, or lossless-round-trip failure.

## Explicit non-scope

- Production resources
- Production deployment
- IAM modification
- authority grant/revoke
- automatic Audit Evidence admission
- silent conflict resolution
- merge of PR #30 or any subsequent PR unless separately authorized
- publication/activation of curriculum version
- treating parser/import completion as academic approval

## Required Human Authorization Wording

To authorize implementation, the Human Decision Authority should explicitly state a decision substantially equivalent to:

> **Authorize HEPE-INGEST-02D — NON-PRODUCTION Schema Extension, RLS Implementation, Synthetic Migration & Lossless Regression only, on the HEPE non-production Supabase project and controlled development branch. Authorization includes the additive schema/DDL and RLS changes required by the HEPE-INGEST-02C.2 approved design package, synthetic migration, rollback verification, and C01–C24 regression. It does NOT authorize Production action, canonical curriculum activation/publication, IAM changes, authority grant/revoke, automatic Audit Evidence admission, silent conflict resolution, or PR merge. Real Source-B use, if reached after synthetic PASS, is dry-run/controlled-import validation only and must not activate or publish canonical curriculum data.**

A generic instruction such as “ดำเนินการ”, “Next”, or “Approve” is not sufficient to expand the prior gate into Schema Modification Authorization.

## Pre-execution assertions for 02D

Before any DDL is executed, verify:
- target Supabase project identity and NON-PRODUCTION status;
- current schema snapshot;
- migration history/snapshot suitable for rollback;
- current branch HEAD and controlled design package versions;
- no newer controlled baseline supersedes HEPE-INGEST-02C.2;
- no Production target is configured for the execution path;
- no service-role/secret value is revealed or logged;
- authority/RLS design matches the Human Approval Package;
- C01–C24 regression harness is ready;
- rollback path is executable and separately testable.

## Evidence boundary

This document is a **CONTROLLED REVIEW / AUTHORIZATION-PREFLIGHT RECORD** candidate only after provenance/authority requirements are satisfied. It is not Test Evidence and it is not a schema authorization by itself.

## Current disposition

`HEPE-INGEST-02D — READY FOR EXPLICIT HUMAN SCHEMA MODIFICATION AUTHORIZATION / NOT YET AUTHORIZED`
