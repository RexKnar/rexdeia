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

export type CreatePeriodTypeModel = Pick<PeriodTypeModel, 'name' | 'isActive'>;
export type UpdatePeriodTypeModel = Pick<
  PeriodTypeModel,
  'id' | 'name' | 'isActive'
>;
