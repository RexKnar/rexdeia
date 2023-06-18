import 'configs/tailwind/styles.css';
import Providers from "../lib/Providers";

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
        </Providers>
      </body>
    </html>
  );
}
