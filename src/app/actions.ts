
'use server';

import { z } from 'zod';
import { beep } from '@/ai/flows/beep-flow';
import { BeepOutput } from '@/lib/types';
import { signOut as firebaseSignOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { redirect } from 'next/navigation';

/**
 * Server action to handle user sign-out.
 */
export async function signOut() {
  // This would be more robust in a real app with session management
  // For now, we sign out of the Firebase client instance
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    console.error("Firebase sign-out error:", error);
  }
  // And redirect to login
  redirect('/login');
}


/**
 * Server action that acts as the bridge between the client and the BEEP agent.
 * @param {string} command - The user's command text.
 * @returns {Promise<BeepOutput>} The structured output from the BEEP agent.
 */
export async function processUserCommand(command: string): Promise<BeepOutput> {
    try {
        const response = await beep({ command });
        return response;
    } catch (error) {
        console.error("Error processing BEEP command:", error);
        return {
            response: "Aegis Alert: The BEEP agent has encountered a critical error. The command could not be processed.",
        };
    }
}
