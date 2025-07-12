
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

  try {
    const serviceAccount = {
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      clientEmail: process.env.NEXT_PUBLIC_FIREBASE_CLIENT_EMAIL,
      privateKey: (process.env.NEXT_PUBLIC_FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
    } as admin.ServiceAccount;

    if (!serviceAccount.projectId || !serviceAccount.clientEmail || !serviceAccount.privateKey) {
       // This check is primarily for developer feedback, as missing creds will cause a crash anyway.
       // In a production environment, these should always be set.
       if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
        console.warn(
          'Firebase admin credentials not found. Some server-side functionality may not work.'
        );
       }
    }

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

// Initialize the app on module load
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
