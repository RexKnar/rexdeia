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

  const uniqueSubjectsMap = new Map();

  const processedGroups = sectionToGroups
    .map((groupData) => {
      const group = {
        id: groupData.group.id,
        name: groupData.group.name,
        subject: [],
      };

      groupData.group.subjectToGroup.forEach((subjectGroup) => {
        const subject = {
          id: subjectGroup.subject.id,
          name: subjectGroup.subject.name,
        };

        if (!uniqueSubjectsMap.has(subject.id)) {
          group.subject.push(subject);
          uniqueSubjectsMap.set(subject.id, subject);
        }
      });

      return group;
    })

    .filter((group) => group.subject.length > 0);

  return processedGroups;
}
