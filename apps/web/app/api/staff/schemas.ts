import { z } from 'zod';

import { UpdateStaffModel } from '../../../lib/domain/staff';

export const addStaffSchema = z.object({
  image: z.string().optional(),
  lastName: z.string(),
  firstName: z.string(),
  dateOfBirth: z.coerce.date(),
  middleName: z.string().optional(),
  aadharCardNumber: z.string().optional(),
  gender: z.string(),
  annualIncome: z.string().optional(),
  bloodGroup: z
    .enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'])
    .optional(),
  dateOfJoining: z.coerce.date(),
  dateOfDetainment: z.coerce.date(),
  dateOfRegularization: z.coerce.date(),
  employmentType: z.string().optional(),
  category: z.string().optional(),
  subjectHandling: z.string().optional(),
  collegeName: z.string().optional(),
  passOutYear: z.coerce.date(),
  marksObtained: z.string().optional(),
  designation: z.string().optional(),
  email: z.string().email(),
  mobile: z.string(),
  religion: z.string().optional(),
  caste: z.string().optional(),
  nationality: z.string().optional(),
  motherTongue: z.string().optional(),
  enrollmentNumber: z.string().optional(),
  specialCategory: z.string().optional(),
  differentlyAbled: z.boolean().optional().default(false),
  epfNumber: z.string().optional(),
  fatherName: z.string().optional(),
  fatherOccupation: z.string().optional(),
  motherName: z.string().optional(),
  motherOccupation: z.string().optional(),
  spouseName: z.string().optional(),
  spouseOccupation: z.string().optional(),
  currentAddressLine1: z.string().optional(),
  currentAddressLine2: z.string().optional(),
  currentCity: z.string().optional(),
  currentState: z.string().optional(),
  currentCountry: z.string().optional(),
  currentPincode: z.string().optional(),
  permanentAddress1: z.string().optional(),
  permanentAddress2: z.string().optional(),
  permanentCity: z.string().optional(),
  permanentState: z.string().optional(),
  permanentPincode: z.string().optional(),
  permanentCountry: z.string().optional(),
  birthCertificate: z.string().optional(),
  communityCertificate: z.string().optional(),
  childImmunicationCertificate: z.string().optional(),
  medicalCertificate: z.string().optional(),
  covidVaccinationCertificate: z.string().optional(),
  characterCertificate: z.string().optional(),
  fathersPhoto: z.string().optional(),
  mothersPhoto: z.string().optional(),
  spousePhoto: z.string().optional(),
  incomeCertificate: z.string().optional(),
  transferCertificate: z.string().optional(),
  sslcMarksCard: z.string().optional(),
  pucMarksCard: z.string().optional(),
  degreeMarksCard: z.string().optional(),
  pgMarksCard: z.string().optional(),
  otherCertificate: z.string().optional(),
});

const updateSchema = z.object({
  status: z.string().nullable().optional(),
  type: z.string().nullable().optional(),
  address: z.string().nullable().optional(),
  annualIncome: z.string().nullable().optional(),
});

export async function validateUpdateStaff(staff: UpdateStaffModel) {
  try {
    updateSchema.parse(staff);
  } catch (e) {
    return Promise.reject(e);
  }
}
