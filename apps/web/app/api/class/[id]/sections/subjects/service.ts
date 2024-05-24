import { db } from 'lib/db';

export async function getSubjectsBySectionIds(sectionIds, classId) {
  const sectionToGroups = await db.sectionToGroups.findMany({
    where: {
      sectionId: {
        in: sectionIds,
      },
    },
    select: {
      sectionId: true,
      group: {
        select: {
          name: true,
          id: true,
          subjectToGroup: {
            where: { classId: classId },
            select: {
              subject: {
                include: {
                  subjectToAssessmentFormat: {
                    select: {
                      assessmentFormat: true,
                    },
                  },
                  subjectToGroup: {
                    select: {
                      group: true,
                    },
                  },
                  subjectToSubjectTypes: {
                    select: {
                      subjectType: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });
  const subjectsWithGroup = sectionToGroups
    .map((groupData) => {
      const groupInfo = {
        id: groupData.group.id,
        name: groupData.group.name,
        subject: groupData.group.subjectToGroup.map((subjectGroup) => ({
          id: subjectGroup.subject.id,
          name: subjectGroup.subject.name,
        })),
      };
      return groupInfo;
    })
    .flat();

  return subjectsWithGroup;
}
