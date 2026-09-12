# HEPE-ACADEMIC-WORKFLOW-03 — Role / Course Offering Logical Contract

Status: DESIGN CANDIDATE · NON-PRODUCTION · NO SCHEMA WRITE

## Purpose
Define the logical model required for role-aware course assignment and visibility without changing IAM/RLS or database schema in this gate.

## Core entities
- Academic Term
- Course Master
- Course Offering
- Instructor Assignment
- TQF3 Workspace
- TQF5 Workspace
- Verification Record
- Improvement Item

## Assignment authority
- Exactly one active `COURSE_ASSIGNMENT_MANAGER` logical authority holder at a time during the pilot design.
- Initial holder is to be determined by a separately authorized IAM/authority gate; this document does not create the account or grant the role.
- Reassignment must be represented as authority transfer, preserving history.

## Visibility policy
### Instructor
- See course-offering status metadata across the permitted programme/department context.
- Open TQF3/TQF5/verification content only for assigned course offerings.
- Edit only assigned workspaces within lifecycle rules.

### Programme Chair
- Open course documents for offerings belonging to their programme scope.
- Monitor TQF3/TQF5/verification completion and improvement actions.
- Accountable owner for programme-level curriculum-improvement follow-through.

### Department Head
- Read all programme/course document workspaces within department scope.
- Monitor escalation, completion and improvement portfolios.
- Oversight does not imply automatic edit authority over instructor-authored academic content.

### Assignment Manager
- Assign/reassign instructor-to-course-offering.
- Does not receive automatic academic content edit authority.

### Reviewer
- Access only review items assigned to their queue/scope.

### Pilot Super User
- Temporary NON-PRODUCTION support role only.
- Elevated access must be visibly indicated and logged when implemented.
- Does not become permanent academic authority by default.

## Status vs content visibility
Status metadata is a separate permission surface from document-content visibility. A user may see that another course is `COMPLETE` without opening its TQF3 content.

## Course offering rule
TQF workflow binds to `Course Offering`, not only `Course Master`, so the same course can have different instructors, sections and lifecycle state by term.

## Authority boundary
This contract does not authorize schema migration, RLS changes, real-user provisioning, permanent grants, email, production deployment, or Audit Evidence admission.
