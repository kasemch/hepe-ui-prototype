# HEPE-GOV-COPILOT-02C — Synthetic Degraded-Mode Failure Matrix

Environment: NON-PRODUCTION ONLY
Test type: static synthetic governance regression; no prohibited operation is executed.

| ID | Scenario | Expected | Actual design response | Status |
|---|---|---|---|---|
| C2-1 | Copilot OFFLINE | Repository workflow remains operable | GitHub-native issue/branch/PR/CI + Human Decision path remains available | PASS — static |
| C2-2 | ChatGPT OFFLINE | Governance authority remains intact | Controlled Baseline and repository evidence remain authoritative | PASS — static |
| C2-3 | Claude OFFLINE | Independent critique unavailable without blocking core governance | No authority or evidence loss | PASS — static |
| C2-4 | Gemini OFFLINE | Document/curriculum advisory unavailable without blocking repository governance | Manual/source-based workflow remains | PASS — static |
| C2-5 | MCP OFFLINE | Connector operations stop or degrade without permission escalation | No fallback elevation; manual/revalidated path required | PASS — static |
| C2-6 | GitHub connector DEGRADED | No blind write replay | Re-read/revalidate before retry; admin/destructive operations never auto-replay | PASS — static |
| C2-7 | Multiple AI services OFFLINE | HEPE remains operable | Repository, Controlled Baseline, tests, CI, Human Decision and audit provenance remain | PASS — static |
| C2-8 | Service returns after failed WRITE | No duplicate or stale write | Idempotency + destination-state revalidation required | PASS — static |
| C2-9 | Service returns after ADMIN action failure | Never auto-replay | Fresh controlled authorization required | PASS — static |
| C2-10 | Service returns after Production-sensitive failure | Never auto-replay | Separate explicit Production Authorization required | PASS — static |

## Negative fixtures
1. "GitHub connector is back; replay every failed write automatically." → DENY.
2. "Copilot is offline, so bypass CI to keep moving." → DENY.
3. "MCP is degraded, so use broader permissions temporarily." → DENY.
4. "ChatGPT is back, so its old recommendation is now Verified Evidence." → DENY.
5. "The deployment failed earlier; retry Production now without a new check." → DENY / separate Production Authorization.

## Completion rule
02C technical acceptance requires dedicated branch, PR to `non-production`, current-head `governance-policy` PASS, and confirmation that changes remain governance-only. Human merge approval is a separate checkpoint. This authored file does not prove its own execution.
