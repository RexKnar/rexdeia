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
      <head>
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <title>acadx.io | Elevate your academic experience</title>
      </head>
      <body className="h-screen bg-gray-50">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
