export type PeriodModel = {
  id: string;
  name: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
  sectionId: string;
  periodMasterId: string;
  subjectId: string;
  classId: string;
  staffId: string;
  batchId: string;
};

export type CreatePeriodModel = Pick<
  PeriodModel,
  | 'name'
  | 'isActive'
  | 'subjectId'
  | 'periodMasterId'
  | 'sectionId'
  | 'classId'
  | 'staffId'
  | 'batchId'
>;
export type UpdatePeriodModel = Pick<
  PeriodModel,
  | 'id'
  | 'name'
  | 'isActive'
  | 'subjectId'
  | 'periodMasterId'
  | 'sectionId'
  | 'classId'
  | 'staffId'
  | 'batchId'
>;
