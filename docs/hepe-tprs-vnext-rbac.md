# HEPE-TPRS vNext RBAC Contract

The event ledger follows deny-by-default governance.

- Learner/client UI: no direct canonical ledger INSERT/UPDATE/DELETE.
- Verifier UI: no direct canonical ledger mutation; scoped reads only when required by an authorized workflow.
- Server workflow: append through the controlled persistence function after the domain transaction succeeds.
- Audit/admin: read access must remain scoped by the existing authorization model.
- UPDATE/DELETE: prohibited at database level for all normal application workflows.

The migration intentionally introduces no broad application grants. Before applying it to an isolated Neon branch, inspect current role ownership/default privileges and explicitly verify that no public/client role inherits unintended table mutation rights.

External xAPI/LRS credentials and transmission are out of scope and disabled by absence: no sender implementation is included.
