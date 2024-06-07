import { authOptions } from 'lib/auth';
import { db } from 'lib/db';
import { getServerSession } from 'next-auth';

type GroupFilter = {
  isActive?: boolean;
  classId: string;
  sectionId?: string;
};

export async function getAllGroupsByClassId(
  page: number,
  limit: number,
  filter: GroupFilter
) {
  const { isActive, classId } = filter;
  const { branchId } = await getServerSession(authOptions);

  const whereClause = {
    branchId,
    isDeleted: false,
  };

  if (isActive !== undefined) {
    whereClause['isActive'] = isActive;
  }

  const [total, groupList] = await Promise.all([
    db.sectionToGroups.count({
      where: {
        section: { classId },
      },
    }),
    db.sectionToGroups.findMany({
      take: limit,
      skip: (page - 1) * limit,
      where: {
        section: { classId },
      },
      include: {
        group: true,
        section: {
          select: {
            id: true,
            name: true,
            classId: true,
          },
        },
      },
    }),
  ]);
  const responseList = groupList.map((item) => item.group);

  return {
    page,
    total,
    limit,
    data: responseList,
  };
}
