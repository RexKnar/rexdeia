import { db } from '../../../lib/db';
import { AddAdmissionModel } from './models';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../lib/auth';

export async function addAdmission(
  formId: string,
  admission: AddAdmissionModel
) {
  return await db.admissionForm.create({
    data: {
      ...admission,
      aadharCardNumber: admission.aadharCardNumber,
      admissionMode: admission.admissionMode,
      admissionType: admission.admissionType,
      annualIncome: admission.annualIncome,
      bloodGroup: admission.bloodGroup,
      caste: admission.caste,
      community: admission.community,
      dob: admission.dob,
      emailId: admission.emailId,
      fatherName: admission.fatherName,
      fatherOccupation: admission.fatherOccupation,
      firstLanguage: admission.firstLanguage,
      firstName: admission.firstName,
      guardiansOccupation: admission.guardiansOccupation,
      gender: admission.gender,
      guardianName: admission.guardianName,
      guardianPhoneNumber: admission.guardianPhoneNumber,
      lastName: admission.lastName,
      maritalStatus: admission.maritalStatus,
      mediumOfEducation10th: admission.mediumOfEducation10th,
      mediumOfEducation12th: admission.mediumOfEducation12th,
      middleName: admission.middleName,
      mobileNumber: admission.mobileNumber,
      motherName: admission.motherName,
      motherOccupation: admission.motherOccupation,
      motherTongue: admission.motherTongue,
      nationality: admission.nationality,
      noOfSiblings: admission.noOfSiblings,
      obtainedMark10th: admission.obtainedMark10th,
      obtainedMark12th: admission.obtainedMark12th,
      courseOption1: admission.courseOption1,
      courseOption2: admission.courseOption2,
      parentsSeparated: admission.parentsSeparated,
      permanentDistrict: admission.permanentDistrict,
      permanentPostalCode: admission.permanentPostalCode,
      permanentState: admission.permanentState,
      phoneNumber: admission.phoneNumber,
      relationshipType: admission.relationshipType,
      religion: admission.religion,
      residentialDistrict: admission.residentialDistrict,
      residentialPostalCode: admission.residentialPostalCode,
      residentialState: admission.residentialState,
      scholarship: admission.scholarship,
      schoolName10th: admission.schoolName10th,
      schoolName12th: admission.schoolName12th,
      siblingClass1: admission.siblingClass1,
      siblingClass2: admission.siblingClass2,
      siblingName1: admission.siblingName1,
      siblingName2: admission.siblingName2,
      siblingRelation1: admission.siblingRelation1,
      siblingRelation2: admission.siblingRelation2,
      yearOfPassing10th: admission.yearOfPassing10th,
      yearOfPassing12th: admission.yearOfPassing12th,
      residentialAddress: admission.residentialAddress,
      permanentAddress: admission.permanentAddress,
      form: {
        connect: {
          id: formId,
        },
      },
    },
  });
}

export async function getAdmissionsList(page: number, pageSize: number) {
  const session = await getServerSession(authOptions);

  const total = await db.admissionForm.count();
  const admissions = await db.admissionForm.findMany({
    take: pageSize,
    skip: (page - 1) * pageSize,
    include: {
      form: {
        include: {
          branch: true,
          organization: true,
        },
      },
    },
    where: {
      form: {
        branchId: session.branchId,
        organizationId: session.organizationId,
      },
    },
  });

  return {
    total,
    page,
    pageSize,
    data: admissions,
  };
}
