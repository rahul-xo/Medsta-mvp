import { create } from 'zustand';
import { supabase } from '@/Services/supabase.js';

export const useAuthStore = create((set, get) => ({
  user: null,
  role: null,
  loading: true,
  initialized: false,
  init: () => {
    if (get().initialized) return;
    set({ initialized: true });

    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      handleSession(session, set);
    });

    // Listen for changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      handleSession(session, set);
    });

    return () => subscription.unsubscribe();
  },
  signOut: async () => {
    await supabase.auth.signOut();
    try { localStorage.removeItem('medsta.role'); } catch { }
    set({ user: null, role: null, loading: false });
  },
}));

async function handleSession(session, set) {
  if (!session?.user) {
    try { localStorage.removeItem('medsta.role'); } catch { }
    set({ user: null, role: null, loading: false });
    return;
  }

  const user = session.user;
  let role = null;

  try {
    const { data, error } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();

    if (data) {
      role = data.role || null;
      try { localStorage.setItem('medsta.role', role || ''); } catch { }
    }
  } catch {
    // If fetch fails, fall back to cached role
    try {
      const cached = localStorage.getItem('medsta.role');
      if (cached) role = cached || null;
    } catch { /* ignore */ }
  }
  set({ user, role, loading: false });
}
