import { db } from 'lib/db';

type GetExamConfigFilterModel = {
  examId?: string;
  classId?: string;
  sectionId?: string;
};

export async function getExamConfigWithSubjectPartion(
  filter: GetExamConfigFilterModel
) {
  const { examId, classId, sectionId } = filter;
  const [examConfig] = await Promise.all([
    db.studentMapping.findMany({
      where: {
        classId: classId,
        sectionId: sectionId,
        section: {
          ExamGroup: {
            some: { examId: examId },
          },
        },
      },
      select: {
        student: {
          select: {
            id: true,
            firstName: true,
            middleName: true,
            lastName: true,
          },
        },
        section: {
          select: {
            id: true,
            name: true,
            ExamGroup: {
              where: {
                examId: examId,
              },
              select: {
                id: true,
                examId: true,
                examSubject: {
                  select: {
                    id: true,
                    subject: true,
                    examSubjectPartition: {
                      include: {
                        assessmentFormat: true,
                        Mark: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    }),
  ]);
  const configResponse = examConfig.map((examData) => {
    const [examGroup] = examData.section.ExamGroup;
    const examSubject = examGroup.examSubject.map((subject) => ({
      ...subject,
      examSubjectPartition: subject.examSubjectPartition.map((partition) => {
        const [mark] = partition.Mark.filter(
          (mark) =>
            mark.studentId === examData.student.id &&
            mark.examSubjectPartitionId === partition.id
        );
        return {
          ...partition,
          Mark: mark || null,
        };
      }),
    }));
    const student = {
      ...examData.student,
      examSubjects: examSubject,
    };
    return student;
  });

  return configResponse;
}
