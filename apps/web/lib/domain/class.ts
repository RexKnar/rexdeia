import { SectionModel } from './section';

export type ClassModel = {
  id: string;
  name: string;
  isActive: boolean;
  description?: string;
  department: string;
  batchId: string;
  branchId: string;
  regulationId: string;
  Section: CreateSectionModel[];
};

export type CreateSectionModel = Pick<
  SectionModel,
  'name' | 'medium' | 'department'
>;
export type CreateClassModel = Pick<
  ClassModel,
  'name' | 'isActive' | 'branchId' | 'Section'
>;

export type UpdateClassModel = Pick<
  ClassModel,
  'id' | 'name' | 'isActive' | 'branchId'
>;
