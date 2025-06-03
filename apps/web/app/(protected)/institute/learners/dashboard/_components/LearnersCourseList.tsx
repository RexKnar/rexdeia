'use client';
import { CourseCard } from 'app/(protected)/institute/courses/_components/CourseCard';
import { useGetCourseListByLearnersIdQuery } from 'lib/queries/institute/learners/useGetCourseListByLearnersIdQuery';
import { useSearchParams } from 'next/navigation';

export default function LearnersCourseList() {
  const searchParams = useSearchParams();

  const page = parseInt(searchParams.get('page')) || 1;
  const limit = parseInt(searchParams.get('limit')) || 5;

  const { data: courseListResponse, isLoading: isCourseListLoading } =
    useGetCourseListByLearnersIdQuery({
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
              type="learner"
            />
          ))
        : isCourseListLoading
          ? 'Loading...'
          : 'No Courses Found'}
    </div>
  );
}
