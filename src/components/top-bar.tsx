
'use client';

import React from 'react';
import Link from 'next/link';
import { ScribeSigil } from './icons';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Search } from 'lucide-react';
import { User } from '@/lib/types';
import { Workspace } from '@/lib/types';
import { UserMenu } from './user-menu';

interface TopBarProps {
  user: User;
  workspace: Workspace;
}

/**
 * The persistent TopBar component, serving as the primary command and navigation interface.
 * It contains the brand logo, the BEEP command input, and the user/workspace menu.
 */
export function TopBar({ user, workspace }: TopBarProps) {

  const handleCommandSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const command = formData.get('command') as string;
    // In a real app, this would be passed to a global command handler (e.g., via Zustand)
    console.log('Command submitted:', command);
    // For now, just clear the input
    event.currentTarget.reset();
  };

  return (
    <header className="h-16 w-full flex items-center justify-between px-4 bg-background/50 backdrop-blur-md border-b border-border z-50 shrink-0">
      <div className="flex items-center gap-4">
        <Link href="/" className="flex items-center gap-2">
          <ScribeSigil className="h-8 w-8 text-primary" />
          <span className="font-bold text-lg hidden sm:inline-block sigil-obelisk">ΛΞVON OS</span>
        </Link>
      </div>

      <div className="flex-1 max-w-lg">
        <form onSubmit={handleCommandSubmit}>
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
