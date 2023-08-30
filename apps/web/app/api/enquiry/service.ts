import { db } from '../../../lib/db';
import { AddEnquiryModel } from './models';

export async function addEnquiry(enquiry: AddEnquiryModel) {
  return await db.EnquiryForm.create({
    data: {
      ...enquiry,
      name: enquiry.name,
      emailId: enquiry.emailId,
      contactNumber: enquiry.contactNumber,
      dob: enquiry.dob,
      gender: enquiry.gender,
      age: enquiry.age,
      maritalStatus: enquiry.maritalStatus,
      fatherName: enquiry.fatherName,
      fatherOccupation: enquiry.fatherOccupation,
      motherName: enquiry.motherName,
      motherOccupation: enquiry.motherOccupation,
      guardianName: enquiry.guardianName,
      guardianOccupation: enquiry.guardianOccupation,
      addressLine1: enquiry.addressLine1,
      addressLine2: enquiry.addressLine2,
      nationality: enquiry.nationality,
      state: enquiry.state,
      district: enquiry.district,
      postalCode: enquiry.postalCode,
      schoolName10th: enquiry.schoolName10th,
      obtainedMark10th: enquiry.obtainedMark10th,
      yearOfPassing10th: enquiry.yearOfPassing10th,
      mediumOfEducation10th: enquiry.mediumOfEducation10th,
      schoolName12th: enquiry.schoolName12th,
      obtainedMark12th: enquiry.obtainedMark12th,
      yearOfPassing12th: enquiry.yearOfPassing12th,
      mediumOfEducation12th: enquiry.mediumOfEducation12th,
    },
  });
}
