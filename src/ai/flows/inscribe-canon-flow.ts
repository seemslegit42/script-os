
'use server';
/**
 * @fileOverview A flow for inscribing the entire canon into a vector database.
 *
 * This file defines a one-time Genkit flow that reads all documentation,
 * generates vector embeddings for each document, and stores them in Firestore
 * to create a persistent, searchable long-term memory for the Oracle.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { getDocs } from '@/lib/docs';
import { embed } from 'genkit';
import { textEmbedding004 } from '@genkit-ai/googleai';
import { Firestore, FieldValue } from '@google-cloud/firestore';

// Define the structure of a document in our vector collection
const ScriptureVectorSchema = z.object({
  text: z.string(),
  title: z.string(),
  docId: z.string(),
  embedding: z.custom<FieldValue>(), // Use custom to allow FieldValue
});
type ScriptureVector = z.infer<typeof ScriptureVectorSchema>;


let db: Firestore;

function getDb() {
    if (!db) {
        // Check for emulator environment
        if (process.env.FIRESTORE_EMULATOR_HOST) {
            console.log(`Connecting to Firestore emulator at ${process.env.FIRESTORE_EMULATOR_HOST}`);
            db = new Firestore({
                host: process.env.FIRESTORE_EMULATOR_HOST,
                projectId: process.env.GCP_PROJECT_ID || 'demo-project', // Default project for emulator
                ssl: false,
            });
        } else {
            console.log('Connecting to production Firestore.');
            db = new Firestore({
                projectId: process.env.GCP_PROJECT_ID!,
                credentials: {
                  client_email: process.env.GCP_CLIENT_EMAIL!,
                  private_key: process.env.GCP_PRIVATE_KEY!.replace(/\\n/g, '\n'),
                },
            });
        }
    }
    return db;
}


/**
 * The main flow for inscribing the canon.
 * Reads all docs, generates embeddings, and saves them to Firestore.
 */
export const inscribeCanon = ai.defineFlow(
  {
    name: 'inscribeCanonFlow',
    inputSchema: z.void(),
    outputSchema: z.object({ count: z.number() }),
  },
  async () => {
    // 1. Fetch all canonical documents
    const scriptures = await getDocs();
    if (!scriptures || scriptures.length === 0) {
      throw new Error("The canonical scriptures could not be found or are empty.");
    }
    console.log(`Found ${scriptures.length} scriptures to inscribe.`);

    // 2. Generate embeddings for all documents
    console.log('Generating embeddings for all scriptures...');
    const embeddings = await embed({
      embedder: textEmbedding004,
      content: scriptures.map(doc => `${doc.title}\n\n${doc.markdown}`), // Embed title with content for better context
    });

    // 3. Prepare documents for Firestore
    const firestoreDb = getDb();
    const collectionRef = firestoreDb.collection('scriptures');
    const batch = firestoreDb.batch();

    scriptures.forEach((scripture, i) => {
        const docRef = collectionRef.doc(scripture.id);
        const documentToAdd: ScriptureVector = {
            text: scripture.markdown!,
            title: scripture.title!,
            docId: scripture.id,
            embedding: FieldValue.vector(embeddings[i]),
        };
        batch.set(docRef, documentToAdd);
    });

    // 4. Commit the batch to Firestore
    console.log('Inscribing documents into the vector memory (Firestore)...');
    await batch.commit();

    return { count: scriptures.length };
  }
);
