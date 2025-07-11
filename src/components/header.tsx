
'use client';

import { useState } from 'react';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { LogIn, Swords, Gem } from 'lucide-react';
import { ScribeSigil } from './icons';
import { AuthModal } from './auth-modal';
import { UserStats } from './user-stats';

type HeaderProps = {
    pageTitle?: string;
    children?: React.ReactNode;
}

export function Header({ pageTitle, children }: HeaderProps) {
    const { user, loading, signOut } = useAuth();
    const [isAuthModalOpen, setAuthModalOpen] = useState(false);
    const router = useRouter();

    const handleMyForgeClick = () => {
        if (user) {
          router.push('/forge');
        } else {
          setAuthModalOpen(true);
        }
    };
    
    return (
        <>
            <AuthModal isOpen={isAuthModalOpen} onClose={() => setAuthModalOpen(false)} />
            <header className="fixed top-0 left-0 right-0 p-4 flex justify-between items-center z-10 bg-background/30 backdrop-blur-lg border-b border-primary/20">
                <div className="flex items-center gap-2">
                    <ScribeSigil className="h-8 w-8 sm:h-10 sm:w-10 text-primary" />
                    {pageTitle ? (
                        <h1 className="text-lg sm:text-xl font-bold tracking-wider sigil-obelisk text-primary align-middle truncate">
                           {pageTitle}
                        </h1>
                    ) : (
                        <span className="text-lg sm:text-xl font-bold tracking-wider sigil-obelisk text-primary align-middle">
                            SCRIPTORIUM
                        </span>
                    )}
                </div>
                <div className="flex items-center gap-2 sm:gap-4">
                  {children}
                   {loading ? (
                    <Skeleton className="h-10 w-48 bg-muted/50" />
                  ) : user ? (
                    <>
                        <UserStats />
                        <Button onClick={() => signOut()} variant="outline" size="sm">End Session</Button>
                    </>
                  ) : (
                    <div className="flex items-center gap-2 sm:gap-4">
                        <Button variant="ghost" onClick={handleMyForgeClick}>
                            <Swords className="mr-0 sm:mr-2"/>
                            <span className="hidden sm:inline">My Scriptorium</span>
                        </Button>
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
