export type ExamSummary = {
  id: string;
  name: string;
  totalStudents: number;
  passCount: number;
  failCount: number;
  absentCount: number;
  passPercentage: number;
};

export type AdminDashboardSummary = {
  totalStudents: number;
  totalStaff: number;
  ongoingExam: ExamSummary | null;
  lastCompletedExam: ExamSummary | null;
};

export type AttendanceCounts = {
  present: number;
  absent: number;
  leave: number;
  notMarked: number;
  total: number;
};

export type AdminAttendanceOverview = {
  students: AttendanceCounts;
  staff: AttendanceCounts;
};

export type BranchExam = {
  id: string;
  name: string;
  status: 'ongoing' | 'completed' | 'upcoming';
};

export type ExamBranchAnalytics = {
  staffWise: any[];
  summary: Omit<ExamSummary, 'id' | 'name'>;
};
