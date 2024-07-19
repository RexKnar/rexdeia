import { authOptions } from 'lib/auth';
import { db } from 'lib/db';
import { getServerSession } from 'next-auth';

export async function getStudentSearchList(
  searchTerm: string,
  page: number,
  pageSize: number
) {
  const session = await getServerSession(authOptions);
  const searchFields = [
    'firstName',
    'middleName',
    'lastName',
    'emisNumber',
    'phoneNumber',
    'emailId',
    'fatherName',
    'motherName',
    'guardianName',
  ] as const;

  const whereCondition = {
    AND: [
      {
        isDeleted: false,
        branchId: session.branchId,
        organizationId: session.organizationId,
      },
      {
        OR: searchFields.map((field) => ({
          [field]: {
            search: searchTerm,
          },
        })),
      },
    ],
  };

  const [total, studentsList] = await Promise.all([
    db.student.count({
      where: whereCondition,
    }),

    db.student.findMany({
      where: whereCondition,
      take: pageSize,
      skip: (page - 1) * pageSize,
      orderBy: {
        _relevance: {
          fields: [...searchFields],
          search: searchTerm,
          sort: 'desc',
        },
      },
      select: {
        id: true,
        firstName: true,
        middleName: true,
        lastName: true,
        emailId: true,
        phoneNumber: true,
        aadharCardNumber: true,
        emisNumber: true,
        gender: true,
        bloodGroup: true,
        studentMapping: {
          where: {
            batchId: session.currentBatch,
          },
          select: {
            class: {
              select: {
                name: true,
              },
            },
            section: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    }),
  ]);

  return {
    total,
    page,
    pageSize,
    data: studentsList,
  };
}
