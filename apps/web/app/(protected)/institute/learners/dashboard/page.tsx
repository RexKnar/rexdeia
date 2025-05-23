import { authOptions } from 'lib/auth';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { Suspense } from 'react';

import LearnersCourseList from './_components/LearnersCourseList';

export default async function Page() {
  const session = await getServerSession(authOptions);
  if (!session.branchId || !session.organizationId) {
    return redirect('/signin?callbackUrl=/academics/course');
  }

  return (
    <section>
      <div className="mx-auto my-5 rounded-md bg-white p-6">
        <Suspense>
          {/* <LearnersDashboardWidget /> */}
          <section className="flex flex-col gap-3 rounded-md bg-white p-10 shadow-sm">
            <div>
              <p className="text-xl font-semibold text-gray-800">
                Active Courses
              </p>
              <p className="text-gray-700">
                Here you can find your recent active courses.
              </p>
            </div>
          </section>
          <section className="flex flex-col gap-3 rounded-md bg-white p-10 shadow-sm">
            <LearnersCourseList />
          </section>
        </Suspense>
      </div>
    </section>
  );
}
