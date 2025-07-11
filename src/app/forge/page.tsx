
"use client";

import { useAuth } from '@/context/auth-context';
import { useFirestore } from '@/hooks/use-firestore';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Swords, ArrowLeft, BookOpen } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';
import { FocusLayer } from '@/components/focus-layer';
import { UploadSigil } from './upload-sigil';
import { InterrogationPanel } from './interrogation-panel';
import { ScribeGlyph } from '@/components/icons';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getDocsAction } from './actions';
import { Separator } from '@/components/ui/separator';

type Doc = {
    id: string;
    title: string;
    html: string;
    markdown: string;
}

export default function ForgePage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [selectedSigil, setSelectedSigil] = useState<any>(null);
  const [docs, setDocs] = useState<Doc[]>([]);
  const [docsLoading, setDocsLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/');
    }
  }, [user, authLoading, router]);
  
  useEffect(() => {
    const fetchDocs = async () => {
        setDocsLoading(true);
        const fetchedDocs = await getDocsAction();
        setDocs(fetchedDocs);
        setDocsLoading(false);
    }
    fetchDocs();
  }, []);

  const { documents: sigils, loading: sigilsLoading } = useFirestore(
    'sigils',
    user ? [['userId', '==', user.uid]] : null
  );

  const handleBack = () => {
    if (selectedSigil) {
      setSelectedSigil(null);
    } else {
      router.push('/');
    }
  }

  if (authLoading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <ScribeGlyph className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  if (selectedSigil) {
    const sigilContext = selectedSigil.html || `${selectedSigil.why}\n\n${selectedSigil.how}`;
    return (
        <main className="container mx-auto p-4 sm:p-8 h-screen flex flex-col">
             <header className="flex justify-between items-center mb-4 flex-shrink-0">
                <h1 className="text-2xl md:text-4xl sigil-obelisk text-primary flex items-center gap-4 truncate">
                    {selectedSigil.query || selectedSigil.fileName || selectedSigil.title}
                </h1>
                <Button onClick={handleBack} variant="outline" size="sm">
                  <ArrowLeft className="mr-2"/>
                  Back to Forge
                </Button>
            </header>
            <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-6 min-h-0">
                <Card className="bg-card/70 backdrop-blur-sm border border-primary/20 shadow-lg shadow-primary/10 flex flex-col">
                    <CardContent className="p-6 flex-grow min-h-0">
                      <ScrollArea className="h-full pr-4">
                        <div className="space-y-6">
                            {selectedSigil.imageUrl && (
                                <Image 
                                    src={selectedSigil.imageUrl}
                                    alt={`Sigil for ${selectedSigil.query}`}
                                    width={1024}
                                    height={576}
                                    className="w-full h-auto rounded-lg border border-primary/30 aspect-video object-cover"
                                />
                            )}
                            {selectedSigil.html ? (
                                <div
                                    className="prose prose-invert max-w-none sigil-codex prose-headings:sigil-obelisk prose-headings:text-primary prose-code:sigil-glyph prose-code:bg-black/30 prose-code:p-1 prose-code:rounded"
                                    dangerouslySetInnerHTML={{ __html: selectedSigil.html }}
                                />
                            ) : (
                                <FocusLayer whyContent={selectedSigil.why} howContent={selectedSigil.how} />
                            )}
                        </div>
                      </ScrollArea>
                    </CardContent>
                </Card>
                 <InterrogationPanel context={sigilContext} />
            </div>
        </main>
    );
  }
  
  return (
    <main className="container mx-auto p-4 sm:p-8">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-4xl sigil-obelisk text-primary flex items-center gap-4">
          <Swords className="h-10 w-10" />
          The Scriptorium
        </h1>
        <Button onClick={() => router.push('/')}>Back to Scribe</Button>
      </header>

      <div className="mb-12">
        <UploadSigil />
      </div>

      <Separator className="my-12 bg-primary/20" />

       <div className="space-y-8">
        <div>
          <h2 className="text-3xl sigil-obelisk mb-6 flex items-center gap-3"><ScribeGlyph className="h-8 w-8" /> My Scriptures</h2>
           {sigilsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 3 }).map((_, i) => (
                 <Card key={i} className="bg-card/70 backdrop-blur-sm border-primary/20">
                   <CardHeader>
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                   </CardHeader>
                   <CardContent>
                      <Skeleton className="w-full aspect-video" />
                   </CardContent>
                </Card>
              ))}
            </div>
          ) : sigils.length === 0 ? (
            <Card className="text-center p-12 bg-card/70 backdrop-blur-sm border-primary/20">
                <CardHeader>
                    <ScribeGlyph className="h-16 w-16 mx-auto text-muted-foreground" />
                    <CardTitle className="mt-4">Your Forge is Empty</CardTitle>
                </CardHeader>
                <CardContent>
                    <CardDescription>
                        Generate sigils with the Scribe or upload your own scriptures.
                    </CardDescription>
                </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sigils.map((sigil: any) => (
                <Card 
                    key={sigil.id} 
                    className="flex flex-col bg-card/70 backdrop-blur-sm border-primary/20 overflow-hidden hover:border-accent hover:shadow-lg hover:shadow-accent/10 transition-all cursor-pointer"
                    onClick={() => setSelectedSigil(sigil)}
                >
                    <CardHeader>
                        <CardTitle className="sigil-codex truncate">{sigil.query || sigil.fileName}</CardTitle>
                        <CardDescription>
                            {sigil.createdAt?.seconds ? new Date(sigil.createdAt.seconds * 1000).toLocaleDateString() : 'Just now'}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow flex flex-col justify-end">
                      {sigil.imageUrl ? (
                          <Image
                            src={sigil.imageUrl}
                            alt={`Sigil for ${sigil.query}`}
                            width={512}
                            height={288}
                            className="w-full h-auto object-cover rounded-md aspect-video"
                          />
                      ) : (
                        <div className="w-full aspect-video bg-background/50 rounded-md flex items-center justify-center">
                            <ScribeGlyph className="h-16 w-16 text-muted-foreground/50"/>
                        </div>
                      )}
                    </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        <div>
          <h2 className="text-3xl sigil-obelisk mb-6 flex items-center gap-3"><BookOpen className="h-8 w-8" /> Canonical Doctrine</h2>
           {docsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 2 }).map((_, i) => (
                 <Card key={i} className="bg-card/70 backdrop-blur-sm border-primary/20">
                   <CardHeader>
                      <Skeleton className="h-6 w-3/4" />
                   </CardHeader>
                   <CardContent>
                    <div className="w-full aspect-video bg-background/50 rounded-md flex items-center justify-center">
                        <BookOpen className="h-16 w-16 text-muted-foreground/50"/>
                    </div>
                   </CardContent>
                </Card>
              ))}
            </div>
          ) : (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {docs.map((doc) => (
                    <Card 
                        key={doc.id}
                        className="flex flex-col bg-card/70 backdrop-blur-sm border-primary/20 overflow-hidden hover:border-accent hover:shadow-lg hover:shadow-accent/10 transition-all cursor-pointer"
                        onClick={() => setSelectedSigil({ ...doc, html: doc.html, context: doc.markdown })}
                    >
                        <CardHeader>
                             <CardTitle className="sigil-codex truncate">{doc.title}</CardTitle>
                        </CardHeader>
                        <CardContent className="flex-grow flex flex-col justify-end">
                           <div className="w-full aspect-video bg-background/50 rounded-md flex items-center justify-center">
                                <BookOpen className="h-16 w-16 text-muted-foreground/50"/>
                            </div>
                        </CardContent>
                    </Card>
                ))}
             </div>
          )}
        </div>
      </div>
    </main>
  );
}
