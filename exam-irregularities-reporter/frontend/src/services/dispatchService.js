/**
 * DISPATCH SERVICE — Priority Scheduling + Department Dispatch
 * ─────────────────────────────────────────────────────────────────────────────
 * Implements a NON-PREEMPTIVE priority queue:
 *   • Critical (weight 3) > High (weight 2) > Medium (weight 1)
 *   • Equal-priority reports follow FIFO by submittedAt timestamp
 *   • A report already being processed is NEVER interrupted
 *   • A newly arriving Critical report moves ahead of waiting High/Medium
 *     but waits for the current report to finish
 *
 * NOTE: Priority values come from mock data (and later from the backend).
 * This service does NOT assign priority — it only schedules based on the
 * priority already present on each report.
 *
 * Replace the mock store with axios calls in Part D.
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * Expected API shapes for Part D integration:
 *
 * GET  /api/dispatch/queue          → { processing, waiting, history }
 * POST /api/dispatch/next           → { report }   (admin triggers next)
 * POST /api/dispatch/complete/:id   → { report }
 * GET  /api/dept/reports?dept=NAME  → Report[]
 * POST /api/dept/reports/:id/accept → { report }
 * POST /api/dept/reports/:id/remark → { report }
 * POST /api/dept/reports/:id/resolve→ { report }
 */

import { PRIORITY_WEIGHT, getDeptForCategory } from '../config/dispatchConfig';
import { MOCK_REPORTS } from '../data/mockData';

// ── Helpers ──────────────────────────────────────────────────────────────────

function prioritySort(a, b) {
  const wa = PRIORITY_WEIGHT[a.priority] ?? 0;
  const wb = PRIORITY_WEIGHT[b.priority] ?? 0;
  if (wb !== wa) return wb - wa;                          // higher weight first
  return new Date(a.submittedAt) - new Date(b.submittedAt); // FIFO tiebreak
}

function enrichReport(r) {
  return {
    ...r,
    department: r.department ?? getDeptForCategory(r.category),
  };
}

// ── Initial mock state ────────────────────────────────────────────────────────
// Seed the queue from MOCK_REPORTS, partitioned by status.

function buildInitialState() {
  const all = MOCK_REPORTS.map(enrichReport);

  const processing = all.find((r) => r.status === 'In Progress') ?? null;

  const waiting = all
    .filter((r) => ['Submitted', 'Pending', 'Assigned'].includes(r.status))
    .sort(prioritySort);

  const history = all.filter((r) => r.status === 'Resolved');

  return { processing, waiting, history };
}

let state = buildInitialState();

// ── Public API ────────────────────────────────────────────────────────────────

export const dispatchService = {
  /**
   * Returns a snapshot of the current queue state.
   * Replace with GET /api/dispatch/queue in Part D.
   */
  getQueue: async () => {
    await new Promise((r) => setTimeout(r, 300));
    return {
      processing: state.processing ? { ...state.processing } : null,
      waiting: state.waiting.map((r) => ({ ...r })),
      history: state.history.map((r) => ({ ...r })),
    };
  },

  /**
   * Marks the currently processing report as completed and picks the next
   * highest-priority report from the waiting queue.
   * Non-preemptive: only called when current processing slot is free.
   * Replace with POST /api/dispatch/next in Part D.
   */
  processNext: async () => {
    await new Promise((r) => setTimeout(r, 400));

    if (state.processing) {
      // Complete the current report
      const completed = {
        ...state.processing,
        status: 'Resolved',
        dispatchStatus: 'Dispatched',
        completedAt: new Date().toISOString(),
      };
      state.history = [completed, ...state.history];
    }

    if (state.waiting.length === 0) {
      state.processing = null;
      return { processing: null, waiting: [] };
    }

    // Pick next by priority + FIFO (already sorted)
    const [next, ...rest] = state.waiting;
    state.processing = {
      ...next,
      status: 'In Progress',
      dispatchStatus: 'Dispatched',
      processingStartedAt: new Date().toISOString(),
    };
    state.waiting = rest;

    return {
      processing: { ...state.processing },
      waiting: state.waiting.map((r) => ({ ...r })),
    };
  },

  /**
   * Adds a new report to the waiting queue.
   * The queue re-sorts automatically — a Critical report will jump ahead of
   * waiting High/Medium reports but will NOT interrupt current processing.
   * Replace with POST /api/dispatch/enqueue in Part D.
   */
  enqueue: async (report) => {
    await new Promise((r) => setTimeout(r, 200));
    const enriched = enrichReport(report);
    state.waiting = [...state.waiting, enriched].sort(prioritySort);
    return { ...enriched };
  },

  /**
   * Department staff: accept a report (move to In Progress for that dept).
   * Replace with POST /api/dept/reports/:id/accept in Part D.
   */
  acceptReport: async (reportId, staffId) => {
    await new Promise((r) => setTimeout(r, 300));
    const idx = state.waiting.findIndex((r) => r.id === reportId);
    if (idx === -1) return { success: false, message: 'Report not found in queue.' };
    const updated = {
      ...state.waiting[idx],
      status: 'In Progress',
      dispatchStatus: 'Dispatched',
      acceptedBy: staffId,
      processingStartedAt: new Date().toISOString(),
    };
    state.waiting = state.waiting.filter((r) => r.id !== reportId);
    if (!state.processing) {
      state.processing = updated;
    } else {
      // Already processing another — put this one back as In Progress in history preview
      state.history = [updated, ...state.history];
    }
    return { success: true, report: { ...updated } };
  },

  /**
   * Department staff: add a remark to a report.
   * Replace with POST /api/dept/reports/:id/remark in Part D.
   */
  addRemark: async (reportId, remark) => {
    await new Promise((r) => setTimeout(r, 200));
    const update = (r) =>
      r.id === reportId ? { ...r, remarks: remark, updatedAt: new Date().toISOString() } : r;
    state.waiting = state.waiting.map(update);
    if (state.processing?.id === reportId) state.processing = update(state.processing);
    state.history = state.history.map(update);
    return { success: true };
  },

  /**
   * Department staff: resolve a report.
   * Replace with POST /api/dept/reports/:id/resolve in Part D.
   */
  resolveReport: async (reportId, remark) => {
    await new Promise((r) => setTimeout(r, 300));
    let resolved = null;

    if (state.processing?.id === reportId) {
      resolved = {
        ...state.processing,
        status: 'Resolved',
        dispatchStatus: 'Dispatched',
        remarks: remark || state.processing.remarks,
        completedAt: new Date().toISOString(),
      };
      state.processing = null;
    } else {
      const idx = state.waiting.findIndex((r) => r.id === reportId);
      if (idx !== -1) {
        resolved = {
          ...state.waiting[idx],
          status: 'Resolved',
          dispatchStatus: 'Dispatched',
          remarks: remark || state.waiting[idx].remarks,
          completedAt: new Date().toISOString(),
        };
        state.waiting = state.waiting.filter((r) => r.id !== reportId);
      }
    }

    if (!resolved) return { success: false, message: 'Report not found.' };
    state.history = [resolved, ...state.history];
    return { success: true, report: { ...resolved } };
  },

  /**
   * Returns all reports visible to a specific department.
   * Filters by department name — staff can only see their own dept's reports.
   * Replace with GET /api/dept/reports?dept=NAME in Part D.
   */
  getDeptReports: async (deptName) => {
    await new Promise((r) => setTimeout(r, 300));
    const all = [
      ...(state.processing ? [state.processing] : []),
      ...state.waiting,
      ...state.history,
    ];
    return all.filter((r) => r.department === deptName).map((r) => ({ ...r }));
  },

  /** Reset state (used by scheduling visualizer demo) */
  _reset: () => { state = buildInitialState(); },
  _getState: () => state,
};
