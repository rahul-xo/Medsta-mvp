import { create } from 'zustand';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/Services/firebase.js';

export const useAuthStore = create((set, get) => ({
  user: null,
  role: null,
  loading: true,
  initialized: false,
  init: () => {
    if (get().initialized) return;
    set({ initialized: true });
    onAuthStateChanged(auth, async (user) => {
      if (!user) {
        try { localStorage.removeItem('medsta.role'); } catch {}
        set({ user: null, role: null, loading: false });
        return;
      }
      let role = null;
      try {
        const snap = await getDoc(doc(db, 'users', user.uid));
        if (snap.exists()) {
          const data = snap.data();
          role = data.role || null;
          try { localStorage.setItem('medsta.role', role || ''); } catch {}
        }
      } catch {
        // If Firestore fetch fails (offline etc), fall back to cached role
        try {
          const cached = localStorage.getItem('medsta.role');
          if (cached) role = cached || null;
        } catch { /* ignore */ }
      }
      set({ user, role, loading: false });
    });
  },
  signOut: async () => {
    const { signOut } = await import('firebase/auth');
    await signOut(auth);
  },
}));
