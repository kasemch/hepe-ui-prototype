# A10 Role-Based Experience — controlled prototype

A10 introduces pure permission-decision functions and synthetic fixtures, not institutional authorization. Role cards must not operate as an identity switch. Even simulated APPROVE, official EXPORT and SUBMIT remain denied. Server-side identity, scoped assignments, RLS and transitions must be verified before enabling live actions.

Contract: canView, canEdit, canSubmit, canReview, canApprove and canExport consume an explicit AuthorityContext. The UI merely displays decisions; it cannot grant access. ADMIN does not inherit academic APPROVE authority. Executive is read-only.

Current fixtures are synthetic for HED3505 / HEPE. Do not pass them into production authorization.