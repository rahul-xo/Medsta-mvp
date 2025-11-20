import { onAuthStateChanged } from 'firebase/auth';

export async function ensureAuthReady(auth, expectedUid) {
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
    const unsub = onAuthStateChanged(
      auth,
      async (user) => {
        if (user?.uid === expectedUid) {
          clearTimeout(timeout);
          unsub();
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
