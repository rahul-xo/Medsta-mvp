import { auth, db } from '@/Services/firebase.js';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';

export async function runFirebaseDiagnostics() {
  const results = { authUser: null, writeUsersDoc: null, readUsersDoc: null, errors: [] };
  try {
    results.authUser = auth.currentUser ? { uid: auth.currentUser.uid, email: auth.currentUser.email } : null;
    if (!auth.currentUser) {
      results.errors.push('No auth.currentUser; sign in first.');
      return results;
    }
    const uid = auth.currentUser.uid;
    // test write
    try {
      await setDoc(doc(db, 'users', uid), { diagPingAt: serverTimestamp(), email: auth.currentUser.email || null }, { merge: true });
      results.writeUsersDoc = 'ok';
    } catch (e) {
      results.writeUsersDoc = 'fail';
      results.errors.push('Write users doc failed: ' + (e.code || e.message));
    }
    // test read
    try {
      const snap = await getDoc(doc(db, 'users', uid));
      results.readUsersDoc = snap.exists() ? 'ok' : 'not-found';
    } catch (e) {
      results.readUsersDoc = 'fail';
      results.errors.push('Read users doc failed: ' + (e.code || e.message));
    }
  } catch (outer) {
    results.errors.push('Diagnostics crashed: ' + (outer.code || outer.message));
  }
  console.log('[Firebase Diagnostics]', results);
  return results;
}
