import { CommonGetModel } from './common';
import { Section } from './staff';

export type ExamConfigSubjectModel = {
  subjectName: string;
  id: string;
  subject: CommonGetModel;
  section: Section;
  examSubjectPartition: any;
  convertTo: Number;
  minMark: Number;
  totalMarks: Number;
};

export type UpdateExamConfigSubjectModel = {
  convertTo: Number;
  minMark: Number;
  totalMarks: Number;
};
