
'use client';

import React from 'react';
import { Button } from './ui/button';
import { Sparkles } from 'lucide-react';

const questions = [
    "What is the purpose of the Aegis protocol?",
    "Explain the dual end-game paths of ΛΞVON OS.",
    "Describe the 'Ancient Roman Glass' aesthetic.",
    "How does the KLEPSYDRA Engine work?",
];

type ExampleQuestionsProps = {
    onQuestionSelect: (question: string) => void;
};

/**
 * A component that displays a list of clickable example questions
 * to help guide the user and showcase the Oracle's capabilities.
 * @param {ExampleQuestionsProps} props - The component's props.
 */
export function ExampleQuestions({ onQuestionSelect }: ExampleQuestionsProps) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
            {questions.map((q, i) => (
                <Button 
                    key={i}
                    variant="outline"
                    className="h-auto whitespace-normal text-left justify-start sigil-glyph border-dashed border-primary/30 hover:border-solid hover:bg-primary/10 hover:border-primary/50"
                    onClick={() => onQuestionSelect(q)}
                >
                    <Sparkles className="h-4 w-4 mr-3 text-primary/70 flex-shrink-0"/>
                    <span>{q}</span>
                </Button>
            ))}
        </div>
    );
}
