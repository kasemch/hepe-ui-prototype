# HEPE-MANUAL-05A — Authenticated Visual Acceptance & Screenshot Capture

Project: HEPE Curriculum Governance & Development
Environment: NON-PRODUCTION ONLY
Branch: docs/hepe-manual-04-help-tour-blueprint
Baseline: feat/hepe-pilot-master-01 @ 259baf896a34c89d0e974520f564bbec2e9269f3
Rendered-capture head: e18cded2e1dacc984927f4567349c1bb3b210ddd
PR: #38 (DRAFT / NOT MERGED)

## Gate objective

Validate the HEPE Help Center and Guided Tour on the protected Preview, capture the P0 screenshot library, verify keyboard/focus/contrast/overflow behavior, and prepare the visual-ready Quick Start package before any merge consideration.

## Protected Preview rendered capture

A dedicated GitHub Actions runner reused the existing Vercel automation bypass secret without changing Vercel protection settings. The runner verified the exact Preview SHA and NON-PRODUCTION boundary before browser execution.

Workflow run: 34755124056
Job: visual-capture
Conclusion: SUCCESS
Artifact: hepe-manual-05a-visual-capture-e18cded2e1dacc984927f4567349c1bb3b210ddd
Artifact digest: sha256:b7a819dd8861bdd2e233926e44dc45959d1166608600a9aa4fd2063a43838517
Retention: 14 days

The browser run produced 18 real rendered PNG captures across Desktop 1440x900 and Mobile 390x844 plus a machine-readable visual-capture-report.json.

Important scope boundary: Vercel Protection was bypassed for automation only. No HEPE authenticated application session was created. No IAM mutation, database write, authority grant, or Production action was performed.

## Rendered browser results

Automated assertions for every admitted route/state:
- HTTP response: PASS
- NON-PRODUCTION boundary visible: PASS
- Horizontal overflow: none detected
- axe WCAG 2A/2AA serious/critical violations: 0
- Desktop capture: PASS
- Mobile capture: PASS
- Guided Tour opens in rendered browser: PASS
- Focus enters the tour dialog: PASS
- Escape closes the tour dialog: PASS

Captured rendered screens:
- SS-CMD-01 — My Academic Workspace
- SS-COURSE-01 — My Courses
- SS-LRN-01 — Learning & Teaching
- SS-ASM-01 — Assessment
- SS-EVD-01 — Evidence
- SS-PLAN-01 — Plan vs Actual
- SS-TRC-01 — PLO / CLO Traceability
- SS-HELP-01 — Help Center
- SS-TOUR-01 — Guided Tour desktop
- SS-TOUR-02 — Guided Tour mobile

For RLS-protected academic screens, the captured state is AUTH_REQUIRED because no HEPE application session was created. This is accepted as fail-closed rendered evidence, but it is not a substitute for authenticated VERIFIED-state screenshots.

## Human visual review

Manually reviewed rendered PNGs confirm:
- Help Center desktop hierarchy is clear and visually consistent with HEPE.
- Help Center mobile collapses cleanly to one column with readable cards.
- Guided Tour modal is readable on desktop and mobile.
- NON-PRODUCTION / TEST DATA ONLY boundary remains prominent.
- Help / Guided Tour controls remain visible without apparent clipping.
- My Courses AUTH_REQUIRED state is explicit and does not fabricate or fallback to privileged course data.
- No obvious horizontal clipping or unreadable layout was observed in the sampled rendered captures.

## Keyboard/focus review

The tour implementation includes:
- focus move into dialog on open;
- Tab / Shift+Tab containment inside tour controls;
- Escape-to-close;
- focus restoration to Guided Tour launcher;
- aria-haspopup=dialog and aria-expanded;
- aria-describedby and explicit close-button accessible name.

These semantics are covered by the 21-check build regression and focus/Escape behavior was also exercised in the rendered browser run.

## Contrast calculation

Static CSS color-pair calculations:
- #173956 on #ffffff = 11.96:1 — PASS WCAG AA normal text.
- #667085 on #ffffff = 4.97:1 — PASS WCAG AA normal text.
- #245f8f on #ffffff = 6.76:1 — PASS WCAG AA normal text.
- #dceaf3 on #0b2540 = 12.64:1 — PASS.
- #f2d39b on #071728 = 12.53:1 — PASS.
- #315f80 on #eaf2f8 = 6.03:1 — PASS.
- #645538 on #fff8e9 = 6.85:1 — PASS.

These remain calculated CSS contrast checks; full WCAG conformance is not claimed.

## Remaining authenticated capture set

Still pending because it requires a HEPE application session and current gate does not authorize IAM/identity mutation:
- SS-COURSE-01 — VERIFIED authenticated course list state
- SS-COURSE-02 — Course Workspace
- SS-ENTRY-01A — Quick Entry full view
- SS-ENTRY-01B — Teaching entry
- SS-ENTRY-01C — Assessment evidence entry
- SS-ENTRY-01D — Save-success state
- SS-LRN-01 — VERIFIED authenticated teaching state
- SS-ASM-01 — VERIFIED authenticated assessment state
- SS-EVD-01 — VERIFIED authenticated evidence state
- SS-PLAN-01 — authenticated plan/actual state
- SS-TRC-01 — authenticated traceability state

## Gate verdict

IMPLEMENTATION / BUILD / STRUCTURAL ACCESSIBILITY: PASS.
PROTECTED-PREVIEW RENDERED VISUAL ACCEPTANCE: PASS.
HELP CENTER + GUIDED TOUR DESKTOP/MOBILE VISUAL ACCEPTANCE: PASS.
FAIL-CLOSED AUTH_REQUIRED RENDERING: PASS.
AUTHENTICATED HEPE VERIFIED-STATE CAPTURE: PENDING SEPARATE AUTHORIZATION / EXISTING NON-MUTATING SESSION.
SCREENSHOT LIBRARY v1.0: PARTIAL RENDERED SET AVAILABLE; authenticated workflow images pending.
PR #38: REMAINS DRAFT / NOT MERGED.

This record is project-controlled context. Admission as Audit Evidence requires the project evidence-admission process and explicit provenance/authority handling.