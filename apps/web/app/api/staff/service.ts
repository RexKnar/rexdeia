import { getServerSession } from 'next-auth';

import { authOptions } from '../../../lib/auth';
import { db } from '../../../lib/db';
import { AddStaffModel, UpdateStaffModel } from '../../../lib/domain/staff';

export async function getStaffById(id: string) {
  return db.staff.findFirst({
    where: {
      id,
    },
  });
}

export async function deleteStaffById(id: string) {
  return db.staff.update({
    where: {
      id: id,
    },
    data: {
      status: 'InActive',
      updatedAt: new Date(),
    },
  });
}

export async function updateStaffById(
  id: string,
  updatedStaff: UpdateStaffModel
) {
  return db.staff.update({
    where: {
      id: id,
    },
    data: {
      ...updatedStaff,
    },
  });
}

/**
 * @swagger
 * /api/staff:
 *     post:
 *       summary: Add new staff
 *       description: Add New staff
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       responses:
 *         '200':
 *           description: New staff added successfully.
 *           content:
 *             application/json:
 *               schema:
 *                 # Define the schema of your staff object here
 *         '400':
 *           description: Bad request due to validation error.
 *         '401':
 *           description: Unauthorized access.
 *         '500':
 *           description: Internal server error.
 */
export async function addStaff(staff: AddStaffModel) {
  const session = await getServerSession(authOptions);

  let user = await db.user.findFirst({
    where: {
      email: staff.email,
    },
  });

  if (!user) {
    user = await db.user.create({
      data: {
        password: '',
        email: staff.email,
        role: 'TeachingStaff',
        username: staff.email,
        phoneNumber: staff.mobile,
        name: `${staff.firstName} ${staff.middleName} ${staff.lastName}`,
      },
    });
  }
  await db.userOrganization.create({
    data: {
      user: {
        connect: {
          id: user.id,
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

  return db.staff.create({
    data: {
      ...staff,
      createdAt: new Date(),
      updatedAt: new Date(),
      user: {
        connect: {
          id: user.id,
        },
      },
      Organization: {
        connect: {
          id: session.organizationId,
        },
      },
      Branch: {
        connect: {
          id: session.branchId,
        },
      },
    },
  });
}

export async function getStaffList(page: number, limit: number) {
  const session = await getServerSession(authOptions);

  const [staffList, total] = await Promise.all([
    db.staff.findMany({
      take: limit,
      skip: (page - 1) * limit,
      where: {
        status: 'Active',
        branchId: session.branchId,
        organizationId: session.organizationId,
      },
    }),
    db.staff.count({
      where: {
        branchId: session.branchId,
        organizationId: session.organizationId,
      },
    }),
  ]);

  return {
    total,
    page,
    limit,
    data: staffList,
  };
}

export async function getAllStaffsBySectionId(sectionId: string) {
  const session = await getServerSession(authOptions);
  return db.staff.findMany({
    where: {
      branchId: session.branchId,
      organizationId: session.organizationId,
      sectionId: sectionId,
    },
  });
}
