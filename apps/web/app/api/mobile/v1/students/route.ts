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
    const { searchParams } = new URL(request.url);
    const classId = searchParams.get('classId');
    const sectionId = searchParams.get('sectionId');
    const search = searchParams.get('search')?.trim() || '';

    // Resolve staffId for teaching staff
    let staffId: string | null = (user as any).staffId || null;
    if (!staffId && user.role === 'TeachingStaff') {
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
        branchId: session.branchId,
      },
      select: { id: true },
    });
    const currentBatchId = activeBatch?.id || session.currentBatch;

    // Determine allowed section IDs for teaching staff
    let allowedSectionIds: string[] | null = null;
    if (staffId && user.role === 'TeachingStaff') {
      const staffAssignments = await db.academicSubjectForStaff.findMany({
        where: {
          staffId,
          deletedAt: null,
          ...(currentBatchId ? { academicYearId: currentBatchId } : {}),
        },
        select: {
          sectionId: true,
        },
      });

      const sectionIdSet = new Set(
        staffAssignments
          .map((a) => a.sectionId)
          .filter((id): id is string => Boolean(id))
      );

      // If no assignments found with currentBatchId, query all active assignments
      if (sectionIdSet.size === 0) {
        const allAssignments = await db.academicSubjectForStaff.findMany({
          where: {
            staffId,
            deletedAt: null,
          },
          select: {
            sectionId: true,
          },
        });
        allAssignments.forEach((a) => {
          if (a.sectionId) sectionIdSet.add(a.sectionId);
        });
      }

      allowedSectionIds = Array.from(sectionIdSet);
    }

    // If teacher has assigned sections, restrict query
    if (allowedSectionIds !== null && allowedSectionIds.length === 0) {
      return NextResponse.json({ success: true, data: [] });
    }

    const sectionFilter = sectionId
      ? sectionId
      : allowedSectionIds
      ? { in: allowedSectionIds }
      : undefined;

    const studentWhereCondition: any = {
      isDeleted: false,
      status: 'Active',
      branchId: session.branchId,
      organizationId: session.organizationId,
    };

    if (search) {
      studentWhereCondition.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { middleName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { emisNumber: { contains: search, mode: 'insensitive' } },
        { phoneNumber: { contains: search, mode: 'insensitive' } },
      ];
    }

    const mappings = await db.studentMapping.findMany({
      where: {
        isCurrent: true,
        ...(currentBatchId ? { batchId: currentBatchId } : {}),
        ...(classId ? { classId } : {}),
        ...(sectionFilter ? { sectionId: sectionFilter } : {}),
        student: studentWhereCondition,
      },
      include: {
        student: {
          select: {
            id: true,
            firstName: true,
            middleName: true,
            lastName: true,
            gender: true,
            status: true,
            emisNumber: true,
            phoneNumber: true,
            profileImage: true,
          },
        },
        class: {
          select: {
            id: true,
            name: true,
          },
        },
        section: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: [
        { class: { name: 'asc' } },
        { section: { name: 'asc' } },
        { rollNumber: 'asc' },
        { student: { firstName: 'asc' } },
      ],
      take: 200,
    });

    const data = mappings.map((m) => ({
      id: m.student.id,
      mappingId: m.id,
      name: [m.student.firstName, m.student.middleName, m.student.lastName]
        .filter(Boolean)
        .join(' ')
        .trim(),
      firstName: m.student.firstName,
      lastName: m.student.lastName,
      rollNo: m.rollNumber ? String(m.rollNumber) : '-',
      classId: m.classId,
      className: m.class?.name || '',
      sectionId: m.sectionId || '',
      sectionName: m.section?.name || '',
      status: (m.student.status as 'Active' | 'Inactive') || 'Active',
      gender: m.student.gender || '',
      emisNumber: m.student.emisNumber || '',
      phoneNumber: m.student.phoneNumber || null,
      profileImage: m.student.profileImage || null,
    }));

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    captureException(error);
    return NextResponse.json(
      { error: error.message || 'INTERNAL_SERVER_ERROR' },
      { status: StatusCodes.INTERNAL_SERVER_ERROR }
    );
  }
}
