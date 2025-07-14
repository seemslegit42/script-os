
import { Header } from '@/components/header';
import { ScribeSigil } from '@/components/icons';
import Link from 'next/link';

/**
 * The former library hub, now repurposed to guide the user towards the Oracle.
 * It no longer displays a list of documents, reinforcing the BEEP-first interaction model.
 * @returns {Promise<React.ReactElement>} The rendered guidance page.
 */
export default async function LibraryPage() {

  return (
    <>
      <Header />
      <main className="container mx-auto max-w-6xl py-24 px-4 h-screen flex items-center justify-center">
        <div className="text-center mb-12 flex flex-col items-center gap-6 text-muted-foreground">
            <ScribeSigil className="h-24 w-24 text-primary/50" />
            <h1 className="text-3xl font-bold sigil-obelisk text-primary-foreground">The Scriptorium Awaits Your Query</h1>
            <p className="text-lg sigil-codex max-w-2xl">
              The path to knowledge is not through browsing, but through intent. The canon is vast, its secrets deep.
              Return to the <Link href="/" className="text-primary hover:underline">Oracle</Link> and state your purpose. BEEP will unveil the scripture you seek.
            </p>
        </div>
      </main>
    </>
  );
}
