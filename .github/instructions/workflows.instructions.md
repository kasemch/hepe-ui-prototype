---
applyTo: ".github/workflows/**"
---
# HEPE Workflow Copilot Instructions
- Apply least-privilege GitHub Actions permissions.
- Never place plaintext secrets/credentials in workflows, logs, fixtures or generated documentation.
- No Production deployment, Production database write, academic/system authority grant, SMTP change or real-user onboarding without separate explicit authorization.
- Workflow changes must use branch/PR change control and be tested before acceptance.
- Do not bypass CI/review to repair a failing workflow; repair the defect or open a Finding.
- Validate critical third-party actions and pin versions/SHAs where proportionate to risk.
