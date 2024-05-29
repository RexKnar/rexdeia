import { db } from 'lib/db';

export async function getSubjectsBySectionIds(
  classId,
  sectionIds,
  subjectTypeId
) {
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
            where: {
              classId: classId,
              subject: {
                subjectToSubjectTypes: {
                  some: {
                    subjectTypeId: subjectTypeId,
                  },
                },
              },
            },
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
                  subjectToSubjectTypes: true,
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
