import { db } from 'lib/db';

export async function getExamSubjectDetailById(examSubjectId: string) {
  const response = await db.examSubject.findUnique({
    where: {
      id: examSubjectId,
    },

    select: {
      id: true,
      subjectId: true,
      subject: {
        select: {
          id: true,
          name: true,
        },
      },
      convertTo: true,
      minMark: true,
      totalMarks: true,
    },
  });

  return response || {};
}

export async function editExamSubject(payload: any, examSubjectId: string) {
  const { minMark, convertTo, totalMarks } = payload;
  return db.examSubject.update({
    where: {
      id: examSubjectId,
    },

    data: {
      minMark: +minMark,
      convertTo: +convertTo,
      totalMarks: +totalMarks,
    },
  });
}

export async function deleteExamSubjectById(
  examSubjectId: string,
  branchId?: string | null
) {
  return await db.$transaction(async (tx) => {
    const existing = await tx.examSubject.findUnique({
      where: { id: examSubjectId },
      select: {
        id: true,
        examGroup: {
          select: {
            exam: {
              select: {
                branchId: true,
              },
            },
          },
        },
      },
    });

    if (
      !existing ||
      (branchId && existing.examGroup?.exam?.branchId !== branchId)
    ) {
      throw new Error('DATA_NOT_FOUND');
    }

    const markCount = await tx.mark.count({
      where: {
        OR: [{ examSubjectId }, { examSubjectPartition: { examSubjectId } }],
      },
    });

    if (markCount > 0) {
      throw new Error('MARK_ENTRY_EXISTS');
    }

    await tx.examSubjectPartition.deleteMany({
      where: { examSubjectId },
    });

    return await tx.examSubject.delete({
      where: { id: examSubjectId },
    });
  });
}

export type CreateExamSubjectPartitionPayload = {
  assessmentFormatId: string;
  minMark: number | string;
  convertTo: number | string;
  totalMarks: number | string;
  dateToConduct: string;
  excludeSubjectValidation?: boolean;
  order: number | string;
};

function parseFiniteNumber(value: unknown): number {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : Number.NaN;
  }
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (trimmed === '') {
      return Number.NaN;
    }
    const parsed = Number(trimmed);
    return Number.isFinite(parsed) ? parsed : Number.NaN;
  }
  return Number.NaN;
}

export async function createExamSubjectPartition(
  examSubjectId: string,
  payload: CreateExamSubjectPartitionPayload,
  branchId?: string | null
) {
  if (!payload || typeof payload !== 'object') {
    throw new Error('VALIDATION_ERROR');
  }

  const {
    assessmentFormatId,
    minMark,
    convertTo,
    totalMarks,
    dateToConduct,
    excludeSubjectValidation = false,
    order,
  } = payload;

  if (
    typeof assessmentFormatId !== 'string' ||
    !assessmentFormatId.trim() ||
    typeof dateToConduct !== 'string' ||
    !dateToConduct.trim()
  ) {
    throw new Error('VALIDATION_ERROR');
  }

  const normalizedAssessmentFormatId = assessmentFormatId.trim();
  const parsedMinMark = parseFiniteNumber(minMark);
  const parsedConvertTo = parseFiniteNumber(convertTo);
  const parsedTotalMarks = parseFiniteNumber(totalMarks);
  const parsedOrder = parseFiniteNumber(order);
  const parsedDate = new Date(dateToConduct.trim());

  if (
    Number.isNaN(parsedMinMark) ||
    Number.isNaN(parsedConvertTo) ||
    Number.isNaN(parsedTotalMarks) ||
    Number.isNaN(parsedOrder) ||
    Number.isNaN(parsedDate.getTime()) ||
    parsedMinMark < 0 ||
    parsedConvertTo < 0 ||
    parsedTotalMarks < 0 ||
    parsedMinMark > parsedTotalMarks ||
    !Number.isInteger(parsedOrder) ||
    parsedOrder < 1
  ) {
    throw new Error('VALIDATION_ERROR');
  }

  return await db.$transaction(async (tx) => {
    const examSubject = await tx.examSubject.findUnique({
      where: { id: examSubjectId },
      select: {
        id: true,
        subjectId: true,
        examGroupId: true,
        examGroup: {
          select: {
            exam: {
              select: {
                branchId: true,
              },
            },
          },
        },
      },
    });

    if (
      !examSubject ||
      (branchId && examSubject.examGroup?.exam?.branchId !== branchId)
    ) {
      throw new Error('DATA_NOT_FOUND');
    }

    const subjectAssessmentFormat =
      await tx.subjectToAssessmentFormat.findFirst({
        where: {
          subjectId: examSubject.subjectId,
          assessmentFormatId: normalizedAssessmentFormatId,
        },
        select: {
          assessmentFormat: {
            select: {
              id: true,
              isDeleted: true,
              isActive: true,
              hasMarkEntry: true,
            },
          },
        },
      });

    const assessmentFormat = subjectAssessmentFormat?.assessmentFormat;

    if (
      !assessmentFormat ||
      assessmentFormat.isDeleted ||
      assessmentFormat.isActive === false ||
      assessmentFormat.hasMarkEntry !== true
    ) {
      throw new Error('ASSESSMENT_FORMAT_NOT_FOUND');
    }

    const existingPartition = await tx.examSubjectPartition.findFirst({
      where: {
        examSubjectId,
        assessmentFormatId: normalizedAssessmentFormatId,
      },
      select: { id: true },
    });

    if (existingPartition) {
      throw new Error('PARTITION_ALREADY_EXISTS');
    }

    return await tx.examSubjectPartition.create({
      data: {
        subjectId: examSubject.subjectId,
        examSubjectId: examSubject.id,
        examGroupId: examSubject.examGroupId,
        assessmentFormatId: normalizedAssessmentFormatId,
        minMark: parsedMinMark,
        convertTo: parsedConvertTo,
        totalMarks: parsedTotalMarks,
        order: parsedOrder,
        dateToConduct: parsedDate,
        excludeSubjectValidation: Boolean(excludeSubjectValidation),
      },
      include: {
        assessmentFormat: true,
      },
    });
  });
}
