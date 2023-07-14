import 'configs/tailwind/styles.css';
import Providers from '../lib/Providers';
import { Toast } from 'ui';

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
      <body>
        <Providers>
          {children}
          <Toast />
        </Providers>
      </body>
    </html>
  );
}
