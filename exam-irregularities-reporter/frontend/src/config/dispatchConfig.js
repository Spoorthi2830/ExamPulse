/**
 * DISPATCH CONFIGURATION
 * ─────────────────────────────────────────────────────────────────────────────
 * Centralized category → department mapping for ExamWatch.
 *
 * These are PLACEHOLDER department names. Replace `name` and `code` with the
 * actual college department names and codes before going live.
 *
 * The backend (Part D) will be the authoritative source for this mapping.
 * This file exists only to drive the frontend mock demonstration.
 * ─────────────────────────────────────────────────────────────────────────────
 */

export const DEPT_CONFIG = {
  Malpractice: {
    code: 'EXAM-DISC',
    name: 'Examination Discipline',   // ← replace with actual dept name
    shortName: 'Exam Discipline',
    color: 'red',
  },
  Medical: {
    code: 'MED-SUP',
    name: 'Medical Support',          // ← replace with actual dept name
    shortName: 'Medical',
    color: 'pink',
  },
  Technical: {
    code: 'TECH-SUP',
    name: 'Technical Support',        // ← replace with actual dept name
    shortName: 'Technical',
    color: 'blue',
  },
  Disturbance: {
    code: 'SEC-DEPT',
    name: 'Security Department',      // ← replace with actual dept name
    shortName: 'Security',
    color: 'orange',
  },
  'Missing Script': {
    code: 'EXAM-SEC',
    name: 'Examination Section',      // ← replace with actual dept name
    shortName: 'Exam Section',
    color: 'purple',
  },
};

/**
 * Returns the department name for a given category.
 * Falls back to 'Unassigned' if category is not found.
 */
export function getDeptForCategory(category) {
  return DEPT_CONFIG[category]?.name ?? 'Unassigned';
}

/**
 * Returns the full dept config object for a given category.
 */
export function getDeptConfigForCategory(category) {
  return DEPT_CONFIG[category] ?? null;
}

/**
 * Priority weight map — higher number = higher priority.
 * Used by the scheduling algorithm.
 * NOTE: Priority values are supplied by mock data / future backend.
 * Do NOT derive priority from category alone.
 */
export const PRIORITY_WEIGHT = {
  Critical: 3,
  High: 2,
  Medium: 1,
};

/** All unique department names derived from config */
export const ALL_DEPARTMENTS = [...new Set(Object.values(DEPT_CONFIG).map((d) => d.name))];
