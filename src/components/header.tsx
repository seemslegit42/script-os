
'use client';

import { ScribeSigil } from './icons';
import Link from 'next/link';

/**
 * The global header component for the application.
 * It provides the main branding. All other links have been removed
 * to focus on the single, unified Scriptorium experience.
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
                    {/* All navigation links removed for a focused experience. */}
                </div>
            </header>
        </>
    );
}
