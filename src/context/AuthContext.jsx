import React, { createContext, useContext, useState } from 'react';

// ─────────────────────────────────────────────────────────────────────────────
// Tiny localStorage "database" for users
// ss_users  → array of { name, email, passwordHash, avatar, joinedAt }
// ss_user   → the currently logged-in user object (session)
// ─────────────────────────────────────────────────────────────────────────────

const USERS_KEY   = 'ss_users';
const SESSION_KEY = 'ss_user';

/** Deterministic but non-reversible encode — good enough for a demo. */
function hashPassword(password) {
  let hash = 5381;
  for (let i = 0; i < password.length; i++) {
    hash = (hash * 33) ^ password.charCodeAt(i);
  }
  return (hash >>> 0).toString(16); // unsigned 32-bit hex
}

function getUsers() {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
  } catch {
    return [];
  }
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function getSession() {
  try {
    const s = localStorage.getItem(SESSION_KEY);
    return s ? JSON.parse(s) : null;
  } catch {
    return null;
  }
}

function saveSession(userObj) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(userObj));
}

// ─────────────────────────────────────────────────────────────────────────────

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getSession());

  /**
   * signup — creates a new account.
   * Returns { success: true } or { success: false, error: string }
   */
  const signup = ({ name, email, password }) => {
    const users = getUsers();
    const normalizedEmail = email.trim().toLowerCase();

    if (users.find(u => u.email === normalizedEmail)) {
      return { success: false, error: 'An account with this email already exists. Try logging in.' };
    }

    const newUser = {
      name: name.trim(),
      email: normalizedEmail,
      passwordHash: hashPassword(password),
      avatar: `https://i.pravatar.cc/150?u=${encodeURIComponent(normalizedEmail)}`,
      joinedAt: new Date().toISOString(),
    };

    saveUsers([...users, newUser]);

    // Auto-login after signup
    const sessionUser = { name: newUser.name, email: newUser.email, avatar: newUser.avatar, joinedAt: newUser.joinedAt };
    saveSession(sessionUser);
    setUser(sessionUser);

    return { success: true };
  };

  /**
   * login — validates credentials against stored users.
   * Returns { success: true } or { success: false, error: string }
   */
  const login = ({ email, password }) => {
    const users = getUsers();
    const normalizedEmail = email.trim().toLowerCase();
    const found = users.find(u => u.email === normalizedEmail);

    if (!found) {
      return { success: false, error: 'No account found with this email. Please sign up first.' };
    }

    if (found.passwordHash !== hashPassword(password)) {
      return { success: false, error: 'Incorrect password. Please try again.' };
    }

    const sessionUser = { name: found.name, email: found.email, avatar: found.avatar, joinedAt: found.joinedAt };
    saveSession(sessionUser);
    setUser(sessionUser);

    return { success: true };
  };

  const logout = () => {
    localStorage.removeItem(SESSION_KEY);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoggedIn: !!user, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
