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
  return db.rangeScales.createMany({
    data: rangeList.map((payload) => ({
      startValue: payload.startValue,
      endValue: payload.endValue,
      order: payload.order,
      batchId: session.currentBatch,
      rangeOf: payload.rangeOf,
      classLevelId: payload.classLevelId,
    })),
  });
}

export async function getRangeScales(
  rangeType: string,
  classId?: string,
  academicYearId?: string
) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error('Unauthorized');

  const BatchId = academicYearId ?? session.currentBatch;
  const classDetail = classId ? await getClassById(classId) : null;

  const where: any = {
    batchId: BatchId,
  };

  if (rangeType !== 'All') {
    where.rangeOf = rangeType as RangeType;
  }

  if (classDetail?.classLevelId) {
    where.classLevel = { id: classDetail.classLevelId };
  }

  const rangeScales = await db.rangeScales.findMany({
    where,
    include: {
      classLevel: true,
    },
  });

  return rangeScales;
}

export async function getRangeScalesById(id: string) {
  const session = await getServerSession(authOptions);

  return db.rangeScales.findFirst({
    where: {
      id: id,
      batchId: session.currentBatch,
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
