
'use client';

import React, { useState, useCallback, useActionState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UploadCloud, FileText, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { uploadSigilAction } from '@/app/actions';

const initialState = { success: false, error: null };

export function UploadSigil() {
  const [file, setFile] = useState<File | null>(null);
  const { toast } = useToast();
  const [state, formAction, isPending] = useActionState(uploadSigilAction, initialState);

  const onDrop = useCallback((acceptedFiles: File[], fileRejections: any[]) => {
    if (fileRejections.length > 0) {
      toast({
        title: 'Upload Error',
        description: 'Only .md files are accepted.',
        variant: 'destructive',
      });
      return;
    }
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
    }
  }, [toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'text/markdown': ['.md'] },
    multiple: false,
  });

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
      toast({ title: 'Success', description: 'Your scripture has been forged and bound to your Scriptorium.' });
      setFile(null); // Clear file on successful upload
    }
    if (state.error) {
      toast({ title: 'Upload Failed', description: state.error, variant: 'destructive' });
    }
  }, [state, toast]);

  return (
    <Card className="bg-card/70 backdrop-blur-sm border-primary/20 shadow-md">
      <CardHeader>
        <CardTitle className="sigil-obelisk">Forge a Scripture</CardTitle>
        <CardDescription>Upload a Markdown (.md) file to add it to your personal Scriptorium.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          {file ? (
            <div className="flex items-center justify-between p-4 border-2 border-dashed rounded-lg border-primary/50 bg-background/30">
                <div className="flex items-center gap-3">
                    <FileText className="h-8 w-8 text-primary"/>
                    <span className="font-mono text-sm">{file.name}</span>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setFile(null)}>
                    <X className="h-5 w-5"/>
                </Button>
            </div>
          ) : (
            <div
              {...getRootProps()}
              className={`flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                isDragActive ? 'border-accent bg-accent/10' : 'border-primary/50 hover:border-accent'
              }`}
            >
              <input {...getInputProps()} />
              <UploadCloud className="h-12 w-12 text-muted-foreground" />
              <p className="mt-4 text-muted-foreground">
                {isDragActive ? 'Drop the file here...' : "Drag 'n' drop a .md file here, or click to select"}
              </p>
            </div>
          )}
          <Button type="submit" disabled={!file || isPending} className="mt-4 w-full">
            {isPending ? 'Forging...' : 'Upload Scripture'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
