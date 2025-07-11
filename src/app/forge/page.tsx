
"use client";

import { useAuth } from '@/context/auth-context';
import { useFirestore } from '@/hooks/use-firestore';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ScribeGlyph } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { Swords } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';

export default function ForgePage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/');
    }
  }, [user, authLoading, router]);

  const { documents: sigils, loading: sigilsLoading } = useFirestore(
    'sigils',
    user ? [['userId', '==', user.uid]] : null
  );

  if (authLoading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <ScribeGlyph className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }
  
  return (
    <main className="container mx-auto p-4 sm:p-8">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-4xl sigil-obelisk text-primary flex items-center gap-4">
          <Swords className="h-10 w-10" />
          My Forge
        </h1>
        <Button onClick={() => router.push('/')}>Back to Scribe</Button>
      </header>

      {sigilsLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
             <Card key={i} className="bg-card/70 backdrop-blur-sm border-primary/20">
               <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
               </CardHeader>
               <CardContent>
                  <Skeleton className="w-full aspect-video" />
               </CardContent>
            </Card>
          ))}
        </div>
      ) : sigils.length === 0 ? (
        <Card className="text-center p-12 bg-card/70 backdrop-blur-sm border-primary/20">
            <CardHeader>
                <ScribeGlyph className="h-16 w-16 mx-auto text-muted-foreground" />
                <CardTitle className="mt-4">Your Forge is Empty</CardTitle>
            </CardHeader>
            <CardContent>
                <CardDescription>
                    Return to the Scribe to generate and save your first sigil.
                </CardDescription>
                <Button className="mt-6" onClick={() => router.push('/')}>Summon the Scribe</Button>
            </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sigils.map(sigil => (
            <Card key={sigil.id} className="flex flex-col bg-card/70 backdrop-blur-sm border-primary/20 overflow-hidden hover:border-accent hover:shadow-lg hover:shadow-accent/10 transition-all">
                <CardHeader>
                    <CardTitle className="sigil-codex truncate">{sigil.query}</CardTitle>
                    <CardDescription>
                        {new Date(sigil.createdAt.seconds * 1000).toLocaleDateString()}
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow flex flex-col justify-end">
                  {sigil.imageUrl && (
                      <Image
                        src={sigil.imageUrl}
                        alt={`Sigil for ${sigil.query}`}
                        width={512}
                        height={288}
                        className="w-full h-auto object-cover rounded-md aspect-video"
                      />
                  )}
                  {/* Future: Add button to view/annotate */}
                </CardContent>
            </Card>
          ))}
        </div>
      )}
    </main>
  );
}
