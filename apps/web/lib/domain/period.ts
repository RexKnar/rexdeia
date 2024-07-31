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

export type CreatePeriodModel = Pick<
  PeriodModel,
  'name' | 'isActive' | 'subjectId'
>;
export type UpdatePeriodModel = Pick<
  PeriodModel,
  'id' | 'name' | 'isActive' | 'subjectId'
>;
