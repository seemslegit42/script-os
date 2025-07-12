
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/auth-context';
import { db } from '@/lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { Gem, Star } from 'lucide-react';
import { Skeleton } from './ui/skeleton';

export function UserStats() {
    const { user } = useAuth();
    const [userData, setUserData] = useState<{ credits: number, sovereigntyClass: string } | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            setLoading(true);
            const userDocRef = doc(db, 'users', user.uid);
            const unsubscribe = onSnapshot(userDocRef, (doc) => {
                if (doc.exists()) {
                    const data = doc.data();
                    setUserData({
                        credits: data.credits || 0,
                        sovereigntyClass: data.sovereigntyClass || 'Initiate',
                    });
                }
                setLoading(false);
            }, (error) => {
                console.error("Failed to fetch user stats:", error);
                setLoading(false);
            });

            return () => unsubscribe();
        } else {
            setLoading(false);
            setUserData(null);
        }
    }, [user]);

    if (loading) {
        return <Skeleton className="h-10 w-48 bg-muted/50" />;
    }

    if (!userData) {
        return null; // Or some placeholder if needed when user is logged out but component is rendered
    }

    return (
        <div className="flex items-center gap-4 bg-black/30 text-sm p-2 rounded-lg border border-primary/20">
            <div className="flex items-center gap-2" title="Sovereignty Class">
                <Star className="text-secondary h-4 w-4" />
                <span className="font-bold sigil-codex text-secondary-foreground">{userData.sovereigntyClass}</span>
            </div>
            <div className="h-6 w-px bg-primary/30"></div>
            <div className="flex items-center gap-2" title="ΞCredits">
                <Gem className="text-accent h-4 w-4" />
                <span className="font-mono text-accent-foreground font-bold">{userData.credits.toLocaleString()} Ξ</span>
            </div>
        </div>
    );
}
