import { RangeType } from '@prisma/client';
import { getClassById } from 'app/api/class/service';
import { authOptions } from 'lib/auth';
import { db } from 'lib/db';
import { CreateRangeScale } from 'lib/domain/analytics/rangeAnalytics';
import { getServerSession } from 'next-auth';

export async function addRangeFilter(createRangePayload: {
  data: CreateRangeScale[];
}) {
  const { data: rangeList } = createRangePayload;
  const session = await getServerSession(authOptions);
  if (!session) throw new Error('Unauthorized');

  let batchId = session.currentBatch;
  if (!batchId && session.branchId) {
    const activeBatch = await db.batch.findFirst({
      where: {
        branchId: session.branchId,
        currentAcademicYear: true,
        isDeleted: false,
      },
    });
    batchId = activeBatch?.id;
  }

  if (!batchId) {
    throw new Error('No active academic year found for current session');
  }

  return db.rangeScales.createMany({
    data: rangeList.map((payload) => ({
      startValue: payload.startValue,
      endValue: payload.endValue,
      order: payload.order,
      batchId,
      rangeOf: payload.rangeOf,
      classLevelId:
        payload.classLevelId &&
        payload.classLevelId !== 'all' &&
        payload.classLevelId !== 'common'
          ? payload.classLevelId
          : null,
    })),
  });
}

export async function getRangeScales(
  rangeType: string,
  classId?: string,
  academicYearId?: string,
  classLevelId?: string
) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error('Unauthorized');

  let targetBatchId =
    academicYearId &&
    academicYearId.trim() !== '' &&
    academicYearId !== 'All' &&
    academicYearId !== 'all' &&
    academicYearId !== 'null'
      ? academicYearId
      : session.currentBatch && session.currentBatch.trim() !== ''
        ? session.currentBatch
        : undefined;

  if (!targetBatchId && session.branchId) {
    const activeBatch = await db.batch.findFirst({
      where: {
        branchId: session.branchId,
        currentAcademicYear: true,
        isDeleted: false,
      },
    });
    if (activeBatch) {
      targetBatchId = activeBatch.id;
    }
  }

  const where: any = {};

  if (targetBatchId && targetBatchId.trim() !== '') {
    where.batchId = targetBatchId;
  }

  if (rangeType && rangeType !== 'All') {
    where.rangeOf = rangeType as RangeType;
  }

  if (classId) {
    const classDetail = await getClassById(classId);
    if (classDetail?.classLevelId) {
      const specificCount = await db.rangeScales.count({
        where: {
          ...(where.batchId ? { batchId: where.batchId } : {}),
          classLevelId: classDetail.classLevelId,
          ...(rangeType && rangeType !== 'All'
            ? { rangeOf: rangeType as RangeType }
            : {}),
        },
      });

      if (specificCount > 0) {
        where.classLevelId = classDetail.classLevelId;
      } else {
        where.classLevelId = null;
      }
    } else {
      where.classLevelId = null;
    }
  } else if (classLevelId) {
    if (classLevelId === 'common' || classLevelId === 'null') {
      where.classLevelId = null;
    } else if (
      classLevelId !== 'All' &&
      classLevelId !== 'all' &&
      classLevelId.trim() !== ''
    ) {
      where.classLevelId = classLevelId;
    }
  }

  const rangeScales = await db.rangeScales.findMany({
    where,
    include: {
      classLevel: true,
    },
    orderBy: [{ order: 'asc' }],
  });

  return rangeScales;
}

export async function getRangeScalesById(id: string) {
  const session = await getServerSession(authOptions);

  return db.rangeScales.findFirst({
    where: {
      id: id,
      ...(session?.currentBatch ? { batchId: session.currentBatch } : {}),
    },
    include: {
      batch: true,
      classLevel: true,
    },
  });
}

export async function deleteRangeScalesById(id: string) {
  return db.rangeScales.delete({
    where: {
      id: id,
    },
  });
}
