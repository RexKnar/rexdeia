import { UserRole } from '@prisma/client';
import { getServerSession } from 'next-auth';

import { authOptions } from '../../../lib/auth';
import { db } from '../../../lib/db';
import { AddStudentModel } from '../../../lib/domain';

export async function getStudentById(id: string) {
  const session = await getServerSession(authOptions);

  const student = await db.student.findFirst({
    where: {
      id,
      branchId: session.branchId,
      organizationId: session.organizationId,
      isDeleted: false,
    },
  });

  // if (!student) {
  //   return null;
  // }

  // if (format === 'form') {
  //   const studentDefaultPropsMap = new Map(Object.entries(student));
  //   const additionalPropsMap = new Map(
  //     Object.entries(student.additionalAttributes)
  //   );

  //   const form = await db.form.findFirst({
  //     where: {
  //       id: student.formId,
  //     },
  //   });

  //   // @ts-ignore
  //   form.json.formSections.forEach((section) => {
  //     section.sectionFields.forEach((field) => {
  //       field.value =
  //         studentDefaultPropsMap.get(field.name) == undefined
  //           ? additionalPropsMap.get(field.name)
  //           : studentDefaultPropsMap.get(field.name);
  //     });
  //   });
  //   return form.json;
  // }
  return student;
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
        role: UserRole.Student,
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

  const studentWithoutBatchId: Omit<AddStudentModel, 'batchId'> = {
    ...student,
  };
  delete studentWithoutBatchId['batchId'];

  const createdStudent = await db.student.create({
    data: {
      ...studentWithoutBatchId,
      status: 'Active',
      createdAt: new Date(),
      updatedAt: new Date(),
      studentMapping: {
        create: [
          {
            groupId: student.additionalAttributes.joiningGroup,
            classId: student.additionalAttributes.joiningClass,
            mediumId: student.additionalAttributes.joiningMedium,
          },
        ],
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
      user: {
        connect: {
          id: user.id,
        },
      },
      batch: {
        connect: {
          id: student.batchId,
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

  const [total, studentsList] = await Promise.all([
    db.student.count({
      where: {
        isDeleted: false,
        branchId: session.branchId,
        organizationId: session.organizationId,
      },
    }),
    db.student.findMany({
      take: pageSize,
      skip: (page - 1) * pageSize,
      where: {
        isDeleted: false,
        branchId: session.branchId,
        organizationId: session.organizationId,
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

export async function getAllStudentsByBatchId(
  page: number,
  pageSize: number,
  batchId: string
) {
  const session = await getServerSession(authOptions);

  const [total, studentsList] = await Promise.all([
    db.student.count({
      where: {
        status: 'Active',
        branchId: session.branchId,
        organizationId: session.organizationId,
        batchId: batchId,
      },
    }),
    db.student.findMany({
      take: pageSize,
      skip: (page - 1) * pageSize,
      where: {
        status: 'Active',
        branchId: session.branchId,
        organizationId: session.organizationId,
        batchId: batchId,
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

export async function getRecentlyAddedStudentsList({
  count,
}: {
  count: number;
}) {
  const session = await getServerSession(authOptions);
  return await db.student.findMany({
    take: count,
    where: {
      status: 'Active',
      branchId: session.branchId,
      organizationId: session.organizationId,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
}
export async function getAllStudentsBySectionIdWithGroup(sectionId: string) {
  const session = await getServerSession(authOptions);
  const students = await db.student.findMany({
    where: {
      branchId: session.branchId,
      organizationId: session.organizationId,
      studentMapping: {
        some: {
          sectionId: sectionId,
        },
      },
    },
    include: {
      studentMapping: {
        include: {
          group: true,
        },
      },
    },
  });

  const result = students.map(({ studentMapping, ...rest }) => ({
    ...rest,
    group: studentMapping.map((group) => group.group),
  }));

  return result;
}

export async function getAllStudentsBySectionIds(ids: string[]) {
  const studentsList = await db.studentMapping.findMany({
    where: {
      sectionId: {
        in: ids,
      },
    },
    select: {
      student: true,
    },
  });

  let studentList = studentsList.map((item) => {
    return item.student;
  });
  return studentList;
}

export async function deleteStudentById(id: string) {
  const session = await getServerSession(authOptions);
  return db.student.update({
    where: {
      id: id,
      branchId: session.branchId,
    },
    data: {
      isDeleted: true,
      updatedAt: new Date(),
    },
  });
}
