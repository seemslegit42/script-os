
'use client';

import { useState, useTransition, useEffect } from 'react';
import { useAuth } from '@/context/auth-context';
import { useFirestore } from '@/hooks/use-firestore';
import { useToast } from '@/hooks/use-toast';
import { Header } from '@/components/header';
import { UploadSigil } from './upload-sigil';
import { getDocsAction } from '@/app/actions';
import { Scripture } from '@/lib/types';
import { Annotation, Annotator } from '@/components/annotator';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { MessageSquareQuote, Trash2, X } from 'lucide-react';
import { DeleteSigilDialog } from './delete-sigil-dialog';
import { FocusLayer } from '@/components/focus-layer';
import { ConstellationCanvas } from '@/components/constellation-canvas';
import { Skeleton } from '@/components/ui/skeleton';

export default function ForgePage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const { documents: sigils, loading: sigilsLoading } = useFirestore('sigils', user ? [['userId', '==', user.uid]] : null);
  const [canonicalDocs, setCanonicalDocs] = useState<Scripture[]>([]);
  const [isPending, startTransition] = useTransition();
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [isLedgerOpen, setIsLedgerOpen] = useState(false);
  const [selectedScripture, setSelectedScripture] = useState<Scripture | null>(null);

  useEffect(() => {
    async function fetchDocs() {
      const docs = await getDocsAction();
      setCanonicalDocs(docs.map(doc => ({ ...doc, id: `canonical-${doc.id}` })));
    }
    fetchDocs();
  }, []);

  const handleAnnotate = (annotation: Omit<Annotation, 'id'>) => {
    const newAnnotation = { ...annotation, id: `ann-${Date.now()}` };
    setAnnotations(prev => [...prev, newAnnotation]);
    toast({ title: "Annotation Saved", description: "Your insight has been recorded in the session ledger." });
    setIsLedgerOpen(true);
  };

  const handleSelectScripture = (scripture: Scripture | null) => {
    setSelectedScripture(scripture);
    // Reset session-specific state when changing scripture
    setAnnotations([]);
    setIsLedgerOpen(false);
  }

  const allScriptures = [...canonicalDocs, ...sigils];

  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      <Header />

      <main className="flex-grow flex items-stretch pt-20">
        <div className="w-full h-full relative">
            <div className="absolute top-4 right-4 z-10">
                <UploadSigil />
            </div>

            {sigilsLoading ? (
                <div className="w-full h-full flex items-center justify-center">
                    <Skeleton className="w-3/4 h-3/4" />
                </div>
            ) : (
                <ConstellationCanvas 
                    scriptures={allScriptures} 
                    onNodeClick={handleSelectScripture}
                    selectedNodeId={selectedScripture?.id || null}
                />
            )}
        </div>
      </main>

      <Sheet open={!!selectedScripture} onOpenChange={(isOpen) => !isOpen && setSelectedScripture(null)}>
        <SheetContent className="w-full md:w-[60vw] lg:w-[40vw] xl:w-[33vw] bg-card/90 backdrop-blur-lg border-primary/30 flex flex-col">
          {selectedScripture && (
            <>
              <SheetHeader className="pr-12">
                <SheetTitle className="sigil-obelisk truncate">{selectedScripture.title || selectedScripture.query || selectedScripture.fileName}</SheetTitle>
                <SheetDescription className="sigil-codex">
                  {selectedScripture.createdAt ? `Bound on ${new Date(selectedScripture.createdAt.seconds * 1000).toLocaleDateString()}` : 'Canonical scripture.'}
                </SheetDescription>
              </SheetHeader>

              <div className="flex-grow overflow-y-auto pr-6 -mr-6 pl-6 -ml-6 mt-4">
                  <Annotator contentId={selectedScripture.id} onAnnotate={handleAnnotate}>
                    <FocusLayer
                      whyContent={selectedScripture.why || selectedScripture.html || 'Content not available.'}
                      howContent={selectedScripture.how || selectedScripture.markdown || 'No technical details available.'}
                    />
                  </Annotator>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-primary/20">
                <Button variant="outline" size="sm" onClick={() => setIsLedgerOpen(true)}>
                  <MessageSquareQuote className="mr-2" />
                  Ledger ({annotations.length})
                </Button>
                {!selectedScripture.id.startsWith('canonical-') && (
                    <DeleteSigilDialog 
                        sigilId={selectedScripture.id} 
                        sigilName={selectedScripture.title || selectedScripture.query || selectedScripture.fileName || 'Unknown Scripture'}
                        onDeleted={(result) => {
                            if (result.success) {
                                toast({ title: 'Scripture Unbound', description: 'The scripture has been returned to the aether.' });
                                setSelectedScripture(null); // Close sheet on successful deletion
                            } else {
                                toast({ title: 'Unbinding Failed', description: result.error, variant: 'destructive' });
                            }
                        }}
                    >
                        <Button variant="destructive" size="sm" disabled={isPending}>
                            <Trash2 className="mr-2" />
                            {isPending ? 'Unbinding...' : 'Unbind'}
                        </Button>
                    </DeleteSigilDialog>
                )}
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      <Sheet open={isLedgerOpen} onOpenChange={setIsLedgerOpen}>
          <SheetContent side="bottom" className="h-[40vh] bg-card/90 backdrop-blur-lg border-primary/30">
              <SheetHeader>
                  <SheetTitle className="sigil-obelisk">Annotation Ledger</SheetTitle>
                  <SheetDescription>Insights recorded during this session for "{selectedScripture?.title || selectedScripture?.query}". These are not persisted.</SheetDescription>
              </SheetHeader>
              <div className="mt-4 overflow-y-auto h-[calc(100%-4rem)] space-y-4">
                  {annotations.length === 0 ? (
                      <p className="text-muted-foreground italic text-center pt-8">No annotations recorded in this session.</p>
                  ) : (
                      annotations.map(ann => (
                          <div key={ann.id} className="border-l-2 border-accent pl-4 py-2">
                              <blockquote className="italic text-accent-foreground/80 sigil-codex">&ldquo;{ann.selection}&rdquo;</blockquote>
                              <p className="mt-2 sigil-glyph">{ann.comment}</p>
                          </div>
                      ))
                  )}
              </div>
          </SheetContent>
      </Sheet>
    </div>
  );
}
