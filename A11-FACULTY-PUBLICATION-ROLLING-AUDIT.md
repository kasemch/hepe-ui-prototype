# HEPE academic publication rolling eligibility dashboard — controlled pilot

Route: /faculty-publications. Identity: Panya Putsorn, academic_person_id 10102cb3-3395-41a0-a3ff-73ad53c63fff (Supabase verified person registry). Publication examples are external/controlled-document fixtures, NOT yet a verified publication registry. No Supabase writes.

## Sources
- มคอ.2 (7), p.86: TNCP2017 2560 pp.338–347 and Tennis 1 textbook 2559 ISBN 978-616-414-095-0.
- หลักสูตรวิทยาศาสตร์การกีฬา ปรับปรุง 2565 เล่มประทับตรา / มคอ.2 (8): 2564 journal Vol.5 No.1 pp.89–102.
- EDULEARN22: bibliographic DOI 10.21125/edulearn.2022.1976; original full paper, exact date and conference organizer compliance require policy review.
- Official undergraduate academic programme regulation 2565 §10.1.1: at least one qualifying work in 5 years; only publication component evaluated, not overall faculty qualification.
- HEI full-paper date consideration: https://www.ops.go.th/th/ches-resolutions/meeting-important/item/5669-6
- Undergraduate standard: https://www.ops.go.th/th/role/edu-standard/item/6942-2022-07-22-03-17-22
- Proceedings regulatory clarification: https://ops.go.th/th/all-announcement/circular/download/3563/9958/16; check temporal applicability before counting.

## As-of 2569 calendar or demonstration academic-year grouping
Records: 4 historical works; in period 2565–2569: one 2565 international proceedings candidate. Count verified against every criterion: 0; pending policy/evidence: 1; out of period: 3. Therefore show **PENDING REVIEW, not NOT QUALIFIED**. Absence of a recent work in the four-item fixture is not proof of absence of publications. Fiscal 2569 5-year window starts 2021-10-01 and ends 2026-09-30; precise publication date is needed and never substituted with a conference start date. Academic year mode currently grouped by BE year only and must be explicitly marked demonstration pending academic calendar.

## Next-phase full system architecture
- publication_records: normalized scholarly identifiers DOI/ISBN/URL, canonical title, author aliases, venue, full paper/abstract, publication and acceptance dates, research classification, publication type; one work per canonical ID.
- publication_authorship: scoped person/work match, verified name variant and human adjudication.
- publication_evidence: originating URL/source document/page, immutable version/hash, evidence-level, review.
- rule_set_versions: institution-approved level/programme/category, permitted types, minimum number, lookback definition, source and effective date.
- assessment_runs + assessment_rows: as-of date, academic/calendar/fiscal window, rule version, exact reason per work, exclusions/duplicate handling.
- review_decisions: signer, academic authority and audit; no LLM issuing VERIFIED or APPROVED.
- programme snapshots: calculate qualified individuals separately, not distinct-work count alone; do not infer overall compliance from only research output.
- Explicit lifecycle: DISCOVERED → EVIDENCE_REVIEW → RULE_REVIEW → HUMAN_CONFIRMED → QUALIFIED_FOR_REPORT; never auto-promote.
- Outputs: teacher timeline, programme aggregate, source links, evidence-to-rule matrix, QA reports with review date and reproducibility.

## Acceptance / hold
No production authorization, new schema/RLS, data write, main merge, actual person qualification verdict or automatic emails. Vercel deployment rate-limited as previously verified; source implementation alone is not a tested live page. Exact-head preview READY and HTTP 200 remain required.
