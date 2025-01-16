export interface Analytics {
  highestTotalMark: number;
  lowestTotalMark: number;
  highestByGender: EstByGender;
  lowestByGender: EstByGender;
  highestStudent: HighestStudent;
  lowestStudent: HighestStudent;
  highestStudentByGender: EstStudentByGender;
  lowestStudentByGender: EstStudentByGender;
  totalPassCount: number;
  malePassCount: number;
  femalePassCount: number;
  totalFailCount: number;
  maleFailCount: number;
  femaleFailCount: number;
  totalAbsentCount: number;
  maleAbsentCount: number;
  femaleAbsentCount: number;
  malePassPercentage: string;
  femalePassPercentage: string;
  totalPassPercentage: string;
  totalFailPercentage: string;
}

export interface EstByGender {
  male: number;
}

export interface HighestStudent {
  firstName: string;
  middleName: string;
  lastName: string;
  gender: string;
  id: string;
  subjects: Subject[];
}

export interface Subject {
  id: string;
  description: null;
  name: string;
  isActive: boolean;
  elective: number;
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
  regulationId: string;
  sectionId: any[];
  branchId: string;
  subjectMasterId: string;
  classId: string;
  marks: Mark[];
  subjectTotalMark: number;
  absentStatus: boolean;
  absentOn: any[];
  failingStatus: boolean;
  failingOn: string[];
}

export interface Mark {
  id: string;
  mark: number;
  attandance: number;
  studentId: string;
  staffId: string;
  examSubjectId: string;
  examSubjectPartitionId: string;
  excludeSubjectValidation?: boolean;
  subjectId: string;
  assessmentFormatId: string;
}

export interface EstStudentByGender {
  male: HighestStudent;
}
