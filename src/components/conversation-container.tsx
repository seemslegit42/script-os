
'use client';

import React from 'react';
import { ConversationState } from '@/app/actions';
import { ScribeSigil } from './icons';
import { ConversationHistory } from './conversation-history';
import { ConversationForm } from './conversation-form';

/**
 * Props for the ConversationContainer component.
 */
type ConversationContainerProps = {
    state: ConversationState;
    formAction: (payload: FormData) => void;
    isPending: boolean;
    startTransition: React.TransitionStartFunction;
}

/**
 * A container component that dynamically renders the conversation UI.
 * It centers the form when the conversation is empty and switches to a
 * chat view once messages exist.
 * @param {ConversationContainerProps} props - The component's props.
 */
export function ConversationContainer({ state, formAction, isPending, startTransition }: ConversationContainerProps) {

  const hasConversation = state.conversation.length > 0;

  return (
    <div className="flex flex-col h-full w-full max-w-4xl bg-card/70 backdrop-blur-sm border border-primary/20 shadow-lg shadow-primary/10 rounded-lg">
      {hasConversation ? (
        <>
            <ConversationHistory conversation={state.conversation} />
            <div className="p-4 border-t border-primary/20 bg-background/50 rounded-b-lg">
                <ConversationForm 
                    formAction={formAction} 
                    isPending={isPending} 
                    startTransition={startTransition}
                />
            </div>
        </>

      ) : (
        <div className="flex-grow flex flex-col items-center justify-center p-6 text-center text-muted-foreground sigil-codex">
            <ScribeSigil className="h-20 w-20 text-primary/70 mb-4"/>
            <h1 className="text-2xl font-bold sigil-obelisk text-primary-foreground mb-2">The Oracle is Silent</h1>
            <p className="mb-6">Pose your query to the canon.</p>
            <div className="w-full max-w-2xl">
                <ConversationForm 
                    formAction={formAction} 
                    isPending={isPending} 
                    startTransition={startTransition} 
                />
            </div>
        </div>
      )}
    </div>
  );
}
