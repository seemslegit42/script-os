'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { processUserCommand } from '@/app/actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Progress } from '../ui/progress';
import { Skeleton } from '../ui/skeleton';

interface RadarResult {
    riskScore: number;
    analysis: string;
    decoyMessage: string;
}

/**
 * A Micro-App for the Spectre Intelligence Suite's Infidelity Radar.
 * Fulfills the 'Infidelity-Radar.md' scripture.
 */
export function InfidelityRadar() {
  const [situation, setSituation] = useState('');
  const [result, setResult] = useState<RadarResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!situation) {
      toast({
        title: 'Situation Required',
        description: 'Please provide context for the Spectre to analyze.',
        variant: 'destructive',
      });
      return;
    }
    setIsLoading(true);
    setResult(null);

    const command = `analyze relationship risk: ${situation}`;
    try {
      const rawResponse = await processUserCommand(command);
      const parsedResult = JSON.parse(rawResponse.response.replace(/```json\n|\n```/g, ''));
      setResult(parsedResult);
    } catch (error) {
      console.error(error);
      toast({
        title: 'Spectre Offline',
        description: 'The agent is currently in the shadows. Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full w-full flex flex-col bg-card/50 sigil-codex p-4 gap-4">
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <Label htmlFor="situation">Situation Briefing</Label>
                <Textarea
                    id="situation"
                    placeholder="Describe the situation, behavior, or red flags..."
                    value={situation}
                    onChange={(e) => setSituation(e.target.value)}
                    className="min-h-[100px]"
                    disabled={isLoading}
                />
            </div>
            <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? 'Scanning...' : 'Engage Spectre'}
            </Button>
        </form>

      <div className="flex-grow">
        {isLoading && (
            <Card className="flex-grow bg-transparent">
                <CardHeader>
                    <Skeleton className="h-5 w-2/5" />
                    <Skeleton className="h-4 w-4/5" />
                </CardHeader>
                <CardContent className="space-y-3">
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-12 w-full" />
                </CardContent>
            </Card>
        )}
        {result && (
          <Card className="flex-grow bg-transparent border-primary/20">
            <CardHeader>
              <CardTitle>Spectre Analysis</CardTitle>
              <CardDescription>{result.analysis}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Relationship Risk Score: {result.riskScore}%</Label>
                <Progress value={result.riskScore} className="mt-1" />
              </div>
              <div>
                <Label>Calculated Decoy Message</Label>
                <blockquote className="mt-1 border-l-2 pl-4 italic text-sm">
                  {result.decoyMessage}
                </blockquote>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
