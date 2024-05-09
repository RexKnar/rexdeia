export type StudentsMarksForAnalytics = {
  studentId: string;
  studentName: string;
  subjects: Subject[];
};

export type Subject = {
  subjectId: string;
  subjectName: string;
  marks: Mark[];
};

export type Mark = {
  mark: number;
  attendance: number;
  assessmentFormat: {
    id: string;
    name: string;
  };
  student: {
    id: string;
    firstName: string;
  };
};
