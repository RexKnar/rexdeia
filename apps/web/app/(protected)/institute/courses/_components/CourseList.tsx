'use client';
import { useGetInstituteCourseListQuery } from 'lib/queries/institute/course/useGetInstituteCourseListQuery';
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
      filter: { isActive: false },
    });
  return (
    <div className="flex flex-wrap justify-center gap-3 md:justify-start ">
      {courseListResponse
        ? courseListResponse?.data?.map((course) => (
            <CourseCard
              key={course.id}
              courseId={course.id}
              imgSrc={course.coverImage}
              courseName={course.courseName}
              type="institute"
            />
          ))
        : isCourseListLoading
          ? 'Loading...'
          : 'No Courses Found'}
    </div>
  );
}
