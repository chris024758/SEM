import React, { createContext, useContext, useState } from 'react';

// Persists saved listing IDs in localStorage keyed per user email,
// so saves are per-account (falls back to a guest key when logged out).

const SavedContext = createContext(null);

function getKey(user) {
  return user ? `ss_saved_${user.email}` : 'ss_saved_guest';
}

function loadSaved(user) {
  try {
    return JSON.parse(localStorage.getItem(getKey(user)) || '[]');
  } catch {
    return [];
  }
}

export function SavedProvider({ children, user }) {
  const [savedIds, setSavedIds] = useState(() => loadSaved(user));

  const toggle = (listingId) => {
    setSavedIds(prev => {
      const next = prev.includes(listingId)
        ? prev.filter(id => id !== listingId)
        : [...prev, listingId];
      localStorage.setItem(getKey(user), JSON.stringify(next));
      return next;
    });
  };

  const isSaved = (listingId) => savedIds.includes(listingId);

  return (
    <SavedContext.Provider value={{ savedIds, toggle, isSaved }}>
      {children}
    </SavedContext.Provider>
  );
}

export function useSaved() {
  const ctx = useContext(SavedContext);
  if (!ctx) throw new Error('useSaved must be used inside SavedProvider');
  return ctx;
}
