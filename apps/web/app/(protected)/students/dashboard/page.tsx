import Image from 'next/image';
import Link from 'next/link';
import { Suspense } from 'react';

import noStudentData from '../../../../public/assets/images/no-student-data.svg';
import { getRecentlyAddedStudentsList } from '../../../api/student/service';
import { RecentEnrolledStudents } from './_components/RecentEnrolledStudents';
import { StudentDashboardBanner } from './_components/StudentDashboardBanner';
import { StudentsWidgetContainer } from './_components/StudentsWidgetContainer';

export default async function Page() {
  const studentsList = await getRecentlyAddedStudentsList({
    count: 5,
  });

  return (
    <section className="flex flex-col gap-4 p-4 sm:p-6 md:p-8">
      <StudentDashboardBanner />
      <section className="flex flex-col gap-3 rounded-md bg-white p-6 shadow-sm sm:p-8">
        <section>
          <p className="text-lg font-semibold text-gray-800 sm:text-xl">
            Students Overview
          </p>
          <p className="text-sm text-gray-700 sm:text-base">
            This section provides a comprehensive overview of student
            statistics.
          </p>
          <StudentsWidgetContainer />
        </section>
      </section>
      <section className="flex flex-col gap-3 rounded-md bg-white p-6 shadow-sm sm:p-8">
        <section>
          <p className="text-lg font-semibold text-gray-800 sm:text-xl">
            Recent enrolled students
          </p>
          <p className="text-sm text-gray-700 sm:text-base">
            Here you will find information on students who have recently joined,
            including their backgrounds, academic interests.
          </p>
        </section>
        {studentsList.length === 0 && (
          <div className="mt-4 flex flex-col items-center justify-center text-center text-gray-700">
            <Image alt="icon" width={186} height={186} src={noStudentData} />
            <div className="mt-4 text-sm sm:text-base">
              We couldn’t find any students who were enrolled recently.
            </div>
          </div>
        )}
        {studentsList.map((student) => (
          <Suspense key={student.id}>
            <RecentEnrolledStudents {...student} />
          </Suspense>
        ))}
        <div className="flex justify-end text-sm text-primary sm:text-base">
          <Link href="/students/list">Browse All</Link>
        </div>
      </section>
    </section>
  );
}
