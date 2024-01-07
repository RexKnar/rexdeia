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

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${roboto_mono.variable}`}>
      <body className="h-screen bg-gray-50">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
