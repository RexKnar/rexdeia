/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { authOptions } from 'lib/auth';
import { db } from 'lib/db';
import { getServerSession } from 'next-auth';

export const getCourseContentStructure = async (courseId, _payload) => {
  const session = await getServerSession(authOptions);
  const response = await db.instituteCourse.findUnique({
    where: {
      id: courseId,
      branchId: session.branchId,
      isDeleted: false,
    },
    select: {
      courseName: true,
      isActive: true,
      price: true,
      discountPrice: true,
      language: true,
      description: true,
      createdAt: true,
      updatedAt: true,
      InstituteCourseModule: {
        where: {
          deletedAt: null,
        },
        select: {
          id: true,
          name: true,
          icon: true,
          description: true,
          isActive: true,
          chapters: {
            where: {
              deletedAt: null,
            },
            select: {
              id: true,
              name: true,
              icon: true,
              description: true,
              isActive: true,
              chapterItems: {
                where: {
                  deletedAt: null,
                },
                select: {
                  id: true,
                  name: true,
                  icon: true,
                  description: true,
                  language: true,
                  createdAt: true,
                  updatedAt: true,
                },
              },
            },
          },
        },
      },
    },
  });

  return response?.InstituteCourseModule || [];
};
