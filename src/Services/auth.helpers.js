import { supabase } from './supabase.js';

// ensureAuthReady works for either a Firebase-like auth object or a Supabase client.
export async function ensureAuthReady(clientOrAuth, expectedUid) {
  // If a Firebase-like auth object was passed (has currentUser)
  try {
    if (clientOrAuth && clientOrAuth.currentUser !== undefined) {
      const auth = clientOrAuth;
      const current = auth.currentUser;
      if (current?.uid === expectedUid) {
        try { await current.getIdToken(true); } catch {}
        return current;
      }
      return await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          try { unsub(); } catch {}
          reject(new Error('Auth not ready after timeout'));
        }, 8000);
        const unsub = auth.onAuthStateChanged(
          async (user) => {
            if (user?.uid === expectedUid) {
              clearTimeout(timeout);
              try { unsub(); } catch {}
              try { await user.getIdToken(true); } catch {}
              resolve(user);
            }
          },
          (err) => {
            clearTimeout(timeout);
            try { unsub(); } catch {}
            reject(err);
          }
        );
      });
    }
  } catch {}

  // Otherwise assume Supabase client (or use default imported client)
  const client = clientOrAuth && clientOrAuth.auth ? clientOrAuth : supabase;
  // quick-check current user
  try {
    const { data: userData } = await client.auth.getUser();
    const user = userData?.user || null;
    if (user?.id === expectedUid) return user;
  } catch {}

  return await new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      try { sub?.data?.subscription?.unsubscribe?.(); } catch {}
      reject(new Error('Auth not ready after timeout'));
    }, 8000);
    const { data: sub } = client.auth.onAuthStateChange((event, session) => {
      const user = session?.user || null;
      if (user?.id === expectedUid) {
        clearTimeout(timeout);
        try { sub?.subscription?.unsubscribe?.(); } catch {}
        resolve(user);
      }
    });
  });
}
