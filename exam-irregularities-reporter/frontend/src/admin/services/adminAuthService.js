import { ADMIN_USERS } from '../../data/mockData';

const STORAGE_KEY = 'examwatch_admin';
const LOGOUT_FLAG = 'examwatch_admin_logged_out';

export const adminAuthService = {
  // Replace mock block with axios.post('/api/admin/login') in Part D
  login: async (adminId, password) => {
    await new Promise((r) => setTimeout(r, 600));
    const user = ADMIN_USERS.find(
      (u) => u.adminId === adminId.trim().toUpperCase() && u.password === password
    );
    if (user) {
      const { password: _pw, ...safe } = user;
      return { success: true, user: safe };
    }
    return { success: false, message: 'Invalid Admin ID or password.' };
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
