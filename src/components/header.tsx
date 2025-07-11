
'use client';

import { useState } from 'react';
import { useAuth } from '@/context/auth-context';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { LogIn, Swords, LogOut } from 'lucide-react';
import { ScribeSigil } from './icons';
import { AuthModal } from './auth-modal';
import { UserStats } from './user-stats';
import Link from 'next/link';

export function Header() {
    const { user, loading, signOut } = useAuth();
    const [isAuthModalOpen, setAuthModalOpen] = useState(false);
    
    return (
        <>
            <AuthModal isOpen={isAuthModalOpen} onClose={() => setAuthModalOpen(false)} />
            <header className="fixed top-0 left-0 right-0 p-4 flex justify-between items-center z-10 bg-background/30 backdrop-blur-lg border-b border-primary/20">
                <Link href="/" className="flex items-center gap-2 cursor-pointer">
                    <ScribeSigil className="h-8 w-8 sm:h-10 sm:w-10 text-primary" />
                    <span className="text-lg sm:text-xl font-bold tracking-wider sigil-obelisk text-primary align-middle">
                        SCRIPTORIUM
                    </span>
                </Link>
                <div className="flex items-center gap-2 sm:gap-4">
                   {loading ? (
                    <Skeleton className="h-10 w-48 bg-muted/50" />
                  ) : user ? (
                    <>
                        <UserStats />
                        <Link href="/forge">
                          <Button variant="outline"><Swords /> Scriptorium</Button>
                        </Link>
                        <Button onClick={() => signOut()} variant="ghost" size="icon" title="End Session">
                            <LogOut />
                        </Button>
                    </>
                  ) : (
                    <div className="flex items-center gap-2 sm:gap-4">
                        <Button onClick={() => setAuthModalOpen(true)}>
                            <LogIn className="mr-0 sm:mr-2" />
                            <span className="hidden sm:inline">Login / Initiate</span>
                        </Button>
                    </div>
                  )}
                </div>
            </header>
        </>
    );
}
