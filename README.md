```
git clone https://github.com/amnxd/Medsta-mvp
```

Project structure is now flattened: run everything from the repository root.

Setup
```
npm install
```

Configure Firebase (required)
1. Copy `.env.local.example` to `.env.local` and fill the Firebase Web App config values from your Firebase Console → Project settings → Web app → Config.
2. Ensure Firestore is created in the Firebase project (Console → Firestore Database → Create database).
3. Enable Email/Password provider (Console → Authentication → Sign-in method).

Run the dev server
```
npm run dev
```

to get the latest changes
```
git pull
```

then again, do npm install and npm run dev


Optional: Deploy Firestore rules via CLI
- We keep Firestore rules in `firestore.rules` and `firebase.json` is configured.
- First-time only: log in to Firebase CLI (opens a browser):
```
npm run firebase:login
```
- Deploy rules to your default/selected project:
```
npm run deploy:rules
```
Note: If you have multiple Firebase projects, pass `--project <projectId>` to the deploy command or set a default project with `firebase use`.