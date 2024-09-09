import { ClassModel } from './class';
import { LevelConfigModel } from './levelConfig';
import { PeriodMasterModel } from './periodMaster';

export type ClassLevelModel = {
  id: string;
  name: string;
  isActive: boolean;
  class: ClassModel[];
  periodMaster: PeriodMasterModel[];
  levelConfig: LevelConfigModel[];
  createdAt: string;
  updatedAt: string;
  isDeleted: string;
};

export type CreateClassLevelModel = Pick<ClassLevelModel, 'name' | 'isActive'>;
export type UpdateClassLevelModel = Pick<
  ClassLevelModel,
  'id' | 'name' | 'isActive'
>;
