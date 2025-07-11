
"use client";

import { useAuth } from '@/context/auth-context';
import { useFirestore } from '@/hooks/use-firestore';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, BookOpen, NotebookText, MessageSquareQuote, Trash2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';
import { FocusLayer } from '@/components/focus-layer';
import { UploadSigil } from './upload-sigil';
import { InterrogationPanel } from '@/components/scribe/interrogation-panel';
import { ScribeSigil } from '@/components/icons';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getDocsAction } from './actions';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Annotator, Annotation } from '@/components/annotator';
import { useIsMobile } from '@/hooks/use-mobile';
import { DeleteSigilDialog } from './delete-sigil-dialog';
import { useToast } from '@/hooks/use-toast';
import { Header } from '@/components/header';
import Head from 'next/head';

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
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const isMobile = useIsMobile();
  const { toast } = useToast();

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

  const handleBackToScriptorium = () => {
    setSelectedSigil(null);
    setAnnotations([]); // Clear annotations when leaving a document
  }
  
  const handleAddAnnotation = (annotation: Omit<Annotation, 'id'>) => {
    const newAnnotation: Annotation = { ...annotation, id: `ann-${Date.now()}` };
    setAnnotations(prev => [...prev, newAnnotation]);
  }
  
  const onSigilDeleted = (result: {success: boolean, error: string | null}) => {
    if(result.success) {
      toast({
        title: "Scripture Unbound",
        description: "The sigil has been returned to the aether."
      })
    } else {
      toast({
        title: "Unbinding Failed",
        description: result.error,
        variant: "destructive"
      })
    }
  }


  if (authLoading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <ScribeSigil className="h-16 w-16 text-primary" />
      </div>
    );
  }

  if (selectedSigil) {
    const sigilContext = selectedSigil.markdown || `${selectedSigil.why}\n\n${selectedSigil.how}`;
    const contentId = selectedSigil.id || selectedSigil.query;
    
    return (
      <>
        <Head>
          <title>Scriptorium | Viewing Scripture</title>
        </Head>
        <main className="container mx-auto p-4 sm:p-8 h-screen flex flex-col">
            <Header />
            <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0 pt-20">
              <Button onClick={handleBackToScriptorium} variant="outline" size={isMobile ? 'icon' : 'sm'}>
                <ArrowLeft />
                <span className="hidden sm:inline sm:ml-2">Scriptorium</span>
              </Button>
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size={isMobile ? 'icon' : 'sm'} disabled={annotations.length === 0}>
                    <MessageSquareQuote />
                    <span className="hidden sm:inline sm:ml-2">Annotations ({annotations.length})</span>
                  </Button>
                </SheetTrigger>
                <SheetContent className="bg-card/90 backdrop-blur-lg border-primary/30">
                  <SheetHeader>
                    <SheetTitle className="sigil-obelisk">Session Annotations</SheetTitle>
                  </SheetHeader>
                  <ScrollArea className="h-[calc(100%-4rem)] mt-4 pr-4">
                    <div className="space-y-4">
                      {annotations.length > 0 ? (
                        annotations.map(ann => (
                          <div key={ann.id} className="p-3 rounded-lg bg-background/50 border border-primary/20">
                            <p className="text-sm text-muted-foreground italic border-l-2 border-accent/70 pl-2 sigil-codex">
                              &ldquo;{ann.selection}&rdquo;
                            </p>
                            <p className="mt-2 sigil-glyph">{ann.comment}</p>
                          </div>
                        ))
                      ) : (
                        <p className="text-muted-foreground text-center mt-8">No annotations for this session.</p>
                      )}
                    </div>
                  </ScrollArea>
                </SheetContent>
              </Sheet>
            </div>
            <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-6 min-h-0 pt-4">
                <Card className="bg-card/70 backdrop-blur-sm border-primary/20 shadow-lg shadow-primary/10 flex flex-col">
                    <CardContent className="p-6 flex-grow min-h-0">
                      <ScrollArea className="h-full pr-4">
                         <Annotator contentId={contentId} onAnnotate={handleAddAnnotation}>
                            <div className="space-y-6">
                                {selectedSigil.imageUrl && (
                                    <Image 
                                        src={selectedSigil.imageUrl}
                                        alt={`Sigil for ${selectedSigil.query}`}
                                        width={1024}
                                        height={576}
                                        className="w-full h-auto rounded-lg border border-primary/30 aspect-video object-cover"
                                        data-ai-hint="abstract symbol"
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
                         </Annotator>
                      </ScrollArea>
                    </CardContent>
                </Card>
                 <InterrogationPanel context={sigilContext} />
            </div>
        </main>
      </>
    );
  }
  
  return (
    <>
    <Head>
        <title>Scriptorium | Forge</title>
    </Head>
    <main className="container mx-auto p-4 sm:p-8">
      <Header />

      <div className="mb-12 mt-28">
        <UploadSigil />
      </div>

      <Separator className="my-12 bg-primary/20" />

       <div className="space-y-8">
        <div>
          <h2 className="text-3xl sigil-obelisk mb-6 flex items-center gap-3"><NotebookText className="h-8 w-8" /> My Scriptures</h2>
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
                    <ScribeSigil className="h-16 w-16 mx-auto text-muted-foreground" />
                    <CardTitle className="mt-4 sigil-obelisk">Your Scriptorium is Empty</CardTitle>
                </CardHeader>
                <CardContent>
                    <CardDescription>
                        Forge sigils with the Scribe or upload your own scriptures to begin your journey.
                    </CardDescription>
                </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sigils.map((sigil: any) => (
                <Card 
                    key={sigil.id} 
                    className="flex flex-col bg-card/70 backdrop-blur-sm border-primary/20 overflow-hidden hover:border-accent hover:shadow-lg hover:shadow-accent/10 transition-all group"
                >
                    <CardHeader 
                      className="cursor-pointer flex-grow"
                      onClick={() => setSelectedSigil(sigil)}
                    >
                        <CardTitle className="sigil-codex truncate">{sigil.query || sigil.fileName}</CardTitle>
                        <CardDescription>
                            {sigil.createdAt?.seconds ? new Date(sigil.createdAt.seconds * 1000).toLocaleDateString() : 'Just now'}
                        </CardDescription>
                    </CardHeader>
                    <CardContent 
                      className="flex-grow flex flex-col justify-end cursor-pointer p-6 pt-0"
                      onClick={() => setSelectedSigil(sigil)}
                    >
                      {sigil.imageUrl ? (
                          <Image
                            src={sigil.imageUrl}
                            alt={`Sigil for ${sigil.query}`}
                            width={512}
                            height={288}
                            className="w-full h-auto object-cover rounded-md aspect-video"
                            data-ai-hint="abstract symbol"
                          />
                      ) : (
                        <div className="w-full aspect-video bg-background/50 rounded-md flex items-center justify-center">
                            <ScribeSigil className="h-16 w-16 text-muted-foreground/50"/>
                        </div>
                      )}
                    </CardContent>
                     <CardFooter className="p-2 justify-end">
                        <DeleteSigilDialog 
                            sigilId={sigil.id} 
                            sigilName={sigil.query || sigil.fileName}
                            onDeleted={onSigilDeleted}
                        >
                            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </DeleteSigilDialog>
                     </CardFooter>
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
                        onClick={() => setSelectedSigil({ ...doc, html: doc.html, markdown: doc.markdown })}
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
    </>
  );
}

    