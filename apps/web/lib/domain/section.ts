import { GroupModel } from './group';
import { MediumModel } from './medium';
import { CreateSubjectModel, SubjectModel } from './subject';

export type SectionModel = {
  id: string;
  name: string;
  isActive: boolean;
  description?: string;
  medium: GetMediumModel;
  mediumId: string;
  classId: string;
  faculty: string;
  group: GroupModel[];
  groupIds: string[];
  subjects: SubjectModel[];
  staffs: string[];
  students: string[];
};

export type GetMediumModel = Pick;

export type CreateSectionModel = Pick;

export type UpdateSectionModel = Pick;

export type AddSubjectsToSectionRequestModel =
  | {
      subjectIds: string[];
    }
  | {
      subjects: CreateSubjectModel[];
    };

export type MapEntitiesToSectionModel = {
  entities: {
    subjectId?: string;
    staffId?: string;
    academicYearId: string;
  }[];
};
