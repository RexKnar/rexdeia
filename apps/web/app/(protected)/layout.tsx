import 'configs/tailwind/styles.css';

import { Inter, Roboto_Mono } from '@next/font/google';
import { ReactNode, Suspense } from 'react';
import { Toaster } from 'ui';

import { Sidebar } from '../../lib/components/sidebar/Sidebar';
import Providers from '../../lib/Providers';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const roboto_mono = Roboto_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto-mono',
});

export const metadata = {
  title: 'acadx.io | Elevate your academic experience',
  description: 'Your one stop platform for all your academic needs',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${roboto_mono.variable}`}>
      <Providers>
        <body>
          <main className="flex flex-row">
            <Suspense fallback={<div>Loading...</div>}>
              <Sidebar />
            </Suspense>
            {children}
          </main>
          <Toaster />
        </body>
      </Providers>
    </html>
  );
}
