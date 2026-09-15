# HEPE-IAM-09G.1 — Evidence Admission Register

Status: NON-PRODUCTION / CONTROLLED RECORD
Date: 2026-09-13

| Evidence ID | Evidence Type | Source | Version / Date | Authority / Owner | Relevant assertion | Verification status |
|---|---|---|---|---|---|---|
| EV-IAM-09G-01 | Verified System Evidence | Supabase project detail API | 2026-09-13 | Connected Supabase project inventory | Canonical HEPE non-production target is `lztxpjsuzqvtgyasfnyj` / HEPE Curriculum Command Center Sandbox | VERIFIED |
| EV-IAM-09F-EXACT-HEAD-01 | Test / Regression Evidence | GitHub Actions `HEPE IAM Preview Build`, run 34759607442, job 103729966492 | source SHA `ff8e3fb590614a3b5c71037239d0e6291b30f722` | GitHub Actions controlled runner | install, build, synthetic runtime and negative auth-path smoke checks | PASS / VERIFIED FOR THAT SHA |
| EV-IAM-09G-SRC-01 | Verified System Evidence | GitHub branch metadata | 2026-09-13 | `kasemch/hepe-ui-prototype` | working branch identity and exact branch head at 09G.1 starting-point verification | VERIFIED |
| EV-IAM-09G-SRC-02 | Verified System Evidence | GitHub source: `/login`, `/user-access`, `/user-access/effective-access`, `/auth/callback`, `/auth/callback/status` | 2026-09-13 branch source | Repository controlled source | IAM source preserves non-production and separation of authentication from authorization | VERIFIED SOURCE |
| EV-IAM-09G-PR-01 | Verified System Evidence | GitHub PR #40 metadata | 2026-09-13 | GitHub repository | PR open, ready for review, unmerged, branch/base binding | VERIFIED |
| EV-IAM-09G-PREVIEW-01 | Verified System Evidence | Vercel deployment inventory | 2026-09-13 | Vercel project `prj_ILMW6fZGJVhOdq1M2zKaxXmzRZcH` | latest READY IAM-branch preview found is SHA `01153f33e26e2cb18adad6ab679dc2a83cda1c2a`, not the then-current branch head | VERIFIED / NOT EXACT-HEAD |
| EV-IAM-08A2A-SRC-001 | Controlled Document / Record | `CONTROLLED-SOURCE-MANIFEST.json` on `main` | v0.1.0 / 2026-09-03 | Repository controlled source | HEPE-IAM-08A.2A source canonicalization/callback-preparation predecessor and target ref | VERIFIED CONTROLLED SOURCE |

## Non-admitted historical claims

A complete controlled repository record for HEPE-IAM-00 through HEPE-IAM-07 was not located by the 09G.1 repository search. Any detailed one-to-one mapping of those historical gate IDs is therefore classified as `UNVERIFIED HISTORICAL LINEAGE` until higher-authority controlled records are located.

## Admission rule

No conversation-only statement or prior AI summary is used here as PASS/FAIL evidence. Where exact source/runtime evidence is unavailable, status remains HOLD or UNVERIFIED.
