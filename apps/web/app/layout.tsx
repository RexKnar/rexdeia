import 'configs/tailwind/styles.css';
import '../public/assets/css/styles.css';
import '../public/assets/css/font.css';

import type { ReactNode } from 'react';

import Providers from '../lib/Providers';

export const metadata = {
  title: 'Capeo - Simplifying the way you manage your business',
  description: 'Capeo is a business management platform for small businesses.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <html lang="en">
        <body className="h-screen">
          <Providers>{children}</Providers>
        </body>
      </html>
    </>
  );
}
