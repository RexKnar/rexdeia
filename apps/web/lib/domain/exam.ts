import { BatchModel } from './batch';
import { AssessmentFormatModel } from './subject';

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
  markEntryOpenDate?: Date;
  markEntryEndDate?: Date;
  markEntryCorrectionDate?: Date;
  blockMarkEntry?: Boolean;
};

export type CreateExamModel = Omit<
  ExamModel,
  'examType' | 'batch' | 'term' | 'id'
>;

export type UpdateExamModel = Omit<ExamModel, 'examType' | 'batch' | 'term'>;

export type ExamConfigurationModel = {
  assessmentFormatConfiguration: assessmentFormatConfiguration[];
  examId: string;
  sectionId: string;
  classId: string;
  subjectId: string;
  subjectTypeId: string;
};

export type assessmentFormatConfiguration = {
  id?: string;
  assessmentFormatId: string;
  minPassMark: number;
  markToConvert: number;
  dateToConduct: string;
  markToConduct: number;
  academicExamId: string;
  assessmentFormat?: AssessmentFormatModel;
};

export type CreateExamConfigurationModel = Pick<
  ExamConfigurationModel,
  | 'subjectId'
  | 'subjectTypeId'
  | 'classId'
  | 'sectionId'
  | 'assessmentFormatConfiguration'
>;

/*---------------------------------- Start of New Exam --------------------------------------- **/

// New Exam
export type ExamConfigModel = {
  examId: string;
  sectionIds: string[];
  classId: string;
  subjects: string[];
  config: ExamSubjectPartitionModel[];
};

// New-Exam
export type CreateExamConfigModel = Pick<
  ExamConfigModel,
  'subjects' | 'classId' | 'sectionIds'
>;

export type ExamSubjectPartitionModel = {
  assessmentFormatId: string;
  minMark: number;
  convertTo: number;
  dateToConduct: string;
  totalMarks: number;
  excludeSubjectValidation?: boolean;
  academicExamId: string;
  assessmentFormat?: AssessmentFormatModel;
  order: number;
};

/*---------------------------------- End of New Exam --------------------------------------- **/
export type ExamTypeModel = {
  id: string;
  name: string;
  isActive: boolean;
  frequencyId: string;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
};

export type CreateExamTypeModel = Pick<
  ExamTypeModel,
  'name' | 'isActive' | 'frequencyId'
>;
export type UpdateExamTypeModel = Pick<
  ExamTypeModel,
  'name' | 'isActive' | 'id' | 'frequencyId'
>;
export type DeletExamTypeModel = Pick<ExamTypeModel, 'id' | 'isDeleted'>;
export type TermModel = {
  id: string;
  name: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
};

export type CreateTermModel = Pick<TermModel, 'name' | 'isActive'>;

export type UpdateTermModel = Pick<TermModel, 'id' | 'name' | 'isActive'>;

export type DeleteTermModel = Pick<TermModel, 'id' | 'isDeleted'>;
