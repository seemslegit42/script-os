
'use client';

import React, { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { deleteSigilAction } from '@/app/actions';
import { Button } from '@/components/ui/button';

type DeleteSigilDialogProps = {
  sigilId: string;
  sigilName: string;
  children: React.ReactNode;
  onDeleted: (result: {success: boolean, error: string | null}) => void;
};

export function DeleteSigilDialog({ sigilId, sigilName, children, onDeleted }: DeleteSigilDialogProps) {
  const [isPending, setIsPending] = useState(false);

  const handleDelete = async () => {
    setIsPending(true);
    const result = await deleteSigilAction(sigilId);
    onDeleted(result);
    setIsPending(false);
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
          {children}
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-card/90 backdrop-blur-lg border-destructive/50">
        <AlertDialogHeader>
          <AlertDialogTitle className="sigil-obelisk text-destructive">Unbind This Scripture?</AlertDialogTitle>
          <AlertDialogDescription className="sigil-codex">
            This action is irreversible. The sigil known as <strong className="text-destructive-foreground">"{sigilName}"</strong> will be permanently unbound from your Scriptorium and returned to the aether.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <Button variant="outline" disabled={isPending}>Cancel</Button>
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} disabled={isPending} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">
            {isPending ? 'Unbinding...' : 'Unbind Forever'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
