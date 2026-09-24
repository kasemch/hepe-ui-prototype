# A12 — หลักสูตรปรับปรุง พ.ศ. 2570 / Faculty five-year council-date prototype
STATUS: NON-PRODUCTION DESIGN/CONTROLLED PREVIEW. **No actual council approval date is currently evidenced**. Choosing a date in the UI is a hypothetical scenario, not a verified council decision.

## Purpose
Support a future 2570 curriculum readiness assessment with a five-year window anchored to the council approval date, when the date and applicable institutional method are confirmed. System does not infer date from the curriculum year, nor from submission/effective/publication dates. Current official rule selection still needs university QA/academic authority review; official undergraduate standard 2565 is linked in UI.

## Model / date method
- Accept valid Gregorian ISO date only and constrain illustrative selector to calendar 2027.
- Proposed continuous interval is (five-year anniversary, council date], e.g. hypothetical 2027-06-15 -> 2022-06-16 to 2027-06-15, inclusive. This is a **configurable proposal**, not a final interpretation of every applicable regulation.
- A five-year date span can intersect SIX named calendar years because the first and last years are partial. Display ALL intersecting years, not the five full-numbered calendar years only. It is never a replacement for date-level eligibility.
- Every work must have credible publication/accepted-full-paper date as allowed by the applicable rule, exact original evidence, author matching, classification and authorized reviewer decision before becoming VERIFIED_COUNTABLE. Metadata year alone never becomes verified.
- Dates in boundary year remain unresolved if only BE year is known; outside years are excluded without inventing dates.
- No self-approval by user editing date: approvalStatus=UNCONFIRMED hard-coded in demo, persisted authority/evidence required in the eventual backend.
- For individual result, no overall eligibility inference from publication component only. If date unverified -> PENDING_APPROVAL_DATE; if no verified work and incomplete evidence -> PENDING_EVIDENCE; confirmed insufficiency requires complete authoritative register and valid rule set, NOT absence from sample.
- Case person: Panya Putsorn from Supabase academic_people ID 10102cb3-3395-41a0-a3ff-73ad53c63fff, verified controlled document. Four historic works from separate controlled-document/bibliographic fixture; not authoritative publications register.
- Rule year/approval date cannot be auto-promoted to published curriculum or institutional official status.

## Evidence requirements before adoption
1. Signed council resolution (date, resolution number, file, verified hash).
2. Institutional interpretation of the five-year period and reference date (legal/QA approval with version).
3. Programme type, degree and approved applicable standard; special professional/teacher requirements separately.
4. Each person's qualification, appointment and course role date separately verified.
5. Each work: original, author match, actual date, type/indexing and policy relevance, deduplicate DOI/ISBN.
6. Authorized reviewer, signed decision and audit trail.
7. Complete per-person work register before any INSUFFICIENT_VERIFIED_WORKS decision.

## Scope and checks
UI route /faculty-publications/2570, linked from /faculty-publications. Pure engine app/lib/publications/council-2570.ts.
No Supabase writes, schema, RLS, login authority, production/public release or official export; PR #61 Draft and main merge HOLD.
Preview acceptance requires exact-head READY and HTTP 200 route. The public share link from an older preview may not include this new route.
