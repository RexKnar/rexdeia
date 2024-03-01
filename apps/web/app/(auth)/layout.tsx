import 'configs/tailwind/styles.css';

import { Inter, Roboto_Mono } from 'next/font/google';
import { ReactNode } from 'react';

import { ZohoSalesIQ } from '@/components/ZohoSalesIQ';

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
    <html
      lang="en"
      className={`${inter.variable} ${roboto_mono.variable} bg-white`}
    >
      <body>
        <main>{children}</main>
        <ZohoSalesIQ />
      </body>
    </html>
  );
}
