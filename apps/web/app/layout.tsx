import 'configs/tailwind/styles.css';
import '../public/assets/css/font.css'
import '../public/assets/css/styles.css'
import '../public/assets/css/font.css';

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
    <>
      <html lang="en">
        <body className="h-screen">{children}</body>
      </html>
    </>
  );
}
