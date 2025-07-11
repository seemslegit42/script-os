
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import { TypographicStateProvider } from '@/context/typographic-state-context';

export const metadata: Metadata = {
  title: 'The Scriptorium Cypher',
  description: 'The Sentient Codex',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Recursive:slnt,wght,CASL,MONO@-15..0,300..1000,0..1,0..1&display=swap" rel="stylesheet" />
        {/* Söhne is a commercial font and cannot be linked from Google Fonts. This is a placeholder. */}
        {/* In a real project, you would host the font files or use a font service. */}
        <style dangerouslySetInnerHTML={{ __html: `
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap');
          /* This is a fallback. For Söhne, you'd use @font-face rules. */
          body { --font-body: 'Inter', sans-serif; } 
        `}} />
      </head>
      <body className={cn('antialiased')}>
        <TypographicStateProvider>
          {children}
          <Toaster />
        </TypographicStateProvider>
      </body>
    </html>
  );
}
