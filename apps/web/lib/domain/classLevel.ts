import { LevelConfigModel } from './levelConfig';
import { PeriodMasterModel } from './periodMaster';

export type ClassLevelModel = {
  id: string;
  name: string;
  isActive: boolean;
  classId: string;
  periodMaster: PeriodMasterModel[];
  levelConfig: LevelConfigModel[];
};

export type CreateClassLevelModel = Pick<
  ClassLevelModel,
  'name' | 'isActive' | 'classId'
>;
export type UpdateClassLevelModel = Pick<
  ClassLevelModel,
  'id' | 'name' | 'isActive' | 'classId'
>;
