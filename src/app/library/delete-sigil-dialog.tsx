
'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

/**
 * Props for the DeleteSigilDialog component.
 * @property {boolean} isOpen - Whether the dialog is currently open.
 * @property {() => void} onClose - Function to call when the dialog should be closed.
 * @property {() => void} onConfirm - Function to call when the delete action is confirmed.
 * @property {string} scriptureName - The name of the scripture being deleted, for display in the dialog.
 */
type DeleteSigilDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  scriptureName: string;
};

/**
 * A modal dialog component to confirm the deletion of a scripture.
 * @param {DeleteSigilDialogProps} props - The component's props.
 */
export function DeleteSigilDialog({ isOpen, onClose, onConfirm, scriptureName }: DeleteSigilDialogProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="sigil-obelisk">Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription className="sigil-codex">
            This action cannot be undone. This will permanently delete the scripture for{' '}
            <span className="font-bold text-accent-foreground">&quot;{scriptureName}&quot;</span> from your local forge.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
            Yes, Delete It
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
