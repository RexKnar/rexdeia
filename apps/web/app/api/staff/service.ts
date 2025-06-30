import bcrypt from 'bcrypt';
import uniqBy from 'lodash/uniqBy';
import { getServerSession } from 'next-auth';

import { authOptions } from '../../../lib/auth';
import { db } from '../../../lib/db';
import { AddStaffModel, UpdateStaffModel } from '../../../lib/domain/staff';

type GetStaffsFilter = {
  sectionId: string;
};

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

export async function addStaff(staff: AddStaffModel) {
  const session = await getServerSession(authOptions);

  let user = await db.user.findFirst({
    where: {
      email: staff.email,
    },
  });

  if (!user) {
    const hashedPassword = await bcrypt.hash(staff.mobile || '123456', 10);
    user = await db.user.create({
      data: {
        password: hashedPassword,
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

  const staffDetails: Omit<
    AddStaffModel,
    | 'motherTongueId'
    | 'communityId'
    | 'staffCategoryId'
    | 'employmentTypeId'
    | 'designationId'
    | 'natureOfPostingId'
    | 'staffCategory'
    | 'enrollmentNumber'
    | 'enrollmentId'
  > = {
    ...staff,
  };
  delete staffDetails['communityId'];
  delete staffDetails['motherTongueId'];
  delete staffDetails['staffCategoryId'];
  delete staffDetails['employmentTypeId'];
  delete staffDetails['designationId'];
  delete staffDetails['natureOfPostingId'];
  return db.staff.create({
    data: {
      ...staffDetails,
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
      ...(staff.communityId && {
        community: {
          connect: {
            id: staff.communityId,
          },
        },
      }),
      ...(staff.motherTongueId && {
        motherTongue: {
          connect: {
            id: staff.motherTongueId,
          },
        },
      }),
      ...(staff.staffCategoryId && {
        staffCategory: {
          connect: {
            id: staff.staffCategoryId,
          },
        },
      }),
      ...(staff.employmentTypeId && {
        employmentType: {
          connect: {
            id: staff.employmentTypeId,
          },
        },
      }),
      ...(staff.designationId && {
        designation: {
          connect: {
            id: staff.designationId,
          },
        },
      }),
      ...(staff.natureOfPostingId && {
        natureOfPosting: {
          connect: {
            id: staff.natureOfPostingId,
          },
        },
      }),
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

export async function getAllStaffsBySectionId(id: string) {
  const staffs = await db.staffSection.findMany({
    where: {
      sectionId: id,
    },
    select: {
      staff: true,
    },
  });
  return [...staffs.map((data) => data.staff)];
}

export async function getAllSectionsByStaffIds(ids: string[]) {
  const sections = await db.staffSection.findMany({
    where: {
      staffId: {
        in: ids,
      },
    },
    select: {
      section: true,
    },
  });
  return [...sections.map((data) => data.section)];
}

export async function getAllStaffsBySectionIds(ids: string[]) {
  const staffs = await db.staffSection.findMany({
    where: {
      sectionId: {
        in: ids,
      },
    },
    select: {
      staff: true,
    },
  });
  return [...staffs.map((data) => data.staff)];
}

export async function getAllStaffsBySectionsIdWithSubjects(ids: string[]) {
  const session = await getServerSession(authOptions);
  const staffs = await db.staff.findMany({
    where: {
      academicSubjectForStaff: {
        some: {
          sectionId: {
            in: ids,
          },
          academicYearId: session.currentBatch,
          deletedAt: null,
        },
      },
    },
    include: {
      academicSubjectForStaff: {
        where: {
          sectionId: {
            in: ids,
          },
          academicYearId: session.currentBatch,
          deletedAt: null,
        },
        select: {
          isIncharge: true,
          subject: {
            select: {
              name: true,
              id: true,
            },
          },
          academicYear: {
            select: {
              name: true,
              id: true,
            },
          },
          section: {
            select: {
              name: true,
              id: true,
            },
          },
        },
      },
    },
  });

  const result = staffs.map(({ academicSubjectForStaff, ...rest }) => ({
    ...rest,
    subjects: academicSubjectForStaff
      .filter((item) => !item.isIncharge)
      .map((subject) => subject.subject),
    academicYear: academicSubjectForStaff.map(
      (academicYear) => academicYear.academicYear
    ),
    sections: academicSubjectForStaff
      .filter((item) => !item.isIncharge)
      .map((section) => section.section),
    sectionIncharge: academicSubjectForStaff
      .filter((item) => item.isIncharge)
      .map((section) => section.section),
  }));

  return result;
}

export async function getStaffsBySection(filter: GetStaffsFilter) {
  const session = await getServerSession(authOptions);
  const staffs = await db.academicSubjectForStaff.findMany({
    where: {
      ...filter,
      academicYearId: session.currentBatch,
    },
    select: {
      staff: {
        select: {
          id: true,
          firstName: true,
          middleName: true,
          lastName: true,
          email: true,
        },
      },
    },
  });
  let staffsList = staffs.map((item) => {
    return item.staff;
  });

  return uniqBy(staffsList, (staff) => staff.id);
}

export async function getSubjectByStaffId(id) {
  const session = await getServerSession(authOptions);
  const subjectResponse = await db.class.findMany({
    where: {
      Section: {
        some: {
          academicSubjectForStaff: {
            some: {
              staffId: id,
              academicYearId: session.currentBatch,
            },
          },
        },
      },
    },
    select: {
      id: true,
      name: true,
      Section: {
        select: {
          id: true,
          name: true,
          academicSubjectForStaff: {
            where: {
              staffId: id,
              isIncharge: false,
              academicYearId: session.currentBatch,
            },
            include: {
              subject: true,
            },
          },
        },
      },
    },
  });

  const response = subjectResponse.flatMap(({ id, name, ...rest }) => {
    const sections = rest.Section.filter(
      (section) => section?.academicSubjectForStaff.length
    ).flatMap(({ id: sectionId, name: sectionName, ...sectionRest }) => {
      const subjects = sectionRest.academicSubjectForStaff.flatMap(
        (academicSubject) => {
          return academicSubject.subject;
        }
      );

      return { id: sectionId, name: sectionName, subjects };
    });

    return {
      id,
      name,
      sections,
    };
  });

  return response;
}
