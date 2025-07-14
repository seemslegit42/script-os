
import { getDocs } from '@/lib/docs';
import Link from 'next/link';
import { Header } from '@/components/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookCopy } from 'lucide-react';

/**
 * A server component that serves as the main library page.
 * It fetches a list of all canonical documents and displays them as a navigable list.
 * @returns {Promise<React.ReactElement>} The rendered library page.
 */
export default async function LibraryPage() {
  const docs = await getDocs();

  // Sort docs alphabetically by title
  const sortedDocs = docs.sort((a, b) => (a.title || '').localeCompare(b.title || ''));

  return (
    <>
      <Header />
      <main className="container mx-auto max-w-6xl py-24 px-4">
        <div className="text-center mb-12">
            <h1 className="text-4xl font-bold sigil-obelisk text-primary-foreground">The Scriptorium Library</h1>
            <p className="text-lg text-muted-foreground mt-2 sigil-codex">The complete canon of foundational scriptures.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedDocs.map((doc) => (
                <Link href={`/library/${doc.id}`} key={doc.id} passHref>
                    <Card className="h-full bg-card/70 backdrop-blur-sm border-primary/20 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 flex flex-col group">
                        <CardHeader>
                            <CardTitle className="sigil-obelisk text-lg flex items-center gap-3 text-primary-foreground group-hover:text-primary transition-colors">
                                <BookCopy className="text-primary h-5 w-5"/>
                                {doc.title}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex-grow">
                           <p className="text-sm text-muted-foreground line-clamp-3 sigil-codex">
                            {/* A short description could be generated here in the future */}
                            Explore the scripture known as &quot;{doc.title}&quot;.
                           </p>
                        </CardContent>
                    </Card>
                </Link>
            ))}
        </div>
      </main>
    </>
  );
}
