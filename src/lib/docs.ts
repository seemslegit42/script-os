
import fs from 'fs';
import path from 'path';
import { marked } from 'marked';
import { Scripture } from './types';

const docsDirectory = path.join(process.cwd(), 'docs');

// Simple in-memory cache for the documents.
// This is safe on the server-side. The cache will be cleared on server restart,
// which is appropriate as new docs would require a restart to be detected anyway.
let docsCache: Scripture[] | null = null;


/**
 * Reads all markdown files from the /docs directory, parses them, and returns them as a structured array.
 * Uses an in-memory cache to avoid reading from the filesystem on every request.
 * @returns {Promise<Array<{id: string, title: string, html: string, markdown: string}>>} An array of document objects.
 */
export async function getDocs(): Promise<Scripture[]> {
  if (docsCache) {
    return docsCache;
  }

  const fileNames = fs.readdirSync(docsDirectory);
  const allDocsData = await Promise.all(fileNames.map(async (fileName) => {
    // Remove ".md" from file name to get id
    const id = fileName.replace(/\.md$/, '');
    
    // Create a title from the file name (e.g., 'agentic-operating-system' -> 'Agentic Operating System')
    const title = id.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

    // Read markdown file as string
    const fullPath = path.join(docsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');

    // Use marked to parse markdown into HTML
    const html = await marked(fileContents);

    // Combine the data with the id
    return {
      id,
      title,
      html,
      markdown: fileContents
    };
  }));

  docsCache = allDocsData;
  return allDocsData;
}
