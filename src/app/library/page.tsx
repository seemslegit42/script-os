
'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { Header } from '@/components/header';
import { getDocsAction } from '@/app/actions';
import { Scripture, Annotation } from '@/lib/types';
import { Annotator } from '@/components/annotator';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { MessageSquareQuote, List, Share2, Trash2 } from 'lucide-react';
import { FocusLayer } from '@/components/focus-layer';
import { ConstellationCanvas } from '@/components/constellation-canvas';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyForge } from '@/components/empty-forge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useScriptorium } from '@/context/scriptorium-context';
import { DeleteSigilDialog } from './delete-sigil-dialog';
import { cn } from '@/lib/utils';

type ViewMode = 'constellation' | 'list';

const ANNOTATION_STORAGE_KEY = 'scriptorium-annotations';

/**
 * The main page for the Library, where users can view and interact with
 * both canonical and user-forged scriptures.
 */
export default function LibraryPage() {
  const { toast } = useToast();
  const { savedScriptures, deleteScripture } = useScriptorium();
  const [canonicalDocs, setCanonicalDocs] = useState<Scripture[]>([]);
  const [allScriptures, setAllScriptures] = useState<Scripture[]>([]);
  const [loading, setLoading] = useState(true);
  const [allAnnotations, setAllAnnotations] = useState<Record<string, Annotation[]>>({});
  const [isLedgerOpen, setIsLedgerOpen] = useState(false);
  const [selectedScripture, setSelectedScripture] = useState<Scripture | null>(null);
  const [scriptureToDelete, setScriptureToDelete] = useState<Scripture | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('constellation');

  useEffect(() => {
    async function fetchDocs() {
      try {
        setLoading(true);
        const docs = await getDocsAction();
        setCanonicalDocs(docs.map(doc => ({ ...doc, id: `canonical-${doc.id}` })));
        
        const savedAnnotations = localStorage.getItem(ANNOTATION_STORAGE_KEY);
        if (savedAnnotations) {
          setAllAnnotations(JSON.parse(savedAnnotations));
        }

      } catch (error) {
        toast({ title: "Error", description: "Could not load canonical scriptures.", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    }
    fetchDocs();
  }, [toast]);
  
  useEffect(() => {
      setAllScriptures([...canonicalDocs, ...savedScriptures]);
  }, [canonicalDocs, savedScriptures]);

  const saveAnnotations = (updatedAnnotations: Record<string, Annotation[]>) => {
    setAllAnnotations(updatedAnnotations);
    localStorage.setItem(ANNOTATION_STORAGE_KEY, JSON.stringify(updatedAnnotations));
  };
  
  const handleAnnotate = useCallback((annotation: Omit<Annotation, 'id' | 'targetId'>, contentId: string) => {
    const newAnnotation: Annotation = { ...annotation, id: `ann-${Date.now()}`, targetId: contentId };
    
    const updatedAnnotations = { ...allAnnotations };
    const currentScriptureAnnotations = updatedAnnotations[contentId] || [];
    updatedAnnotations[contentId] = [...currentScriptureAnnotations, newAnnotation];

    saveAnnotations(updatedAnnotations);
    toast({ title: "Annotation Saved", description: "Your insight has been recorded." });
    setIsLedgerOpen(true);
  }, [allAnnotations, toast]);

  const handleDeleteAnnotation = (annotationId: string, contentId: string) => {
    const updatedAnnotations = { ...allAnnotations };
    const currentScriptureAnnotations = updatedAnnotations[contentId] || [];
    updatedAnnotations[contentId] = currentScriptureAnnotations.filter(ann => ann.id !== annotationId);

    saveAnnotations(updatedAnnotations);
    toast({ title: "Annotation Deleted", description: "Your insight has been removed." });
  };

  const handleSelectScripture = (scripture: Scripture | null) => {
    setSelectedScripture(scripture);
    if (!scripture) {
      setIsLedgerOpen(false);
    }
  }

  const handleDeleteRequest = (e: React.MouseEvent, scripture: Scripture) => {
    e.stopPropagation(); // Prevent node selection when clicking delete
    setScriptureToDelete(scripture);
  };

  const confirmDelete = () => {
    if (scriptureToDelete) {
      deleteScripture(scriptureToDelete.id);
      toast({ title: "Scripture Deleted", description: `"${scriptureToDelete.query}" has been removed from your forge.`});
      if (selectedScripture?.id === scriptureToDelete.id) {
        handleSelectScripture(null);
      }
      setScriptureToDelete(null);
    }
  };

  const hasScriptures = allScriptures.length > 0;
  const currentAnnotations = selectedScripture ? allAnnotations[selectedScripture.id] || [] : [];
  
  const pageVariants = {
    initial: {
      opacity: 0,
      y: 20
    },
    in: {
      opacity: 1,
      y: 0
    },
    out: {
      opacity: 0,
      y: -20
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      <Header />

      <main className="flex-grow container mx-auto flex flex-col items-center justify-center p-4 pt-20">
         <motion.div 
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={{ type: 'tween', ease: 'anticipate', duration: 0.5 }}
            className="w-full h-full max-w-7xl flex flex-col bg-card/70 backdrop-blur-sm border border-primary/20 shadow-lg shadow-primary/10 rounded-lg">
            {hasScriptures && !loading && (
                <div className="flex justify-end p-4 border-b border-primary/20">
                    <Button variant="outline" onClick={() => setViewMode(viewMode === 'constellation' ? 'list' : 'constellation')} className="bg-background/50">
                        {viewMode === 'constellation' ? <List className="mr-2" /> : <Share2 className="mr-2" />}
                        {viewMode === 'constellation' ? 'List View' : 'Constellation View'}
                    </Button>
                </div>
            )}
            <div className="flex-grow relative">
                {loading ? (
                    <div className="w-full h-full flex items-center justify-center p-4">
                        <Skeleton className="w-full h-full" />
                    </div>
                ) : !hasScriptures ? (
                    <EmptyForge />
                ) : viewMode === 'constellation' ? (
                    <ConstellationCanvas 
                        scriptures={allScriptures} 
                        onNodeClick={handleSelectScripture}
                        selectedNodeId={selectedScripture?.id || null}
                        onDeleteRequest={handleDeleteRequest}
                    />
                ) : (
                    <div className="p-4">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="sigil-obelisk">Type</TableHead>
                                    <TableHead className="sigil-obelisk">Scripture Title</TableHead>
                                    <TableHead className="text-right"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {allScriptures.map(doc => (
                                    <TableRow key={doc.id} onClick={() => handleSelectScripture(doc)} className="cursor-pointer">
                                        <TableCell className={cn("font-medium", doc.id.startsWith('canonical-') ? 'text-primary' : 'text-accent')}>
                                          {doc.id.startsWith('canonical-') ? 'Canonical' : 'Forged'}
                                        </TableCell>
                                        <TableCell className="font-medium sigil-codex">{doc.title || doc.query || doc.fileName}</TableCell>
                                        <TableCell className="text-right">
                                           {!doc.id.startsWith('canonical-') && (
                                              <Button variant="ghost" size="icon" onClick={(e) => handleDeleteRequest(e, doc)}>
                                                  <Trash2 className="h-4 w-4 text-destructive" />
                                              </Button>
                                           )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </div>
         </motion.div>
      </main>

      <Sheet open={!!selectedScripture} onOpenChange={(isOpen) => !isOpen && handleSelectScripture(null)}>
        <SheetContent className="w-full md:w-[60vw] lg:w-[40vw] xl:w-[33vw] bg-card/90 backdrop-blur-lg border-primary/30 flex flex-col">
          {selectedScripture && (
            <>
              <SheetHeader className="pr-12">
                <SheetTitle className="sigil-obelisk truncate">{selectedScripture.title || selectedScripture.query || selectedScripture.fileName}</SheetTitle>
                <SheetDescription className="sigil-codex">
                  {selectedScripture.id.startsWith('canonical-') ? 'Canonical scripture of the ΛΞVON OS.' : 'User-forged scripture.'} Annotations are saved locally.
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
                  Ledger ({currentAnnotations.length})
                </Button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      <Sheet open={isLedgerOpen} onOpenChange={setIsLedgerOpen}>
          <SheetContent side="bottom" className="h-[40vh] bg-card/90 backdrop-blur-lg border-primary/30 flex flex-col">
              <SheetHeader>
                  <SheetTitle className="sigil-obelisk">Annotation Ledger</SheetTitle>
                  <SheetDescription>Insights recorded for "{selectedScripture?.title || selectedScripture?.query}".</SheetDescription>
              </SheetHeader>
              <div className="mt-4 overflow-y-auto flex-grow space-y-4">
                  {currentAnnotations.length === 0 ? (
                      <p className="text-muted-foreground italic text-center pt-8">No annotations recorded for this scripture.</p>
                  ) : (
                      currentAnnotations.map(ann => (
                          <div key={ann.id} className="border-l-2 border-accent pl-4 py-2 group relative">
                              <blockquote className="italic text-accent-foreground/80 sigil-codex">&ldquo;{ann.selection}&rdquo;</blockquote>
                              <p className="mt-2 sigil-glyph">{ann.comment}</p>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="absolute top-2 right-2 h-7 w-7 opacity-0 group-hover:opacity-100"
                                onClick={() => handleDeleteAnnotation(ann.id, selectedScripture!.id)}
                              >
                                  <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                          </div>
                      ))
                  )}
              </div>
          </SheetContent>
      </Sheet>

      <DeleteSigilDialog 
        isOpen={!!scriptureToDelete} 
        onClose={() => setScriptureToDelete(null)}
        onConfirm={confirmDelete}
        scriptureName={scriptureToDelete?.query || 'this scripture'}
      />
    </div>
  );
}
