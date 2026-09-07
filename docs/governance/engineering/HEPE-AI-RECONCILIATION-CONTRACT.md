# HEPE AI Reconciliation Contract

Environment: NON-PRODUCTION ONLY
Gate: HEPE-GOV-COPILOT-02B

## Canonical record
Each underlying governance question uses one Reconciliation record with these fields:

- Reconciliation ID
- Question
- Reviewer/System
- Recommendation
- Supporting Evidence
- Conflict
- Controlled Baseline Impact
- Human Decision Required?
- Resolution
- Authority
- Status

## Admission and authority
AI systems may populate Recommendation, Supporting Evidence references, and Conflict analysis. They may not fabricate Human Decision, Authority, Approved status, Verified Evidence status, or Production Authorization.

Supporting Evidence must reference admissible evidence with provenance where available. If provenance is missing, classify the material as CONTEXT / DISCUSSION / UNVERIFIED INPUT.

## Conflict precedence
1. Verified System Evidence / Controlled Baseline
2. Explicit gate-scoped human Approved Decision
3. Controlled repository instructions/specifications
4. Verified repository/runtime state
5. AI recommendations, memory, comments and conversation as non-authoritative context

If an AI recommendation conflicts with a Controlled Baseline or Verified Evidence, preserve the baseline/evidence and open or update the Reconciliation Item. Do not silently rewrite the baseline.

## Deduplication rule
One underlying issue = one canonical Reconciliation ID. Multiple AI observations become attributed entries under the same record. Do not create separate findings solely because Copilot, ChatGPT, Claude, and Gemini independently report the same issue.

## Human decision rule
Human Decision Required? = YES when resolution changes a Controlled Baseline, grants authority, permits Production-sensitive action, approves consequential write/admin behavior, or resolves an unresolved governance conflict that cannot be settled by verified evidence alone.

AI consensus never changes this requirement.
