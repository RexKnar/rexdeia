'use client';
import { useGetInstituteCourseListQuery } from 'lib/queries/institute/course/useGetInstituteCourseListMutationQuery';
import { useSearchParams } from 'next/navigation';

import { CourseCard } from './CourseCard';

export default function CourseList() {
  const searchParams = useSearchParams();

  const page = parseInt(searchParams.get('page')) || 1;
  const limit = parseInt(searchParams.get('limit')) || 10;

  const { data: courseListResponse, isLoading: isCourseListLoading } =
    useGetInstituteCourseListQuery({
      page,
      limit,
    });
  return (
    <div className="flex flex-wrap gap-3 ">
      {courseListResponse
        ? courseListResponse?.data?.map((course) => (
            <CourseCard
              key={course.id}
              courseId={course.id}
              imgSrc={course.coverImage}
              courseName={course.courseName}
            />
          ))
        : isCourseListLoading
          ? 'Loading...'
          : 'No Courses Found'}
    </div>
  );
}
