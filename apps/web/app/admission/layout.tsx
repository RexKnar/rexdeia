import 'configs/tailwind/styles.css';
import { Toaster } from "../../../../packages/ui/components/ui/Toaster"
import { GraduationCap } from 'lucide-react';
import { Suspense } from 'react';
import Providers from '../../lib/Providers';
import { NavigationHeader } from '../../lib/components/NavigationHeader';
import { UserMenu } from '../../lib/components/header/UserMenu';
import { Sidebar } from '../../lib/components/Sidebar';

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
          <main className="flex flex-row">
            <Suspense fallback={<div>Loading...</div>}>
              <Sidebar />
            </Suspense>
            {children}
           
          </main>
          <Toaster/>
        </body>
      </Providers>
    </html>
  );
}
