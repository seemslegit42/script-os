
"use client";

// This hook is no longer used in the documentation-site architecture,
// as all content is fetched from the local /docs directory.
// It is kept for reference or potential future use cases.

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { 
  collection, 
  onSnapshot, 
  query, 
  orderBy,
  QueryConstraint
} from 'firebase/firestore';

/**
 * A custom hook for interacting with a Firestore collection.
 * It provides real-time data fetching, loading and error states.
 * @param {string} collectionName - The name of the Firestore collection to interact with.
 * @param {QueryConstraint[] | null} queryConstraints - An array of Firestore query constraints.
 * @returns {{
*   documents: any[],
*   loading: boolean,
*   error: string | null,
* }} An object containing the documents, loading state, and error state.
*/
export const useFirestore = (collectionName: string, queryConstraints: QueryConstraint[] | null = null) => {
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let q;
    const collectionRef = collection(db, collectionName);
    
    if(queryConstraints){
        q = query(collectionRef, ...queryConstraints, orderBy('createdAt', 'desc'));
    } else {
        q = query(collectionRef, orderBy('createdAt', 'desc'));
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
  }, [collectionName, queryConstraints]);

  return { documents, loading, error };
};
