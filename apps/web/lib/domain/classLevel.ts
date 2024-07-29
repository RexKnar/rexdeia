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
