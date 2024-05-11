import { authOptions } from 'lib/auth';
import { db } from 'lib/db';
import {
  CreateAssessmentFormatModel,
  DeleteAssessmentFormatModel,
  UpdateAssessmentFormatModel,
} from 'lib/domain/subject';
import { getServerSession } from 'next-auth';

type AssessmentFormatFilter = {
  isActive?: boolean;
  hasMarkEntry?: boolean;
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
  assessmentFormatId: string,
  assessmentFormat: UpdateAssessmentFormatModel
) {
  return db.assessmentFormat.update({
    where: {
      id: assessmentFormatId,
    },
    data: {
      name: assessmentFormat.name,
      isActive: assessmentFormat.isActive,
      hasMarkEntry: assessmentFormat.hasMarkEntry,
      parentId: assessmentFormat.parentId,
    },
  });
}

export async function deleteAssessmentFormat(
  assessmentFormatId: string
): Promise<DeleteAssessmentFormatModel> {
  const assessmentFormat = await db.assessmentFormat.findUnique({
    where: {
      id: assessmentFormatId,
    },
    include: {
      childAssessmentFormats: true,
      parentAssessmentFormat: true,
    },
  });

  if (!assessmentFormat) {
    return { error: { message: 'Assessment format not found' } };
  }

  if (
    assessmentFormat.childAssessmentFormats.length === 0 &&
    assessmentFormat.parentAssessmentFormat === null
  ) {
    const deletedParent = await db.assessmentFormat.delete({
      where: {
        id: assessmentFormatId,
      },
    });
    return deletedParent;
  } else if (
    assessmentFormat.childAssessmentFormats.length === 0 &&
    assessmentFormat.parentAssessmentFormat !== null
  ) {
    const deletedChild = await db.assessmentFormat.delete({
      where: {
        id: assessmentFormatId,
      },
    });
    return deletedChild;
  } else {
    return {
      error: {
        message: 'Cannot delete the record due to existing relationships',
      },
    };
  }
}

export async function getAssessmentFormatsWithFilter(
  page: number,
  limit: number,
  filter: AssessmentFormatFilter
) {
  const { isActive, hasMarkEntry } = filter;
  const { branchId } = await getServerSession(authOptions);

  const whereClause = {
    branchId,
    isDeleted: false,
  };

  if (isActive) {
    whereClause['isActive'] = isActive;
  }
  if (hasMarkEntry) {
    whereClause['hasMarkEntry'] = hasMarkEntry;
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
