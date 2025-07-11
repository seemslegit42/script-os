
"use client";

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { 
  collection, 
  addDoc, 
  onSnapshot, 
  query, 
  where,
  QueryConstraint
} from 'firebase/firestore';
import { useAuth } from '@/context/auth-context';

export const useFirestore = (collectionName: string, queryConstraints: QueryConstraint[] | null = null) => {
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    // If there are constraints but no user, don't query.
    if (queryConstraints && !user) {
        setDocuments([]);
        setLoading(false);
        return;
    }

    const collectionRef = collection(db, collectionName);
    let q = query(collectionRef);

    if(queryConstraints){
        q = query(collectionRef, ...queryConstraints);
    }
    
    setLoading(true);

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setDocuments(docs);
      setLoading(false);
    }, (err) => {
      console.error(err);
      setError('Failed to fetch documents.');
      setLoading(false);
    });

    return () => unsubscribe();
  }, [collectionName, user]); // Rerun if collection or user changes

  const addDocument = async (data: object) => {
    try {
      await addDoc(collection(db, collectionName), data);
    } catch (e: any) {
      console.error("Error adding document: ", e);
      throw new Error("Could not add document.");
    }
  };

  return { documents, loading, error, addDocument };
};
