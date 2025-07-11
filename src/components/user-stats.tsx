
'use client';

import { Gem, Star } from 'lucide-react';

export function UserStats() {

    // Placeholder data. In a real application, this would come from a user context or API call.
    const sovereigntyClass = "Initiate";
    const credits = 1337;


    return (
        <div className="flex items-center gap-4 bg-black/30 text-sm p-2 rounded-lg border border-primary/20">
            <div className="flex items-center gap-2" title="Sovereignty Class">
                <Star className="text-secondary h-4 w-4" />
                <span className="font-bold sigil-codex text-secondary-foreground">{sovereigntyClass}</span>
            </div>
            <div className="h-6 w-px bg-primary/30"></div>
            <div className="flex items-center gap-2" title="ΞCredits">
                <Gem className="text-accent h-4 w-4" />
                <span className="font-mono text-accent-foreground font-bold">{credits.toLocaleString()} Ξ</span>
            </div>
        </div>
    );
}
