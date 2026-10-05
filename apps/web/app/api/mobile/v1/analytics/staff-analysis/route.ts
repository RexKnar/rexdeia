import { captureException } from '@sentry/nextjs';
import { StatusCodes } from 'http-status-codes';
import { db } from 'lib/db';
import { getAuthSession } from 'lib/mobile-auth';
import { NextRequest, NextResponse } from 'next/server';

function calculatePercentage(obtained: number, total: number): number {
  if (!total || total === 0) return 0;
  return Number(((obtained / total) * 100).toFixed(2));
}

function getGradeFromScale(mark: number, gradeScales?: any[]): string {
  if (gradeScales && gradeScales.length > 0) {
    for (const scale of gradeScales) {
      const start = Number(scale.startValue);
      const end = Number(scale.endValue);
      if (mark >= start && mark <= end) {
        return scale.gradeName;
      }
    }
  }
  if (mark >= 90) return 'A1';
  if (mark >= 80) return 'A2';
  if (mark >= 70) return 'B1';
  if (mark >= 60) return 'B2';
  if (mark >= 50) return 'C1';
  if (mark >= 40) return 'C2';
  if (mark >= 35) return 'D';
  return 'E';
}

export async function GET(request: NextRequest) {
  const session = await getAuthSession(request);
  if (!session?.user?.id) {
    return NextResponse.json(
      { error: 'UNAUTHORIZED' },
      { status: StatusCodes.UNAUTHORIZED }
    );
  }

  const { searchParams } = new URL(request.url);
  const examId = searchParams.get('examId');
  const classId = searchParams.get('classId'); // 'all', undefined, or specific classId
  const sectionId = searchParams.get('sectionId'); // 'all', undefined, or specific sectionId

  if (!examId) {
    return NextResponse.json(
      { error: 'MISSING_EXAM_ID', message: 'examId parameter is required' },
      { status: StatusCodes.BAD_REQUEST }
    );
  }

  try {
    const branchId = session.branchId;

    // Fetch exam info
    const exam = await db.exam.findFirst({
      where: { id: examId, branchId },
      select: {
        id: true,
        name: true,
        batchId: true,
        batch: { select: { id: true, name: true } },
      },
    });

    if (!exam) {
      return NextResponse.json(
        { error: 'EXAM_NOT_FOUND', message: 'Exam was not found for this branch' },
        { status: StatusCodes.NOT_FOUND }
      );
    }

    const currentBatchId = exam.batchId || session.currentBatch;

    // 1. Resolve logged-in staff
    const user = session.user;
    let loggedInStaffId: string | null = (user as any).staffId || null;
    if (!loggedInStaffId) {
      const staffRecord = await db.staff.findFirst({
        where: {
          OR: [
            ...(user.id ? [{ userId: user.id }] : []),
            ...(user.email ? [{ email: user.email }] : []),
          ],
        },
        select: { id: true },
      });
      loggedInStaffId = staffRecord?.id || null;
    }

    // 2. Fetch active assignments for the logged-in staff
    let staffAssignments = loggedInStaffId
      ? await db.academicSubjectForStaff.findMany({
          where: {
            staffId: loggedInStaffId,
            deletedAt: null,
            ...(currentBatchId ? { academicYearId: currentBatchId } : {}),
          },
          select: {
            sectionId: true,
            subjectId: true,
            isIncharge: true,
            section: {
              select: {
                id: true,
                classId: true,
              },
            },
          },
        })
      : [];

    if (staffAssignments.length === 0 && loggedInStaffId) {
      staffAssignments = await db.academicSubjectForStaff.findMany({
        where: {
          staffId: loggedInStaffId,
          deletedAt: null,
        },
        select: {
          sectionId: true,
          subjectId: true,
          isIncharge: true,
          section: {
            select: {
              id: true,
              classId: true,
            },
          },
        },
      });
    }

    const staffSectionSubjectMap = new Map<string, Set<string>>();
    const staffAssignedSectionIds = new Set<string>();
    const staffAssignedClassIds = new Set<string>();

    staffAssignments.forEach((assignment) => {
      if (assignment.sectionId) {
        staffAssignedSectionIds.add(assignment.sectionId);
        if (assignment.section?.classId) {
          staffAssignedClassIds.add(assignment.section.classId);
        }
        if (assignment.subjectId) {
          if (!staffSectionSubjectMap.has(assignment.sectionId)) {
            staffSectionSubjectMap.set(assignment.sectionId, new Set<string>());
          }
          staffSectionSubjectMap.get(assignment.sectionId)!.add(assignment.subjectId);
        }
      }
    });

    if (loggedInStaffId) {
      const inchargeSections = await db.section.findMany({
        where: { staffId: loggedInStaffId, isDeleted: false },
        select: { id: true, classId: true },
      });
      inchargeSections.forEach((s) => {
        staffAssignedSectionIds.add(s.id);
        staffAssignedClassIds.add(s.classId);
      });
    }

    // 3. Determine classes to analyze (scoped strictly to logged-in staff's assigned classes)
    const isOverallClass = !classId || classId === 'all';
    let targetClassIds: string[] = [];
    let selectedClassDetails: { id: string; name: string } | null = null;

    if (loggedInStaffId && staffAssignedClassIds.size > 0) {
      if (isOverallClass) {
        targetClassIds = Array.from(staffAssignedClassIds);
        selectedClassDetails = { id: 'all', name: 'Overall (All Classes)' };
      } else {
        const cls = await db.class.findFirst({
          where: { id: classId, branchId, isDeleted: false },
          select: { id: true, name: true },
        });
        if (cls && staffAssignedClassIds.has(cls.id)) {
          targetClassIds = [cls.id];
          selectedClassDetails = cls;
        } else {
          targetClassIds = [];
        }
      }
    } else {
      if (isOverallClass) {
        const branchClasses = await db.class.findMany({
          where: { branchId, isDeleted: false, isActive: true },
          select: { id: true, name: true },
          orderBy: { name: 'asc' },
        });
        targetClassIds = branchClasses.map((c) => c.id);
        selectedClassDetails = { id: 'all', name: 'Overall (All Classes)' };
      } else {
        const cls = await db.class.findFirst({
          where: { id: classId, branchId, isDeleted: false },
          select: { id: true, name: true },
        });
        if (cls) {
          targetClassIds = [cls.id];
          selectedClassDetails = cls;
        }
      }
    }

    // 4. Determine sections to analyze (scoped strictly to logged-in staff's assigned sections)
    const isOverallSection = !sectionId || sectionId === 'all' || isOverallClass;
    let targetSectionIds: string[] = [];
    let selectedSectionDetails: { id: string; name: string } | null = null;

    if (loggedInStaffId && staffAssignedSectionIds.size > 0) {
      const assignedSectionsList = await db.section.findMany({
        where: { id: { in: Array.from(staffAssignedSectionIds) }, isDeleted: false },
        select: { id: true, name: true, classId: true },
      });

      if (isOverallSection) {
        targetSectionIds = assignedSectionsList
          .filter((s) => targetClassIds.includes(s.classId))
          .map((s) => s.id);
        selectedSectionDetails = { id: 'all', name: 'Overall (All Sections)' };
      } else {
        const sec = assignedSectionsList.find((s) => s.id === sectionId);
        if (sec && targetClassIds.includes(sec.classId)) {
          targetSectionIds = [sec.id];
          selectedSectionDetails = { id: sec.id, name: sec.name };
        } else {
          targetSectionIds = [];
        }
      }
    } else {
      if (isOverallSection) {
        const allSections = await db.section.findMany({
          where: {
            classId: { in: targetClassIds },
            isDeleted: false,
          },
          select: { id: true, name: true, classId: true },
          orderBy: { name: 'asc' },
        });
        targetSectionIds = allSections.map((s) => s.id);
        selectedSectionDetails = { id: 'all', name: 'Overall (All Sections)' };
      } else {
        const sec = await db.section.findFirst({
          where: { id: sectionId, isDeleted: false },
          select: { id: true, name: true },
        });
        if (sec) {
          targetSectionIds = [sec.id];
          selectedSectionDetails = sec;
        }
      }
    }

    if (targetSectionIds.length === 0) {
      return NextResponse.json({
        success: true,
        exam: { id: exam.id, name: exam.name },
        class: selectedClassDetails,
        section: selectedSectionDetails,
        summary: null,
        staffAnalytics: [],
        studentMarkList: [],
        subjectHeaders: [],
        isSectionIncharge: false,
        canViewOtherStaff: false,
      });
    }

    // 5. Verify if user is incharge of the specifically selected section
    const isSpecificSectionSelected = Boolean(sectionId && sectionId !== 'all' && !isOverallClass);
    let isUserInchargeOfSelectedSection = false;

    if (isSpecificSectionSelected && loggedInStaffId && sectionId) {
      const inchargeAssignment = await db.academicSubjectForStaff.findFirst({
        where: {
          staffId: loggedInStaffId,
          sectionId,
          isIncharge: true,
          deletedAt: null,
        },
        select: { id: true },
      });

      const sectionStaffRecord = await db.section.findFirst({
        where: {
          id: sectionId,
          staffId: loggedInStaffId,
          isDeleted: false,
        },
        select: { id: true },
      });

      isUserInchargeOfSelectedSection = Boolean(inchargeAssignment || sectionStaffRecord);
    }

    // Access control rule:
    // Only show other staff's analytics if a specific section is chosen AND the logged-in staff is its incharge.
    // Otherwise, strictly show the logged-in staff's analytics only.
    const allowOtherStaff = isSpecificSectionSelected && isUserInchargeOfSelectedSection;

    // Check if assignments exist with currentBatchId
    const hasBatchAssignments = currentBatchId
      ? (await db.academicSubjectForStaff.count({
          where: {
            sectionId: { in: targetSectionIds },
            deletedAt: null,
            isIncharge: false,
            academicYearId: currentBatchId,
          },
        })) > 0
      : false;

    const batchCondition = hasBatchAssignments && currentBatchId ? { academicYearId: currentBatchId } : {};

    const staffWhereClause: any = {
      branchId,
      academicSubjectForStaff: {
        some: {
          sectionId: { in: targetSectionIds },
          deletedAt: null,
          isIncharge: false,
          ...batchCondition,
        },
      },
    };

    if (!allowOtherStaff) {
      staffWhereClause.id = loggedInStaffId || '__NO_STAFF__';
    }

    // 5. Fetch Staff with their subject assignments for these sections
    const staffs = await db.staff.findMany({
      where: staffWhereClause,
      select: {
        id: true,
        firstName: true,
        middleName: true,
        lastName: true,
        email: true,
        academicSubjectForStaff: {
          where: {
            sectionId: { in: targetSectionIds },
            deletedAt: null,
            isIncharge: false,
            ...batchCondition,
          },
          select: {
            isIncharge: true,
            subject: {
              select: {
                id: true,
                name: true,
                subjectMaster: {
                  select: { id: true, name: true, order: true },
                },
              },
            },
            section: {
              select: {
                id: true,
                name: true,
                class: {
                  select: { id: true, name: true },
                },
              },
            },
          },
        },
      },
    });

    // 6. Fetch Student Mappings with marks for this exam
    const studentMappings = await db.studentMapping.findMany({
      where: {
        sectionId: { in: targetSectionIds },
        isCurrent: true,
        onHold: false,
        ...(currentBatchId ? { batchId: currentBatchId } : {}),
      },
      select: {
        rollNumber: true,
        student: {
          select: {
            id: true,
            firstName: true,
            middleName: true,
            lastName: true,
            gender: true,
          },
        },
        section: {
          select: {
            id: true,
            name: true,
            class: {
              select: {
                id: true,
                name: true,
                grade: {
                  select: {
                    gradeScales: true,
                  },
                },
              },
            },
            ExamGroup: {
              where: { examId },
              select: {
                examSubject: {
                  orderBy: {
                    subject: {
                      subjectOrder: 'asc',
                    },
                  },
                  select: {
                    id: true,
                    subjectId: true,
                    minMark: true,
                    totalMarks: true,
                    convertTo: true,
                    subject: {
                      select: { id: true, name: true, subjectOrder: true },
                    },
                    examSubjectPartition: {
                      include: {
                        Mark: true,
                        assessmentFormat: {
                          select: { id: true, name: true },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      orderBy: [
        { rollNumber: 'asc' },
        { student: { gender: 'asc' } },
        { student: { firstName: 'asc' } },
      ],
    });

    // Structure Student marks per section & subject for fast lookup in staff analytics
    interface StudentSubjectResult {
      studentId: string;
      studentName: string;
      gender: 'male' | 'female';
      hasEntry: boolean;
      isAbsent: boolean;
      isPass: boolean;
      totalMark: number;
    }

    const sectionSubjectStudentMap = new Map<string, StudentSubjectResult[]>();

    studentMappings.forEach((mapping) => {
      const student = mapping.student;
      if (!student) return;

      const rawGender = String(student.gender || '').toLowerCase();
      const gender: 'male' | 'female' = rawGender === 'female' ? 'female' : 'male';
      const studentFullName = `${student.firstName} ${student.middleName || ''} ${student.lastName || ''}`.trim();
      const section = mapping.section;
      if (!section) return;

      const examGroup = section.ExamGroup?.[0];
      const examSubjects = examGroup?.examSubject || [];

      examSubjects.forEach((es) => {
        const key = `${section.id}_${es.subjectId}`;
        if (!sectionSubjectStudentMap.has(key)) {
          sectionSubjectStudentMap.set(key, []);
        }

        const partitions = es.examSubjectPartition || [];
        let hasAnyMarkEntry = false;
        let isAllAbsent = partitions.length > 0;
        let subjectSum = 0;
        let isSubjectFailing = false;

        const pSubjectMin =
          Number(es.minMark) > 0
            ? Number(es.minMark)
            : Math.round(Number(es.totalMarks || 100) * 0.35);

        partitions.forEach((partition) => {
          const markObj = partition.Mark?.find((m: any) => m.studentId === student.id);
          if (markObj) {
            hasAnyMarkEntry = true;
            if (markObj.attandance === 1) {
              // Absent in this partition
            } else {
              isAllAbsent = false;
              const val = Number(markObj.mark) || 0;
              subjectSum += val;

              const partMin =
                Number(partition.minMark) > 0
                  ? Number(partition.minMark)
                  : Math.round(Number(partition.totalMarks || 100) * 0.35);

              if (val < partMin) {
                isSubjectFailing = true;
              }
            }
          } else {
            isAllAbsent = false;
          }
        });

        if (subjectSum < pSubjectMin) {
          isSubjectFailing = true;
        }

        const isPass = hasAnyMarkEntry && !isAllAbsent && !isSubjectFailing;

        sectionSubjectStudentMap.get(key)!.push({
          studentId: student.id,
          studentName: studentFullName,
          gender,
          hasEntry: hasAnyMarkEntry,
          isAbsent: isAllAbsent && hasAnyMarkEntry,
          isPass,
          totalMark: subjectSum,
        });
      });
    });

    // Calculate analytics for each Staff & Subject
    const staffAnalyticsResult: any[] = [];

    let grandTotalStudents = 0;
    let grandAppeared = 0;
    let grandAbsent = 0;
    let grandPass = 0;
    let grandFail = 0;
    let grandPending = 0;
    let grandSumMarks = 0;
    let grandHighest = 0;
    let grandLowest = Infinity;

    staffs.forEach((staff) => {
      const staffFullName = `${staff.firstName} ${staff.middleName || ''} ${staff.lastName || ''}`.trim();
      const subjectAnalyticsList: any[] = [];

      const staffOverall = {
        totalStudents: { male: 0, female: 0, overall: 0 },
        appeared: { male: 0, female: 0, overall: 0 },
        absent: { male: 0, female: 0, overall: 0 },
        pendingMarkEntry: { male: 0, female: 0, overall: 0 },
        numberOfPassStudents: { male: 0, female: 0, overall: 0 },
        numberOfFailStudents: { male: 0, female: 0, overall: 0 },
        passPercentage: { male: 0, female: 0, overall: 0 },
        failPercentage: { male: 0, female: 0, overall: 0 },
        averageMark: { male: 0, female: 0, overall: 0 },
        highestMark: { male: 0, female: 0, overall: 0 },
        highestMarkStudentName: { male: '', female: '', overall: '' },
        lowestMark: { male: Infinity, female: Infinity, overall: Infinity },
        lowestMarkStudentName: { male: '', female: '', overall: '' },
      };

      staff.academicSubjectForStaff.forEach((item) => {
        const sec = item.section;
        const sub = item.subject;
        if (!sec || !sub) return;

        const mapKey = `${sec.id}_${sub.id}`;
        const studentRecords = sectionSubjectStudentMap.get(mapKey) || [];

        const subjectStats = {
          section: { id: sec.id, name: sec.name, class: sec.class },
          subject: { id: sub.id, name: sub.name },
          totalStudents: { male: 0, female: 0, overall: 0 },
          appeared: { male: 0, female: 0, overall: 0 },
          absent: { male: 0, female: 0, overall: 0 },
          pendingMarkEntry: { male: 0, female: 0, overall: 0 },
          numberOfPassStudents: { male: 0, female: 0, overall: 0 },
          numberOfFailStudents: { male: 0, female: 0, overall: 0 },
          passPercentage: { male: 0, female: 0, overall: 0 },
          failPercentage: { male: 0, female: 0, overall: 0 },
          averageMark: { male: 0, female: 0, overall: 0 },
          highestMark: { male: 0, female: 0, overall: 0 },
          highestMarkStudentName: { male: '', female: '', overall: '' },
          lowestMark: { male: Infinity, female: Infinity, overall: Infinity },
          lowestMarkStudentName: { male: '', female: '', overall: '' },
        };

        let sumMarksMale = 0;
        let sumMarksFemale = 0;
        let sumMarksOverall = 0;

        studentRecords.forEach((rec) => {
          const g = rec.gender;
          subjectStats.totalStudents[g]++;
          subjectStats.totalStudents.overall++;

          if (!rec.hasEntry) {
            subjectStats.pendingMarkEntry[g]++;
            subjectStats.pendingMarkEntry.overall++;
          } else if (rec.isAbsent) {
            subjectStats.absent[g]++;
            subjectStats.absent.overall++;
          } else {
            subjectStats.appeared[g]++;
            subjectStats.appeared.overall++;
            sumMarksOverall += rec.totalMark;

            if (g === 'male') {
              sumMarksMale += rec.totalMark;
            } else {
              sumMarksFemale += rec.totalMark;
            }

            if (rec.totalMark > subjectStats.highestMark[g]) {
              subjectStats.highestMark[g] = rec.totalMark;
              subjectStats.highestMarkStudentName[g] = rec.studentName;
            }
            if (rec.totalMark > subjectStats.highestMark.overall) {
              subjectStats.highestMark.overall = rec.totalMark;
              subjectStats.highestMarkStudentName.overall = rec.studentName;
            }

            if (rec.totalMark < subjectStats.lowestMark[g]) {
              subjectStats.lowestMark[g] = rec.totalMark;
              subjectStats.lowestMarkStudentName[g] = rec.studentName;
            }
            if (rec.totalMark < subjectStats.lowestMark.overall) {
              subjectStats.lowestMark.overall = rec.totalMark;
              subjectStats.lowestMarkStudentName.overall = rec.studentName;
            }

            if (rec.isPass) {
              subjectStats.numberOfPassStudents[g]++;
              subjectStats.numberOfPassStudents.overall++;
            } else {
              subjectStats.numberOfFailStudents[g]++;
              subjectStats.numberOfFailStudents.overall++;
            }
          }
        });

        ['male', 'female', 'overall'].forEach((cat) => {
          const key = cat as 'male' | 'female' | 'overall';
          const count = subjectStats.appeared[key];
          const totalCount = subjectStats.totalStudents[key];
          const sum = key === 'male' ? sumMarksMale : key === 'female' ? sumMarksFemale : sumMarksOverall;

          subjectStats.averageMark[key] = count > 0 ? Number((sum / count).toFixed(2)) : 0;
          subjectStats.passPercentage[key] = count > 0 ? calculatePercentage(subjectStats.numberOfPassStudents[key], count) : 0;
          subjectStats.failPercentage[key] = count > 0 ? calculatePercentage(subjectStats.numberOfFailStudents[key], count) : 0;

          if (subjectStats.lowestMark[key] === Infinity) {
            subjectStats.lowestMark[key] = 0;
          }

          staffOverall.totalStudents[key] += totalCount;
          staffOverall.appeared[key] += count;
          staffOverall.absent[key] += subjectStats.absent[key];
          staffOverall.pendingMarkEntry[key] += subjectStats.pendingMarkEntry[key];
          staffOverall.numberOfPassStudents[key] += subjectStats.numberOfPassStudents[key];
          staffOverall.numberOfFailStudents[key] += subjectStats.numberOfFailStudents[key];

          if (subjectStats.highestMark[key] > staffOverall.highestMark[key]) {
            staffOverall.highestMark[key] = subjectStats.highestMark[key];
            staffOverall.highestMarkStudentName[key] = subjectStats.highestMarkStudentName[key];
          }
          if (subjectStats.lowestMark[key] < staffOverall.lowestMark[key] && count > 0) {
            staffOverall.lowestMark[key] = subjectStats.lowestMark[key];
            staffOverall.lowestMarkStudentName[key] = subjectStats.lowestMarkStudentName[key];
          }
        });

        grandTotalStudents += subjectStats.totalStudents.overall;
        grandAppeared += subjectStats.appeared.overall;
        grandAbsent += subjectStats.absent.overall;
        grandPending += subjectStats.pendingMarkEntry.overall;
        grandPass += subjectStats.numberOfPassStudents.overall;
        grandFail += subjectStats.numberOfFailStudents.overall;
        grandSumMarks += sumMarksOverall;
        if (subjectStats.highestMark.overall > grandHighest) {
          grandHighest = subjectStats.highestMark.overall;
        }
        if (subjectStats.lowestMark.overall < grandLowest && subjectStats.appeared.overall > 0) {
          grandLowest = subjectStats.lowestMark.overall;
        }

        subjectAnalyticsList.push(subjectStats);
      });

      ['male', 'female', 'overall'].forEach((cat) => {
        const key = cat as 'male' | 'female' | 'overall';
        const count = staffOverall.appeared[key];
        staffOverall.passPercentage[key] = count > 0 ? calculatePercentage(staffOverall.numberOfPassStudents[key], count) : 0;
        staffOverall.failPercentage[key] = count > 0 ? calculatePercentage(staffOverall.numberOfFailStudents[key], count) : 0;
        if (staffOverall.lowestMark[key] === Infinity) {
          staffOverall.lowestMark[key] = 0;
        }
      });

      if (subjectAnalyticsList.length > 0) {
        staffAnalyticsResult.push({
          id: staff.id,
          name: staffFullName,
          email: staff.email,
          analytics: subjectAnalyticsList,
          overall: staffOverall,
        });
      }
    });

    // 7. Structure Detailed Student-Wise Marklist for the selected class/section
    const subjectHeaderMap = new Map<string, { id: string; name: string; partitions: string[] }>();
    const studentMarkListResult: any[] = [];

    studentMappings.forEach((mapping) => {
      const student = mapping.student;
      if (!student) return;

      const rawGender = String(student.gender || '').toLowerCase();
      const gender: 'male' | 'female' = rawGender === 'female' ? 'female' : 'male';
      const studentFullName = `${student.firstName} ${student.middleName || ''} ${student.lastName || ''}`.trim();
      const section = mapping.section;
      if (!section) return;

      // Filter: Show only the respective class/section students of the logged-in user/staff
      // and only their subject of that class/section.
      let permittedExamSubjects: any[] = [];

      if (loggedInStaffId) {
        // Must be a section where the logged-in staff teaches a subject
        const staffSubjectsForThisSection = staffSectionSubjectMap.get(section.id);
        if (!staffSubjectsForThisSection || staffSubjectsForThisSection.size === 0) {
          return;
        }

        const examGroup = section.ExamGroup?.[0];
        const examSubjects = examGroup?.examSubject || [];

        // ONLY keep the subjects taught by the logged-in staff in this specific class/section
        permittedExamSubjects = examSubjects.filter((es) =>
          staffSubjectsForThisSection.has(es.subjectId)
        );
      } else {
        const examGroup = section.ExamGroup?.[0];
        permittedExamSubjects = examGroup?.examSubject || [];
      }

      if (permittedExamSubjects.length === 0) return;

      // Populate distinct subject headers in order
      permittedExamSubjects.forEach((es) => {
        if (!subjectHeaderMap.has(es.subjectId)) {
          const partNames = (es.examSubjectPartition || []).map(
            (p: any) => p.assessmentFormat?.name || 'Part'
          );
          subjectHeaderMap.set(es.subjectId, {
            id: es.subjectId,
            name: es.subject?.name || 'Subject',
            partitions: partNames,
          });
        }
      });

      let studentTotalMarks = 0;
      let studentMaxMarks = 0;
      let allPassed = true;
      let allAbsent = true;
      let hasAnyEntry = false;
      let studentCentumCount = 0;

      const studentSubjects: any[] = [];
      const classGradeScales = (section.class as any)?.grade?.gradeScales || [];

      permittedExamSubjects.forEach((es) => {
        const partitions = es.examSubjectPartition || [];
        let hasPartitionEntry = false;
        let isSubjectAbsent = partitions.length > 0;
        let subjectMarkSum = 0;
        let isSubjectFailing = false;
        let absentOnCount = 0;
        let centum = true;

        const maxMark = Number(es.totalMarks || 100);
        const minMark =
          Number(es.minMark) > 0
            ? Number(es.minMark)
            : Math.round(maxMark * 0.35);

        studentMaxMarks += maxMark;

        const partitionMarks = partitions.map((partition: any) => {
          const markObj = partition.Mark?.find((m: any) => m.studentId === student.id);
          const partTotal = Number(partition.totalMarks) || 100;
          const partConvert = Number(partition.convertTo) || partTotal;
          const partMin =
            Number(partition.minMark) > 0
              ? Number(partition.minMark)
              : Math.round(partTotal * 0.35);

          if (markObj) {
            hasPartitionEntry = true;
            hasAnyEntry = true;
            const isAttAbsent = markObj.attandance === 1 || markObj.attandance === true;
            const markVal = Number(markObj.mark) || 0;

            if (markVal < partMin || isAttAbsent) {
              if (!partition.excludeSubjectValidation) {
                isSubjectFailing = true;
              }
            }

            if (isAttAbsent) {
              absentOnCount++;
            } else {
              isSubjectAbsent = false;
              allAbsent = false;
            }

            if (!isSubjectFailing && markVal !== partTotal) {
              centum = false;
            }

            const scaledMark = Math.round((markVal / partTotal) * partConvert);
            if (!isAttAbsent) {
              subjectMarkSum += scaledMark;
            }

            return {
              formatId: partition.assessmentFormatId,
              formatName: partition.assessmentFormat?.name || 'Part',
              mark: isAttAbsent ? null : scaledMark,
              rawMark: markVal,
              isAbsent: isAttAbsent,
              hasEntry: true,
            };
          } else {
            isSubjectAbsent = false;
            return {
              formatId: partition.assessmentFormatId,
              formatName: partition.assessmentFormat?.name || 'Part',
              mark: null,
              rawMark: null,
              isAbsent: false,
              hasEntry: false,
            };
          }
        });

        if (partitions.length > 0 && absentOnCount === partitions.length) {
          isSubjectAbsent = true;
        }

        if (subjectMarkSum < minMark) {
          isSubjectFailing = true;
        }

        const subjectPass = hasPartitionEntry && !isSubjectAbsent && !isSubjectFailing;
        if (!subjectPass) {
          allPassed = false;
        }

        studentTotalMarks += subjectMarkSum;

        const subjectGrade = getGradeFromScale(subjectMarkSum, classGradeScales);

        if (!isSubjectFailing && centum && partitions.length > 0 && hasPartitionEntry && !isSubjectAbsent) {
          studentCentumCount++;
        }

        studentSubjects.push({
          subjectId: es.subjectId,
          subjectName: es.subject?.name || 'Subject',
          marks: subjectMarkSum,
          subjectTotalMark: subjectMarkSum,
          totalMarks: maxMark,
          minMark,
          isPass: subjectPass,
          isAbsent: isSubjectAbsent && hasPartitionEntry,
          hasEntry: hasPartitionEntry,
          partitions: partitionMarks,
          grade: subjectGrade,
          centum,
        });
      });

      const percentage =
        studentMaxMarks > 0 ? Number(((studentTotalMarks / studentMaxMarks) * 100).toFixed(2)) : 0;
      const isStudentPassing = hasAnyEntry && !allAbsent && allPassed;
      const studentGrade = getGradeFromScale(percentage, classGradeScales);

      studentMarkListResult.push({
        id: student.id,
        name: studentFullName,
        gender,
        className: section.class?.name || '',
        sectionName: section.name || '',
        subjects: studentSubjects,
        totalMark: studentTotalMarks,
        maxTotalMark: studentMaxMarks,
        percentage,
        isPass: isStudentPassing,
        isAbsent: allAbsent && hasAnyEntry,
        hasEntry: hasAnyEntry,
        rank: null,
        grade: studentGrade,
        centumCount: studentCentumCount,
      });
    });

    // Calculate rank among passed students
    const passedStudents = studentMarkListResult
      .filter((s) => s.isPass)
      .sort((a, b) => b.totalMark - a.totalMark);

    let currentRank = 1;
    let prevTotal = -1;
    let rankSkip = 0;

    passedStudents.forEach((student) => {
      if (student.totalMark !== prevTotal) {
        currentRank += rankSkip;
        student.rank = currentRank;
        rankSkip = 1;
      } else {
        student.rank = currentRank;
        rankSkip++;
      }
      prevTotal = student.totalMark;
    });

    const grandSummary = {
      totalStudents: grandTotalStudents,
      appeared: grandAppeared,
      absent: grandAbsent,
      pending: grandPending,
      pass: grandPass,
      fail: grandFail,
      passPercentage: grandAppeared > 0 ? calculatePercentage(grandPass, grandAppeared) : 0,
      failPercentage: grandAppeared > 0 ? calculatePercentage(grandFail, grandAppeared) : 0,
      averageMark: grandAppeared > 0 ? Number((grandSumMarks / grandAppeared).toFixed(2)) : 0,
      highestMark: grandHighest,
      lowestMark: grandLowest === Infinity ? 0 : grandLowest,
    };

    return NextResponse.json({
      success: true,
      exam: { id: exam.id, name: exam.name },
      class: selectedClassDetails,
      section: selectedSectionDetails,
      summary: grandSummary,
      staffAnalytics: staffAnalyticsResult,
      studentMarkList: studentMarkListResult,
      subjectHeaders: Array.from(subjectHeaderMap.values()),
      isSectionIncharge: isUserInchargeOfSelectedSection,
      canViewOtherStaff: allowOtherStaff,
    });
  } catch (error: any) {
    captureException(error);
    return NextResponse.json(
      { error: error?.message || 'FAILED_TO_LOAD_STAFF_ANALYSIS' },
      { status: StatusCodes.INTERNAL_SERVER_ERROR }
    );
  }
}
