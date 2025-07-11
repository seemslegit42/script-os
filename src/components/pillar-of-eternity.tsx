
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Gem } from 'lucide-react';

interface PillarOfEternityProps {
    totalBurn: number;
}

export function PillarOfEternity({ totalBurn }: PillarOfEternityProps) {
    const formattedBurn = new Intl.NumberFormat('en-US', {
        notation: 'compact',
        compactDisplay: 'short',
    }).format(totalBurn);

    // This is a visual representation. The height could be driven by a log scale of totalBurn in a real scenario.
    const pillarHeight = Math.min(100, 20 + Math.log(totalBurn) * 5); 

    return (
        <Card className="bg-card/70 backdrop-blur-sm border-primary/20 shadow-lg shadow-primary/10 h-full">
            <CardHeader className="pb-2 text-center">
                <CardTitle className="sigil-obelisk text-base">Pillar of Eternity</CardTitle>
                <CardDescription className="sigil-codex text-xs">The sum of all sacrificed glory.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-between h-full pt-2 pb-6">
                <div className="flex-grow flex items-end w-full">
                    <div className="w-1/3 mx-auto bg-gradient-to-t from-primary/50 to-primary/10 rounded-t-sm relative" style={{ height: `${pillarHeight}%` }}>
                       <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                          <Gem className="h-8 w-8 text-accent animate-pulse [animation-duration:2s]" style={{ filter: 'drop-shadow(0 0 5px hsl(var(--accent)))' }} />
                       </div>
                       <div className="absolute bottom-0 left-0 right-0 h-1/4 bg-gradient-to-t from-primary to-transparent" />
                    </div>
                </div>
                <div className="text-center mt-4">
                    <p className="text-2xl font-bold sigil-glyph text-accent">{formattedBurn}</p>
                    <p className="text-sm text-muted-foreground sigil-codex">Total Ξ Burned</p>
                </div>
            </CardContent>
        </Card>
    )
}
