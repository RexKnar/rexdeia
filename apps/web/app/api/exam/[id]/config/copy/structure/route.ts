import { authOptions } from 'lib/auth';
import { db } from 'lib/db';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params: { id } }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new NextResponse(JSON.stringify({ error: 'UNAUTHORIZED' }), {
      status: 401,
    });
  }

  try {
    // 1. Get current exam to find its batchId (academic year)
    const exam = await db.exam.findUnique({
      where: { id },
      select: { batchId: true },
    });

    if (!exam) {
      return new NextResponse(JSON.stringify({ error: 'Exam not found' }), {
        status: 404,
      });
    }

    const { batchId } = exam;

    // 2. Get all sections for this batchId with class details
    const sections = await db.section.findMany({
      where: {
        academicYearId: batchId,
        isDeleted: false,
        isActive: true,
        class: {
          branchId: session.branchId,
          isDeleted: false,
        },
      },
      include: {
        class: true,
        sectionToGroups: {
          include: {
            group: {
              include: {
                subjectToGroup: {
                  where: {
                    subject: {
                      isDeleted: false,
                    },
                  },
                  include: {
                    subject: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: [
        {
          class: {
            name: 'asc',
          },
        },
        {
          name: 'asc',
        },
      ],
    });

    // 3. Flatten this into class, section, subject list
    const items: any[] = [];
    for (const section of sections) {
      const classId = section.class.id;
      const className = section.class.name;
      const sectionId = section.id;
      const sectionName = section.name;

      // Collect subjects from all groups in this section
      const seenSubjectIds = new Set<string>();
      for (const sToG of section.sectionToGroups) {
        if (!sToG.group) continue;
        for (const subToG of sToG.group.subjectToGroup) {
          if (!subToG.subject || seenSubjectIds.has(subToG.subject.id)) continue;
          seenSubjectIds.add(subToG.subject.id);

          items.push({
            classId,
            className,
            sectionId,
            sectionName,
            subjectId: subToG.subject.id,
            subjectName: subToG.subject.name,
            key: `${classId}:${sectionId}:${subToG.subject.id}`,
          });
        }
      }
    }

    return new NextResponse(JSON.stringify(items), {
      status: 200,
    });
  } catch (e: any) {
    return new NextResponse(JSON.stringify({ error: e.message }), {
      status: 500,
    });
  }
}
