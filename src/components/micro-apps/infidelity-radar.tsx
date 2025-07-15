'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { processUserCommand } from '@/app/actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '../ui/card';
import { Skeleton } from '../ui/skeleton';
import { InfidelityRadarOutput } from '@/ai/flows/infidelity-radar-agent';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertTriangle, FileText, Send, TestTube2 } from 'lucide-react';

const RiskScoreGauge = ({ score }: { score: number }) => {
  const rotation = (score / 100) * 180;
  return (
    <div className="relative w-48 h-24 mx-auto">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
        <div className="w-full h-full border-4 border-muted rounded-t-full border-b-0"></div>
        <div 
          className="absolute top-0 left-0 w-full h-full border-4 border-b-0 rounded-t-full origin-bottom-center transition-transform duration-500 ease-in-out" 
          style={{ 
            borderColor: `hsl(0, ${score}%, 50%)`,
            transform: `rotate(${rotation}deg)`,
            clipPath: 'polygon(0 0, 100% 0, 100% 50%, 0 50%)'
          }}
        ></div>
         <div className="absolute bottom-0 w-full text-center">
            <div className="text-4xl font-bold sigil-obelisk" style={{ color: `hsl(0, ${score}%, 50%)` }}>{score}%</div>
            <div className="text-xs text-muted-foreground uppercase tracking-widest">Likelihood of Concealed Behavior</div>
        </div>
      </div>
    </div>
  );
};


/**
 * A Micro-App for the Spectre Intelligence Suite's Infidelity Radar.
 * Fulfills the 'Infidelity-Radar.md' scripture for "Operative Mode".
 */
export function InfidelityRadar() {
  const [situation, setSituation] = useState('');
  const [result, setResult] = useState<InfidelityRadarOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!situation) {
      toast({
        title: 'Situation Briefing Required',
        description: 'Provide metadata for the Spectre to analyze.',
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
  
  const handleExport = () => {
      toast({
          title: "Dossier Export Initiated",
          description: "This is a premium feature. In a real scenario, a PDF would be generated.",
      })
  }

  return (
    <div className="h-full w-full flex flex-col bg-card/50 sigil-codex">
        <form onSubmit={handleSubmit} className="p-4 space-y-3 border-b border-border">
            <div>
                <Label htmlFor="situation">Situation & Metadata Briefing</Label>
                <Textarea
                    id="situation"
                    placeholder="Paste chat logs, describe suspicious behavior, list metadata..."
                    value={situation}
                    onChange={(e) => setSituation(e.target.value)}
                    className="min-h-[80px]"
                    disabled={isLoading}
                />
            </div>
            <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? 'Scanning...' : 'Run Scan'}
            </Button>
        </form>

        <div className="flex-grow">
            {isLoading && (
                <div className="p-4 space-y-4 animate-pulse">
                    <Skeleton className="h-8 w-3/5 mx-auto" />
                    <Skeleton className="h-4 w-4/5 mx-auto" />
                    <Skeleton className="h-24 w-48 mx-auto rounded-full" />
                    <Skeleton className="h-20 w-full" />
                </div>
            )}
            {!isLoading && !result && (
                <div className="h-full flex flex-col items-center justify-center text-center p-4">
                    <TestTube2 className="h-12 w-12 text-muted-foreground/50 mb-4" />
                    <h3 className="font-bold text-lg text-primary-foreground">Awaiting Directive</h3>
                    <p className="text-sm text-muted-foreground">Provide metadata to engage the Spectre agent.</p>
                </div>
            )}
            {result && (
              <Tabs defaultValue="analysis" className="h-full flex flex-col">
                  <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="analysis">Analysis</TabsTrigger>
                      <TabsTrigger value="decoy">Decoy Deployment</TabsTrigger>
                  </TabsList>
                  <TabsContent value="analysis" className="flex-grow p-4 space-y-4">
                        <RiskScoreGauge score={result.likelihood} />
                        <Card className='bg-transparent'>
                            <CardHeader className='p-2'>
                                <CardTitle className='text-base flex items-center gap-2'><AlertTriangle className='h-4 w-4'/>Suspicious Patterns</CardTitle>
                            </CardHeader>
                            <CardContent className='p-2'>
                               <ul className="list-disc list-inside space-y-1 text-sm">
                                    {result.suspiciousPatterns.map((pattern, i) => (
                                        <li key={i}>{pattern}</li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                        <Button variant="outline" onClick={handleExport} className='w-full'>
                            <FileText className='mr-2 h-4 w-4' />
                            Export Dossier
                        </Button>
                  </TabsContent>
                  <TabsContent value="decoy" className="flex-grow p-4">
                      <Card className='bg-transparent h-full flex flex-col'>
                          <CardHeader>
                              <CardTitle className='text-base'>Calculated Decoy Message</CardTitle>
                              <CardDescription>A plausible, short message to test loyalty.</CardDescription>
                          </CardHeader>
                          <CardContent className='flex-grow'>
                              <blockquote className="border-l-2 border-primary pl-4 italic text-foreground">
                                  {result.decoyMessage}
                              </blockquote>
                          </CardContent>
                          <CardFooter>
                              <Button className='w-full'><Send className='mr-2 h-4 w-4' />Deploy Seduction Agent™</Button>
                          </CardFooter>
                      </Card>
                  </TabsContent>
              </Tabs>
            )}
        </div>
    </div>
  );
}
