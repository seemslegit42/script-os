// src/lib/treasury.ts
'use server';

/**
 * @fileOverview The Treasury of ΛΞVON OS.
 * This artifact manages the entire sovereign economy of ΞCredits.
 * It is the sole authority for minting, transferring, and recording credits.
 * All operations are designed to be atomic and secure under the watch of Aegis.
 */

import { getDb } from '@/lib/firebase-admin';
import * as admin from 'firebase-admin';

const db = getDb();
const usersCollection = db.collection('users');

const INITIAL_ENDOWMENT = 1000;
const BINDING_AWARD = 150;

/**
 * Creates a new user record in Firestore and grants them their initial endowment of ΞCredits.
 * This is invoked once upon successful user sign-up.
 * @param {string} userId - The unique ID of the new user.
 * @returns {Promise<void>}
 */
export async function grantInitialEndowment(userId: string): Promise<void> {
  try {
    const userRef = usersCollection.doc(userId);
    await userRef.set({
      credits: INITIAL_ENDOWMENT,
      sovereigntyClass: 'Initiate',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  } catch (error) {
    console.error(`Treasury Error: Failed to grant initial endowment to user ${userId}`, error);
    // In a real system, this would trigger an alert to Aegis.
    throw new Error('Failed to complete financial initiation.');
  }
}

/**
 * Awards a user ΞCredits for the sacred act of binding a new scripture to their Scriptorium.
 * @param {string} userId - The ID of the user to receive the award.
 * @returns {Promise<void>}
 */
export async function awardCreditForBinding(userId: string): Promise<void> {
    try {
        const userRef = usersCollection.doc(userId);
        // Use a transaction to ensure atomic update
        await db.runTransaction(async (transaction) => {
            const userDoc = await transaction.get(userRef);
            if (!userDoc.exists) {
                // This case should ideally not happen if grantInitialEndowment is called on signup
                // But as a fallback, we create the user document.
                transaction.set(userRef, {
                    credits: BINDING_AWARD,
                    sovereigntyClass: 'Initiate',
                });
            } else {
                transaction.update(userRef, {
                    credits: admin.firestore.FieldValue.increment(BINDING_AWARD)
                });
            }
        });
    } catch (error) {
        console.error(`Treasury Error: Failed to award binding credit to user ${userId}`, error);
        // Aegis alert
        throw new Error('Failed to award credit for binding.');
    }
}
