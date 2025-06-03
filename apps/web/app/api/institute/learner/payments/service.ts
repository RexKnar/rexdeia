import { authOptions } from 'lib/auth';
import { db } from 'lib/db';
import { getServerSession } from 'next-auth';

export async function getPaymentListByLearnerId(page: number, limit: number) {
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
            isActive: true,
            createdAt: true,
          },
        },
      },
    }),
  ]);

  return {
    page,
    total,
    limit,
    data: purchasedCourses,
  };
}
