import { SectionModel } from './section';
import { Student } from './student';
import { CreateSubjectModel } from './subject';

export type ClassModel = {
  students: Student[];
  id: string;
  name: string;
  isActive: boolean;
  description?: string;
  batchId: string;
  branchId: string;
  regulationId: string;
  classLevelId?: string;
  gradeId?: string;
  Section: CreateSectionModel[];
};

export type CreateSectionModel = Pick<
  SectionModel,
  'name' | 'mediumId' | 'groupIds'
>;
export type CreateClassModel = Pick<
  ClassModel,
  'name' | 'isActive' | 'branchId' | 'classLevelId' | 'gradeId'
> & {
  section: CreateSectionModel[];
};

export type UpdateClassModel = Pick<
  ClassModel,
  'id' | 'name' | 'isActive' | 'branchId' | 'classLevelId' | 'gradeId'
>;

export type AddSubjectsToClassRequestModel =
  | {
      subjectIds: string[];
    }
  | {
      subjects: CreateSubjectModel[];
    };

export type MapEntitiesToClassModel = {
  sectionIds: string[];
  classInCharge: string[];
  entities: {
    subjectId?: string;
    staffId?: string;
    academicYearId: string;
  }[];
};

export type LinkStaffToSectionModel = {
  staffId: string;
  sections: string[];
  subjectIds: string[];
};
export type LinkStaffModel = {
  data: LinkStaffToSectionModel[];
};

export type AssignStaffToClassRequestModel = {
  staffId: string;
  subjectId: string;
  academicYearId: string;
  sectionIds: string[];
  sectionInCharge: string[];
};

export type MapStaffToClassModelEntity = {
  data: AssignStaffToClassRequestModel[];
};
