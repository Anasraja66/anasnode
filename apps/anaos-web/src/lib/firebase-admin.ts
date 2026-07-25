import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

if (!getApps().length) {
  try {
    initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        // Handling multiline private key safely
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      }),
    });
    console.log("[FIREBASE_ADMIN] Initialized successfully.");
  } catch (error) {
    console.error("[FIREBASE_ADMIN] Initialization error:", error);
  }
}

export const adminAuth = getAuth();
export const adminDb = getFirestore();
