import { CourseList } from '../../../lib/components/course/courseList';
import { db } from '../../../lib/db';

export default async function Page() {
  try {
    const apiResponse = await db.course.findMany({
      where: { isDeleted: false },
    });
    return (
      <div className="flex flex-col">
        <CourseList courseList={apiResponse} />
      </div>
    );
  } catch (error) {
    console.log(error);
  }
}
