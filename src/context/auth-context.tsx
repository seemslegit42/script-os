
'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { 
  Auth, 
  User, 
  getAuth, 
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  GoogleAuthProvider,
  signInWithPopup,
  UserCredential
} from 'firebase/auth';
import { app } from '@/lib/firebase';
import { grantInitialEndowment } from '@/lib/treasury';

/**
 * The context type for authentication-related data and functions.
 * @property {User | null} user - The currently authenticated Firebase user object, or null if not logged in.
 * @property {boolean} loading - A boolean that is true while the authentication state is being determined.
 * @property {Auth} auth - The Firebase Auth instance.
 * @property {(email: string, password: string) => Promise<any>} signUp - Function to create a new user with email and password.
 * @property {(email: string, password: string) => Promise<any>} signIn - Function to sign in a user with email and password.
 * @property {() => Promise<void>} signOut - Function to sign out the current user.
 * @property {() => Promise<any>} signInWithGoogle - Function to sign in a user with a Google account popup.
 */
interface AuthContextType {
  user: User | null;
  loading: boolean;
  auth: Auth;
  signUp: (email: string, password: string) => Promise<UserCredential>;
  signIn: (email: string, password: string) => Promise<UserCredential>;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<UserCredential>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * A provider component that wraps the application and makes authentication state available to any child components.
 * It handles user session management and provides functions for sign-up, sign-in, and sign-out.
 * @param {{ children: ReactNode }} props - The child components to be rendered within the provider.
 */
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const auth = getAuth(app);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const idToken = await user.getIdToken();
        // Send the token to your API route to set the session cookie
        await fetch('/api/auth/signin', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${idToken}`
            }
        });
      }
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [auth]);

  const handleNewUser = async (userCredential: UserCredential) => {
    const isNewUser = userCredential.user && (await userCredential.user.getIdTokenResult()).claims.auth_time === (await userCredential.user.getIdTokenResult()).claims.iat;

    const user = userCredential.user;
    if (user) {
        // A simple check for new user creation, though metadata is more reliable.
        // For Google Sign-In, we check if the user doc exists.
        const userDocRef = (await import('firebase/firestore')).doc( (await import('@/lib/firebase')).db, 'users', user.uid);
        const userDoc = await (await import('firebase/firestore')).getDoc(userDocRef);

        if (!userDoc.exists()) {
             await grantInitialEndowment(user.uid);
        }
    }
  };

  const signUp = async (email: string, password: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await grantInitialEndowment(userCredential.user.uid);
    return userCredential;
  };

  const signIn = (email: string, password: string) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
    // After signing out from Firebase on the client, we need to clear the server-side session cookie.
    await fetch('/api/auth/signout');
  };

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);
    await handleNewUser(userCredential);
    return userCredential;
  }

  const value = { user, loading, auth, signUp, signIn, signOut, signInWithGoogle };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * A custom hook to access the authentication context.
 * It provides an easy way to get the current user and authentication functions.
 * @returns {AuthContextType} The authentication context.
 * @throws {Error} If used outside of an `AuthProvider`.
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
