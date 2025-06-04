import NextTopLoader from 'nextjs-toploader';
import { ReactNode, Suspense } from 'react';
import { primaryColor, Toaster } from 'ui';
import { SidebarProvider } from 'ui/components/ui/Sidebar';

import { AppSidebar } from '@/components/appSidebar/AppSidebar';
import { PageHeader } from '@/components/PageHeader';
import { ZohoSalesIQ } from '@/components/ZohoSalesIQ';

export const metadata = {
  title: 'Rexdeia | Elevate your academic experience',
  description: 'Your one stop platform for all your academic needs',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="h-screen w-full bg-gray-50">
        <NextTopLoader color={primaryColor} showSpinner={false} />

        <Suspense>
          <PageHeader />

          <section className="lg:flex ">
            <section className="h-full bg-gray-50 lg:flex-1 print:ml-0">
              <section className="h-full bg-gray-50">
                <section className="mx-auto bg-gray-50 py-6 md:container">
                  {children}
                </section>
              </section>
            </section>
          </section>
        </Suspense>

        <Toaster />
        <ZohoSalesIQ />
      </main>
    </SidebarProvider>
  );
}
