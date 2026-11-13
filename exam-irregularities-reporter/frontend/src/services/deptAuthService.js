/**
 * DEPARTMENT STAFF AUTH SERVICE
 * ─────────────────────────────────────────────────────────────────────────────
 * Completely separate from invigilator auth (examwatch_user) and
 * admin auth (examwatch_admin).
 *
 * IMPORTANT: This is MOCK authentication for frontend demonstration only.
 * Real authorization — including department-level access control — will be
 * enforced by the backend in Part D.
 *
 * Replace the mock block with axios.post('/api/dept/auth/login') in Part D.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { DEPT_STAFF_USERS } from '../data/mockData';

const STORAGE_KEY = 'examwatch_dept_staff';
const LOGOUT_FLAG = 'examwatch_dept_logged_out';

export const deptAuthService = {
  login: async (staffId, password) => {
    await new Promise((r) => setTimeout(r, 600));
    const user = DEPT_STAFF_USERS.find(
      (u) => u.staffId === staffId.trim().toUpperCase() && u.password === password
    );
    if (user) {
      const { password: _pw, ...safe } = user;
      return { success: true, user: safe };
    }
    return { success: false, message: 'Invalid Staff ID or password.' };
  },

  logout: () => {
    sessionStorage.removeItem(STORAGE_KEY);
    sessionStorage.setItem(LOGOUT_FLAG, '1');
  },

  getUser: () => {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  },

  saveUser: (user) => {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  },

  getLogoutFlag: () => {
    const flag = sessionStorage.getItem(LOGOUT_FLAG);
    if (flag) sessionStorage.removeItem(LOGOUT_FLAG);
    return !!flag;
  },
};
