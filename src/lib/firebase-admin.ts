
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
    // Construct the service account object from environment variables.
    const serviceAccount = {
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      // The private key must be correctly formatted. Environment variables often
      // store it as a single line with escaped newlines.
      privateKey: process.env.FIREBASE_PRIVATE_KEY
        ? JSON.parse(process.env.FIREBASE_PRIVATE_KEY)
        : undefined,
    } as admin.ServiceAccount;
    
    // Validate that all required credentials are provided
    if (!serviceAccount.projectId || !serviceAccount.clientEmail || !serviceAccount.privateKey) {
       if (process.env.NODE_ENV === 'development') {
        console.warn(
          'Firebase admin credentials not found. Some server-side functionality may not work.'
        );
       }
        throw new Error('Missing Firebase Admin credentials. Check your .env file.');
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
