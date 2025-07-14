
'use client';

import { ScribeSigil } from './icons';
import Link from 'next/link';
import { Button } from './ui/button';
import { Home } from 'lucide-react';

/**
 * The global header component for the application.
 * It provides the main branding and navigation links.
 * The direct "Library" link has been removed to encourage Oracle-first interaction.
 */
export function Header() {
    return (
        <>
            <header className="fixed top-0 left-0 right-0 p-4 flex justify-between items-center z-20 bg-background/30 backdrop-blur-lg border-b border-primary/20">
                <Link href="/" className="flex items-center gap-2 cursor-pointer">
                    <ScribeSigil className="h-8 w-8 sm:h-10 sm:w-10 text-primary" />
                    <span className="text-lg sm:text-xl font-bold tracking-wider sigil-obelisk text-primary-foreground align-middle">
                        SCRIPTORIUM
                    </span>
                </Link>
                <div className="flex items-center gap-2 sm:gap-4">
                    <Button asChild variant="ghost">
                        <Link href="/">
                            <Home className="mr-2 h-4 w-4" />
                            Oracle
                        </Link>
                    </Button>
                </div>
            </header>
        </>
    );
}
