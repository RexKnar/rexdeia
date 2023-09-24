import 'configs/tailwind/styles.css';

import { ReactNode, Suspense } from 'react';
import { Toaster } from 'ui';

import { Sidebar } from '../../lib/components/Sidebar';
import Providers from '../../lib/Providers';

export const metadata = {
  title: 'acadx.io | Elevate your academic experience',
  description: 'Your one stop platform for all your academic needs',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <Providers>
        <body>
          <main className="flex flex-row">
            <Suspense fallback={<div>Loading...</div>}>
              <Sidebar />
            </Suspense>
            {children}
          </main>
          <Toaster />
        </body>
      </Providers>
    </html>
  );
}
