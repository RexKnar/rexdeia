import { authOptions } from 'lib/auth';
import { db } from 'lib/db';
import { getServerSession } from 'next-auth';

import { generateSignedUrl } from '../../upload/service';

export async function getInstituteCourses(page: number, limit: number) {
  const { branchId } = await getServerSession(authOptions);

  const whereClause = {
    isDeleted: false,
    branchId,
  };

  const [total, courses] = await db.$transaction([
    db.instituteCourse.count({
      where: whereClause,
    }),
    db.instituteCourse.findMany({
      take: limit,
      skip: (page - 1) * limit,
      where: whereClause,
      select: {
        id: true,
        courseName: true,
        coverImage: true,
        isActive: true,
        createdAt: true,
      },
    }),
  ]);

  const data = await Promise.all(
    courses.map(async (course) => ({
      ...course,
      coverImage: course.coverImage
        ? await generateSignedUrl(course.coverImage)
        : null,
    }))
  );
  return {
    page,
    total,
    limit,
    data,
  };
}

export async function addInstituteCourse(payload: any) {
  const session = await getServerSession(authOptions);
  const { courseName, isActive, price, discountPrice, languageId } = payload;

  return await db.instituteCourse.create({
    data: {
      courseName,
      isActive,
      price,
      discountPrice,
      language: {
        connect: {
          id: languageId,
        },
      },
      organization: {
        connect: {
          id: session.organizationId,
        },
      },
      branch: {
        connect: {
          id: session.branchId,
        },
      },
    },
  });
}
