
"use client";

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/auth-context';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ScribeGlyph } from './icons';

/**
 * A modal component for user authentication (Login and Sign Up), framed as an 'Initiation' ritual.
 * It provides forms for email/password and Google sign-in.
 * @param {AuthModalProps} props - The component props.
 */
type AuthModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

/**
 * A modal component for user authentication (Login and Sign Up).
 * It provides forms for email/password and Google sign-in.
 * @param {AuthModalProps} props - The component props.
 */
export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { signUp, signIn, signInWithGoogle } = useAuth();

  const handleAuthAction = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (isLogin) {
        await signIn(email, password);
      } else {
        await signUp(email, password);
      }
      onClose();
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setIsLoading(true);
    try {
        await signInWithGoogle();
        onClose();
    } catch(err: any) {
        setError(err.message || 'An unexpected error occurred.');
    } finally {
        setIsLoading(false);
    }
  }

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError(null);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-card/70 backdrop-blur-lg border-primary/30">
        <DialogHeader className="text-center items-center">
            <ScribeGlyph className="h-10 w-10 text-primary mb-2" />
          <DialogTitle className="text-2xl sigil-obelisk">{isLogin ? 'Enter the Sanctum' : 'Begin Your Initiation'}</DialogTitle>
          <DialogDescription className="sigil-codex">
            {isLogin ? "Access your personal Scriptorium of sigils." : "Create an account to begin your journey."}
          </DialogDescription>
        </DialogHeader>

        {error && (
            <Alert variant="destructive" className="my-4">
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        )}

        <form onSubmit={handleAuthAction} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="email" className="sigil-codex">Email</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="architect@domain.com" className="sigil-glyph"/>
            </div>
            <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="••••••••" className="sigil-glyph"/>
            </div>
            <Button type="submit" className="w-full sigil-obelisk" disabled={isLoading}>
                {isLoading ? "Authenticating..." : (isLogin ? 'Enter' : 'Initiate')}
            </Button>
        </form>
        
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>

        <Button variant="outline" className="w-full sigil-obelisk" onClick={handleGoogleSignIn} disabled={isLoading}>
          <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 126 21.2 177.2 55.4l-62.1 62.1C335.6 97.2 293.8 80 248 80c-82.8 0-150.5 67.7-150.5 150.5S165.2 406.5 248 406.5c70.2 0 129.2-47.3 148.2-113.3H248v-87.2h239.2c.5 12.3.8 24.8.8 37.8z"></path></svg>
          Google
        </Button>
        
        <div className="mt-4 text-center text-sm">
            {isLogin ? "Do not have an account?" : "Already an Initiate?"}
            <Button variant="link" onClick={toggleMode} className="pl-1 sigil-obelisk">
                {isLogin ? 'Begin Initiation' : 'Enter the Sanctum'}
            </Button>
        </div>

      </DialogContent>
    </Dialog>
  );
}
