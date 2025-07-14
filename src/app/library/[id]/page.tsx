
import { getDocs } from '@/lib/docs';
import { notFound } from 'next/navigation';
import { Header } from '@/components/header';
import { Annotator } from '@/components/annotator';
import { marked } from 'marked';

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
  
  const parsedHtml = marked.parse(doc.markdown || '');

  return (
    <>
      <Header />
      <main className="container mx-auto max-w-5xl py-24 px-4">
        <div className="flex flex-col lg:flex-row lg:gap-8">
            {/* Thematic Navigation Sidebar (Placeholder) */}
            <aside className="w-full lg:w-1/4 mb-8 lg:mb-0">
                <div className="sticky top-24">
                    <h3 className="text-lg font-bold sigil-obelisk text-primary mb-4">Nexus Weave</h3>
                    <p className="text-sm text-muted-foreground sigil-codex">
                        Related scriptures will be woven here, guiding your journey through the canon. (Coming soon)
                    </p>
                </div>
            </aside>

            {/* Main Content: The Scribe's Scroll */}
            <article className="prose prose-invert max-w-none w-full lg:w-3/4 sigil-codex prose-headings:sigil-obelisk prose-headings:text-primary prose-code:sigil-glyph prose-code:bg-black/30 prose-code:p-1 prose-code:rounded">
              <Annotator contentId={doc.id}>
                <h1>{doc.title}</h1>
                <div dangerouslySetInnerHTML={{ __html: parsedHtml }} />
              </Annotator>
            </article>
        </div>
      </main>
    </>
  );
}
