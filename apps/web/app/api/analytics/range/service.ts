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

export async function getRangeScales(rangeType: string, classId?: string) {
  const session = await getServerSession(authOptions);
  const classDetail = await getClassById(classId);
  let where = {};
  if (rangeType == 'All') {
    where = {
      batchId: session.currentBatch,
    };
  } else {
    where = {
      batchId: session.currentBatch,
      rangeOf: rangeType as RangeType,
    };
  }
  if (classDetail?.classLevelId) {
    where['classLevel'] = { id: classDetail.classLevelId };
  } else {
    where['classLevel'] = null;
  }

  const rangeScales = await db.rangeScales.findMany({
    where: where,
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
