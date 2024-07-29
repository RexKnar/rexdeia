import { ClassModel } from './class';
import { PeriodMasterModel } from './periodMaster';
import { SectionModel } from './section';
import { Staff } from './staff';

export type PeriodModel = {
  id: string;
  name: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
  section: SectionModel[];
  periodMaster: PeriodMasterModel[];
  subjectId: string;
  class: ClassModel[];
  staff: Staff[];
};
