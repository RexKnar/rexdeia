import { getServerSession } from 'next-auth';
import { db } from '../../../lib/db';
import { AddStudentModel } from './models';
import { authOptions } from '../../../lib/auth';

export async function addStudent(formId: string, student: AddStudentModel) {
  return await db.studentForm.create({
    data: {
      ...student,
      aadharCardNumber: student.aadharCardNumber,
      admissionMode: student.admissionMode,
      admissionType: student.admissionType,
      annualIncome: student.annualIncome,
      bloodGroup: student.bloodGroup,
      caste: student.caste,
      community: student.community,
      dob: student.dob,
      emailId: student.emailId,
      fatherName: student.fatherName,
      fatherOccupation: student.fatherOccupation,
      firstLanguage: student.firstLanguage,
      firstName: student.firstName,
      guardiansOccupation: student.guardiansOccupation,
      gender: student.gender,
      guardianName: student.guardianName,
      guardianPhoneNumber: student.guardianPhoneNumber,
      lastName: student.lastName,
      maritalStatus: student.maritalStatus,
      mediumOfEducation10th: student.mediumOfEducation10th,
      mediumOfEducation12th: student.mediumOfEducation12th,
      middleName: student.middleName,
      mobileNumber: student.mobileNumber,
      motherName: student.motherName,
      motherOccupation: student.motherOccupation,
      motherTongue: student.motherTongue,
      nationality: student.nationality,
      noOfSiblings: student.noOfSiblings,
      obtainedMark10th: student.obtainedMark10th,
      obtainedMark12th: student.obtainedMark12th,
      courseOption1: student.courseOption1,
      courseOption2: student.courseOption2,
      parentsSeparated: student.parentsSeparated,
      permanentDistrict: student.permanentDistrict,
      permanentPostalCode: student.permanentPostalCode,
      permanentState: student.permanentState,
      phoneNumber: student.phoneNumber,
      relationshipType: student.relationshipType,
      religion: student.religion,
      residentialDistrict: student.residentialDistrict,
      residentialPostalCode: student.residentialPostalCode,
      residentialState: student.residentialState,
      scholarship: student.scholarship,
      schoolName10th: student.schoolName10th,
      schoolName12th: student.schoolName12th,
      siblingClass1: student.siblingClass1,
      siblingClass2: student.siblingClass2,
      siblingName1: student.siblingName1,
      siblingName2: student.siblingName2,
      siblingRelation1: student.siblingRelation1,
      siblingRelation2: student.siblingRelation2,
      yearOfPassing10th: student.yearOfPassing10th,
      yearOfPassing12th: student.yearOfPassing12th,
      residentialAddress: student.residentialAddress,
      permanentAddress: student.permanentAddress,
      form: {
        connect: {
          id: formId,
        },
      },
    },
  });
}

export async function getStudentsList(page: number, pageSize: number) {
  const session = await getServerSession(authOptions);
  const total = await db.studentForm.count();
  const studentsList = await db.studentForm.findMany({
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
    data: studentsList,
  };
}
