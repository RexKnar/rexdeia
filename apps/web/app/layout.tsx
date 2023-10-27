import 'configs/tailwind/styles.css';
import '../public/assets/css/styles.css';

import { Inter, Roboto_Mono } from 'next/font/google';
import type { ReactNode } from 'react';

import Providers from '../lib/Providers';

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
  title: 'Capeo - Simplifying the way you manage your business',
  description: 'Capeo is a business management platform for small businesses.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${roboto_mono.variable}`}>
      <body className="h-screen">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
