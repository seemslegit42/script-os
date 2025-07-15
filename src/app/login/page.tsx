
'use client';

import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { ScribeSigil } from '@/components/icons';
import { AnimatePresence, motion } from 'framer-motion';
import { AcquisitionButton } from '@/components/ui/acquisition-button';
import Link from 'next/link';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { initiateMagicLinkLogin } from '@/app/actions';
import { GlassPane } from '@/components/ui/glass-pane';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const result = await initiateMagicLinkLogin(email);

    setIsLoading(false);

    if (result.success) {
      setIsSubmitted(true);
      toast({
        title: "The Echo is Sent",
        description: "A path has opened. Check your inbox for a message from the Oracle to cross the threshold.",
      });
    } else {
      toast({
        title: "Rite Interrupted",
        description: result.error || 'An unknown error occurred. The path remains sealed.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
            <Link href="/" className="inline-block">
                <ScribeSigil className="h-24 w-24 text-primary" />
            </Link>
          <h1 className="text-3xl font-bold mt-4 sigil-obelisk text-primary-foreground">The Sovereign's Ledger</h1>
          <p className="text-muted-foreground mt-2 sigil-codex">Begin the Rite. State your designation.</p>
        </div>
        
        <AnimatePresence mode="wait">
        {isSubmitted ? (
            <motion.div
                key="submitted"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
            >
                <GlassPane variant="modal" className="text-center p-8 flex flex-col items-center">
                  <ScribeSigil className="h-16 w-16 text-primary mb-4" />
                  <h2 className="text-xl font-bold text-primary-foreground">The Echo Has Been Sent</h2>
                  <p className="text-muted-foreground mt-2">Follow the path in your inbox to cross the threshold.</p>
                </GlassPane>
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
