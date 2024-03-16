export type ExamConfigurationModel = {
  name: string;
  assessmentFormatConfiguration: assessmentFormatConfiguration[];
  sectionId: string;
  classId: string;
  subjectId: string;
  subjectTypeId: string;
  academicYearId: string;
  examTypeId: string;
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
  | 'name'
  | 'subjectId'
  | 'subjectTypeId'
  | 'classId'
  | 'sectionId'
  | 'academicYearId'
  | 'examTypeId'
  | 'assessmentFormatConfiguration'
>;

export type ExamTypeModel = {
  id: string;
  name: string;
  isActive: string;
  termId: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateExamModel = Pick<
  ExamTypeModel,
  'name' | 'termId' | 'isActive'
>;
