export type PeriodTypeModel = {
  id: string;
  name: string;
  periodMode: string;
  periodDuration: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
  periodMasterId: string;
};

export type CreatePeriodTypeModel = Pick<
  PeriodTypeModel,
  'name' | 'periodMode' | 'periodDuration' | 'periodMasterId' | 'isActive'
>;
export type UpdatePeriodTypeModel = Pick<
  PeriodTypeModel,
  | 'id'
  | 'name'
  | 'periodMode'
  | 'periodDuration'
  | 'periodMasterId'
  | 'isActive'
>;
