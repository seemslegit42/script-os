import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import { AethericStreams } from '@/components/aetheric-streams';
import { TypographicStateProvider } from '@/context/typographic-state-context';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

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
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap" rel="stylesheet" />
      </head>
      <body className={cn('font-body antialiased', inter.variable)}>
        <TypographicStateProvider>
          <AethericStreams />
          <main>{children}</main>
          <Toaster />
        </TypographicStateProvider>
      </body>
    </html>
  );
}
