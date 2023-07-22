import 'configs/tailwind/styles.css';
import Providers from '../lib/Providers';
import { Toast } from 'ui';
import { GraduationCap } from 'lucide-react';
import { NavigationHeader } from '../lib/components/NavigationHeader';
import { UserMenu } from '../lib/components/header/UserMenu';
import { Suspense } from 'react';
import { Sidebar } from '../lib/components/Sidebar';

export const metadata = {
  title: 'Capeo - Simplifying the way you manage your business',
  description: 'Capeo is a business management platform for small businesses.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <Providers>
        <body>
          <header className="border-color-50 flex items-center justify-between border px-4 py-2">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-6 w-6" />
              <p className="text-bold text-lg">Capeo</p>
            </div>
            <div className="flex gap-4">
              <NavigationHeader />
              <UserMenu />
            </div>
          </header>
          <main className="flex flex-row">
            <Suspense fallback={<div>Loading...</div>}>
              <Sidebar />
            </Suspense>
            {children}
          </main>
          <Toast />
        </body>
      </Providers>
    </html>
  );
}
