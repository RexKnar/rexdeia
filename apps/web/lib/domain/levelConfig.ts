export type LevelConfigModel = {
  id: string;
  name: string;
  isActive: boolean;
  noOfSubjects: string;
  noOfPeriods: string;
  startTime: string;
  endTime: string;
  createdAt: string;
  updatedAt: string;
  isDeleted: string;
  classLevelId: string;
};

export type CreateLevelConfigModel = Pick<
  LevelConfigModel,
  | 'name'
  | 'isActive'
  | 'classLevelId'
  | 'noOfSubjects'
  | 'noOfPeriods'
  | 'startTime'
  | 'endTime'
>;
export type UpdateLevelConfigModel = Pick<
  LevelConfigModel,
  | 'id'
  | 'name'
  | 'isActive'
  | 'classLevelId'
  | 'noOfSubjects'
  | 'noOfPeriods'
  | 'startTime'
  | 'endTime'
>;
