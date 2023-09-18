import 'configs/tailwind/styles.css';

import { ReactNode, Suspense } from 'react';
import { Toaster } from 'ui';

import { Sidebar } from '../../lib/components/Sidebar';
import Providers from '../../lib/Providers';

export const metadata = {
  title: 'Capeo - Simplifying the way you manage your business',
  description: 'Capeo is a business management platform for small businesses.',
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
