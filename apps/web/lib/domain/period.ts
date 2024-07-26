import { ClassModel } from './class';
import { PeriodMasterModel } from './periodMaster';
import { SectionModel } from './section';
import { Staff } from './staff';
import { SubjectModel } from './subject';

export type PeriodModel = {
  id: string;
  name: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
  section: SectionModel[];
  periodMaster: PeriodMasterModel[];
  subject: SubjectModel[];
  class: ClassModel[];
  staff: Staff[];
};
