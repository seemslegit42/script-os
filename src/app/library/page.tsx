
import { Header } from '@/components/header';
import { ScribeSigil } from '@/components/icons';
import { getDocs } from '@/lib/docs';
import Link from 'next/link';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';

/**
 * The main library page, envisioned as the "Grand Hall" or "Pantheon."
 * It displays all available scriptures as a constellation of Aetheric Sigils
 * orbiting a central, larger sigil representing the Obelisk of Knowledge.
 * @returns {Promise<React.ReactElement>} The rendered library pantheon page.
 */
export default async function LibraryPage() {
  const docs = await getDocs();

  return (
    <>
      <Header />
      <main className="container mx-auto max-w-6xl py-24 px-4">
        <div className="text-center mb-12">
            <h1 className="text-4xl font-bold sigil-obelisk text-primary-foreground">The Scriptorium</h1>
            <p className="text-lg text-muted-foreground sigil-codex mt-2">A pantheon of self-contained truths from the Nexus canon.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {docs.map((doc) => (
            <Link href={`/library/${doc.id}`} key={doc.id} passHref>
              <Card className="h-full bg-card/50 backdrop-blur-sm border-primary/10 hover:border-primary/30 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-primary/20 flex flex-col items-center justify-center p-6 text-center">
                <ScribeSigil className="h-16 w-16 text-primary mb-4" />
                <CardHeader>
                  <CardTitle className="sigil-obelisk text-lg leading-tight text-primary-foreground">{doc.title}</CardTitle>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </main>
    </>
  );
}
