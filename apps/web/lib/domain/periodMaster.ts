import { DaysModel } from './days';
import { PeriodTypeModel } from './periodsType';

export type PeriodMasterModel = {
  id: string;
  name: string;
  isActive: boolean;
  order: string;
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
  periodsType: PeriodTypeModel[];
  days: DaysModel[];
  classLevelId: string;
  periodId: string;
};
export type CreatePeriodMasterModel = Pick<
  PeriodMasterModel,
  'name' | 'isActive' | 'order' | 'classLevelId' | 'periodId'
>;
export type UpdatePeriodMasterModel = Pick<
  PeriodMasterModel,
  'id' | 'name' | 'isActive' | 'order' | 'classLevelId' | 'periodId'
>;
