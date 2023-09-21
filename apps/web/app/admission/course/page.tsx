import { CourseList } from '../../../lib/components/course/courseList';

export default async function Page() {
  return (
    <>
      <div className="flex flex-col">
        <CourseList />
      </div>
    </>
  );
}
