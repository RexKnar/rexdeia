export type Staff = {
  id: string;
  image?: string;
  lastName: string;
  firstName: string;
  dateOfBirth: Date;
  middleName?: string;
  aadharCardNumber?: string;
  gender: string;
  type: 'Teaching' | 'NonTeaching' | 'Principal' | 'Correspondent';
  status: 'Active' | 'InActive' | 'Resigned' | 'Suspended' | 'Fired';
  annualIncome: string;
  bloodGroup?: string;
  dateOfJoining: Date;
  email: string;
  mobile: string;
  religion?: string;
  caste?: string;
  nationality?: string;
  motherTongue?: string;
  enrollmentNumber?: string;
  specialCategory?: string;
  differentlyAbled: boolean;
  epfNumber?: string;
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
};

export type AddStaffModel = Omit<Staff, 'id' | 'status'>;

export type UpdateStaffModel = Omit<
  Staff,
  'aadharCardNumber' | 'dob' | 'email' | 'name'
>;
