import { getServerSession } from 'next-auth';
import { authOptions } from '../lib/auth';
import { redirect } from 'next/navigation';
import { NavigationHeader } from '../lib/components/NavigationHeader';
import { GraduationCap } from 'lucide-react';
import { UserMenu } from '../lib/components/header/UserMenu';

export default async function Page() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect('/signin');
  }

  return (
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
  );
}
