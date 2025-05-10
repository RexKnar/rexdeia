import { InstituteCourseChapterModel } from './chapter';

export type InstituteCourseModuleModel = {
  id: string;
  name: string;
  icon?: string;
  description?: string;
  isActive?: boolean;
  instituteCourseId?: string;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
  createdById?: string;
  branchId?: string;
  expanded?: boolean;
  chapters?: InstituteCourseChapterModel[];
};

export type CreateCourseModuleRequestModel = Pick<
  InstituteCourseModuleModel,
  | 'name'
  | 'icon'
  | 'description'
  | 'isActive'
  | 'instituteCourseId'
  | 'branchId'
>;

export type UpdateCourseModuleRequestModel = Pick<
  InstituteCourseModuleModel,
  'id' | 'name' | 'icon' | 'description' | 'isActive'
>;
