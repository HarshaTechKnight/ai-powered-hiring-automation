
// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp, type FirebaseOptions } from "firebase/app";
import { getAuth } from "firebase/auth";

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
  
  // Log this error to the console. It will appear in the browser console and/or server logs.
  console.error(errorMessage);

  // Optionally, you could throw an error here to halt execution,
  // but allowing Firebase to attempt initialization and throw its specific error
  // (like auth/invalid-api-key) is also informative.
  // For now, this detailed console log should be a strong hint.
}

const firebaseConfig: FirebaseOptions = {
  apiKey: firebaseApiKey,
  authDomain: firebaseAuthDomain,
  projectId: firebaseProjectId,
  storageBucket: firebaseStorageBucket,
  messagingSenderId: firebaseMessagingSenderId,
  appId: firebaseAppId,
  measurementId: firebaseMeasurementId, // This is optional, Firebase SDK handles if it's undefined
};

// Initialize Firebase
let app;
if (!getApps().length) {
  try {
    // Check if API key specifically looks like a placeholder, which is a common mistake.
    if (firebaseApiKey && (firebaseApiKey.includes("your_") || firebaseApiKey.startsWith("your"))) {
        console.warn(
            "Firebase Configuration Hint: Your NEXT_PUBLIC_FIREBASE_API_KEY (" + firebaseApiKey + ") " +
            "looks like a placeholder value (e.g., 'your_api_key_here'). " +
            "Please ensure you've replaced it with your actual Firebase API key from your Firebase project settings " +
            "in the .env.local file and restarted your development server."
        );
    }
    app = initializeApp(firebaseConfig);
  } catch (error) {
    console.error("Firebase initialization failed:", error);
    // Re-throw the error to allow Next.js to handle it and display an error page.
    throw error;
  }
} else {
  app = getApp();
}

export const auth = getAuth(app);
export default app;
