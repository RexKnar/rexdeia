import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';

import { authOptions } from '../../../../../lib/auth';
import { CourseForm } from '../../../../../lib/components/course/courseForm';

export default async function Page() {
  const session = await getServerSession(authOptions);
  if (!session.branchId || !session.organizationId) {
    redirect('/signin');
  }
  return <CourseForm />;
}
