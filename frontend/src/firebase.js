// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCqge6axC7GLu_bLIILEfYik2Q6LBCaZ-A",
  authDomain: "medsta.firebaseapp.com",
  databaseURL: "https://medsta-default-rtdb.firebaseio.com",
  projectId: "medsta",
  storageBucket: "medsta.firebasestorage.app",
  messagingSenderId: "777262027319",
  appId: "1:777262027319:web:0cf92d3603094f1e90e5b2",
  measurementId: "G-TCSDL1KF54",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
// Initialize and export Firebase Auth
const auth = getAuth(app);
// Initialize and export Firestore
const db = getFirestore(app);

export { app, analytics, auth, db };
