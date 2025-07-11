
'use client';

import { useAuth } from '@/context/auth-context';
import { useFirestore } from '@/hooks/use-firestore';
import { useEffect, useState, useActionState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Swords, BookOpen, NotebookText, Trash2, UploadCloud, FileText, X } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';
import { ScribeSigil } from '@/components/icons';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getDocsAction, uploadSigilAction, deleteSigilAction } from '@/app/scriptorium/actions';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { useToast } from '@/hooks/use-toast';
import { Scripture } from '@/lib/types';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';
import { useDropzone } from 'react-dropzone';

type ScriptoriumDrawerProps = {
    onSelectScripture: (scripture: Scripture) => void;
}

type Doc = {
    id: string;
    title: string;
    html: string;
    markdown: string;
}

const uploadInitialState = { success: false, error: null };


export function ScriptoriumDrawer({ onSelectScripture }: ScriptoriumDrawerProps) {
  const { user, loading: authLoading } = useAuth();
  const [docs, setDocs] = useState<Doc[]>([]);
  const [docsLoading, setDocsLoading] = useState(true);
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const { toast } = useToast();

  const { documents: sigils, loading: sigilsLoading } = useFirestore(
    'sigils',
    user ? [['userId', '==', user.uid]] : null
  );

  useEffect(() => {
    const fetchDocs = async () => {
        setDocsLoading(true);
        const fetchedDocs = await getDocsAction();
        setDocs(fetchedDocs);
        setDocsLoading(false);
    }
    fetchDocs();
  }, []);

  const handleSelect = (scripture: Scripture) => {
    onSelectScripture(scripture);
    setDrawerOpen(false);
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

  return (
    <Sheet open={isDrawerOpen} onOpenChange={setDrawerOpen}>
      <SheetTrigger asChild>
        <Button variant="outline">
          <Swords className="mr-2" />
          My Scriptorium
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-full sm:w-3/4 lg:w-1/2 bg-card/90 backdrop-blur-lg border-primary/30 p-0">
        <SheetHeader className="p-6">
          <SheetTitle className="sigil-obelisk text-2xl">The Scriptorium</SheetTitle>
        </SheetHeader>
        <ScrollArea className="h-[calc(100%-140px)] px-6">
            <div className="space-y-8">
                <div>
                  <h2 className="text-xl sigil-obelisk mb-4 flex items-center gap-3"><NotebookText /> My Scriptures</h2>
                   {sigilsLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Array.from({ length: 2 }).map((_, i) => (
                         <Card key={i} className="bg-card/70 backdrop-blur-sm border-primary/20">
                           <CardHeader><Skeleton className="h-5 w-3/4" /></CardHeader>
                           <CardContent><Skeleton className="w-full aspect-video" /></CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : sigils.length === 0 ? (
                    <Card className="text-center p-8 bg-card/70 backdrop-blur-sm border-primary/20">
                        <CardHeader><ScribeSigil className="h-12 w-12 mx-auto text-muted-foreground" /></CardHeader>
                        <CardContent>
                            <CardTitle className="mt-2 sigil-obelisk">Your Scriptorium is Empty</CardTitle>
                            <CardDescription>Forge scriptures with the Scribe or upload your own to begin.</CardDescription>
                        </CardContent>
                    </Card>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {sigils.map((sigil: any) => (
                        <Card key={sigil.id} className="flex flex-col bg-background/50 border-primary/20 overflow-hidden hover:border-accent hover:shadow-lg hover:shadow-accent/10 transition-all group">
                            <CardHeader className="cursor-pointer" onClick={() => handleSelect(sigil)}>
                                <CardTitle className="sigil-codex truncate">{sigil.query || sigil.fileName}</CardTitle>
                                <CardDescription>{sigil.createdAt?.seconds ? new Date(sigil.createdAt.seconds * 1000).toLocaleDateString() : 'Just now'}</CardDescription>
                            </CardHeader>
                            <CardContent className="flex-grow flex flex-col justify-end cursor-pointer" onClick={() => handleSelect(sigil)}>
                              {sigil.imageUrl ? (
                                  <Image src={sigil.imageUrl} alt={`Sigil for ${sigil.query}`} width={512} height={288} className="w-full h-auto object-cover rounded-md aspect-video" data-ai-hint="abstract symbol" />
                              ) : (
                                <div className="w-full aspect-video bg-background/50 rounded-md flex items-center justify-center">
                                    <ScribeSigil className="h-12 w-12 text-muted-foreground/50"/>
                                </div>
                              )}
                            </CardContent>
                             <CardFooter className="p-2 justify-end">
                                <DeleteSigilDialog sigilId={sigil.id} sigilName={sigil.query || sigil.fileName} onDeleted={onSigilDeleted}>
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

                <Separator className="my-8 bg-primary/20" />

                <div>
                  <h2 className="text-xl sigil-obelisk mb-4 flex items-center gap-3"><BookOpen /> Canonical Doctrine</h2>
                   {docsLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Array.from({ length: 2 }).map((_, i) => (
                         <Card key={i} className="bg-card/70 backdrop-blur-sm border-primary/20">
                            <CardHeader><Skeleton className="h-5 w-3/4" /></CardHeader>
                            <CardContent>
                                <div className="w-full aspect-video bg-background/50 rounded-md flex items-center justify-center">
                                    <BookOpen className="h-12 w-12 text-muted-foreground/50"/>
                                </div>
                            </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {docs.map((doc) => (
                            <Card key={doc.id} className="flex flex-col bg-background/50 border-primary/20 overflow-hidden hover:border-accent hover:shadow-lg hover:shadow-accent/10 transition-all cursor-pointer" onClick={() => handleSelect({ ...doc, html: doc.html, markdown: doc.markdown })}>
                                <CardHeader><CardTitle className="sigil-codex truncate">{doc.title}</CardTitle></CardHeader>
                                <CardContent className="flex-grow flex flex-col justify-end">
                                   <div className="w-full aspect-video bg-background/50 rounded-md flex items-center justify-center">
                                        <BookOpen className="h-12 w-12 text-muted-foreground/50"/>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                     </div>
                  )}
                </div>
            </div>
        </ScrollArea>
        <div className="p-4 border-t border-primary/30 absolute bottom-0 left-0 right-0 bg-card/90 backdrop-blur-sm">
             <UploadSigil />
        </div>
      </SheetContent>
    </Sheet>
  );
}

function DeleteSigilDialog({ sigilId, sigilName, children, onDeleted }: {sigilId: string, sigilName: string, children: React.ReactNode, onDeleted: (result: {success: boolean, error: string | null}) => void}) {
  const [isPending, setIsPending] = useState(false);

  const handleDelete = async () => {
    setIsPending(true);
    const result = await deleteSigilAction(sigilId);
    onDeleted(result);
    setIsPending(false);
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent className="bg-card/90 backdrop-blur-lg border-destructive/50">
        <AlertDialogHeader>
          <AlertDialogTitle className="sigil-obelisk text-destructive">Unbind This Scripture?</AlertDialogTitle>
          <AlertDialogDescription className="sigil-codex">
            This action is irreversible. The sigil known as <strong className="text-destructive-foreground">"{sigilName}"</strong> will be permanently unbound.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel asChild><Button variant="outline" disabled={isPending}>Cancel</Button></AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} disabled={isPending} className="bg-destructive hover:bg-destructive/90">
            {isPending ? 'Unbinding...' : 'Unbind Forever'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function UploadSigil() {
  const [file, setFile] = useState<File | null>(null);
  const { toast } = useToast();
  const [state, formAction, isPending] = useActionState(uploadSigilAction, uploadInitialState);

  const onDrop = useCallback((acceptedFiles: File[], fileRejections: any[]) => {
    if (fileRejections.length > 0) {
      toast({ title: 'Upload Error', description: 'Only .md files are accepted.', variant: 'destructive' });
      return;
    }
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
    }
  }, [toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: { 'text/markdown': ['.md'] }, multiple: false });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!file) {
      toast({ title: 'No file selected', description: 'Please select a file to upload.', variant: 'destructive' });
      return;
    }
    const formData = new FormData();
    formData.append('markdownFile', file);
    formAction(formData);
  };
  
  React.useEffect(() => {
    if (state.success) {
      toast({ title: 'Success', description: 'Your scripture has been bound.' });
      setFile(null); // Clear file on successful upload
    }
    if (state.error) {
      toast({ title: 'Upload Failed', description: state.error, variant: 'destructive' });
    }
  }, [state, toast]);

  return (
    <form onSubmit={handleSubmit}>
      {file ? (
        <div className="flex items-center justify-between p-2 border-2 border-dashed rounded-lg border-primary/50 bg-background/30">
            <div className="flex items-center gap-3">
                <FileText className="h-6 w-6 text-primary"/>
                <span className="font-mono text-xs">{file.name}</span>
            </div>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setFile(null)}>
                <X className="h-4 w-4"/>
            </Button>
        </div>
      ) : (
        <div {...getRootProps()} className={`flex flex-col items-center justify-center p-4 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${ isDragActive ? 'border-accent bg-accent/10' : 'border-primary/50 hover:border-accent'}`}>
          <input {...getInputProps()} />
          <UploadCloud className="h-8 w-8 text-muted-foreground" />
          <p className="mt-2 text-xs text-muted-foreground text-center">
            {isDragActive ? 'Drop the file here...' : "Drag 'n' drop or click to upload a scripture (.md)"}
          </p>
        </div>
      )}
      <Button type="submit" disabled={!file || isPending} className="mt-2 w-full" size="sm">
        {isPending ? 'Forging...' : 'Upload Scripture'}
      </Button>
    </form>
  );
}
