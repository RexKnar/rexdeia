import { SectionModel } from './section';
import { CreateSubjectModel } from './subject';

export type ClassModel = {
  id: string;
  name: string;
  isActive: boolean;
  description?: string;
  batchId: string;
  branchId: string;
  regulationId: string;
  classLevelId?: string;
  Section: CreateSectionModel[];
};

export type CreateSectionModel = Pick;
export type CreateClassModel = Pick & {
  section: CreateSectionModel[];
};

export type UpdateClassModel = Pick;

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
