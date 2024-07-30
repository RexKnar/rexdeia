export type LevelConfigModel = {
  id: string;
  name: string;
  isActive: boolean;
  classLevelId: string;
  noOfSubjects: string;
  noOfPeriods: string;
  startTime: string;
  endTime: string;
  isDeleted: boolean;
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
