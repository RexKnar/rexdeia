import { RangeType } from '@prisma/client';
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
    })),
  });
}

export async function getRangeScales(rangeType: string) {
  const session = await getServerSession(authOptions);
  const where =
    rangeType == 'All'
      ? {
          batchId: session.currentBatch,
        }
      : {
          batchId: session.currentBatch,
          rangeOf: rangeType as RangeType,
        };
  const rangeScales = await db.rangeScales.findMany({ where: where });

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
