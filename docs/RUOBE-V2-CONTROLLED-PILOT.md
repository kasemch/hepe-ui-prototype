# RU OBE Copilot v2 — Controlled Pilot Frontend Baseline

Status: WORKING / NON-PRODUCTION

Branch: `feat/ruobe-v2-controlled-pilot`

## Backend
Host Supabase project: `lztxpjsuzqvtgyasfnyj`
Schema: `ru_obe`

Service-only read models:
- `ru_obe.v_dashboard_summary`
- `ru_obe.v_programme_workspace`
- `ru_obe.v_human_gate_queue`

These are not exposed to anon/authenticated roles.

## Frontend
Initial route: `/ru-obe`

The route intentionally renders only controlled-pilot / synthetic state. It does not use service-role credentials in the browser and does not ingest real student data.

## Locked boundaries
- Production/public release: NOT AUTHORIZED
- Real student/person-level data: NOT AUTHORIZED
- Academic verification/promotion to VERIFIED or AUTHORITATIVE by AI: PROHIBITED
- HEPE canonical table overwrite: PROHIBITED

## Next safe work
1. Add server-side scoped adapter for the service-only read models.
2. Add programme/course/mapping/assessment read-only pilot views.
3. Add validation and human-gate UI surfaces.
4. Test with synthetic fixtures only.
