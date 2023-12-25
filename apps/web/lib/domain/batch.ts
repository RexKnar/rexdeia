export type BatchModel = {
  id: string;
  name: string;
  endYear: string;
  isActive: boolean;
  classes: string[];
  startYear: string;
  students?: string[];
  description?: string;
  isDeleting?: boolean;
  isUpdating?: boolean;
  isNewlyAdded?: boolean;
};

export type CreateBatchModel = Pick<
  BatchModel,
  'name' | 'isActive' | 'description' | 'startYear' | 'endYear'
>;

export type UpdateBatchModel = Pick<
  BatchModel,
  | 'id'
  | 'name'
  | 'isActive'
  | 'description'
  | 'startYear'
  | 'endYear'
  | 'students'
>;
