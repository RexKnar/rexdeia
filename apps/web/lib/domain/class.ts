import { SectionModel } from './section';

export type ClassModel = {
  id: string;
  name: string;
  isActive: boolean;
  description?: string;
  batchId: string;
  branchId: string;
  regulationId: string;
  Section: CreateSectionModel[];
};

export type CreateSectionModel = Pick<SectionModel, 'name' | 'mediumId'>;
export type CreateClassModel = Pick<
  ClassModel,
  'name' | 'isActive' | 'branchId'
> & {
  section: CreateSectionModel[];
};

export type UpdateClassModel = Pick<
  ClassModel,
  'id' | 'name' | 'isActive' | 'branchId'
>;
