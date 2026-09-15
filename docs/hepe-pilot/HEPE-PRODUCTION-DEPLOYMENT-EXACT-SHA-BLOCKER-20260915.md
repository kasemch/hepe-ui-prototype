# HEPE Production Deployment Exact-SHA Blocker — 2026-09-15

Status: CONTROLLED RECORD / PRODUCTION DEPLOYMENT AUTHORIZED FOR EXACT SHA ONLY / DEPLOYMENT NOT YET EXECUTED

## Authorization
Human authority explicitly authorized Production Deployment for exact application SHA:
`435dbdd6786663d9cd9523bea2fc0bbeae509152`

This authorization is exact-SHA bounded. No substitute SHA, rebuild from a different branch, or different repository may be treated as authorized.

## Verified target deployment
Vercel deployment:
- Deployment ID: `dpl_HyWT31D1ymtMehgNqZbweTrY1upz`
- State: READY
- Target: preview / null
- Git repository: `kasemch/hepe-ui-prototype`
- Git ref: `rc/hepe-preprod-20260915`
- Git SHA: `435dbdd6786663d9cd9523bea2fc0bbeae509152`

A second READY deployment with the same exact SHA also exists (`dpl_89oCUBCfJ6WdjDA5y3siRFMfo7Vj`).

## Production routing conflict discovered before promotion
Current Vercel production alias resolves to deployment `dpl_N9pARUKeeRZssER2jThEJX81BzLQ`, whose metadata identifies:
- repository: `kengkasem/academic-work-os`
- branch: `main`
- SHA: `20d3ea8c8a5a3efb12f83b95f066baaa5392ecd4`

This does not match the authorized HEPE repository or exact SHA.

## Fail-closed decision
No Production deployment/promotion was executed through the available connector because the connector does not expose Vercel's existing-deployment promote operation and its generic deploy action cannot prove exact-SHA preservation.

Vercel documentation identifies the correct exact-deployment operation as promotion of an existing deployment without rebuild (`vercel promote <deployment-url>` / POST `/v10/projects/{projectId}/promote/{deploymentId}`).

Until that exact promotion is executed and verified:
- Production deployment status = NOT EXECUTED
- Production alias remains unchanged
- Audit Evidence Admission = NOT_ADMITTED
- No substitute SHA is authorized

## Required controlled next action
Promote `dpl_HyWT31D1ymtMehgNqZbweTrY1upz` (exact SHA `435dbdd6786663d9cd9523bea2fc0bbeae509152`) to Production using Vercel's Promote action, then verify production deployment metadata, route response, and runtime errors.
