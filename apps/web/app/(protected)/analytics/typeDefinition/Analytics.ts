import { Student } from 'lib/domain';

export interface Analytics {
  numberOfPassStudents: {
    male: number;
    female: number;
    overall: number;
    studentList: { male: Student[]; female: Student[]; overall: Student[] };
  };
  numberOfFailStudents: {
    male: number;
    female: number;
    overall: number;
    studentList: { male: Student[]; female: Student[]; overall: Student[] };
  };
  totalFailExcludingAbsent: {
    male: number;
    female: number;
    overall: number;
    studentList: { male: Student[]; female: Student[]; overall: Student[] };
  };
  highestMark: {
    male: number;
    female: number;
    overall: number;
    studentList: { male: Student[]; female: Student[]; overall: Student[] };
  };
  highestMarkStudentName: {
    male: string;
    female: string;
    overall: string;
    studentList: { male: Student[]; female: Student[]; overall: Student[] };
  };
  lowestMark: {
    male: number;
    female: number;
    overall: number;
    studentList: { male: Student[]; female: Student[]; overall: Student[] };
  };
  lowestMarkStudentName: {
    male: string;
    female: string;
    overall: string;
    studentList: { male: Student[]; female: Student[]; overall: Student[] };
  };
  averageMark: {
    male: number;
    female: number;
    overall: number;
    studentList: { male: Student[]; female: Student[]; overall: Student[] };
  };
  averageMarkAppeared: {
    male: number;
    female: number;
    overall: number;
    studentList: { male: Student[]; female: Student[]; overall: Student[] };
  };
  passPercentage: {
    male: number;
    female: number;
    overall: number;
    studentList: { male: Student[]; female: Student[]; overall: Student[] };
  };
  failPercentage: {
    male: number;
    female: number;
    overall: number;
    studentList: { male: Student[]; female: Student[]; overall: Student[] };
  };
  passPercentageExcludingAbsent: {
    male: number;
    female: number;
    overall: number;
    studentList: { male: Student[]; female: Student[]; overall: Student[] };
  };
  failPercentageExcludingAbsent: {
    male: number;
    female: number;
    overall: number;
    studentList: { male: Student[]; female: Student[]; overall: Student[] };
  };
  appeared: {
    male: number;
    female: number;
    overall: number;
    studentList: { male: Student[]; female: Student[]; overall: Student[] };
  };
  absent: { male: number; female: number; overall: number; studentList: any };
  overallAbsent: {
    male: number;
    female: number;
    overall: number;
    studentList: any;
  };
  pendingMarkEntry: {
    male: number;
    female: number;
    overall: number;
    studentList: { male: Student[]; female: Student[]; overall: Student[] };
  };
  totalStudents: {
    male: number;
    female: number;
    overall: number;
    studentList: { male: Student[]; female: Student[]; overall: Student[] };
  };
  centum: { male: number; female: number; overall: number; studentList: any };
}
