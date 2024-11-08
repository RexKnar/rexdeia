import { Language } from '@prisma/client';

import { CommunityModel } from './community';
import { SectionModel } from './section';
import { StaffCategoryModel } from './staffCategory';
import { SubjectModel } from './subject';

export type Staff = {
  id: string;
  image?: string;
  lastName: string;
  firstName: string;
  dateOfBirth: Date;
  age: string;
  middleName?: string;
  aadharCardNumber?: string;
  gender: string;
  status: 'Active' | 'InActive' | 'Resigned' | 'Suspended' | 'Fired';
  academicYear?: AcademicYear;
  annualIncome: string;
  bloodGroup?: string;
  enrollmentId?: number;
  dateOfJoining: Date;
  dateOfDetainment: Date;
  dateOfRegularization: Date;
  dateOfRetirement: Date;
  employmentType: string;
  employmentTypeId: string;
  employeeId: string;
  staffCategory?: StaffCategoryModel;
  staffCategoryId?: string;
  natureOfPosting?: string | null;
  natureOfPostingId: string;
  subjectHandling: string;
  collegeName: string;
  passOutYear: Date;
  marksObtained: string;
  designation: string;
  designationId: string;
  email: string;
  mobile: string;
  religion?: string;
  caste?: string;
  nationality?: string;
  motherTongueId?: string | null;
  motherTongue?: Language | null;
  communityId?: string | null;
  community?: CommunityModel;
  enrollmentNumber?: string;
  specialCategory?: string;
  differentlyAbled: boolean;
  epfNumber?: string;
  cps: string;
  tpf: string;
  accountHolderName: string;
  accountNumber: string;
  branchName: string;
  IFSC_Code: string;
  fatherName?: string;
  fatherOccupation?: string;
  motherName?: string;
  motherOccupation?: string;
  spouseName?: string;
  spouseOccupation?: string;
  currentAddressLine1?: string;
  currentAddressLine2?: string;
  currentCity?: string;
  currentState?: string;
  currentCountry?: string;
  currentPincode?: string;
  permanentAddress1?: string;
  permanentAddress2?: string;
  permanentCity?: string;
  permanentState?: string;
  permanentPincode?: string;
  permanentCountry?: string;
  birthCertificate?: string;
  communityCertificate?: string;
  childImmunicationCertificate?: string;
  medicalCertificate?: string;
  covidVaccinationCertificate?: string;
  characterCertificate?: string;
  fathersPhoto?: string;
  mothersPhoto?: string;
  spousePhoto?: string;
  incomeCertificate?: string;
  transferCertificate?: string;
  sslcMarksCard?: string;
  pucMarksCard?: string;
  degreeMarksCard?: string;
  pgMarksCard?: string;
  otherCertificate?: string;
  isDeleting?: boolean;
  isUpdating?: boolean;
  isNewlyAdded?: boolean;
  additionalAttributes: any;
  subjects?: SubjectModel[];
  sections?: SectionModel[];
  sectionIncharge?: SectionModel[];
};

export type AddStaffModel = Omit<
  Staff,
  | 'id'
  | 'motherTongue'
  | 'community'
  | 'natureOfPosting'
  | 'employmentType'
  | 'staffCategory'
  | 'designation'
  | 'status'
  | 'subjects'
  | 'sections'
>;
export type UpdateStaffModel = Omit<
  Staff,
  | 'motherTongue'
  | 'community'
  | 'natureOfPosting'
  | 'employmentType'
  | 'staffCategory'
  | 'designation'
  | 'status'
  | 'subjects'
  | 'sections'
  | 'enrollmentNumber'
  | 'enrollmentId'
>;

export type StaffSubjectList = {
  sectionId: string;
  sectionName: string;
  subjects: Section[];
};

export type Section = {
  id: string;
  name: string;
};

type AcademicYear = {
  id: string;
  name: string;
};
export type SubjectHandledByStaff = {
  id: string;
  name: string;
  sections?: SectionModel[];
};

export type UnassignStaffModel = {
  sections: sections[];
};

type sections = {
  section: string;
  subjects: string[];
};
