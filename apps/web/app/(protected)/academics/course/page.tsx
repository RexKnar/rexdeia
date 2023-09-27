import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';

import { authOptions } from '../../../../lib/auth';
import { CourseList } from '../../../../lib/components/course/courseList';
import { getCourseList } from '../../../api/course/service';

export default async function Page() {
  const session = await getServerSession(authOptions);
  if (!session.branchId || !session.organizationId) {
    return redirect('/signin?callbackUrl=/academics/course');
  }

  const courses = await getCourseList({
    branchId: session.branchId,
    organizationId: session.organizationId,
  });

  return (
    <div className="flex flex-col">
      <CourseList courseList={courses} />
    </div>
  );
}
