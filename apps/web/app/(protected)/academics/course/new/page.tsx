import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';

import { CourseForm } from '@/components/course/courseForm';

import { authOptions } from '../../../../../lib/auth';

export default async function Page() {
  const session = await getServerSession(authOptions);
  if (!session.branchId || !session.organizationId) {
    return redirect('/signin?callbackUrl=/academics/course/new');
  }
  return <CourseForm />;
}
