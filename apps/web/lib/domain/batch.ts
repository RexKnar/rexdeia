export type BatchModel = {
  id: string;
  name: string;
  isActive: boolean;
  description?: string;
  startYear: string;
  endYear: string;
  classes: string[];
  students: string[];
};

export type CreateBatchModel = Pick<
  BatchModel,
  | 'name'
  | 'isActive'
  | 'description'
  | 'startYear'
  | 'endYear'
  | 'classes'
  | 'students'
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
