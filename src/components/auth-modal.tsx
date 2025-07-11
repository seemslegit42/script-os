
'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { firebaseApp } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AuthModal({ open, onOpenChange }: AuthModalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPending, setIsPending] = useState(false);
  const [activeTab, setActiveTab] = useState('login');
  const auth = getAuth(firebaseApp);
  const { toast } = useToast();

  const clearForm = () => {
    setEmail('');
    setPassword('');
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    clearForm();
  }

  const handleAuthAction = async (action: 'signup' | 'login') => {
    setIsPending(true);
    try {
      if (action === 'signup') {
        await createUserWithEmailAndPassword(auth, email, password);
        toast({ title: 'Success', description: "You've joined the Forge. Welcome, Architect." });
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        toast({ title: 'Success', description: "Welcome back to the Forge." });
      }
      onOpenChange(false);
      clearForm();
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Authentication Error',
        description: error.message,
      });
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
        onOpenChange(isOpen);
        if (!isOpen) {
            clearForm();
        }
    }}>
      <DialogContent className="sm:max-w-md bg-card/80 backdrop-blur-lg">
        <DialogHeader>
          <DialogTitle className="sigil-obelisk text-primary">Join The Forge</DialogTitle>
          <DialogDescription className="sigil-codex">
            Create an account to begin your ascent and carve your legacy.
          </DialogDescription>
        </DialogHeader>
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <form onSubmit={(e) => { e.preventDefault(); handleAuthAction('login'); }}>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <Input id="login-email" type="email" placeholder="initiate@domain.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password">Password</Label>
                  <Input id="login-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <Button type="submit" className="w-full" disabled={isPending}>
                  {isPending ? 'Accessing...' : 'Enter the Forge'}
                </Button>
              </div>
            </form>
          </TabsContent>
          <TabsContent value="signup">
            <form onSubmit={(e) => { e.preventDefault(); handleAuthAction('signup'); }}>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input id="signup-email" type="email" placeholder="architect@domain.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <Input id="signup-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <Button type="submit" className="w-full" disabled={isPending}>
                  {isPending ? 'Forging Account...' : 'Begin Ascent'}
                </Button>
              </div>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
