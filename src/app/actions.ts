
'use server';

import { z } from 'zod';
import { beep } from '@/ai/flows/beep-flow';
import { BeepOutput } from '@/lib/types';
import { signOut as firebaseSignOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { redirect } from 'next/navigation';
import { getAuth as getAdminAuth } from 'firebase-admin/auth';
import { adminApp } from '@/lib/firebase-admin';
import { Resend } from 'resend';

/**
 * Server action to handle user sign-out.
 */
export async function signOut() {
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    console.error("Firebase sign-out error:", error);
  }
  redirect('/login');
}

/**
 * Initiates the passwordless login process by generating a magic link and emailing it to the user.
 * This is a server-side action for security.
 * @param {string} email - The user's email address.
 * @returns {Promise<{success: boolean, error?: string}>} An object indicating success or failure.
 */
export async function initiateMagicLinkLogin(email: string) {
  const emailSchema = z.string().email();
  const validation = emailSchema.safeParse(email);

  if (!validation.success) {
    return { success: false, error: 'Invalid email address provided.' };
  }

  const adminAuth = getAdminAuth(adminApp);
  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    // Check if user exists. Firebase Admin SDK doesn't have a simple "exists" check,
    // so we try to get the user and create them if they don't exist.
    try {
      await adminAuth.getUserByEmail(email);
    } catch (error: any) {
      if (error.code === 'auth/user-not-found') {
        console.log(`User not found for ${email}. Creating new user.`);
        await adminAuth.createUser({ email });
      } else {
        throw error; // Re-throw other errors
      }
    }
    
    const actionCodeSettings = {
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/callback`, // The URL to redirect to after link is clicked
      handleCodeInApp: true,
    };

    const link = await adminAuth.generateSignInWithEmailLink(email, actionCodeSettings);

    await resend.emails.send({
      from: 'oracle@aevonos.com',
      to: email,
      subject: 'The Echo: Your Path to the Canvas',
      html: `
        <div style="font-family: sans-serif; text-align: center;">
          <h2>A path has opened.</h2>
          <p>To cross the threshold, you must follow this echo before it fades.</p>
          <a href="${link}" style="display: inline-block; padding: 10px 20px; background-color: #6A0DAD; color: white; text-decoration: none; border-radius: 5px;">
            Cross the Threshold
          </a>
          <p style="font-size: 0.8em; color: #888;">This echo will dissipate in 15 minutes.</p>
        </div>
      `,
    });

    return { success: true };

  } catch (error) {
    console.error('Magic link generation failed:', error);
    return { success: false, error: 'Could not initiate login process.' };
  }
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
