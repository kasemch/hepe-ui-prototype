import type { ActorRole, AuthorityContext } from "../persistence-contracts";

export type AuthorityAction =
  | "VIEW" | "EDIT" | "SUBMIT" | "REVIEW" | "APPROVE"
  | "EXPORT_PREVIEW" | "EXPORT_OFFICIAL" | "MASTER_DATA";

export interface AuthorityDecision {
  allowed: boolean;
  reason: string;
  enforcement: "UI_SIMULATION_ONLY";
}

const scoped = (ctx: AuthorityContext, programmeId: string, offeringId: string) =>
  ctx.programmeIds.includes(programmeId) || ctx.courseOfferingIds.includes(offeringId);
const hasRole = (ctx: AuthorityContext, role: ActorRole) => ctx.roles.includes(role);

export function decideAuthority(
  ctx: AuthorityContext,
  action: AuthorityAction,
  programmeId: string,
  offeringId: string,
): AuthorityDecision {
  const deny = (reason: string): AuthorityDecision => ({ allowed: false, reason, enforcement: "UI_SIMULATION_ONLY" });
  const allow = (reason: string): AuthorityDecision => ({ allowed: true, reason, enforcement: "UI_SIMULATION_ONLY" });
  if (!ctx.actorId || !scoped(ctx, programmeId, offeringId)) return deny("No resolved scoped assignment");
  if (action === "APPROVE" || action === "EXPORT_OFFICIAL")
    return deny("Real institutional authority and server-side enforcement are not bound");
  if (hasRole(ctx, "EXECUTIVE_READ_ONLY")) {
    return action === "VIEW" ? allow("Scoped read-only preview") : deny("Executive context is read-only");
  }
  if (action === "VIEW") return allow("Scoped preview");
  if (action === "EDIT") return hasRole(ctx, "LECTURER") || hasRole(ctx, "PROGRAMME_CHAIR")
    ? allow("Scoped authoring UI only") : deny("Authoring role required");
  if (action === "SUBMIT") return deny("Validation and persisted workflow gate not enabled");
  if (action === "REVIEW") return hasRole(ctx, "REVIEWER_QA") || hasRole(ctx, "PROGRAMME_CHAIR")
    ? allow("Review workspace preview only") : deny("Reviewer role required");
  if (action === "EXPORT_PREVIEW") return allow("Unclassified metadata preview only; package gates remain enforced separately");
  if (action === "MASTER_DATA") return hasRole(ctx, "ADMIN")
    ? allow("Administration interface preview only") : deny("Admin role required");
  return deny("Action not authorized");
}

export const canView = (c: AuthorityContext,p: string,o: string) => decideAuthority(c,"VIEW",p,o);
export const canEdit = (c: AuthorityContext,p: string,o: string) => decideAuthority(c,"EDIT",p,o);
export const canSubmit = (c: AuthorityContext,p: string,o: string) => decideAuthority(c,"SUBMIT",p,o);
export const canReview = (c: AuthorityContext,p: string,o: string) => decideAuthority(c,"REVIEW",p,o);
export const canApprove = (c: AuthorityContext,p: string,o: string) => decideAuthority(c,"APPROVE",p,o);
export const canExport = (c: AuthorityContext,p: string,o: string,official = false) =>
  decideAuthority(c,official ? "EXPORT_OFFICIAL" : "EXPORT_PREVIEW",p,o);

const prototypeContext = (role: ActorRole): AuthorityContext => ({
  actorId: `synthetic:${role}`, roles: [role],
  programmeIds: ["synthetic:HEPE"], courseOfferingIds: ["synthetic:HED3505"],
});
export const AUTHORITY_FIXTURES = {
  lecturer: prototypeContext("LECTURER"),
  programmeChair: prototypeContext("PROGRAMME_CHAIR"),
  reviewerQA: prototypeContext("REVIEWER_QA"),
  admin: prototypeContext("ADMIN"),
  executiveReadOnly: prototypeContext("EXECUTIVE_READ_ONLY"),
} as const;
