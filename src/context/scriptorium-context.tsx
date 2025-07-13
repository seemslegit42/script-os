
'use client';

import { Scripture } from '@/lib/types';
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

const SCRIPTORIUM_STORAGE_KEY = 'scriptorium-saved-scriptures';

interface ScriptoriumContextType {
  savedScriptures: Scripture[];
  addScripture: (scripture: Scripture) => void;
  deleteScripture: (scriptureId: string) => void;
}

const ScriptoriumContext = createContext<ScriptoriumContextType | undefined>(undefined);

export const ScriptoriumProvider = ({ children }: { children: ReactNode }) => {
  const [savedScriptures, setSavedScriptures] = useState<Scripture[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    try {
      const item = window.localStorage.getItem(SCRIPTORIUM_STORAGE_KEY);
      const scriptures = item ? JSON.parse(item) : [];
      setSavedScriptures(scriptures);
    } catch (error) {
      console.error("Failed to load scriptures from localStorage", error);
      setSavedScriptures([]);
    }
  }, []);

  const addScripture = (scripture: Scripture) => {
    setSavedScriptures(prevScriptures => {
      const newScriptures = [...prevScriptures, scripture];
      try {
        window.localStorage.setItem(SCRIPTORIUM_STORAGE_KEY, JSON.stringify(newScriptures));
      } catch (error) {
        console.error("Failed to save scripture to localStorage", error);
        toast({
          title: "Error Saving Scripture",
          description: "Could not save scripture to local storage. It will be available for this session only.",
          variant: "destructive",
        });
      }
      return newScriptures;
    });
  };

  const deleteScripture = (scriptureId: string) => {
    setSavedScriptures(prevScriptures => {
        const newScriptures = prevScriptures.filter(s => s.id !== scriptureId);
        try {
            window.localStorage.setItem(SCRIPTORIUM_STORAGE_KEY, JSON.stringify(newScriptures));
        } catch (error) {
            console.error("Failed to update localStorage after deletion", error);
            toast({
                title: "Error Deleting Scripture",
                description: "Could not remove scripture from local storage.",
                variant: "destructive",
            });
        }
        return newScriptures;
    });
  };

  return (
    <ScriptoriumContext.Provider value={{ savedScriptures, addScripture, deleteScripture }}>
      {children}
    </ScriptoriumContext.Provider>
  );
};

export const useScriptorium = () => {
  const context = useContext(ScriptoriumContext);
  if (context === undefined) {
    throw new Error('useScriptorium must be used within a ScriptoriumProvider');
  }
  return context;
};
