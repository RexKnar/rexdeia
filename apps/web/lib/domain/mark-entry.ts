import { AssessmentFormatModel } from './subject';

export type MarkEntryModel = {
  id: string;
  classId: string;
  sectionId: string;
  studentId: string;
  staffId: string;
  academicYearId: string;
  subjectId: string;
  assessmentFormatId: string;
  subjectTypeId: string;
};

export type StudentsMarkInExamModel = {
  studentId: string;
  subjects: Marks[];
};
export type Marks = {
  subjectId: string;
  marks: MarksWithAssessmentFormatModel[];
};
export type MarksWithAssessmentFormatModel = {
  id: string;
  academicExamId: string;
  assessmentFormatId: string;
  mark: string;
  attendance?: string;
};

export type AddMarkEntryModel = {
  staffId: string;
  studentsMarkDetails: StudentsMarkInExamModel[];
};
//New
export type EnterMarkEntryModel = {
  userId: string;
  studentsMarkDetails: ExamStudentModel[];
};

export type ExamStudentModel = {
  studentId: string;
  subjects: ExamSubjectModel[];
};
export type ExamSubjectModel = {
  subjectId: string;
  examSubjectId: string;
  marks: ExamMarkModel[];
};

export type ExamMarkModel = {
  id?: string;
  examSubjectId: string;
  assessmentFormatId: string;
  attendance?: string;
  examPartitionId: string;
  isUpdate: boolean;
  mark: string;
};

//end of the new mark entry model

export type MarkEntryFromStructureModel = {
  id: string;
  name: string;
  subjects: SubjectForMarkEntry[];
};
export type SubjectForMarkEntry = {
  id: string;
  name: string;
  assessmentFormat: AssessmentFormatModel[];
};
