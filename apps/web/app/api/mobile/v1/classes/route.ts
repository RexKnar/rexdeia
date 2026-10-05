import { captureException } from '@sentry/nextjs';
import { StatusCodes } from 'http-status-codes';
import { db } from 'lib/db';
import { getAuthSession } from 'lib/mobile-auth';
import { NextRequest, NextResponse } from 'next/server';

const CLASS_ORDER: Record<string, number> = {
  'PRE-KG': 1,
  PREKG: 1,
  PRE_KG: 1,
  LKG: 2,
  'L.K.G': 2,
  UKG: 3,
  'U.K.G': 3,
  I: 4,
  '1': 4,
  II: 5,
  '2': 5,
  III: 6,
  '3': 6,
  IV: 7,
  '4': 7,
  V: 8,
  '5': 8,
  VI: 9,
  '6': 9,
  VII: 10,
  '7': 10,
  VIII: 11,
  '8': 11,
  IX: 12,
  '9': 12,
  X: 13,
  '10': 13,
  '10F': 13,
  XI: 14,
  '11': 14,
  XII: 15,
  '12': 15,
};

function sortClassesByName(a: { name: string }, b: { name: string }) {
  const normA = a.name.toUpperCase().trim();
  const normB = b.name.toUpperCase().trim();
  const orderA = CLASS_ORDER[normA] ?? 99;
  const orderB = CLASS_ORDER[normB] ?? 99;
  if (orderA !== orderB) return orderA - orderB;
  return a.name.localeCompare(b.name, undefined, { numeric: true });
}

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

    // Resolve staffId for teaching staff or user
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

    // Also support staffId query param if provided
    const { searchParams } = new URL(request.url);
    const paramStaffId = searchParams.get('staffId');
    if (paramStaffId) {
      staffId = paramStaffId;
    }

    // Determine current active academic batch
    const activeBatch = await db.batch.findFirst({
      where: {
        currentAcademicYear: true,
        AcademicSubjectForStaff: {
          some: { deletedAt: null },
        },
      },
      select: { id: true },
    });
    const currentBatchId = activeBatch?.id || session.currentBatch;

    // If staffId is resolved, fetch ONLY classes and sections assigned to this staff
    if (staffId) {
      // 1. Check for assignments in current active batch
      let staffAssignments = await db.academicSubjectForStaff.findMany({
        where: {
          staffId: staffId,
          deletedAt: null,
          ...(currentBatchId ? { academicYearId: currentBatchId } : {}),
        },
        select: {
          isIncharge: true,
          section: {
            select: {
              id: true,
              name: true,
              staffId: true,
              class: {
                select: { id: true, name: true, isActive: true },
              },
              _count: {
                select: {
                  studentMapping: {
                    where: {
                      isCurrent: true,
                      ...(currentBatchId ? { batchId: currentBatchId } : {}),
                    },
                  },
                },
              },
            },
          },
        },
      });

      // 2. If no assignments in currentBatchId, query all active assignments
      if (staffAssignments.length === 0) {
        staffAssignments = await db.academicSubjectForStaff.findMany({
          where: {
            staffId: staffId,
            deletedAt: null,
          },
          select: {
            isIncharge: true,
            section: {
              select: {
                id: true,
                name: true,
                staffId: true,
                class: {
                  select: { id: true, name: true, isActive: true },
                },
                _count: {
                  select: {
                    studentMapping: {
                      where: { isCurrent: true },
                    },
                  },
                },
              },
            },
          },
        });
      }

      // Group sections into unique classes
      const classMap = new Map<string, any>();

      for (const a of staffAssignments) {
        const cls = a.section?.class;
        if (!cls || !cls.isActive) continue;

        if (!classMap.has(cls.id)) {
          classMap.set(cls.id, {
            id: cls.id,
            name: cls.name,
            isActive: cls.isActive,
            assignedStudentsCount: 0,
            sectionsMap: new Map<string, any>(),
          });
        }

        const classEntry = classMap.get(cls.id);
        const sec = a.section;
        const count = sec._count?.studentMapping || 0;
        const isIncharge = a.isIncharge === true || sec.staffId === staffId;

        if (!classEntry.sectionsMap.has(sec.name)) {
          classEntry.sectionsMap.set(sec.name, {
            id: sec.id,
            name: sec.name,
            isClassIncharge: isIncharge,
            studentsCount: count,
          });
          classEntry.assignedStudentsCount += count;
        } else {
          if (isIncharge) {
            classEntry.sectionsMap.get(sec.name).isClassIncharge = true;
          }
        }
      }

      // Fetch class total students to match web app widget badge
      const transformed = await Promise.all(
        Array.from(classMap.values()).map(async (c) => {
          const totalInClass = await db.studentMapping.count({
            where: {
              classId: c.id,
              isCurrent: true,
              ...(currentBatchId ? { batchId: currentBatchId } : {}),
            },
          });

          return {
            id: c.id,
            name: c.name,
            isActive: c.isActive,
            studentsCount: totalInClass > 0 ? totalInClass : (c.assignedStudentsCount > 0 ? c.assignedStudentsCount : null),
            sections: Array.from(c.sectionsMap.values()).sort((a: any, b: any) =>
              a.name.localeCompare(b.name, undefined, { numeric: true })
            ),
          };
        })
      );

      transformed.sort(sortClassesByName);

      return NextResponse.json({ data: transformed });
    }

    // Fallback for Admin: return all active classes and their sections
    const allSections = await db.section.findMany({
      where: {
        isActive: true,
        isDeleted: false,
        ...(currentBatchId ? { academicYearId: currentBatchId } : {}),
      },
      orderBy: { name: 'asc' },
      select: {
        id: true,
        name: true,
        class: {
          select: { id: true, name: true, isActive: true },
        },
        _count: {
          select: {
            studentMapping: {
              where: {
                isCurrent: true,
                ...(currentBatchId ? { batchId: currentBatchId } : {}),
              },
            },
          },
        },
      },
    });

    const classMap = new Map<string, any>();
    for (const sec of allSections) {
      const cls = sec.class;
      if (!cls || !cls.isActive) continue;

      if (!classMap.has(cls.id)) {
        classMap.set(cls.id, {
          id: cls.id,
          name: cls.name,
          isActive: cls.isActive,
          assignedStudentsCount: 0,
          sectionsMap: new Map<string, any>(),
        });
      }

      const classEntry = classMap.get(cls.id);
      const count = sec._count?.studentMapping || 0;

      if (!classEntry.sectionsMap.has(sec.name)) {
        classEntry.sectionsMap.set(sec.name, {
          id: sec.id,
          name: sec.name,
          isClassIncharge: false,
          studentsCount: count,
        });
        classEntry.assignedStudentsCount += count;
      }
    }

    const transformed = await Promise.all(
      Array.from(classMap.values()).map(async (c) => {
        const totalInClass = await db.studentMapping.count({
          where: {
            classId: c.id,
            isCurrent: true,
            ...(currentBatchId ? { batchId: currentBatchId } : {}),
          },
        });

        return {
          id: c.id,
          name: c.name,
          isActive: c.isActive,
          studentsCount: totalInClass > 0 ? totalInClass : (c.assignedStudentsCount > 0 ? c.assignedStudentsCount : null),
          sections: Array.from(c.sectionsMap.values()).sort((a: any, b: any) =>
            a.name.localeCompare(b.name, undefined, { numeric: true })
          ),
        };
      })
    );

    transformed.sort(sortClassesByName);

    return NextResponse.json({ data: transformed });
  } catch (error: any) {
    captureException(error);
    return NextResponse.json(
      { error: error.message || 'INTERNAL_SERVER_ERROR' },
      { status: StatusCodes.INTERNAL_SERVER_ERROR }
    );
  }
}
