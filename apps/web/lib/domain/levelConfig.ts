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

export type CreateLevelConfigModel = Pick;
export type UpdateLevelConfigModel = Pick;
