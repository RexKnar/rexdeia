import { CreateShare, UpdateShare } from './models';
import { db } from '../../../../lib/db';

export async function createShare(createShare: CreateShare) {
  return await db.share.create({
    data: {
      ...createShare,
    },
  });
}

export async function updateShareById(id: string, updateShare: UpdateShare) {
  return await db.share.update({
    data: {
      isActive: updateShare.isActive,
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
  const share = await db.share.findUnique({
    where: {
      id: shareId,
    },
  });
  return share;
}

export async function getShareByFormId(formId: string) {
  return await db.share.findMany({
    where: {
      formId: formId,
    },
  });
}
