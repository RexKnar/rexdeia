import { UserRole } from '@prisma/client';
import bcrypt from 'bcrypt';
import { authOptions } from 'lib/auth';
import { db } from 'lib/db';
import { AddStudentModel, UpdateStudentModel } from 'lib/domain/student';
import { getServerSession } from 'next-auth';

import { generateSignedUrl } from '../upload/service';

export async function getStudentById(id: string) {
  const session = await getServerSession(authOptions);

  const student = await db.student.findFirst({
    where: {
      id,
      branchId: session.branchId,
      organizationId: session.organizationId,
      isDeleted: false,
    },
    include: {
      batch: {
        select: {
          id: true,
          name: true,
        },
      },
      studentMapping: {
        where: {
          isCurrent: true,
          batchId: session.currentBatch,
        },
        select: {
          rollNumber: true,
          group: {
            select: {
              id: true,
              name: true,
            },
          },
          class: {
            select: {
              id: true,
              name: true,
            },
          },
          medium: {
            select: {
              id: true,
              name: true,
            },
          },
          section: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  });
  const { studentMapping, profileImage, ...restOfStudent } = student;

  const profileImageUrl = profileImage
    ? await generateSignedUrl(profileImage)
    : null;

  const studentDetails = {
    ...restOfStudent,
    profileImage: profileImageUrl,
    group: studentMapping.length > 0 ? studentMapping[0].group : null,
    class: studentMapping.length > 0 ? studentMapping[0].class : null,
    medium: studentMapping.length > 0 ? studentMapping[0].medium : null,
    section: studentMapping.length > 0 ? studentMapping[0].section : null,
    rollNumber: studentMapping.length > 0 ? studentMapping[0].rollNumber : null,
  };
  return studentDetails;
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
        // Initial password is the student's phone number (so they can sign in
        // with info they already know), but it is hashed, never stored in plaintext.
        password: await bcrypt.hash(`${student.phoneNumber}`, 10),
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

  const studentWithoutBatchId: Omit<
    AddStudentModel,
    'batchId' | 'motherTongueId' | 'communityId'
  > = {
    ...student,
  };
  delete studentWithoutBatchId['batchId'];
  delete studentWithoutBatchId['motherTongueId'];
  delete studentWithoutBatchId['communityId'];

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
            // Attribute the joining mapping to the selected academic year so the
            // student is counted for that year (matches CSV upload / promotion).
            batchId: session.currentBatch,
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
      ...(student.batchId && {
        batch: {
          connect: {
            id: student.batchId,
          },
        },
      }),
      ...(student.motherTongueId && {
        motherTongue: {
          connect: {
            id: student.motherTongueId,
          },
        },
      }),
      ...(student.communityId && {
        community: {
          connect: {
            id: student.communityId,
          },
        },
      }),
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

export async function updateStudentById(
  id: string,
  updateStudentDetails: UpdateStudentModel
) {
  return db.student.update({
    where: {
      id: id,
    },
    data: {
      ...updateStudentDetails,
    },
  });
}

export type MediumBreakdown = {
  mediumId: string | null;
  mediumName: string;
  total: number;
  boys: number;
  girls: number;
  others: number;
};

export type ClassBreakdown = {
  classId: string;
  className: string;
  total: number;
  boys: number;
  girls: number;
  others: number;
};

export type StudentDashboardStats = {
  hasBatchSelected: boolean;
  total: number;
  boys: number;
  girls: number;
  others: number;
  newAdmissions: number;
  discontinued: number;
  mediums: MediumBreakdown[];
  classes: ClassBreakdown[];
};

const UNSPECIFIED_MEDIUM = 'Unspecified';

function genderBucket(gender: string | null): 'boys' | 'girls' | 'others' {
  const normalized = (gender ?? '').trim().toLowerCase();
  if (normalized === 'male') return 'boys';
  if (normalized === 'female') return 'girls';
  return 'others';
}

/**
 * Aggregated statistics for the Students dashboard, scoped to the academic year
 * currently selected in the sidebar (session.currentBatch).
 *
 * A student belongs to an academic year through their StudentMapping for that
 * batch. Active = isCurrent mapping; "Discontinued / Transferred" = archived
 * mapping (isCurrent: false). Medium and class are read from the mapping; gender
 * from the student. New admissions are students whose joining batch is this year.
 */
export async function getStudentDashboardStats(): Promise<StudentDashboardStats> {
  const session = await getServerSession(authOptions);

  const empty: StudentDashboardStats = {
    hasBatchSelected: false,
    total: 0,
    boys: 0,
    girls: 0,
    others: 0,
    newAdmissions: 0,
    discontinued: 0,
    mediums: [],
    classes: [],
  };

  if (!session?.currentBatch) {
    return empty;
  }

  const branchScope = {
    branchId: session.branchId,
    organizationId: session.organizationId,
  };

  const [activeMappings, archived, newAdmissions] = await Promise.all([
    db.studentMapping.findMany({
      where: {
        batchId: session.currentBatch,
        isCurrent: true,
        student: {
          isDeleted: false,
          status: 'Active',
          ...branchScope,
        },
      },
      select: {
        classId: true,
        mediumId: true,
        class: { select: { name: true } },
        medium: { select: { name: true } },
        student: { select: { gender: true } },
      },
    }),
    // Discontinued / Transferred / TC are all represented as archived mappings
    // (isCurrent: false) within the selected academic year. Count distinct
    // students so multiple archived mappings don't inflate the number.
    db.studentMapping.findMany({
      where: {
        batchId: session.currentBatch,
        isCurrent: false,
        student: {
          isDeleted: false,
          ...branchScope,
        },
      },
      select: { studentId: true },
      distinct: ['studentId'],
    }),
    db.student.count({
      where: {
        batchId: session.currentBatch,
        isDeleted: false,
        ...branchScope,
      },
    }),
  ]);

  const mediumMap = new Map<string, MediumBreakdown>();
  const classMap = new Map<string, ClassBreakdown>();
  let boys = 0;
  let girls = 0;
  let others = 0;

  for (const mapping of activeMappings) {
    const bucket = genderBucket(mapping.student?.gender ?? null);
    if (bucket === 'boys') boys += 1;
    else if (bucket === 'girls') girls += 1;
    else others += 1;

    const mediumKey = mapping.mediumId ?? 'unspecified';
    const medium = mediumMap.get(mediumKey) ?? {
      mediumId: mapping.mediumId,
      mediumName: mapping.medium?.name ?? UNSPECIFIED_MEDIUM,
      total: 0,
      boys: 0,
      girls: 0,
      others: 0,
    };
    medium.total += 1;
    medium[bucket] += 1;
    mediumMap.set(mediumKey, medium);

    if (mapping.classId) {
      const klass = classMap.get(mapping.classId) ?? {
        classId: mapping.classId,
        className: mapping.class?.name ?? 'Unknown',
        total: 0,
        boys: 0,
        girls: 0,
        others: 0,
      };
      klass.total += 1;
      klass[bucket] += 1;
      classMap.set(mapping.classId, klass);
    }
  }

  return {
    hasBatchSelected: true,
    total: activeMappings.length,
    boys,
    girls,
    others,
    newAdmissions,
    discontinued: archived.length,
    mediums: Array.from(mediumMap.values()).sort((a, b) => b.total - a.total),
    classes: Array.from(classMap.values()).sort((a, b) => b.total - a.total),
  };
}

export type DashboardRosterScope = 'active' | 'discontinued' | 'newAdmissions';

export type DashboardRosterFilter = {
  scope: DashboardRosterScope;
  mediumId?: string;
  classId?: string;
};

export type RosterRow = {
  id: string;
  name: string;
  className: string;
  sectionName: string;
  mediumName: string;
  gender: string;
  rollNumber: number | null;
  status: string;
};

function fullName(student: {
  firstName: string;
  middleName?: string | null;
  lastName?: string | null;
}) {
  return [student.firstName, student.middleName, student.lastName]
    .filter(Boolean)
    .join(' ')
    .trim();
}

/**
 * Returns the full (non-paginated) student roster for the selected academic
 * year, filtered by the dashboard area that was clicked. Used to populate the
 * drill-down dialog and its Excel / PDF exports.
 *
 * - scope "active": students with a current mapping in the year.
 * - scope "newAdmissions": active students whose joining batch is this year.
 * - scope "discontinued": students with an archived mapping (isCurrent: false).
 */
export async function getStudentRosterForDashboard(
  filter: DashboardRosterFilter
): Promise<RosterRow[]> {
  const session = await getServerSession(authOptions);

  if (!session?.currentBatch) {
    return [];
  }

  const studentScope = {
    isDeleted: false,
    branchId: session.branchId,
    organizationId: session.organizationId,
    ...(filter.scope === 'newAdmissions' && { batchId: session.currentBatch }),
    ...(filter.scope !== 'discontinued' && { status: 'Active' as const }),
  };

  const mappings = await db.studentMapping.findMany({
    where: {
      batchId: session.currentBatch,
      isCurrent: filter.scope !== 'discontinued',
      ...(filter.mediumId && { mediumId: filter.mediumId }),
      ...(filter.classId && { classId: filter.classId }),
      student: studentScope,
    },
    select: {
      studentId: true,
      rollNumber: true,
      remark: true,
      class: { select: { name: true } },
      section: { select: { name: true } },
      medium: { select: { name: true } },
      student: {
        select: {
          firstName: true,
          middleName: true,
          lastName: true,
          gender: true,
        },
      },
    },
    orderBy: [{ class: { name: 'asc' } }, { rollNumber: 'asc' }],
  });

  const seen = new Set<string>();
  const rows: RosterRow[] = [];

  for (const mapping of mappings) {
    // Archived students can have more than one mapping in a year; keep the first.
    if (filter.scope === 'discontinued') {
      if (seen.has(mapping.studentId)) continue;
      seen.add(mapping.studentId);
    }

    rows.push({
      id: mapping.studentId,
      name: fullName(mapping.student),
      className: mapping.class?.name ?? '-',
      sectionName: mapping.section?.name ?? '-',
      mediumName: mapping.medium?.name ?? '-',
      gender: mapping.student?.gender ?? '-',
      rollNumber: mapping.rollNumber ?? null,
      status:
        filter.scope === 'discontinued'
          ? mapping.remark?.trim()
            ? `Discontinued (${mapping.remark.trim()})`
            : 'Discontinued / Transferred'
          : 'Active',
    });
  }

  return rows;
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

  const studentMappings = await db.studentMapping.findMany({
    where: {
      sectionId: sectionId,
      isCurrent: true,
      batchId: session.currentBatch,
      student: {
        branchId: session.branchId,
        organizationId: session.organizationId,
        status: 'Active',
        isDeleted: false,
      },
    },
    include: {
      student: {
        include: {
          community: true,
        },
      },
      group: true,
      batch: true,
      class: true,
      section: true,
    },
    orderBy: [
      {
        rollNumber: 'asc',
      },
      {
        student: {
          gender: 'asc',
        },
      },
      {
        student: {
          firstName: 'asc',
        },
      },
    ],
  });

  const result = studentMappings.map((mapping) => ({
    ...mapping.student,
    academicDetails: {
      id: mapping.id,
      rollNumber: mapping.rollNumber,
      academicYear: mapping.batch,
      class: mapping.class,
      section: mapping.section,
    },
    group: mapping.group,
  }));

  return result;
}

export async function getAllStudentsBySectionIds(ids: string[]) {
  const session = await getServerSession(authOptions);
  const studentsList = await db.studentMapping.findMany({
    where: {
      sectionId: {
        in: ids,
      },
      isCurrent: true,
      batchId: session.currentBatch,
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
