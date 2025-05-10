import { authOptions } from 'lib/auth';
import { db } from 'lib/db';
import { getServerSession } from 'next-auth';

import { generateSignedUrl } from '../../../upload/service';

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
      coverImage: payload.coverImage,
    },
  });
};

export const getCourseDetailById = async (courseId) => {
  const session = await getServerSession(authOptions);

  const course = await db.instituteCourse.findUnique({
    where: {
      id: courseId,
      isDeleted: false,
      branchId: session.branchId,
    },
    select: {
      coverImage: true,
      courseName: true,
    },
  });

  if (!course) return null;

  const signedUrl = course.coverImage
    ? await generateSignedUrl(course.coverImage)
    : null;

  return {
    ...course,
    coverImage: signedUrl,
  };
};
