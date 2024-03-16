// export type ExamConfigurationModel = {
//   id: string;
//   minPassMark: number;
//   markToConvert: number;
//   dateToConduct: string;
//   markToConduct: number;
// };

// export type CreateExamConfigurationModel = Pick<
//   ExamConfigurationModel,
//   'minPassMark' | 'markToConvert' | 'dateToConduct' | 'markToConduct'
// > & { subjectId: string; classId: string };

// export type ExamModel = {
//   id: string;
//   name: string;
//   termId: string;
//   classId: string;
//   batchId: string;
//   createdAt: string;
//   updatedAt: string;
//   sectionId: string;
//   examTypeId: string;
//   configuration: ExamConfigurationModel;
// };

// export type CreateExamModel = Pick<
//   ExamModel,
//   | 'name'
//   | 'termId'
//   | 'batchId'
//   | 'classId'
//   | 'sectionId'
//   | 'examTypeId'
//   | 'configuration'
// > & { subjectId: string };

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

export type ExamModel = {
  id: string;
  name: string;
  termId: string;
  batchId: string;
  examTypeId: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateExamModel = Pick<
  ExamModel,
  'name' | 'termId' | 'batchId' | 'examTypeId'
>;
