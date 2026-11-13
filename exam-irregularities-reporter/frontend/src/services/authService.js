import { AUTHORIZED_USERS } from '../data/mockData';

// Format: INV + department code + 4 digits
// Valid dept codes: CSE, ECE, EEE, CIVL, ME
export const INV_ID_REGEX = /^INV(CSE|ECE|EEE|CIVL|ME)[0-9]{4}$/;

export const validateInvId = (raw) => {
  const id = raw.trim().toUpperCase();
  if (!id) return { valid: false, message: 'Invigilator ID is required.' };
  if (!/^INV/.test(id)) return { valid: false, message: 'ID must start with INV.' };
  if (!INV_ID_REGEX.test(id)) {
    return {
      valid: false,
      message:
        'Invalid ID format. Use INV + department code (CSE, ECE, EEE, CIVL, ME) + 4 digits. Example: INVCSE2121',
    };
  }
  return { valid: true, normalized: id };
};

export const authService = {
  /**
   * Authenticate an invigilator.
   * Replace the mock block with an axios.post('/api/auth/login', ...) call in Part 2.
   */
  login: async (rawId, password) => {
    const check = validateInvId(rawId);
    if (!check.valid) return { success: false, message: check.message };

    // --- MOCK AUTHENTICATION (replace with API call in Part 2) ---
    await new Promise((r) => setTimeout(r, 700));
    const user = AUTHORIZED_USERS.find(
      (u) => u.invId === check.normalized && u.password === password
    );
    if (user) {
      const { password: _pw, ...safeUser } = user;
      return { success: true, user: safeUser };
    }
    return { success: false, message: 'Invalid Invigilator ID or password.' };
    // --- END MOCK ---
  },

  logout: () => {
    sessionStorage.removeItem('examwatch_user');
    // Login page reads this flag to show the logout toast, then clears it
    sessionStorage.setItem('examwatch_logged_out', '1');
  },

  getUser: () => {
    const raw = sessionStorage.getItem('examwatch_user');
    return raw ? JSON.parse(raw) : null;
  },

  saveUser: (user) => {
    sessionStorage.setItem('examwatch_user', JSON.stringify(user));
  },
};
