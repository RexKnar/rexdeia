import { DaysModel } from './days';
import { PeriodTypeModel } from './periodsType';

export type PeriodMasterModel = {
  id: string;
  name: string;
  isActive: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
  periodsType: PeriodTypeModel[];
  days: DaysModel[];
  classLevelId: string;
  periodsId: string;
};
