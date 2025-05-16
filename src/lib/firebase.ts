
// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp, type FirebaseOptions } from "firebase/app";
// import { getAuth } from "firebase/auth"; // Firebase Auth is being removed

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// IMPORTANT: These values MUST come from your .env.local file
// and be prefixed with NEXT_PUBLIC_
const firebaseApiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
const firebaseAuthDomain = process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN;
const firebaseProjectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const firebaseStorageBucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
const firebaseMessagingSenderId = process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID;
const firebaseAppId = process.env.NEXT_PUBLIC_FIREBASE_APP_ID;
const firebaseMeasurementId = process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID; // Optional

let appInitialized = false;
let app;

// Check if critical environment variables are loaded
if (!firebaseApiKey || !firebaseAuthDomain || !firebaseProjectId) {
  let errorMessage = "CRITICAL FIREBASE CONFIGURATION ERROR:\n";
  errorMessage += "One or more essential Firebase environment variables are missing.\n";
  errorMessage += "Please check your .env.local file in the root of your project.\n";
  errorMessage += "Ensure the following variables are correctly set and prefixed with 'NEXT_PUBLIC_':\n";
  if (!firebaseApiKey) errorMessage += "  - NEXT_PUBLIC_FIREBASE_API_KEY\n";
  if (!firebaseAuthDomain) errorMessage += "  - NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN\n";
  if (!firebaseProjectId) errorMessage += "  - NEXT_PUBLIC_FIREBASE_PROJECT_ID\n";
  errorMessage += "\nAfter creating or updating .env.local, YOU MUST RESTART YOUR NEXT.JS DEVELOPMENT SERVER.\n";
  
  console.error(errorMessage);
  // Not throwing an error here to allow the app to run in a degraded mode if only some Firebase services are affected.
  // Auth is being removed, so this check is less critical for auth itself but good for other potential Firebase services.
}

const firebaseConfig: FirebaseOptions = {
  apiKey: firebaseApiKey,
  authDomain: firebaseAuthDomain,
  projectId: firebaseProjectId,
  storageBucket: firebaseStorageBucket,
  messagingSenderId: firebaseMessagingSenderId,
  appId: firebaseAppId,
  measurementId: firebaseMeasurementId, 
};

// Initialize Firebase App (if config seems valid and not already initialized)
// This part is kept in case other Firebase services (like Firestore, Storage) are used later.
// If only Auth was used, this initialization could also be conditionally removed or fully removed.
if (firebaseApiKey && firebaseAuthDomain && firebaseProjectId) {
  if (!getApps().length) {
    try {
      if (firebaseApiKey && (firebaseApiKey.includes("your_") || firebaseApiKey.startsWith("your"))) {
          console.warn(
              "Firebase Configuration Hint: Your NEXT_PUBLIC_FIREBASE_API_KEY (" + firebaseApiKey + ") " +
              "looks like a placeholder value (e.g., 'your_api_key_here'). " +
              "Please ensure you've replaced it with your actual Firebase API key from your Firebase project settings " +
              "in the .env.local file and restarted your development server."
          );
      }
      app = initializeApp(firebaseConfig);
      appInitialized = true;
    } catch (error) {
      console.error("Firebase app initialization failed:", error);
      // Not throwing an error here, to allow app to potentially proceed if auth is mocked out.
    }
  } else {
    app = getApp();
    appInitialized = true;
  }
} else {
  console.warn("Firebase app initialization skipped due to missing critical config variables. Firebase features might not work.");
}

// export const auth = getAuth(app); // Firebase Auth instance removed
export { app, appInitialized }; // Export app instance and initialized status
export default app;
