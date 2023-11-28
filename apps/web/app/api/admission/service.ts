import { getServerSession } from 'next-auth';

import { authOptions } from '../../../lib/auth';
import { db } from '../../../lib/db';
import { AddStudentModel } from '../../../lib/domain';

export async function addAdmission(student: AddStudentModel) {
  const session = await getServerSession(authOptions);

  let user = await db.user.findFirst({
    where: {
      email: student.emailId,
    },
  });

  if (!user) {
    user = await db.user.create({
      data: {
        password: '',
        name: student.firstName,
        email: student.emailId,
        username: student.emailId,
        phoneNumber: student.phoneNumber,
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

  const createdStudent = await db.student.create({
    data: {
      ...student,
      status: 'Pending',
      createdAt: new Date(),
      updatedAt: new Date(),
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
      user: {
        connect: {
          id: user.id,
        },
      },
    },
  });

  const createdAdmission = await db.admissionForm.create({
    data: {
      createdAt: new Date(),
      updatedAt: new Date(),
      student: {
        connect: {
          id: createdStudent.id,
        },
      },
      createdBy: {
        connect: {
          id: session.user.id,
        },
      },
      status: 'Received',
    },
  });

  return createdAdmission;
}

export async function getAdmissionsList(page: number, pageSize: number) {
  const session = await getServerSession(authOptions);

  const total = await db.admissionForm.count();
  const admissions = await db.admissionForm.findMany({
    take: pageSize,
    skip: (page - 1) * pageSize,
    include: {
      student: true,
    },
    where: {
      student: {
        branchId: session.branchId,
        organizationId: session.organizationId,
      },
    },
  });

  return {
    total,
    page,
    pageSize,
    data: admissions,
  };
}
