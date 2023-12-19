import { getServerSession } from 'next-auth';

import { authOptions } from '../../../lib/auth';
import { db } from '../../../lib/db';
import { AddStaffModel, UpdateStaffModel } from '../../../lib/domain/staff';

export async function getStaffById(id: string) {
  return await db.staff.findFirst({
    where: {
      id,
    },
  });
}

export async function deleteStaffById(id: string) {
  return await db.staff.update({
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
  return await db.staff.update({
    where: {
      id: id,
    },
    data: {
      ...updatedStaff,
    },
  });
}

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
        name: staff.name,
        email: staff.email,
        role: 'TeachingStaff',
        username: staff.email,
        phoneNumber: staff.phoneNumber,
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

  const createdStaff = await db.staff.create({
    data: {
      type: staff.type,
      aadharCardNumber: staff.aadharCardNumber,
      annualIncome: staff.annualIncome,
      bloodGroup: staff.bloodGroup,
      dob: staff.dob,
      address: staff.address,
      dateOfJoining: staff.dateOfJoining,
      status: 'Active',
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

  return createdStaff;
}

export async function getStaffList(page: number, pageSize: number) {
  const session = await getServerSession(authOptions);

  const [staffList, total] = await Promise.all([
    db.staff.findMany({
      take: pageSize,
      skip: (page - 1) * pageSize,
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
    pageSize,
    data: staffList,
  };
}

export async function getAllStaffsBySectionId(sectionId: string) {
  const session = await getServerSession(authOptions);
  return await db.staff.findMany({
    where: {
      branchId: session.branchId,
      organizationId: session.organizationId,
      sectionId: {
        has: sectionId,
      },
    },
  });
}
