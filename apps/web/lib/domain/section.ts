import { MediumModel } from './medium';

export type SectionModel = {
  id: string;
  name: string;
  isActive: boolean;
  description?: string;
  medium: GetMediumModel;
  mediumId: string;
  classId: string;
  faculty: string;
  subjects: string[];
  staffs: string[];
  students: string[];
};

export type GetMediumModel = Pick<MediumModel, 'name' | 'isActive'>;

export type CreateSectionModel = Pick<
  SectionModel,
  'name' | 'isActive' | 'mediumId' | 'classId'
>;

export type UpdateSectionModel = Pick<
  SectionModel,
  | 'name'
  | 'isActive'
  | 'mediumId'
  | 'classId'
  | 'faculty'
  | 'subjects'
  | 'staffs'
  | 'students'
  | 'description'
>;
