export interface CourseReadModel {
  courseCode: string;
  readiness: "HOLD" | "READY";
  evidenceReadiness: number;
  blockerCount: number;
  tqf5: "INCOMPLETE" | "READY";
  officialExport: "LOCKED" | "READY";
}

export interface NotificationReadModel {
  title: string;
  detail: string;
  priority: "High" | "Medium" | "Low";
  state: "ACTION_REQUIRED" | "UNREAD" | "ACKNOWLEDGED" | "READ" | "RESOLVED";
  href: string;
}

export interface CourseRepository {
  getCourseReadModel(courseCode: string): CourseReadModel;
  getBlockers(courseCode: string): readonly { id: string; message: string; requirement: string }[];
}

export interface NotificationRepository {
  listNotifications(): readonly NotificationReadModel[];
}

export interface DocumentRepository {
  getTqf5State(courseCode: string): "INCOMPLETE" | "READY";
}

export interface EvidenceRepository {
  getEvidenceReadiness(courseCode: string): number;
}

export interface ReviewRepository {
  getReadiness(courseCode: string): "HOLD" | "READY";
  getBlockerCount(courseCode: string): number;
}

export interface AuditRepository {
  mode: "SYNTHETIC_APPEND_ONLY";
}
