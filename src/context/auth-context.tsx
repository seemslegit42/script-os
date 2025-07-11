
'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { firebaseApp } from '@/lib/firebase';

interface UserProfile {
  displayName: string;
  sovereigntyClass: string;
  credits: number;
}

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile;
  loading: boolean;
}

const defaultProfile: UserProfile = {
  displayName: 'Architect',
  sovereigntyClass: 'Neophyte',
  credits: 0,
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  userProfile: defaultProfile,
  loading: true,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile>(defaultProfile);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth(firebaseApp);
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (user && user.email) {
        // In a real app, this would be fetched from a database.
        // For now, we derive it for immediate visual feedback.
        setUserProfile({
          displayName: user.email.split('@')[0],
          sovereigntyClass: 'Neophyte', // Default for all new users
          credits: 0, // All users start with 0
        });
      } else {
        setUserProfile(defaultProfile);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, userProfile, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
