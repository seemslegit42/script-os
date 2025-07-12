
import * as admin from 'firebase-admin';

// A type assertion is used to extend the global object for our singleton.
declare global {
  var firebaseAdminApp: admin.app.App | undefined;
}

/**
 * Initializes the Firebase Admin SDK, ensuring it only runs once.
 * This function creates a single, shared instance of the Firebase app
 * and stores it on the global object to prevent re-initialization
 * across different modules or hot reloads in development.
 * @returns {admin.app.App} The initialized Firebase Admin App.
 */
function initializeFirebaseAdmin(): admin.app.App {
  if (globalThis.firebaseAdminApp) {
    return globalThis.firebaseAdminApp;
  }

  // --- Absolute Validation ---
  if (!process.env.FIREBASE_PROJECT_ID) {
    throw new Error('Firebase admin initialization failed: Missing FIREBASE_PROJECT_ID from .env file.');
  }
  if (!process.env.FIREBASE_CLIENT_EMAIL) {
    throw new Error('Firebase admin initialization failed: Missing FIREBASE_CLIENT_EMAIL from .env file.');
  }
  if (!process.env.FIREBASE_PRIVATE_KEY) {
    throw new Error('Firebase admin initialization failed: Missing FIREBASE_PRIVATE_KEY from .env file.');
  }
  // --- End Validation ---

  try {
    const serviceAccount = {
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      // Restore newlines in the private key
      privateKey: (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
    };
    
    const app = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    });
    
    globalThis.firebaseAdminApp = app;
    return app;

  } catch (error: any) {
    console.error('Firebase admin initialization error', error.stack);
    // Re-throw the error to make it clear that initialization failed.
    throw new Error('Firebase admin initialization failed: ' + error.message);
  }
}

// Initialize the app on module load to ensure it's ready for use.
initializeFirebaseAdmin();

/**
 * Gets the Firebase Auth instance from the initialized Admin App.
 * @returns {admin.auth.Auth} The Firebase Auth service.
 */
export function getAuth(): admin.auth.Auth {
    if (!globalThis.firebaseAdminApp) {
        initializeFirebaseAdmin();
    }
    return admin.auth(globalThis.firebaseAdminApp);
}

/**
 * Gets the Firestore instance from the initialized Admin App.
 * @returns {admin.firestore.Firestore} The Firestore service.
 */
export function getDb(): admin.firestore.Firestore {
    if (!globalThis.firebaseAdminApp) {
        initializeFirebaseAdmin();
    }
    return admin.firestore(globalThis.firebaseAdminApp);
}
