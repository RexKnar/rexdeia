import { JSX } from 'react';

import { GroupModel } from './group';
import { MediumModel } from './medium';
import { CreateSubjectModel, SubjectModel } from './subject';

export type SectionModel = {
  map(arg0: (section: any) => JSX.Element): import('react').ReactNode;
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
  | 'groupIds'
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
