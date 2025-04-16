import { authOptions } from 'lib/auth';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';

import CourseBuilder from '../../_components/CourseBuilder';

export default async function Page() {
  const session = await getServerSession(authOptions);
  if (!session.branchId || !session.organizationId) {
    return redirect('/signin?callbackUrl=/academics/course');
  }

  return (
    <section className="mx-auto my-5 flex w-full flex-wrap gap-3 rounded-md bg-white p-6">
      <CourseBuilder />
    </section>
  );
}
