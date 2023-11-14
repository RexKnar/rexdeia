import { z } from 'zod';
import { CreateShare, UpdateShare } from './models';
import { getShareByFormId, getShareById } from './service';
import { getFormById } from '../../forms/service';

const createSchema = z.object({
  isActive: z.boolean().nullable().optional(),
  activeFromDate: z.string().nullable().optional(),
  activeToDate: z.string().nullable().optional(),
  acceptPayment: z.boolean().nullable().optional(),
  actualAmount: z.number().nullable().optional(),
  discountAmount: z.number().nullable().optional(),
  formId: z.string(),
});

const updateSchema = z.object({
  isActive: z.boolean().nullable().optional(),
  activeFromDate: z.string().nullable().optional(),
  activeToDate: z.string().nullable().optional(),
  acceptPayment: z.boolean().nullable().optional(),
  actualAmount: z.number().nullable().optional(),
  discountAmount: z.number().nullable().optional(),
});

export async function validateCreateShare(createShare: CreateShare) {
  try {
    if (createShare.acceptPayment && createShare.actualAmount == null) {
      throw new Error('ACTUAL_AMOUNT_REQUIRED');
    }
    const form = await getFormById(createShare.formId);
    if (!form) {
      throw new Error('FORM_NOT_FOUND');
    }
    const share = await getShareByFormId(createShare.formId);
    if (share && share.length > 0) {
      throw new Error('SHARE_ALREADY_EXISTS');
    }

    createSchema.parse(createShare);
  } catch (e) {
    throw new Error(e.message);
  }
  return createSchema.parse(createShare);
}

export async function validateUpdateShare(
  shareId: string,
  updateShare: UpdateShare
) {
  try {
    const share = await getShareById(shareId);
    if (!share) {
      throw new Error('SHARE_NOT_FOUND');
    }
    updateSchema.parse(updateShare);
  } catch (e) {
    throw new Error(e.message);
  }
  return updateSchema.parse(updateShare);
}
