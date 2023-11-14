'use client';

import { useRouter } from 'next/navigation';

import { makeAPICall } from '../../api';
import { DELETE_COURSE } from '../../endpoints';

export function CourseList({ courseList }) {
  const router = useRouter();

  async function handleOnDeleteCourseClick(courseId: string) {
    try {
      await makeAPICall(DELETE_COURSE, { courseId });
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <section className="w-full">
      <div className="flex justify-end">
        <button
          className="text-primary-foreground mt-6 h-12 cursor-pointer rounded-md bg-primary px-5 text-white hover:bg-primary/90"
          type="button"
          onClick={() => {
            router.push(`/academics/course/new`);
          }}
        >
          Add Course
        </button>
      </div>

      <h1 className="mt-3 text-center text-3xl font-semibold text-primary">
        Course List
      </h1>
      <table className="m-auto mt-5 table-auto border-collapse border border-slate-400 px-4">
        <thead>
          <tr>
            <th className="border border-slate-300 px-4">Sl.No</th>
            <th className="border border-slate-300 px-4">Course Name</th>
            <th className="border border-slate-300 px-4">No of Years</th>
            <th className="border border-slate-300 px-4">No of Sem</th>
            <th className="border border-slate-300 px-4">Department</th>
            <th className="border border-slate-300 px-4">Active Status</th>
            <th className="border border-slate-300 px-4">Action</th>
          </tr>
        </thead>
        {courseList.map((item, index) => (
          <tr key={index}>
            <td className="border border-slate-300 px-4">{index + 1}</td>
            <td className="border border-slate-300 px-4">{item.courseName}</td>
            <td className="border border-slate-300 px-4">{item.noOfYears}</td>
            <td className="border border-slate-300 px-4">{item.noOfSem}</td>
            <td className="border border-slate-300 px-4">{item.department}</td>
            <td className="border border-slate-300 px-4">
              {item.activeStatus}
            </td>
            <td className="border border-slate-300 px-4">
              <button
                className="text-primary-foreground cursor-pointer rounded-md bg-primary text-white hover:bg-primary/90"
                onClick={() => {
                  router.push(`/academics/course/${item.id}/edit`);
                }}
              >
                Edit
              </button>
              <button
                className="text-primary-foreground cursor-pointer rounded-md bg-primary text-white hover:bg-primary/90"
                onClick={async () => {
                  await handleOnDeleteCourseClick(item.id);
                }}
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </table>
    </section>
  );
}
