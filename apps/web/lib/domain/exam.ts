import { BatchModel } from './batch';

export type ExamModel = {
  id: string;
  name: string;
  isActive: boolean;
  term: TermModel;
  examType: ExamTypeModel;
  examTypeId: string;
  termId: string;
  batch: BatchModel;
  academicYearId: string;
};

export type CreateExamModel = Pick<
  ExamModel,
  'name' | 'termId' | 'isActive' | 'examTypeId' | 'academicYearId' | 'id' // here id for navigation purpose only
>;

export type ExamConfigurationModel = {
  assessmentFormatConfiguration: assessmentFormatConfiguration[];
  examId: string;
  sectionId: string;
  classId: string;
  subjectId: string;
  subjectTypeId: string;
};

export type assessmentFormatConfiguration = {
  assessmentFormatId: string;
  minPassMark: number;
  markToConvert: number;
  dateToConduct: string;
  markToConduct: number;
};

export type CreateExamConfigurationModel = Pick<
  ExamConfigurationModel,
  | 'subjectId'
  | 'subjectTypeId'
  | 'classId'
  | 'sectionId'
  | 'assessmentFormatConfiguration'
>;

export type ExamTypeModel = {
  id: string;
  name: string;
  isActive: boolean;
  termId: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateExamTypeModel = Pick<
  ExamTypeModel,
  'name' | 'termId' | 'isActive'
>;

export type TermModel = {
  id: string;
  name: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CreateTermModel = Pick<TermModel, 'name' | 'isActive'>;

export type UpdateTermModel = Pick<
  TermModel,
  'id' | 'name' | 'isActive'
>;
