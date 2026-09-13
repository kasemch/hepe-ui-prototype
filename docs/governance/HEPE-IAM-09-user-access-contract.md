# HEPE-IAM-09 — User & Access Architecture Contract

Status: NON-PRODUCTION / CONTROLLED DESIGN BASELINE CANDIDATE
Environment: HEPE Curriculum Governance & Development
Branch: feat/hepe-iam-09-user-access

## 1. Governance boundary

This contract is governed by the HEPE Audit Evidence Admission Rule.

Conversation ≠ Audit Evidence by default.

This file does not authorize production deployment, real-user creation, real invitation/email delivery, database data writes, schema modification, RLS modification, or production authorization.

Authentication success does not imply HEPE business authorization.

## 2. Core identity model

HEPE access SHALL be resolved through the following chain:

Identity → HEPE User Profile → Role Binding → Scope Binding → Permission Resolution → RLS Enforcement → Effective Access → Application Action

### 2.1 Identity

Target authentication provider: Supabase Auth.

Preferred pilot sign-in method:
- Controlled invitation
- University/institutional email
- Passwordless Magic Link or Email OTP
- Automatic user creation disabled for ordinary login flows where supported (`shouldCreateUser=false`)

### 2.2 HEPE user profile

An authenticated identity must map to an active HEPE user profile before application access is granted.

Minimum logical attributes:
- auth_user_id
- display_name
- institutional_email
- personnel_reference (nullable)
- organization_unit
- active_status
- created_at / updated_at

No academic authority SHALL be inferred from profile data alone.

## 3. Role model

Initial controlled-pilot role set:

1. Instructor
2. Programme Chair
3. Department Head
4. QA / Auditor
5. System Admin

Role is not sufficient by itself to determine access. Every role assignment must be scoped.

## 4. Scope model

Supported scope levels may include:
- Institution
- Faculty
- Department
- Programme
- Curriculum Version
- Course
- Review / Audit Object

A user may hold different roles in different scopes.

Example:
- Instructor → HED2503
- Reviewer → BED-HEPE-2567 curriculum review

## 5. Authority model

Candidate atomic authorities:
- view
- create_draft
- edit
- submit
- review
- comment
- create_finding
- resolve_finding
- approve
- publish_controlled_record
- manage_user
- assign_role
- assign_scope
- revoke_access

Academic approval authority SHALL NOT be granted merely because a user is System Admin.

Critical rule:

**System Administration ≠ Academic Authority**

## 6. Effective access resolution

Effective access must be computed from:

user identity
+ active HEPE profile
+ active role binding
+ active scope binding
+ explicit authority mapping
+ validity window
+ object state
+ RLS policy result

Fail-closed behavior is required.

If any required binding is missing, ambiguous, expired, or inconsistent, the action must be denied or placed on HOLD.

## 7. User provisioning workflow

Target controlled workflow:

Invite User
→ Verify Identity
→ Create HEPE Profile
→ Assign Role
→ Bind Scope
→ Resolve Effective Permissions
→ Human Review
→ Activate
→ Send Welcome / Access Notification
→ First Login Verification
→ Audit Record

No single “Add User” action should implicitly grant unrestricted application authority.

## 8. User & Access Center

Target modules:

### 8.1 Users
Shows active, inactive, suspended, and invited users.

### 8.2 Pending Invitations
Shows invitation state and expiry without exposing sensitive authentication tokens.

### 8.3 Roles & Scopes
Displays explicit bindings by programme, curriculum, course, department, or review object.

### 8.4 Effective Permissions
Provides a pre-activation preview of actual authority.

Example:

Instructor — BED-HEPE-2567
- HED2503: View / Edit / Submit
- Curriculum baseline: View only
- Approval Queue: No approval authority
- User administration: Denied

### 8.5 Access Review
Supports periodic and event-triggered access review.

### 8.6 Audit History
Records user-access lifecycle events with provenance.

## 9. Email architecture

Authentication email and application notification email are separate concerns.

### 9.1 Authentication email types
- INVITE
- MAGIC_LINK / OTP
- EMAIL_CONFIRMATION
- RECOVERY
- REAUTHENTICATION

### 9.2 Application notification types
- WELCOME
- ACCESS_CHANGED
- ACCESS_REVOKED
- ACTION_REQUIRED
- REVIEW_ASSIGNED

Email templates should be version-controlled.

Sensitive application data must not be embedded in email unless explicitly required and authorized.

## 10. RLS / authorization contract

UI visibility is not an authorization boundary.

Database access must be enforced by RLS and/or trusted server-side authorization.

The RLS model should consume only controlled claims or controlled authorization tables.

No authority should be inferred from email domain alone.

## 11. Pilot test personas

Synthetic-only personas for pre-real-user regression:

- SYN-INSTRUCTOR-01
- SYN-CHAIR-01
- SYN-DEPTHEAD-01
- SYN-AUDITOR-01
- SYN-SYSADMIN-01

All synthetic identities must be marked clearly and cleaned up after the authorized test cycle.

## 12. Synthetic E2E acceptance matrix

Minimum scenarios:

1. unauthenticated → protected route denied
2. authenticated / no HEPE profile → HOLD or access denied
3. active profile / no role binding → denied
4. Instructor / matching course scope → allowed only contracted course actions
5. Instructor / other course scope → denied
6. Programme Chair / matching programme → allowed contracted review actions
7. Auditor → read/review/finding allowed; baseline modification denied unless separately authorized
8. System Admin → IAM administration allowed; academic approval denied by default
9. expired/revoked binding → denied
10. logout/session expiry → protected access denied

Expected result for all negative cases: fail closed.

## 13. Evidence requirements for IAM regression

Each test record must include:
- Test ID
- Persona
- Authentication state
- Role
- Scope
- Requested action
- Expected result
- Actual result
- PASS/FAIL
- Source commit / build identifier
- Environment
- Timestamp

Only completed test records with traceable runtime evidence may be admitted as Test / Regression Evidence.

## 14. Gate sequence

HEPE-IAM-09A — Role / Authority / Scope Contract
→ HEPE-IAM-09B — User & Access Data Model
→ HEPE-IAM-09C — Login + Invitation UX Contract
→ HEPE-IAM-09D — Email Template & Delivery Contract
→ HEPE-IAM-09E — RLS / Effective Permission Mapping
→ HEPE-IAM-09F — Synthetic User E2E Regression
→ HEPE-IAM-09G — Controlled Real-User Pilot Authorization Gate

## 15. Current gate status

09A: DESIGN COMPLETE / BASELINE CANDIDATE
09B: LOGICAL MODEL DEFINED / PHYSICAL SCHEMA NOT AUTHORIZED
09C: TARGET FLOW DEFINED / RUNTIME IMPLEMENTATION NOT YET VERIFIED
09D: EMAIL CONTRACT DEFINED / REAL DELIVERY NOT AUTHORIZED
09E: AUTHORIZATION MODEL DEFINED / RLS CHANGE NOT AUTHORIZED
09F: TEST PLAN DEFINED / SYNTHETIC EXECUTION REQUIRES RUNTIME TEST SETUP
09G: NOT OPENED FOR REAL-USER ACTIONS

## 16. Explicitly not authorized by this contract

- production deployment
- real-user creation
- real invitation email delivery
- real authority grant
- database schema modification
- database data write
- RLS modification
- SMTP modification
- production environment changes

Any such action requires a separately explicit authorization within its own gate and environment boundary.
