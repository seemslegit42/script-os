
"use client";

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { 
  collection, 
  addDoc, 
  onSnapshot, 
  query, 
  where,
  QueryConstraint,
  orderBy
} from 'firebase/firestore';
import { useAuth } from '@/context/auth-context';

/**
 * A custom hook for interacting with a Firestore collection.
 * It provides real-time data fetching, loading and error states, and a function to add new documents.
 * Queries are automatically re-run when the user's authentication state changes.
 * @param {string} collectionName - The name of the Firestore collection to interact with.
 * @param {QueryConstraint[] | null} queryConstraints - An array of Firestore query constraints (e.g., where, orderBy).
 * @returns {{
*   documents: any[],
*   loading: boolean,
*   error: string | null,
*   addDocument: (data: object) => Promise<void>
* }} An object containing the documents, loading state, error state, and an addDocument function.
*/
export const useFirestore = (collectionName: string, queryConstraints: QueryConstraint[] | null = null) => {
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    // If there are constraints that likely depend on a user (e.g., checking a userId field)
    // but the user is not logged in, don't execute the query.
    if (queryConstraints && !user) {
        setDocuments([]);
        setLoading(false);
        return;
    }

    let q;
    const collectionRef = collection(db, collectionName);
    
    // Apply query constraints if they are provided
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

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [collectionName, user]); // Rerun effect if collectionName or user changes

  /**
   * Adds a new document to the specified Firestore collection.
   * @param {object} data - The data to be added as a new document.
   * @throws {Error} If the document could not be added.
   */
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
