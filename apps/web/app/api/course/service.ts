import { db } from '../../../lib/db';
import { AddCourseModel } from './models';

export async function getCourseList({ organizationId, branchId }) {
  return await db.course.findMany({
    where: { isDeleted: false },
    include: {
      department: {
        where: {
          organizationId: organizationId,
          branchId: branchId,
        },
      },
    },
  });
}

export async function addCourse(course: AddCourseModel) {
  return await db.course.create({
    data: {
      ...course,
      courseName: course.courseName,
      isActive: course.isActive,
      description: course.description,
    },
  });
}
