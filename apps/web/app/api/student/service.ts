import { db } from '../../../lib/db';
import { AddStudentModel } from '../../../lib/domain';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../lib/auth';

export async function getStudentById(id: string) {
  const session = await getServerSession(authOptions);
  return await db.student.findFirst({
    where: {
      id,
      branchId: session.branchId,
      organizationId: session.organizationId,
    },
    select: {
      createdAt: false,
      updatedAt: false,
    },
  });
}

export async function addStudent(student: AddStudentModel) {
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
      status: 'Active',
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

  await db.admissionForm.create({
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
      status: 'DirectStudentEntry',
    },
  });

  return createdStudent;
}

export async function getStudentsList(page: number, pageSize: number) {
  const session = await getServerSession(authOptions);
  const total = await db.student.count();
  const studentsList = await db.student.findMany({
    take: pageSize,
    skip: (page - 1) * pageSize,
    where: {
      status: 'Active',
      branchId: session.branchId,
      organizationId: session.organizationId,
    },
  });

  return {
    total,
    page,
    pageSize,
    data: studentsList,
  };
}
