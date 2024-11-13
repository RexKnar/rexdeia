import { PeriodMasterModel } from './periodMaster';

export type DaysModel = {
  id: string;
  name: string;
  isActive: boolean;
  periodMaster: PeriodMasterModel[];
  createdAt: string;
  updatedAt: string;
  isDeleted: string;
};

export type CreateDaysModel = Pick;
export type UpdateDaysModel = Pick;
