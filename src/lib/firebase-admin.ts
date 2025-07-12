// src/lib/firebase-admin.ts
import * as admin from 'firebase-admin';
import { serviceAccount } from './service-account';

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
  if (!serviceAccount.project_id) {
    throw new Error('Firebase admin initialization failed: Missing project_id from service-account.ts');
  }
  if (!serviceAccount.client_email) {
    throw new Error('Firebase admin initialization failed: Missing client_email from service-account.ts');
  }
  if (!serviceAccount.private_key) {
    throw new Error('Firebase admin initialization failed: Missing private_key from service-account.ts');
  }
  // --- End Validation ---

  try {
    const app = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
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
