export type BatchModel = {
  id: string;
  name: string;
  endYear: string;
  isActive: boolean;
  classes: string[];
  startYear: string;
  students: string[];
  description?: string;
  isDeleting?: boolean;
  isNewlyAdded?: boolean;
};

export type CreateBatchModel = Pick<
  BatchModel,
  'name' | 'isActive' | 'description' | 'startYear' | 'endYear'
>;

export type UpdateBatchModel = Pick<
  BatchModel,
  | 'name'
  | 'isActive'
  | 'description'
  | 'startYear'
  | 'endYear'
  | 'classes'
  | 'students'
>;
