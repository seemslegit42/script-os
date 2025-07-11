
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import { TypographicStateProvider } from '@/context/typographic-state-context';
import { AuthProvider } from '@/context/auth-context';

/**
 * Defines the metadata for the application, including the title and description.
 * This information is used by search engines and the browser.
 */
export const metadata: Metadata = {
  title: 'The Scriptorium Cypher',
  description: 'The Sentient Codex',
};

/**
 * The root layout component for the entire application.
 * It wraps all pages with necessary providers and global styles.
 * @param {Readonly<{ children: React.ReactNode }>} props - The props object.
 * @param {React.ReactNode} props.children - The child components to be rendered within the layout.
 * @returns {React.ReactElement} The root layout element.
 */
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
        <link href="https://fonts.googleapis.com/css2?family=Comfortaa:wght@700&family=Lexend:wght@100..900&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Recursive:slnt,wght,CASL,MONO@-15..0,300..1000,0..1,0..1&display=swap" rel="stylesheet" />
        <style dangerouslySetInnerHTML={{ __html: `
          body { 
            --font-headline: 'Comfortaa', sans-serif;
            --font-body: 'Lexend', sans-serif;
            --font-code: 'Recursive', monospace;
          } 
        `}} />
      </head>
      <body className={cn('antialiased')}>
        <AuthProvider>
          <TypographicStateProvider>
            {children}
            <Toaster />
          </TypographicStateProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
