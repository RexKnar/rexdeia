export type ClassModel = {
  id: string;
  name: string;
  isActive: boolean;
  description?: string;
  batchId: string;
  branchId: string;
  regulationId: string;
};

export type CreateClassModel = Pick<
  ClassModel,
  'name' | 'isActive' | 'branchId'
>;

export type UpdateClassModel = Pick<
  ClassModel,
  'name' | 'isActive' | 'batchId' | 'branchId' | 'regulationId'
>;
