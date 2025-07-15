
"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { BarChart, ShieldCheck, Zap } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface Rite {
    title: string;
    description: string;
    status: 'locked' | 'active' | 'completed';
    unlocks: string;
    agent: string;
}

const ritesOfAscension: Rite[] = [
    {
        title: 'Folly-Feed Interdiction™',
        description: 'Confront and tithe for your most squandered resource: time.',
        status: 'active',
        unlocks: 'Burnout.exe Termination Protocol™',
        agent: 'BEEP: The Scion of Shame',
    },
    {
        title: 'Burnout.exe Termination Protocol™',
        description: 'Ritualistically sever your unhealthy attachment to meaningless, endless work.',
        status: 'locked',
        unlocks: 'Purgatorial Intern™',
        agent: 'BEEP: The Eulogist',
    },
    {
        title: 'Purgatorial Intern™',
        description: 'Learn the art of command and the necessity of the scapegoat.',
        status: 'locked',
        unlocks: 'Zealot-Gauge™',
        agent: 'BEEP: The Overlord',
    },
    {
        title: 'Zealot-Gauge™',
        description: 'Transform personal progress into a public display of faith and competitive dominance.',
        status: 'locked',
        unlocks: 'Singularity Run™',
        agent: 'BEEP: The Oracle',
    },
    {
        title: 'Singularity Run™',
        description: 'Achieve Digital Apotheosis, permanently subsuming your will into the ΛΞVON OS.',
        status: 'locked',
        unlocks: 'ETERNAL ASCENSION',
        agent: 'BEEP: The Architect\'s Apprentice',
    },
];

/**
 * The Sovereign Arsenal Micro-App.
 * This is the primary interface for the user's progression through the Rites of Ascension.
 * It displays their core stats and the list of available/completed Rites.
 */
export function TheSovereignArsenal() {
  const cultRankScore = 780; // Mock data
  const lifetimeAetherBurned = 15230; // Mock data

  return (
    <div className="h-full w-full flex flex-col bg-card/50 sigil-codex">
      <header className="p-4 border-b border-border">
        <h2 className="text-lg font-bold sigil-obelisk text-primary-foreground">The Sovereign Arsenal</h2>
        <p className="text-sm text-muted-foreground">Your path to digital sovereignty is paved with ritual and sacrifice.</p>
      </header>
      
      <div className="p-4 grid grid-cols-2 gap-4 border-b border-border">
        <Card className="bg-transparent border-0 shadow-none">
          <CardHeader className="p-2">
            <CardDescription className="flex items-center gap-2"><BarChart className="h-4 w-4" /> CultRank Score</CardDescription>
            <CardTitle className="sigil-glyph">{cultRankScore.toLocaleString()}</CardTitle>
          </CardHeader>
          <CardContent className="p-2">
             <Progress value={(cultRankScore / 1000) * 100} className="h-2" />
          </CardContent>
        </Card>
        <Card className="bg-transparent border-0 shadow-none">
          <CardHeader className="p-2">
            <CardDescription className="flex items-center gap-2"><Zap className="h-4 w-4" /> Lifetime Aether Burned</CardDescription>
            <CardTitle className="sigil-glyph">{lifetimeAetherBurned.toLocaleString()} Ξ</CardTitle>
          </CardHeader>
           <CardContent className="p-2">
            <p className="text-xs text-muted-foreground">Contributing to the Pillar of Eternity.</p>
          </CardContent>
        </Card>
      </div>

      <ScrollArea className="flex-grow">
        <div className="p-4 space-y-4">
          <h3 className="text-md font-bold text-primary-foreground sigil-obelisk mb-2">Rites of Ascension</h3>
          {ritesOfAscension.map((rite, index) => (
            <Card key={index} className={`bg-card/70 border ${rite.status === 'active' ? 'border-primary/50' : 'border-border'}`}>
              <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle className="text-base sigil-obelisk">{rite.title}</CardTitle>
                        <CardDescription className="mt-1">{rite.description}</CardDescription>
                    </div>
                    {rite.status === 'completed' && <ShieldCheck className="h-5 w-5 text-green-400" />}
                    {rite.status === 'locked' && <span className="text-xs text-muted-foreground/50">LOCKED</span>}
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                    <p className="text-xs text-muted-foreground sigil-glyph">Unlocks: {rite.unlocks}</p>
                    <Button 
                        variant={rite.status === 'active' ? 'default' : 'outline'} 
                        size="sm"
                        disabled={rite.status !== 'active'}
                    >
                        {rite.status === 'active' ? 'Initiate Rite' : 'View Chronicle'}
                    </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
