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

// export type StudentsMarkInExamModel = {
//   studentId: string;
//   attendance: number;
//   marks: MarksWithAssessmentFormatModel[];
// };

export type MarksWithAssessmentFormatModel = {
  studentId: string;
  attendance: number;
  academicExamId: string;
  assessmentFormatId: string;
  mark: number;
};

export type AddMarkEntryModel = {
  staffId: string;
  studentsMarkDetails: MarksWithAssessmentFormatModel[];
};
