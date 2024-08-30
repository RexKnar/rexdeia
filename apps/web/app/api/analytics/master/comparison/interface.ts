export interface Analytics {
  numberOfPassStudents: { male: number; female: number; overall: number };
  numberOfFailStudents: { male: number; female: number; overall: number };
  highestMark: { male: number; female: number; overall: number };
  highestMarkStudentName: { male: string; female: string; overall: string };
  lowestMark: { male: number; female: number; overall: number };
  lowestMarkStudentName: { male: string; female: string; overall: string };
  averageMark: { male: number; female: number; overall: number };
  passPercentage: { male: number; female: number; overall: number };
  failPercentage: { male: number; female: number; overall: number };
  attendance: { male: number; female: number; overall: number };
  absent: { male: number; female: number; overall: number };
  markEntry: { male: number; female: number; overall: number };
  totalStudents: { male: number; female: number; overall: number };
}
