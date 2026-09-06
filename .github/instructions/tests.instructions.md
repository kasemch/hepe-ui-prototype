---
applyTo: "tests/**"
---
# HEPE Test Copilot Instructions
- Use synthetic data and synthetic identities by default.
- Each governance/security test must identify scope, expected result, actual result and PASS/FAIL.
- Include negative tests for relevant security, authority and isolation boundaries.
- Never perform a prohibited Production/destructive action merely to prove it is prohibited; use static, mocked or synthetic tests.
- A generated test result is not Audit Evidence until its system provenance and execution result are verified.
