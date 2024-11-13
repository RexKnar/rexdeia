import { PeriodMasterModel } from './periodMaster';

export type PeriodTypeModel = {
  id: string;
  name: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
  periodMaster: PeriodMasterModel[];
};

export type CreatePeriodTypeModel = Pick;
export type UpdatePeriodTypeModel = Pick;
