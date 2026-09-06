---
applyTo: "app/auth/**"
---
# HEPE Auth / IAM Copilot Instructions
- NON-PRODUCTION by default; use synthetic identities/test data unless separately authorized.
- Never send real onboarding email, change SMTP, grant academic/system authority, or expose/log tokens, authorization codes, PKCE verifiers, secrets or credentials without explicit gate-scoped authority.
- Preserve PKCE and existing security controls; never weaken auth controls for test convenience.
- Auth callback changes require positive and negative-path tests where technically applicable.
- Schema/data writes, real-user onboarding and Production actions require separate explicit authorization.
- Work branch/PR-only and record expected/actual/PASS/FAIL for security-boundary tests.
