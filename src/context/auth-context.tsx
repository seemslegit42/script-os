
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
  signInWithPopup
} from 'firebase/auth';
import { app } from '@/lib/firebase';
import { useRouter } from 'next/navigation';

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
  signUp: (email: string, password: string) => Promise<any>;
  signIn: (email: string, password: string) => Promise<any>;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<any>;
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
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [auth]);

  const signUp = (email: string, password: string) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const signIn = (email: string, password: string) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
    // After signing out from Firebase on the client, we need to clear the server-side session cookie.
    await fetch('/api/auth/signout');
    router.push('/');
  };

  const signInWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider);
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
