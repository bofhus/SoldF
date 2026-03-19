import type { Metadata } from 'next';
import './globals.css';
import { Providers } from '@/components/providers';
import { ThemeToggle } from '@/components/theme-toggle';
import { InstallPrompt } from '@/components/install-prompt';

export const metadata: Metadata = {
  title: 'SoldF Utbildningsplattform',
  description: 'Interaktiv utbildningsplattform byggd på SoldF 2001 med AI-komplement.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="sv">
      <body>
        <Providers>
          <InstallPrompt />
          <div className="mx-auto min-h-screen max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <header className="mb-8 flex flex-col gap-4 rounded-[2rem] border border-white/10 bg-[color:var(--surface)] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.2)] sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.4em] text-[color:var(--muted)]">SoldF 2001</p>
                <h1 className="mt-2 text-2xl font-semibold sm:text-3xl">Militär utbildningsplattform</h1>
              </div>
              <ThemeToggle />
            </header>
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
