export type PeriodMasterModel = {
  id: string;
  name: string;
  isActive: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
  periodsTypeId: string;
  daysId: string;
  classLevelId: string;
  periodModeId: string;
  batchId: string;
};
export type CreatePeriodMasterModel = Pick;
export type UpdatePeriodMasterModel = Pick;
