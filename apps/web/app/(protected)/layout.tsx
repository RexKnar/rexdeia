import 'configs/tailwind/styles.css';

import { Inter, Roboto_Mono } from 'next/font/google';
import { ReactNode } from 'react';
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
          <div className="flex h-screen overflow-hidden">
            <aside className="relative hidden flex-[2/6] grow-0 md:flex">
              <Sidebar />
            </aside>
            <main className="flex-1 overflow-auto">{children}</main>
          </div>
          <Toaster />
        </body>
      </Providers>
    </html>
  );
}
