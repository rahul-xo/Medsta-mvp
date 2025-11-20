import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { initializeFirestore, enableIndexedDbPersistence } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase config via Vite env
const cfg = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain:
    import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ||
    (import.meta.env.VITE_FIREBASE_PROJECT_ID
      ? `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com`
      : undefined),
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  // Storage bucket: correct Firebase pattern is <projectId>.appspot.com
  storageBucket:
    cleanEnv(import.meta.env.VITE_FIREBASE_STORAGE_BUCKET) ||
    (import.meta.env.VITE_FIREBASE_PROJECT_ID
      ? `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.appspot.com`
      : undefined),
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

function cleanEnv(v) {
  if (!v) return v;
  return String(v).trim().replace(/^"|"$/g, '');
}

// Normalize key fields removing stray quotes/spaces
cfg.apiKey = cleanEnv(cfg.apiKey);
cfg.authDomain = cleanEnv(cfg.authDomain);
cfg.projectId = cleanEnv(cfg.projectId);
cfg.storageBucket = cleanEnv(cfg.storageBucket);
cfg.messagingSenderId = cleanEnv(cfg.messagingSenderId);
cfg.appId = cleanEnv(cfg.appId);

// Helpful warnings
if (!cfg.apiKey || !cfg.projectId || !cfg.appId) {
  console.warn('[Firebase] Missing required env values.');
}
if (cfg.storageBucket && !/^[a-z0-9\-]+\.appspot\.com$/.test(cfg.storageBucket)) {
  console.warn('[Firebase] Unexpected storageBucket value:', cfg.storageBucket);
}

const app = initializeApp(cfg);
const auth = getAuth(app);
// Use Firestore settings that work better behind strict proxies and enable offline cache
const db = initializeFirestore(app, {
  ignoreUndefinedProperties: true,
  experimentalAutoDetectLongPolling: true, // falls back to HTTP if WebSockets are blocked
});
try {
  // Persist cache so reads succeed offline and during flaky networks
  enableIndexedDbPersistence(db).catch(() => {});
} catch {}
const storage = getStorage(app);

export { app, auth, db, storage };
