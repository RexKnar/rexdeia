import { SectionModel } from './section';

export type ClassModel = {
  id: string;
  name: string;
  isActive: boolean;
  description?: string;
  batchId: string;
  branchId: string;
  regulationId: string;
  section: CreateSectionModel[];
};

export type CreateSectionModel = Pick<SectionModel, 'name' | 'medium'>;
export type CreateClassModel = Pick<
  ClassModel,
  'name' | 'isActive' | 'branchId' | 'section'
>;

export type UpdateClassModel = Pick<
  ClassModel,
  'id' | 'name' | 'isActive' | 'branchId'
>;
