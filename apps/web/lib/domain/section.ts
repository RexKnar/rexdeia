import { MediumModel } from './medium';
import { CreateSubjectModel } from './subject';

export type SectionModel = {
  id: string;
  name: string;
  isActive: boolean;
  description?: string;
  medium: GetMediumModel;
  mediumId: string;
  classId: string;
  faculty: string;
  groupIds: string[];
  subjects: string[];
  staffs: string[];
  students: string[];
};

export type GetMediumModel = Pick<MediumModel, 'name' | 'isActive' | 'id'>;

export type CreateSectionModel = Pick<
  SectionModel,
  'name' | 'isActive' | 'mediumId' | 'classId' | 'groupIds'
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
