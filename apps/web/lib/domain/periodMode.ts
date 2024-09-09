import { PeriodMasterModel } from './periodMaster';

export type PeriodModeModel = {
  id: string;
  name: string;
  duration: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
  periodMaster: PeriodMasterModel[];
};

export type CreatePeriodModeModel = Pick<
  PeriodModeModel,
  'name' | 'isActive' | 'duration'
>;
export type UpdatePeriodModeModel = Pick<
  PeriodModeModel,
  'id' | 'name' | 'isActive' | 'duration'
>;
