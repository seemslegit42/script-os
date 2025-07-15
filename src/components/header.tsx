
'use client';

import React from 'react';
import Link from 'next/link';
import { ScribeSigil } from './icons';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Search, Home, Library } from 'lucide-react';
import { User } from '@/lib/types';
import { Workspace } from '@/lib/types';
import { UserMenu } from './user-menu';
import { useAppStore } from '@/store/app-store';

interface HeaderProps {
  user?: User;
  workspace?: Workspace;
}

/**
 * The primary header for the application. It acts as a simple navigation
 * bar for public pages (like the Scriptorium) and transforms into the
 * full TopBar command interface for authenticated users on the Canvas.
 */
export function Header({ user, workspace }: HeaderProps) {
  const handleCommandSubmit = useAppStore((state) => state.handleCommandSubmit);

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const command = formData.get('command') as string;
    if (command) {
      handleCommandSubmit(command);
    }
    event.currentTarget.reset();
  };

  // Authenticated "TopBar" view
  if (user && workspace) {
    return (
      <header className="h-16 w-full flex items-center justify-between px-4 bg-background/50 backdrop-blur-md border-b border-border z-50 shrink-0">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2">
            <ScribeSigil className="h-8 w-8 text-primary" />
            <span className="font-bold text-lg hidden sm:inline-block sigil-obelisk">ΛΞVON OS</span>
          </Link>
        </div>

        <div className="flex-1 max-w-lg">
          <form onSubmit={handleFormSubmit}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input 
                name="command"
                placeholder="BEEP: Issue a command..." 
                className="pl-10 h-11 sigil-glyph bg-card/60" 
              />
               <Button type="submit" variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-9 w-9">
                <span className="sr-only">Submit command</span>
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8.14645 3.14645C8.34171 2.95118 8.65829 2.95118 8.85355 3.14645L12.8536 7.14645C13.0488 7.34171 13.0488 7.65829 12.8536 7.85355L8.85355 11.8536C8.65829 12.0488 8.34171 12.0488 8.14645 11.8536C7.95118 11.6583 7.95118 11.3417 8.14645 11.1464L11.2929 8H2.5C2.22386 8 2 7.77614 2 7.5C2 7.22386 2.22386 7 2.5 7H11.2929L8.14645 3.85355C7.95118 3.65829 7.95118 3.34171 8.14645 3.14645Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>
              </Button>
            </div>
          </form>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/library" className="hidden sm:block">
             <Button variant="ghost">
                <Library className="mr-2 h-4 w-4" />
                Library
            </Button>
          </Link>
          <div className="hidden sm:flex items-center gap-2 border-r border-border pr-4">
              <span className="text-sm font-semibold text-primary-foreground sigil-obelisk">Ξ</span>
              <span className="text-sm font-mono font-medium text-muted-foreground">
                {workspace.creditBalance.toLocaleString()}
              </span>
          </div>
          <UserMenu user={user} workspaceName={workspace.name} />
        </div>
      </header>
    );
  }

  // Public "Library" view
  return (
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
        <Button asChild variant="ghost">
            <Link href="/library">
                <Library className="mr-2 h-4 w-4" />
                Library
            </Link>
        </Button>
      </div>
    </header>
  );
}
