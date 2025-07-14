
import { getDocs } from '@/lib/docs';
import { notFound } from 'next/navigation';
import { Header } from '@/components/header';

/**
 * Defines the props for the DocPage component.
 * @property {{ id: string }} params - The route parameters, containing the ID of the document to display.
 */
type DocPageProps = {
  params: {
    id: string;
  };
};

/**
 * Generates the static paths for all documentation pages at build time.
 * This function reads all documents from the /docs directory and creates a route for each one.
 * @returns {Promise<Array<{id: string}>>} An array of objects, where each object has an `id` property corresponding to a document.
 */
export async function generateStaticParams() {
  const docs = await getDocs();
  return docs.map((doc) => ({
    id: doc.id,
  }));
}

/**
 * A server component that dynamically renders a page for a single documentation scripture.
 * It fetches the content of the specified document and displays it.
 * If the document is not found, it triggers a 404 page.
 * @param {DocPageProps} props - The component's props, including the document ID from the URL.
 * @returns {Promise<React.ReactElement>} The rendered page element for the document.
 */
export default async function DocPage({ params }: DocPageProps) {
  const docs = await getDocs();
  const doc = docs.find((d) => d.id === params.id);

  if (!doc) {
    notFound();
  }

  return (
    <>
      <Header />
      <main className="container mx-auto max-w-4xl py-24 px-4">
        <article className="prose prose-invert max-w-none sigil-codex prose-headings:sigil-obelisk prose-headings:text-primary prose-code:sigil-glyph prose-code:bg-black/30 prose-code:p-1 prose-code:rounded">
          <h1>{doc.title}</h1>
          <div dangerouslySetInnerHTML={{ __html: doc.html || '' }} />
        </article>
      </main>
    </>
  );
}
