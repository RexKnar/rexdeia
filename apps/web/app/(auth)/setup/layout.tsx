import 'configs/tailwind/styles.css';

export const metadata = {
  title: 'Capeo - Simplifying the way you manage your business',
  description: 'Capeo is a business management platform for small businesses.',
};

export default function SetupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <section>{children}</section>;
}
