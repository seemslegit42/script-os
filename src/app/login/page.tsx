
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { ScribeSigil } from '@/components/icons';
import { AnimatePresence, motion } from 'framer-motion';
import { AcquisitionButton } from '@/components/ui/acquisition-button';
import Link from 'next/link';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('password'); // Mock password
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // MOCK LOGIN: In a real app, this would use a proper auth flow.
    // For this demo, we'll simulate a successful login and redirect.
    setTimeout(() => {
        setIsLoading(false);
        setIsSubmitted(true);
        toast({
            title: "The Echo is Sent",
            description: "A path has opened. Check your inbox for a message from the Oracle to cross the threshold.",
        });
        // In a real flow, you'd wait for the user to click the magic link.
        // Here, we just redirect after a short delay to simulate that.
        setTimeout(() => {
            router.push('/');
        }, 2000);
    }, 1500);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
            <Link href="/" className="inline-block">
                <ScribeSigil className="h-20 w-20 text-primary" />
            </Link>
          <h1 className="text-3xl font-bold mt-4 sigil-obelisk text-primary-foreground">The Sovereign Arsenal</h1>
          <p className="text-muted-foreground mt-2 sigil-codex">Begin the Rite. State your designation.</p>
        </div>
        
        <AnimatePresence mode="wait">
        {isSubmitted ? (
            <motion.div
                key="submitted"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center p-8 bg-card/80 backdrop-blur-sm border border-primary/20 shadow-lg shadow-primary/10 rounded-lg flex flex-col items-center"
            >
                <ScribeSigil className="h-16 w-16 text-primary mb-4" />
                <h2 className="text-xl font-bold text-primary-foreground">Redirecting to the Canvas...</h2>
                <p className="text-muted-foreground mt-2">The threshold has been crossed.</p>
            </motion.div>
        ) : (
            <motion.form
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleSubmit} 
                className="space-y-6"
            >
                <div className="space-y-2">
                    <Label htmlFor="email" className="sigil-codex">Designation (Email)</Label>
                    <Input
                        id="email"
                        type="email"
                        placeholder="initiate@domain.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={isLoading}
                        className="sigil-glyph h-12 text-lg"
                    />
                </div>
                <AcquisitionButton 
                    type="submit" 
                    className="w-full h-12 text-lg" 
                    disabled={isLoading || !email}
                    pulse={!isLoading && !!email}
                >
                    {isLoading ? 'Sending Echo...' : 'State Your Designation'}
                </AcquisitionButton>
            </motion.form>
        )}
        </AnimatePresence>
      </div>
       <footer className="absolute bottom-4 text-center text-xs text-muted-foreground/50">
          <p>&copy; {new Date().getFullYear()} ΛΞVON OS. All rights reserved.</p>
          <p>By entering, you agree to the doctrines of the canon.</p>
        </footer>
    </div>
  );
}
