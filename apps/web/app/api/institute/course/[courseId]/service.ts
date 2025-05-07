import { authOptions } from 'lib/auth';
import { db } from 'lib/db';
import { getServerSession } from 'next-auth';

export const updateCourseById = async (courseId, payload) => {
  const session = await getServerSession(authOptions);
  return db.instituteCourse.update({
    where: {
      id: courseId,
      branchId: session.branchId,
    },
    data: {
      courseName: payload.courseName,
      isActive: payload.isActive,
      price: payload.price,
      discountPrice: payload.discountPrice,
      languageId: payload.languageId,
      description: payload.description,
    },
  });
};

export const getCourseDetailById = async (courseId) => {
  const session = await getServerSession(authOptions);
  return await db.instituteCourse.findUnique({
    where: {
      id: courseId,
      isDeleted: false,
      branchId: session.branchId,
    },
  });
};
