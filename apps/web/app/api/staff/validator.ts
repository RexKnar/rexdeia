import { z } from 'zod';
import { AddStaffModel, UpdateStaffModel } from '../../../lib/domain/staff';

const schema = z.object({
  name: z.string(),
  email: z.string().email(),
  phoneNumber: z.string(),
});

const updateSchema = z.object({
  status: z.string().nullable().optional(),
  type: z.string().nullable().optional(),
  address: z.string().nullable().optional(),
  annualIncome: z.string().nullable().optional(),
});

export async function validateAddStaff(staff: AddStaffModel) {
  try {
    schema.parse(staff);
  } catch (e) {
    return Promise.reject(e);
  }
}

export async function validateUpdateStaff(staff: UpdateStaffModel) {
  try {
    updateSchema.parse(staff);
  } catch (e) {
    return Promise.reject(e);
  }
}
