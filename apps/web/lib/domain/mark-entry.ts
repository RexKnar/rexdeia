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
  academicExamId: string;
  assessmentFormatId: string;
  mark: string;
  attendance?: string;
};

export type AddMarkEntryModel = {
  staffId: string;
  studentsMarkDetails: StudentsMarkInExamModel[];
};

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
