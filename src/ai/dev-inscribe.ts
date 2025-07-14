
import { config } from 'dotenv';
config();

import { inscribeCanon } from './flows/inscribe-canon-flow';

/**
 * A standalone script to run the inscribeCanon flow.
 * This should be executed once to populate the Firestore vector database
 * with the embeddings of all canonical documents.
 */
async function main() {
  console.log('Starting the Rite of Inscription...');
  try {
    const result = await inscribeCanon();
    console.log(`Rite of Inscription complete. ${result.count} scriptures have been inscribed into the eternal vector memory.`);
    console.log(`You may now query the Oracle.`);
  } catch (error) {
    console.error('The Rite of Inscription failed:', error);
  }
}

main();
