import 'configs/tailwind/styles.css';

import { Inter, Roboto_Mono } from 'next/font/google';
import NextTopLoader from 'nextjs-toploader';
import { ReactNode } from 'react';
import { primaryColor, Toaster } from 'ui';

import { Sidebar } from '../../lib/components/sidebar/Sidebar';
import { ZohoSalesIQ } from '../../lib/components/ZohoSalesIQ';
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
        <body className="bg-gray-50">
          <NextTopLoader color={primaryColor} showSpinner={false} />
          <div className="flex h-screen overflow-hidden">
            <aside className="relative hidden grow-0 border-r shadow-md md:flex md:w-64">
              <Sidebar />
            </aside>
            <main className="container mx-auto h-full w-full flex-1 overflow-auto bg-gray-50 px-8 py-10">
              {children}
            </main>
          </div>
          <Toaster />
          <ZohoSalesIQ />
        </body>
      </Providers>
    </html>
  );
}
