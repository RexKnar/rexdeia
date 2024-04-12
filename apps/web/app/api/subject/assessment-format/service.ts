import { authOptions } from 'lib/auth';
import { db } from 'lib/db';
import {
  CreateAssessmentFormatModel,
  UpdateAssessmentFormatModel,
} from 'lib/domain/subject';
import { getServerSession } from 'next-auth';

type AssessmentFormatFilter = {
  isActive?: boolean;
};

export async function getAssessmentFormatList(page: number, limit: number) {
  const session = await getServerSession(authOptions);

  const [assessmentFormat, totalAssessmentFormat] = await db.$transaction([
    db.assessmentFormat.findMany({
      take: limit,
      skip: (page - 1) * limit,
      where: { isDeleted: false, branchId: session.branchId },
      include: {
        parentAssessmentFormat: true,
        childAssessmentFormats: true,
      },
    }),
    db.assessmentFormat.count({
      where: {
        isDeleted: false,
        branchId: session.branchId,
      },
    }),
  ]);

  return {
    page,
    limit,
    data: assessmentFormat,
    total: totalAssessmentFormat,
  };
}

export async function getAssessmentFormatById(id: string) {
  return db.assessmentFormat.findUnique({
    where: {
      id: id,
      isActive: true,
    },
    include: {
      childAssessmentFormats: true,
    },
  });
}

export async function addAssessmentFormat(
  parentId: string | null | undefined,
  assessmentFormat: CreateAssessmentFormatModel
) {
  const session = await getServerSession(authOptions);
  const data = {
    name: assessmentFormat.name,
    isActive: assessmentFormat.isActive,
    hasMarkEntry: assessmentFormat.hasMarkEntry,
    branch: {
      connect: {
        id: session.branchId,
      },
    },
  };

  if (parentId !== null && parentId !== undefined) {
    data['parentAssessmentFormat'] = {
      connect: {
        id: parentId,
      },
    };
  }

  return await db.assessmentFormat.create({
    data,
  });
}

export async function updateAssessmentFormatById(
  subjectId: string,
  assessmentFormat: UpdateAssessmentFormatModel
) {
  const session = await getServerSession(authOptions);

  return db.assessmentFormat.update({
    data: {
      name: assessmentFormat.name,
      isActive: assessmentFormat.isActive,
      parentAssessmentFormat: {
        connect: {
          id: assessmentFormat.parentId,
        },
      },
      branch: {
        connect: {
          id: session.branchId,
        },
      },
    },
    where: {
      id: subjectId,
    },
  });
}

export async function deleteAssessmentFormat(assessmentFormatId: string) {
  return db.assessmentFormat.update({
    where: {
      id: assessmentFormatId,
    },
    data: {
      isDeleted: true,
    },
  });
}

export async function getAssessmentFormatsWithFilter(
  page: number,
  limit: number,
  filter: AssessmentFormatFilter
) {
  const { isActive } = filter;
  const { branchId } = await getServerSession(authOptions);

  const whereClause = {
    branchId,
    isDeleted: false,
  };

  if (isActive !== undefined) {
    whereClause['isActive'] = isActive;
  }

  const [total, data] = await db.$transaction([
    db.assessmentFormat.count({
      where: whereClause,
    }),
    db.assessmentFormat.findMany({
      take: limit,
      where: whereClause,
      skip: (page - 1) * limit,
      include: {
        parentAssessmentFormat: true,
        childAssessmentFormats: true,
      },
    }),
  ]);

  return {
    page,
    total,
    limit,
    data,
  };
}
