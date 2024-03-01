import 'configs/tailwind/styles.css';

import { Inter, Roboto_Mono } from 'next/font/google';
import NextTopLoader from 'nextjs-toploader';
import { ReactNode } from 'react';
import { primaryColor, Toaster } from 'ui';

import { PageHeader } from '@/components/PageHeader';
import { Sidebar } from '@/components/sidebar/Sidebar';
import { ZohoSalesIQ } from '@/components/ZohoSalesIQ';

import Providers from '../../lib/Providers';

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

export const metadata = {
  title: 'acadx.io | Elevate your academic experience',
  description: 'Your one stop platform for all your academic needs',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${roboto_mono.variable} bg-gray-50`}
    >
      <Providers>
        <body className="h-screen bg-gray-50">
          <NextTopLoader color={primaryColor} showSpinner={false} />
          <section className="flex">
            <Sidebar />
            <main className="ml-72 h-full flex-1 bg-gray-50">
              <PageHeader />
              <section className="container mx-auto bg-gray-50 py-6">
                {children}
              </section>
            </main>
          </section>
          <Toaster />
          <ZohoSalesIQ />
        </body>
      </Providers>
    </html>
  );
}
