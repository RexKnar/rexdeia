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

export type AddSubjectsToClassRequestModel =
  | {
      subjectIds: string[];
    }
  | {
      subjects: CreateSubjectModel[];
    };

export type MapEntitiesToClassModel = {
  sectionIds: string[];
  entities: {
    subjectId?: string;
    staffId?: string;
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
