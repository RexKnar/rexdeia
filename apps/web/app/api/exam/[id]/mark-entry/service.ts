import { db } from 'lib/db';

type GetExamConfigFilterModel = {
  examId?: string;
  classId?: string;
  sectionId?: string;
  staffId?: string;
};

export async function getExamConfigWithSubjectPartion(
  filter: GetExamConfigFilterModel
) {
  const { examId, classId, sectionId, staffId } = filter;
  const [examConfig] = await Promise.all([
    db.studentMapping.findMany({
      where: {
        classId: classId,
        sectionId: sectionId,
        section: {
          ExamGroup: {
            some: {
              examId: examId,
              examSubject: staffId
                ? {
                    some: {
                      subject: {
                        academicSubjectForStaff: {
                          some: {
                            staffId: staffId,
                          },
                        },
                      },
                    },
                  }
                : {},
            },
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
                  where: staffId
                    ? {
                        subject: {
                          academicSubjectForStaff: {
                            some: {
                              staffId: staffId,
                            },
                          },
                        },
                      }
                    : {},
                  select: {
                    id: true,
                    subject: {
                      include: {
                        academicSubjectForStaff: {
                          where: staffId
                            ? {
                                staffId: staffId,
                              }
                            : {},
                        },
                      },
                    },
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
      orderBy: [
        {
          student: {
            gender: 'desc',
          },
        },
        {
          student: {
            firstName: 'asc',
          },
        },
        {
          student: {
            lastName: 'asc',
          },
        },
      ],
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
