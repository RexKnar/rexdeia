import { captureException } from '@sentry/nextjs';
import { StatusCodes } from 'http-status-codes';
import { db } from 'lib/db';
import { getAuthSession } from 'lib/mobile-auth';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const session = await getAuthSession(request);
  if (!session?.user?.id) {
    return NextResponse.json(
      { error: 'UNAUTHORIZED' },
      { status: StatusCodes.UNAUTHORIZED }
    );
  }

  try {
    const user = session.user;
    const branchId = session.branchId;

    // Resolve staffId if teaching staff
    let staffId: string | null = (user as any).staffId || null;
    if (!staffId) {
      const staffRecord = await db.staff.findFirst({
        where: {
          OR: [
            ...(user.id ? [{ userId: user.id }] : []),
            ...(user.email ? [{ email: user.email }] : []),
          ],
        },
        select: { id: true },
      });
      staffId = staffRecord?.id || null;
    }

    // Determine current active academic batch
    const activeBatch = await db.batch.findFirst({
      where: {
        currentAcademicYear: true,
        AcademicSubjectForStaff: {
          some: { deletedAt: null },
        },
      },
      select: { id: true, name: true },
    });
    const currentBatchId = activeBatch?.id || session.currentBatch;

    // Fetch assigned sections, classes, and subjects for this staff
    let assignedSectionIds: string[] = [];
    let assignedClassIds: string[] = [];
    let handledSubjectIds: string[] = [];

    if (staffId) {
      let staffAssignments = await db.academicSubjectForStaff.findMany({
        where: {
          staffId,
          deletedAt: null,
          ...(currentBatchId ? { academicYearId: currentBatchId } : {}),
        },
        select: {
          sectionId: true,
          subjectId: true,
          section: {
            select: {
              id: true,
              classId: true,
            },
          },
        },
      });

      if (staffAssignments.length === 0) {
        staffAssignments = await db.academicSubjectForStaff.findMany({
          where: {
            staffId,
            deletedAt: null,
          },
          select: {
            sectionId: true,
            subjectId: true,
            section: {
              select: {
                id: true,
                classId: true,
              },
            },
          },
        });
      }

      assignedSectionIds = Array.from(new Set(staffAssignments.map((a) => a.sectionId).filter(Boolean)));
      assignedClassIds = Array.from(new Set(staffAssignments.map((a) => a.section?.classId).filter(Boolean)));
      handledSubjectIds = Array.from(new Set(staffAssignments.map((a) => a.subjectId).filter(Boolean))) as string[];
    }

    // Fetch active exams for this batch and branch
    const exams = await db.exam.findMany({
      where: {
        branchId,
        isDeleted: false,
        isActive: true,
        ...(currentBatchId ? { batchId: currentBatchId } : {}),
      },
      include: {
        examType: { select: { id: true, name: true } },
        term: { select: { id: true, name: true } },
        batch: { select: { id: true, name: true } },
        examGroup: {
          select: {
            id: true,
            classId: true,
            sectionId: true,
            class: { select: { id: true, name: true } },
            section: { select: { id: true, name: true } },
            examSubject: {
              select: {
                id: true,
                subject: { select: { id: true, name: true } },
                _count: { select: { Mark: true } },
              },
            },
          },
        },
      },
      orderBy: [
        { markEntryEndDate: 'asc' },
        { createdAt: 'desc' },
      ],
    });

    const now = new Date();

    const formattedExams = exams.map((exam) => {
      const openDate = exam.markEntryOpenDate ? new Date(exam.markEntryOpenDate) : null;
      const endDate = exam.markEntryEndDate ? new Date(exam.markEntryEndDate) : null;
      const correctionDate = exam.markEntryCorrectionDate ? new Date(exam.markEntryCorrectionDate) : null;

      let status: 'UPCOMING' | 'ONGOING' | 'CORRECTION' | 'COMPLETED' = 'ONGOING';
      let daysRemaining: number | null = null;
      let isUrgent = false;

      if (endDate) {
        const diffMs = endDate.getTime() - now.getTime();
        daysRemaining = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
        isUrgent = daysRemaining <= 3 && daysRemaining >= 0;
      }

      if (openDate && now < openDate) {
        status = 'UPCOMING';
      } else if (endDate && now > endDate) {
        if (correctionDate && now <= correctionDate) {
          status = 'CORRECTION';
        } else {
          status = 'COMPLETED';
        }
      } else {
        status = 'ONGOING';
      }

      const relevantGroups = staffId && assignedSectionIds.length > 0
        ? exam.examGroup.filter((g) => assignedSectionIds.includes(g.sectionId))
        : exam.examGroup;

      const classesMap = new Map<string, string>();
      const sectionsList: { id: string; name: string; className: string; classId: string }[] = [];
      let totalMarksEntered = 0;

      exam.examGroup.forEach((g) => {
        if (g.class) classesMap.set(g.class.id, g.class.name);
        if (g.section && g.class) {
          sectionsList.push({
            id: g.section.id,
            name: g.section.name,
            className: g.class.name,
            classId: g.class.id,
          });
        }
        g.examSubject.forEach((es) => {
          totalMarksEntered += es._count?.Mark || 0;
        });
      });

      return {
        id: exam.id,
        name: exam.name,
        termName: exam.term?.name || 'General',
        examTypeName: exam.examType?.name || 'Standard Exam',
        batchName: exam.batch?.name || '',
        isActive: exam.isActive,
        blockMarkEntry: exam.blockMarkEntry,
        markEntryOpenDate: exam.markEntryOpenDate,
        markEntryEndDate: exam.markEntryEndDate,
        markEntryCorrectionDate: exam.markEntryCorrectionDate,
        status,
        daysRemaining,
        isUrgent,
        classesCount: classesMap.size,
        sectionsCount: sectionsList.length,
        classesSummary: Array.from(classesMap.values()).slice(0, 3).join(', '),
        isAssignedToStaff: relevantGroups.length > 0,
        totalMarksEntered,
        firstClassId: relevantGroups[0]?.classId || exam.examGroup[0]?.classId || null,
        firstSectionId: relevantGroups[0]?.sectionId || exam.examGroup[0]?.sectionId || null,
      };
    });

    const ongoingExams = formattedExams.filter(
      (e) => e.status === 'ONGOING' || e.status === 'CORRECTION'
    );

    const upcomingDeadlines = formattedExams
      .filter((e) => e.markEntryEndDate && (e.daysRemaining === null || e.daysRemaining >= -1))
      .sort((a, b) => {
        const da = a.daysRemaining ?? 999;
        const db = b.daysRemaining ?? 999;
        return da - db;
      });

    // Calculate responsible students count (students in their assigned sections/classes)
    let assignedStudentsCount = 0;
    if (assignedSectionIds.length > 0) {
      assignedStudentsCount = await db.studentMapping.count({
        where: {
          sectionId: { in: assignedSectionIds },
          isCurrent: true,
          ...(currentBatchId ? { batchId: currentBatchId } : {}),
          student: {
            isDeleted: false,
            status: 'Active',
            branchId,
          },
        },
      });
    } else if (!staffId) {
      // Non-staff/admin fallback to branch total
      assignedStudentsCount = await db.studentMapping.count({
        where: {
          isCurrent: true,
          ...(currentBatchId ? { batchId: currentBatchId } : {}),
          student: {
            isDeleted: false,
            status: 'Active',
            branchId,
          },
        },
      });
    }

    const assignedClassesCount = assignedClassIds.length > 0
      ? assignedClassIds.length
      : (!staffId ? await db.class.count({ where: { branchId, isActive: true } }) : 0);

    const assignedSectionsCount = assignedSectionIds.length > 0
      ? assignedSectionIds.length
      : (!staffId ? await db.section.count({ where: { class: { branchId, isActive: true } } }) : 0);

    const subjectsHandledCount = handledSubjectIds.length > 0
      ? handledSubjectIds.length
      : (!staffId ? await db.subject.count({ where: { branchId, isActive: true } }) : 0);

    return NextResponse.json({
      success: true,
      data: {
        batchName: activeBatch?.name || 'Current Academic Year',
        metrics: {
          assignedClassesCount,
          assignedSectionsCount,
          subjectsHandledCount,
          assignedStudentsCount,
          ongoingExamsCount: ongoingExams.length,
          pendingDeadlinesCount: upcomingDeadlines.length,
        },
        ongoingExams,
        upcomingDeadlines,
        recentExams: formattedExams.slice(0, 6),
      },
    });
  } catch (error: any) {
    captureException(error);
    return NextResponse.json(
      { error: error.message || 'FAILED_TO_FETCH_ANALYTICS' },
      { status: StatusCodes.INTERNAL_SERVER_ERROR }
    );
  }
}
