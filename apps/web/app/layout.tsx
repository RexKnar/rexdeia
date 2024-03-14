import 'configs/tailwind/styles.css';
import '../public/assets/css/styles.css';

import { Inter, Roboto_Mono } from 'next/font/google';
import type { ReactNode } from 'react';

import { AcadXConsole } from '@/components/AcadXConsole';

import Providers from '../lib/Providers';

const inter = Inter({
  preload: true,
  display: 'swap',
  subsets: ['latin'],
  variable: '--font-inter',
});

const roboto_mono = Roboto_Mono({
  preload: true,
  display: 'swap',
  subsets: ['latin'],
  variable: '--font-roboto-mono',
});

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${roboto_mono.variable}`}>
      <head>
        <link
          sizes="180x180"
          rel="apple-touch-icon"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          sizes="32x32"
          type="image/png"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          sizes="16x16"
          type="image/png"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <title>acadx.io | Elevate your academic experience</title>
      </head>
      <body className="h-screen">
        <Providers>{children}</Providers>
        <AcadXConsole />
      </body>
    </html>
  );
}
