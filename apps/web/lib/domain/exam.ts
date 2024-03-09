export type ExamConfigurationModel = {
  id: string;
  minMark: number;
  maxMark: number;
  dateToConduct: string;
  markToConduct: number;
};

export type CreateExamConfigurationModel = Pick<
  ExamConfigurationModel,
  'minMark' | 'maxMark' | 'dateToConduct' | 'markToConduct'
> & { subjectId: string; classId: string };

export type ExamModel = {
  id: string;
  name: string;
  termId: string;
  classId: string;
  batchId: string;
  createdAt: string;
  updatedAt: string;
  sectionId: string;
  examTypeId: string;
  configuration: ExamConfigurationModel;
};

export type CreateExamModel = Pick<
  ExamModel,
  | 'name'
  | 'termId'
  | 'batchId'
  | 'classId'
  | 'sectionId'
  | 'examTypeId'
  | 'configuration'
> & { subjectId: string };
