import { HED3505_STATE, NOTIFICATION_ITEMS } from "../hepe-state";
import type {
  AuditRepository,
  CourseRepository,
  DocumentRepository,
  EvidenceRepository,
  NotificationRepository,
  ReviewRepository,
} from "./contracts";

const assertCourse = (courseCode: string) => {
  if (courseCode !== HED3505_STATE.courseCode) {
    throw new Error(`Controlled synthetic adapter has no data for ${courseCode}`);
  }
};

export const courseRepository: CourseRepository = {
  getCourseReadModel(courseCode) {
    assertCourse(courseCode);
    return {
      courseCode: HED3505_STATE.courseCode,
      readiness: HED3505_STATE.readiness,
      evidenceReadiness: HED3505_STATE.evidenceReadiness,
      blockerCount: HED3505_STATE.blockers.length,
      tqf5: HED3505_STATE.tqf5,
      officialExport: HED3505_STATE.officialExport,
    };
  },
  getBlockers(courseCode) {
    assertCourse(courseCode);
    return HED3505_STATE.blockers;
  },
};

export const notificationRepository: NotificationRepository = {
  listNotifications() {
    return NOTIFICATION_ITEMS;
  },
};

export const documentRepository: DocumentRepository = {
  getTqf5State(courseCode) {
    assertCourse(courseCode);
    return HED3505_STATE.tqf5;
  },
};

export const evidenceRepository: EvidenceRepository = {
  getEvidenceReadiness(courseCode) {
    assertCourse(courseCode);
    return HED3505_STATE.evidenceReadiness;
  },
};

export const reviewRepository: ReviewRepository = {
  getReadiness(courseCode) {
    assertCourse(courseCode);
    return HED3505_STATE.readiness;
  },
  getBlockerCount(courseCode) {
    assertCourse(courseCode);
    return HED3505_STATE.blockers.length;
  },
};

export const auditRepository: AuditRepository = {
  mode: "SYNTHETIC_APPEND_ONLY",
};

export const controlledData = {
  course: courseRepository,
  document: documentRepository,
  evidence: evidenceRepository,
  review: reviewRepository,
  notifications: notificationRepository,
  audit: auditRepository,
} as const;
