# A07 — Controlled Data Layer Prototype

Status: NON-PRODUCTION · SYNTHETIC ADAPTER ONLY · NO DB WRITE PATH

A07 introduces repository contracts and a controlled synthetic adapter between UI and the current static state source.

Objectives:
- UI stops depending directly on raw state constants where migrated.
- repository/service boundary becomes the future insertion point for read-only Supabase.
- no database schema, RLS, authority, or canonical academic data is changed.
- adapter fails closed for unsupported course codes.

Current adapter source remains the accepted HED3505 controlled state baseline.

A07 does NOT authorize persistence writes.
