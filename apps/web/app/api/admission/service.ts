import { db } from '../../../lib/db';
import { AddAdmissionModel } from './models';

export async function addAdmission(admission: AddAdmissionModel) {
  return await db.admissionForm.create({
    data: {
      ...admission,
      firstName: admission.firstName,
      middleName: admission.middleName,
      lastName: admission.lastName,
      emailId: admission.emailId,
      contactNumber: admission.contactNumber,
      dob: admission.dob,
      gender: admission.gender,
      fatherName: admission.fatherName,
      fatherOccupation: admission.fatherOccupation,
      motherName: admission.motherName,
      motherOccupation: admission.motherOccupation,
      guardianName: admission.guardianName,
      addressLine1: admission.addressLine1,
      addressLine2: admission.addressLine2,
      nationality: admission.nationality,
      state: admission.state,
      district: admission.district,
      postalCode: admission.postalCode,
      religion: admission.religion,
      community: admission.community,
      caste: admission.caste,
    },
  });
}

