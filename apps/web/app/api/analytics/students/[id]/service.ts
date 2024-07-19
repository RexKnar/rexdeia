import { getSubjectToStudentByGroupAndClassId } from 'app/api/group/[id]/subjects/service';
import { authOptions } from 'lib/auth';
import { db } from 'lib/db';
import { getServerSession } from 'next-auth';

export async function getStudentMarksById(
  id: string,
  sectionId: string,
  groupId?: string,
  classId?: string
) {
  const session = await getServerSession(authOptions);

  const examData = await db.examGroup.findMany({
    where: {
      sectionId: sectionId,
      exam: {
        batchId: session.currentBatch,
      },
    },
    select: {
      exam: {
        select: {
          name: true,
          batchId: true,
          id: true,
        },
      },
      examSubject: {
        select: {
          subject: true,
          subjectId: true,
          examSubjectPartition: {
            select: {
              minMark: true,
              totalMarks: true,
              convertTo: true,
              assessmentFormat: {
                select: {
                  name: true,
                  id: true,
                },
              },
              Mark: {
                where: {
                  studentId: id,
                },
              },
            },
          },
        },
      },
    },
  });

  const subjectList = await getSubjectToStudentByGroupAndClassId(
    groupId,
    classId
  );

  // console.log(`groupId:` + groupId, `classId` + classId);
  // function getSubjectMarksBySubjectId(subjectId: string, subjects: any) {
  //   return subjects.map((subject) => {});
  // }
  function getSubjectMarksBySubjectId(subjectId: string, subjects: any) {
    // console.log(subjects, subjectId);

    const data = subjects.find((subject) => subject.subjectId === subjectId);
    return data;
  }
  const transformedData = examData.map((group) => ({
    ...group,
    subjects: subjectList.map((subject) => {
      return getSubjectMarksBySubjectId(subject.subjectId, group.examSubject);
    }),
  }));

  return { markList: transformedData, subjectList };
}
