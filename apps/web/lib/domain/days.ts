export type DaysModel = {
  id: string;
  name: string;
  isActive: boolean;
  isDeleted: boolean;
  periodMasterId: string;
};

export type CreateDaysModel = Pick<
  DaysModel,
  'name' | 'isActive' | 'periodMasterId'
>;
export type UpdateDaysModel = Pick<
  DaysModel,
  'id' | 'name' | 'isActive' | 'periodMasterId'
>;
