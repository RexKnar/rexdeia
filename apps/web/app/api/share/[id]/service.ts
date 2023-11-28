import { db } from '../../../../lib/db';
import { CreateShare, UpdateShare } from './models';

export async function createShare(createShare: CreateShare) {
  return await db.share.create({
    data: {
      ...createShare,
      activeToDate: new Date(createShare.activeToDate),
      activeFromDate: new Date(createShare.activeFromDate),
    },
  });
}

export async function updateShareById(id: string, updateShare: UpdateShare) {
  return await db.share.update({
    data: {
      isActive: true,
      acceptPayment: updateShare.acceptPayment,
      actualAmount: updateShare.actualAmount,
      discountAmount: updateShare.discountAmount,
      activeFromDate: updateShare.activeFromDate,
      activeToDate: updateShare.activeToDate,
    },
    where: {
      id: id,
    },
  });
}
export async function getShareById(shareId: string) {
  return await db.share.findUnique({
    where: {
      id: shareId,
    },
  });
}

export async function getShareByFormId(formId: string) {
  return await db.share.findMany({
    where: {
      formId: formId,
    },
  });
}
