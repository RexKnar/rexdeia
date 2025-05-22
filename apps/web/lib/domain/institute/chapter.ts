import { InstituteCourseChapterItemModel } from './chapterItem';

export type InstituteCourseChapterModel = {
  id?: string;
  name: string;
  icon?: string;
  description?: string;
  isActive?: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
  createdById: string;
  branchId?: string;
  moduleId?: string;
  expanded?: boolean;
  chapterItems: InstituteCourseChapterItemModel[];
};

export type CreateCourseChapterRequestModel = Pick<
  InstituteCourseChapterModel,
  'name' | 'icon' | 'description' | 'isActive' | 'branchId' | 'moduleId' | 'id'
>;

export type UpdateCourseChapterRequestModel = Pick<
  InstituteCourseChapterModel,
  'name' | 'icon' | 'description' | 'isActive' | 'moduleId' | 'id'
>;
