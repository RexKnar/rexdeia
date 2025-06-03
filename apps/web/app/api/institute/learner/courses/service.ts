import { generateSignedUrl } from 'app/api/upload/service';
import { authOptions } from 'lib/auth';
import { db } from 'lib/db';
import { getServerSession } from 'next-auth';

export async function getInstituteCoursesByLearnerId(
  page: number,
  limit: number
) {
  const { branchId, organizationId, user } =
    await getServerSession(authOptions);

  const whereClause = {
    isPaid: true,
    branchId,
    organizationId,
    userId: user.id,
  };

  const [total, purchasedCourses] = await db.$transaction([
    db.coursePurchaseRecord.count({
      where: whereClause,
    }),
    db.coursePurchaseRecord.findMany({
      take: limit,
      skip: (page - 1) * limit,
      where: whereClause,
      include: {
        course: {
          select: {
            id: true,
            courseName: true,
            coverImage: true,
            isActive: true,
            createdAt: true,
          },
        },
      },
    }),
  ]);

  const data = await Promise.all(
    purchasedCourses.map(async (purchasedCourse) => {
      return {
        ...purchasedCourse?.course,
        coverImage: purchasedCourse?.course?.coverImage
          ? await generateSignedUrl(purchasedCourse?.course?.coverImage)
          : null,
      };
    })
  );
  return {
    page,
    total,
    limit,
    data,
  };
}
//   db.instituteCourse.count({
//     where: whereClause,
//   }),
//   db.instituteCourse.findMany({
//     take: limit,
//     skip: (page - 1) * limit,
//     where: whereClause,
//     select: {
//       id: true,
//       courseName: true,
//       coverImage: true,
//       isActive: true,
//       createdAt: true,
//     },
//   }),
// ]);

// const data = await Promise.all(
//   courses.map(async (course) => ({
//     ...course,
//     coverImage: course.coverImage
//       ? await generateSignedUrl(course.coverImage)
//       : null,
//   }))
// );
// return {
//   page,
//   total,
//   limit,
//   data,
// };
// }
