# HEPE-IAM Gate Lineage Reconciliation

Status: NON-PRODUCTION / CONTROLLED RECONCILIATION RECORD / PARTIAL
Date: 2026-09-13
Scope: HEPE-IAM-09G.1

## Evidence basis

Verified controlled source on `main` contains `HEPE-IAM-08A.2A-SRC-001` in `CONTROLLED-SOURCE-MANIFEST.json`, with authority scope limited to source canonicalization and callback implementation preparation. The current IAM branch contains the 09A–09G architecture/gate contract.

Repository code search performed during 09G.1 surfaced the controlled 08A.2A artifact but did not surface controlled repository records for the complete historical sequence HEPE-IAM-00 through HEPE-IAM-08.

Accordingly, this reconciliation must not invent one-to-one mappings for historical gates that are not traceable in controlled source.

## Lineage map

| Legacy gate / artifact | Current gate | Purpose / relationship | Evidence status | Reconciliation status |
|---|---|---|---|---|
| HEPE-IAM-00–07 | 09A–09G | Historical IAM work is known to precede the current architecture sequence, but exact gate-by-gate mapping is not proven from current controlled repository evidence. | UNVERIFIED HISTORICAL LINEAGE | OPEN |
| HEPE-IAM-08A.2A | 09C / 09F prerequisite lineage | Source canonicalization and auth callback implementation preparation; predecessor technical source package supporting the later login/callback work. It is not renamed or superseded. | VERIFIED CONTROLLED SOURCE | RECONCILED |
| HEPE-IAM-09A | current | Role / Authority / Scope Contract | CONTROLLED BRANCH RECORD | CURRENT |
| HEPE-IAM-09B | current | User & Access logical model | CONTROLLED BRANCH RECORD | CURRENT |
| HEPE-IAM-09C | current | Login + Invitation UX Contract | CONTROLLED BRANCH RECORD | CURRENT |
| HEPE-IAM-09D | current | Email template / delivery contract | CONTROLLED BRANCH RECORD | CURRENT |
| HEPE-IAM-09E | current | RLS / Effective Permission Mapping | CONTROLLED BRANCH RECORD | CURRENT |
| HEPE-IAM-09F | current | Synthetic build/runtime regression | VERIFIED TEST EVIDENCE AVAILABLE | CURRENT |
| HEPE-IAM-09G | current | Controlled real-user pilot authorization gate | CONTROLLED BRANCH RECORD | CURRENT |

## Reconciliation decision

- Historical identifiers are preserved; no renumbering is performed.
- `HEPE-IAM-08A.2A` is treated as predecessor source/callback preparation evidence, not as an automatic substitute for 09A–09G.
- A complete 00–08 → 09A–09G one-to-one crosswalk cannot be admitted from current repository evidence.

`RI-IAM-09G-02 = OPEN — EVIDENCE INSUFFICIENT FOR COMPLETE HISTORICAL CROSSWALK`

This open item does not invalidate current 09A–09G source/test evidence, but it prevents claiming that the entire historical numbering lineage has been fully reconciled.