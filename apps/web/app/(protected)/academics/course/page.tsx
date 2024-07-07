import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { Suspense } from 'react';

import { CourseList } from '@/components/course/courseList';

import { authOptions } from '../../../../lib/auth';
import { getCourseList } from '../../../api/course/service';

export default async function Page() {
  const session = await getServerSession(authOptions);
  if (!session.branchId || !session.organizationId) {
    return redirect('/signin?callbackUrl=/academics/course');
  }

  const courses = await getCourseList({
    branchId: session.branchId,
  });

  return (
    <div className="flex flex-col">
      <Suspense>
        <CourseList courseList={courses} />
      </Suspense>
    </div>
  );
}
