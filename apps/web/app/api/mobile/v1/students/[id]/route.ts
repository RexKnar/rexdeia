import { captureException } from '@sentry/nextjs';
import { StatusCodes } from 'http-status-codes';
import { db } from 'lib/db';
import { getAuthSession } from 'lib/mobile-auth';
import { NextRequest, NextResponse } from 'next/server';
import { generateSignedUrl } from 'app/api/upload/service';
import { verifySectionIncharge } from '../helpers';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getAuthSession(request);
  if (!session?.user?.id) {
    return NextResponse.json(
      { error: 'UNAUTHORIZED' },
      { status: StatusCodes.UNAUTHORIZED }
    );
  }

  const studentId = params?.id;
  if (!studentId) {
    return NextResponse.json(
      { error: 'STUDENT_ID_REQUIRED' },
      { status: StatusCodes.BAD_REQUEST }
    );
  }

  try {
    // 1. Fetch student with multi-tenant scoping
    const student = await db.student.findFirst({
      where: {
        id: studentId,
        branchId: session.branchId,
        organizationId: session.organizationId,
        isDeleted: false,
      },
      include: {
        batch: {
          select: {
            id: true,
            name: true,
          },
        },
        community: {
          select: {
            id: true,
            name: true,
          },
        },
        motherTongue: {
          select: {
            id: true,
            name: true,
          },
        },
        studentMapping: {
          where: {
            isCurrent: true,
            ...(session.currentBatch ? { batchId: session.currentBatch } : {}),
          },
          include: {
            batch: { select: { id: true, name: true } },
            class: { select: { id: true, name: true } },
            section: { select: { id: true, name: true } },
            group: { select: { id: true, name: true } },
            medium: { select: { id: true, name: true } },
          },
        },
      },
    });

    if (!student) {
      return NextResponse.json(
        { error: 'STUDENT_NOT_FOUND' },
        { status: StatusCodes.NOT_FOUND }
      );
    }

    // 2. Generate signed profile image URL if exists
    let profileImageUrl: string | null = null;
    if (student.profileImage) {
      try {
        profileImageUrl = await generateSignedUrl(student.profileImage);
      } catch {
        profileImageUrl = student.profileImage;
      }
    }

    // 3. Current mapping & academic details
    const currentMapping = student.studentMapping[0] || null;
    const additionalAttributes = (student.additionalAttributes as Record<string, any>) || {};

    // 4. Verify section incharge privileges
    const isSectionIncharge = await verifySectionIncharge(
      session,
      currentMapping?.sectionId,
      currentMapping?.batchId
    );

    const studentProfile = {
      id: student.id,
      isSectionIncharge,
      firstName: student.firstName,
      middleName: student.middleName || '',
      lastName: student.lastName,
      fullName: [student.firstName, student.middleName, student.lastName].filter(Boolean).join(' ').trim(),
      gender: student.gender || '-',
      bloodGroup: student.bloodGroup || '-',
      dob: student.dob || '',
      emailId: student.emailId || '',
      phoneNumber: student.phoneNumber || '',
      aadharCardNumber: student.aadharCardNumber || '',
      status: student.status,
      profileImage: profileImageUrl,
      religion: student.religion || '-',
      nationality: student.nationality || '-',
      motherTongue: student.motherTongue?.name || (additionalAttributes.motherTongue as string) || '-',
      community: student.community?.name || (additionalAttributes.community as string) || '-',
      caste: (additionalAttributes.caste as string) || '-',
      differentlyAbled: (additionalAttributes.differentlyAbled as string) || 'No',
      age: additionalAttributes.age ? String(additionalAttributes.age) : '',

      // Parent Details
      fatherName: student.fatherName || '-',
      fatherOccupation: student.fatherOccupation || '-',
      fatherPhoneNumber: student.fatherPhoneNumber || '',
      fatherEmailId: student.fatherEmailId || '',
      fatherEducation: (additionalAttributes.fatherEducation as string) || '-',
      fatherAadharCardNumber: (additionalAttributes.fatherAadharCardNumber as string) || '-',

      motherName: student.motherName || '-',
      motherOccupation: student.motherOccupation || '-',
      motherPhoneNumber: student.motherPhoneNumber || '',
      motherEmailId: student.motherEmailId || '',
      motherEducation: (additionalAttributes.motherEducation as string) || '-',
      motherAadharCardNumber: (additionalAttributes.motherAadharCardNumber as string) || '-',
      parentsSeparated: (additionalAttributes.parentsSeparated as string) || 'No',
      annualIncome: (additionalAttributes.annualIncome as string) || '-',

      // Guardian Details
      guardianName: student.guardianName || '',
      guardiansOccupation: student.guardiansOccupation || '',
      guardianPhoneNumber: student.guardianPhoneNumber || '',
      guardianEmailId: student.guardianEmailId || '',
      guardianRelationship: (additionalAttributes.relationshipType as string) || '',
      guardianAadharCardNumber: (additionalAttributes.guardianAadharCardNumber as string) || '',

      // Residential Address
      residentialAddress: (additionalAttributes.residentialAddress as string) || '',
      residentialDistrict: (additionalAttributes.residentialDistrict as string) || '',
      residentialState: (additionalAttributes.residentialState as string) || '',
      residentialPostalCode: (additionalAttributes.residentialPostalCode as string) || '',

      // Permanent Address
      permanentAddress: (additionalAttributes.permanentAddress as string) || '',
      permanentDistrict: (additionalAttributes.permanentDistrict as string) || '',
      permanentState: (additionalAttributes.permanentState as string) || '',
      permanentPostalCode: (additionalAttributes.permanentPostalCode as string) || '',

      // Educational & Admission Details
      emisNumber: student.emisNumber || (additionalAttributes.emisNumber as string) || '',
      admissionNumber: student.admissionNumber || (additionalAttributes.admissionNumber as string) || '',
      dateOfJoining: (additionalAttributes.dateOfJoining as string) || '',
      admissionType: (additionalAttributes.admissionType as string) || '-',
      admissionMode: (additionalAttributes.admissionMode as string) || '-',
      scholarship: (additionalAttributes.scholarship as string) || 'None',
      firstLanguage: (additionalAttributes.firstLanguage as string) || '-',

      // Past 10th & 11th Details
      schoolName10th: (additionalAttributes.schoolName10th as string) || '',
      yearOfPassing10th: (additionalAttributes.yearOfPassing10th as string) || '',
      obtainedMark10th: (additionalAttributes.obtainedMark10th as string) || '',
      mediumOfEducation10th: (additionalAttributes.mediumOfEducation10th as string) || '',

      schoolName11th: (additionalAttributes.schoolName11th as string) || '',
      yearOfPassing11th: (additionalAttributes.yearOfPassing11th as string) || '',
      obtainedMark11th: (additionalAttributes.obtainedMark11th as string) || '',
      mediumOfEducation11th: (additionalAttributes.mediumOfEducation11th as string) || '',

      // Current Academic Mapping
      rollNo: currentMapping?.rollNumber ? String(currentMapping.rollNumber) : '-',
      classId: currentMapping?.classId || '',
      className: currentMapping?.class?.name || '',
      sectionId: currentMapping?.sectionId || '',
      sectionName: currentMapping?.section?.name || '',
      groupId: currentMapping?.groupId || '',
      groupName: currentMapping?.group?.name || '',
      mediumId: currentMapping?.mediumId || '',
      mediumName: currentMapping?.medium?.name || '',
      batchId: currentMapping?.batchId || student.batch?.id || '',
      batchName: currentMapping?.batch?.name || student.batch?.name || '',
    };

    // 4. Fetch Academic History
    const allMappings = await db.studentMapping.findMany({
      where: {
        studentId,
      },
      include: {
        batch: { select: { id: true, name: true } },
        class: { select: { id: true, name: true } },
        section: { select: { id: true, name: true } },
        group: { select: { id: true, name: true } },
        medium: { select: { id: true, name: true } },
      },
      orderBy: { batch: { name: 'desc' } },
    });

    const academicHistory = allMappings.map((m) => ({
      id: m.id,
      academicYear: m.batch?.name || '-',
      className: m.class?.name || '-',
      sectionName: m.section?.name || '-',
      rollNumber: m.rollNumber ? String(m.rollNumber) : '-',
      groupName: m.group?.name || '-',
      mediumName: m.medium?.name || '-',
      remark: m.remark || '',
      isCurrent: m.isCurrent,
    }));

    // 5. Fetch Exam Reports
    let reports: any[] = [];
    if (currentMapping?.sectionId && currentMapping?.classId) {
      try {
        const examGroups = await db.examGroup.findMany({
          where: {
            sectionId: currentMapping.sectionId,
            classId: currentMapping.classId,
            exam: {
              batchId: session.currentBatch || undefined,
            },
          },
          select: {
            exam: {
              select: {
                id: true,
                name: true,
              },
            },
            examSubject: {
              select: {
                subject: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
                examSubjectPartition: {
                  select: {
                    minMark: true,
                    totalMarks: true,
                    convertTo: true,
                    assessmentFormat: {
                      select: {
                        id: true,
                        name: true,
                      },
                    },
                    Mark: {
                      where: {
                        studentId,
                      },
                    },
                  },
                },
              },
            },
          },
        });

        reports = examGroups.map((eg) => {
          let totalObtained = 0;
          let totalPossible = 0;
          let hasFailing = false;
          let anyEntered = false;

          const subjects = eg.examSubject.map((es) => {
            let subjectObtained = 0;
            let subjectPossible = 0;
            let subjectFailed = false;
            let isAbsent = false;

            es.examSubjectPartition.forEach((partition) => {
              const markRecord = partition.Mark.find((m) => m.studentId === studentId);
              const maxPartMark = Number(partition.convertTo || partition.totalMarks);
              subjectPossible += maxPartMark;

              if (markRecord) {
                anyEntered = true;
                if (markRecord.attandance) {
                  isAbsent = true;
                  subjectFailed = true;
                } else {
                  const rawMark = Number(markRecord.mark || 0);
                  const scaledMark = partition.totalMarks
                    ? Math.round((rawMark / Number(partition.totalMarks)) * maxPartMark)
                    : rawMark;
                  subjectObtained += scaledMark;

                  if (rawMark < Number(partition.minMark || 0)) {
                    subjectFailed = true;
                  }
                }
              }
            });

            if (subjectFailed) hasFailing = true;
            totalObtained += subjectObtained;
            totalPossible += subjectPossible;

            return {
              subjectId: es.subject.id,
              subjectName: es.subject.name,
              obtainedMarks: isAbsent ? 'A' : String(subjectObtained),
              maxMarks: String(subjectPossible),
              isPassed: !subjectFailed,
              isAbsent,
            };
          });

          const percentage = totalPossible > 0 ? (totalObtained / totalPossible) * 100 : 0;

          return {
            examId: eg.exam.id,
            examName: eg.exam.name,
            totalObtained,
            totalPossible,
            percentage: Number(percentage.toFixed(1)),
            status: !anyEntered ? 'Pending' : hasFailing ? 'Fail' : 'Pass',
            subjects,
          };
        });
      } catch (err) {
        captureException(err);
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        student: studentProfile,
        academicHistory,
        reports,
        isSectionIncharge,
      },
    });
  } catch (error: any) {
    captureException(error);
    return NextResponse.json(
      { error: error.message || 'INTERNAL_SERVER_ERROR' },
      { status: StatusCodes.INTERNAL_SERVER_ERROR }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getAuthSession(request);
  if (!session?.user?.id) {
    return NextResponse.json(
      { error: 'UNAUTHORIZED' },
      { status: StatusCodes.UNAUTHORIZED }
    );
  }

  const studentId = params?.id;
  if (!studentId) {
    return NextResponse.json(
      { error: 'STUDENT_ID_REQUIRED' },
      { status: StatusCodes.BAD_REQUEST }
    );
  }

  try {
    const existingStudent = await db.student.findFirst({
      where: {
        id: studentId,
        branchId: session.branchId,
        organizationId: session.organizationId,
        isDeleted: false,
      },
      include: {
        studentMapping: {
          where: { isCurrent: true },
          select: { sectionId: true, batchId: true },
        },
      },
    });

    if (!existingStudent) {
      return NextResponse.json(
        { error: 'STUDENT_NOT_FOUND' },
        { status: StatusCodes.NOT_FOUND }
      );
    }

    const currentMapping = existingStudent.studentMapping[0] || null;
    const isAuthorized = await verifySectionIncharge(
      session,
      currentMapping?.sectionId,
      currentMapping?.batchId
    );

    if (!isAuthorized) {
      return NextResponse.json(
        { error: 'FORBIDDEN_NOT_SECTION_INCHARGE' },
        { status: StatusCodes.FORBIDDEN }
      );
    }

    const body = await request.json();
    const existingAttrs = (existingStudent.additionalAttributes as Record<string, any>) || {};

    const updatedAttrs = {
      ...existingAttrs,
      ...(body.residentialAddress !== undefined ? { residentialAddress: body.residentialAddress } : {}),
      ...(body.residentialDistrict !== undefined ? { residentialDistrict: body.residentialDistrict } : {}),
      ...(body.residentialState !== undefined ? { residentialState: body.residentialState } : {}),
      ...(body.residentialPostalCode !== undefined ? { residentialPostalCode: body.residentialPostalCode } : {}),
      ...(body.permanentAddress !== undefined ? { permanentAddress: body.permanentAddress } : {}),
      ...(body.permanentDistrict !== undefined ? { permanentDistrict: body.permanentDistrict } : {}),
      ...(body.permanentState !== undefined ? { permanentState: body.permanentState } : {}),
      ...(body.permanentPostalCode !== undefined ? { permanentPostalCode: body.permanentPostalCode } : {}),
      ...(body.fatherEducation !== undefined ? { fatherEducation: body.fatherEducation } : {}),
      ...(body.fatherAadharCardNumber !== undefined ? { fatherAadharCardNumber: body.fatherAadharCardNumber } : {}),
      ...(body.motherEducation !== undefined ? { motherEducation: body.motherEducation } : {}),
      ...(body.motherAadharCardNumber !== undefined ? { motherAadharCardNumber: body.motherAadharCardNumber } : {}),
      ...(body.parentsSeparated !== undefined ? { parentsSeparated: body.parentsSeparated } : {}),
      ...(body.annualIncome !== undefined ? { annualIncome: body.annualIncome } : {}),
      ...(body.guardianRelationship !== undefined ? { relationshipType: body.guardianRelationship } : {}),
      ...(body.guardianAadharCardNumber !== undefined ? { guardianAadharCardNumber: body.guardianAadharCardNumber } : {}),
      ...(body.caste !== undefined ? { caste: body.caste } : {}),
      ...(body.differentlyAbled !== undefined ? { differentlyAbled: body.differentlyAbled } : {}),
      ...(body.community !== undefined ? { community: body.community } : {}),
      ...(body.motherTongue !== undefined ? { motherTongue: body.motherTongue } : {}),
    };

    const updated = await db.student.update({
      where: { id: studentId },
      data: {
        ...(body.firstName !== undefined ? { firstName: body.firstName.trim() } : {}),
        ...(body.middleName !== undefined ? { middleName: body.middleName?.trim() || null } : {}),
        ...(body.lastName !== undefined ? { lastName: body.lastName.trim() } : {}),
        ...(body.gender !== undefined ? { gender: body.gender } : {}),
        ...(body.bloodGroup !== undefined ? { bloodGroup: body.bloodGroup } : {}),
        ...(body.dob !== undefined ? { dob: body.dob } : {}),
        ...(body.emailId !== undefined ? { emailId: body.emailId.trim() } : {}),
        ...(body.phoneNumber !== undefined ? { phoneNumber: body.phoneNumber.trim() } : {}),
        ...(body.aadharCardNumber !== undefined ? { aadharCardNumber: body.aadharCardNumber?.trim() || null } : {}),
        ...(body.religion !== undefined ? { religion: body.religion } : {}),
        ...(body.nationality !== undefined ? { nationality: body.nationality } : {}),

        ...(body.fatherName !== undefined ? { fatherName: body.fatherName } : {}),
        ...(body.fatherOccupation !== undefined ? { fatherOccupation: body.fatherOccupation } : {}),
        ...(body.fatherPhoneNumber !== undefined ? { fatherPhoneNumber: body.fatherPhoneNumber } : {}),
        ...(body.fatherEmailId !== undefined ? { fatherEmailId: body.fatherEmailId } : {}),

        ...(body.motherName !== undefined ? { motherName: body.motherName } : {}),
        ...(body.motherOccupation !== undefined ? { motherOccupation: body.motherOccupation } : {}),
        ...(body.motherPhoneNumber !== undefined ? { motherPhoneNumber: body.motherPhoneNumber } : {}),
        ...(body.motherEmailId !== undefined ? { motherEmailId: body.motherEmailId } : {}),

        ...(body.guardianName !== undefined ? { guardianName: body.guardianName } : {}),
        ...(body.guardiansOccupation !== undefined ? { guardiansOccupation: body.guardiansOccupation } : {}),
        ...(body.guardianPhoneNumber !== undefined ? { guardianPhoneNumber: body.guardianPhoneNumber } : {}),
        ...(body.guardianEmailId !== undefined ? { guardianEmailId: body.guardianEmailId } : {}),

        additionalAttributes: updatedAttrs,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Student details updated successfully',
      data: {
        id: updated.id,
        firstName: updated.firstName,
        middleName: updated.middleName,
        lastName: updated.lastName,
      },
    });
  } catch (error: any) {
    captureException(error);
    return NextResponse.json(
      { error: error.message || 'FAILED_TO_UPDATE_STUDENT' },
      { status: StatusCodes.INTERNAL_SERVER_ERROR }
    );
  }
}
