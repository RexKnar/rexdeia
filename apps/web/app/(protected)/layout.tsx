import 'configs/tailwind/styles.css';

import NextTopLoader from 'nextjs-toploader';
import { ReactNode, Suspense } from 'react';
import { primaryColor, Toaster } from 'ui';

import { PageHeader } from '@/components/PageHeader';
import { Sidebar } from '@/components/sidebar/Sidebar';
import { ZohoSalesIQ } from '@/components/ZohoSalesIQ';

export const metadata = {
  title: 'Rexdeia | Elevate your academic experience',
  description: 'Your one stop platform for all your academic needs',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <main className="h-screen bg-gray-50">
      <NextTopLoader color={primaryColor} showSpinner={false} />
     <Suspense><PageHeader /></Suspense>
      <section className="lg:flex">
       <Suspense><Sidebar /></Suspense>
        <section className="h-full bg-gray-50 lg:ml-72 lg:flex-1">
          <section className="container py-6 mx-auto bg-gray-50">
            {children}
          </section>
        </section>
      </section>
      <Toaster />
      <ZohoSalesIQ />
    </main>
  );
}
