import { authOptions } from 'lib/auth';
import { db } from 'lib/db';
import { getServerSession } from 'next-auth';

type GetExamConfigFilterModel = {
  examId?: string;
  classId?: string;
  sectionId?: string;
  staffId?: string;
};

type MarkEntryPermission = {
  canEnterMarks: boolean;
  message?: string;
};

async function checkMarkEntryPermission(
  examId: string,
  staffId: string | undefined,
  isIncharge: boolean,
  userRole: string
): Promise<MarkEntryPermission> {
  const currentDate = new Date();

  // Get exam configuration
  const examConfig = await db.exam.findUnique({
    where: { id: examId },
    select: {
      markEntryOpenDate: true,
      markEntryEndDate: true,
      markEntryCorrectionDate: true,
      blockMarkEntry: true,
      isActive: true,
    },
  });

  if (!examConfig) {
    return {
      canEnterMarks: false,
      message: 'Exam configuration not found',
    };
  }

  // Check if exam is active
  if (!examConfig.isActive) {
    return {
      canEnterMarks: false,
      message: 'Exam is not active',
    };
  }

  // Check if mark entry is globally blocked
  if (examConfig.blockMarkEntry) {
    // Allow admin to bypass blockMarkEntry
    if (userRole !== 'Admin') {
      return {
        canEnterMarks: false,
        message: 'Mark entry is currently blocked',
      };
    }
  }

  // Admin can enter marks anytime unless exam is inactive
  if (userRole === 'Admin') {
    return { canEnterMarks: true };
  }

  const { markEntryOpenDate, markEntryEndDate, markEntryCorrectionDate } =
    examConfig;

  // If no dates are set, only admin can enter marks
  if (!markEntryOpenDate || !markEntryEndDate) {
    return {
      canEnterMarks: false,
      message: 'Mark entry schedule has not been set',
    };
  }

  const now = currentDate.getTime();
  const openDate = markEntryOpenDate.getTime();
  const endDate = markEntryEndDate.getTime();
  const correctionDate = markEntryCorrectionDate?.getTime();

  if (isIncharge) {
    if (now < openDate) {
      return {
        canEnterMarks: false,
        message: 'Mark entry has not started yet',
      };
    }

    if (correctionDate && now > correctionDate) {
      return {
        canEnterMarks: false,
        message: 'Mark entry correction period has ended',
      };
    }

    if (!correctionDate && now > endDate) {
      return {
        canEnterMarks: false,
        message: 'Mark entry period has ended',
      };
    }
    return { canEnterMarks: true };
  }

  if (staffId) {
    if (now < openDate) {
      return {
        canEnterMarks: false,
        message: 'Mark entry has not started yet',
      };
    }
    if (now > endDate) {
      return {
        canEnterMarks: false,
        message: 'Mark entry period has ended',
      };
    }
    return { canEnterMarks: true };
  }

  return {
    canEnterMarks: false,
    message: 'Insufficient permissions',
  };
}

export async function getExamConfigWithSubjectPartion(
  filter: GetExamConfigFilterModel
) {
  const session = await getServerSession(authOptions);
  const { examId, classId, sectionId, staffId } = filter;

  const [isIncharge] = staffId
    ? await Promise.all([
        db.academicSubjectForStaff.findFirst({
          where: {
            staffId: staffId,
            isIncharge: true,
            sectionId: sectionId,
            academicYearId: session.currentBatch,
          },
        }),
      ])
    : [false];

  const permission = await checkMarkEntryPermission(
    examId!,
    staffId,
    Boolean(isIncharge),
    session.user.role
  );

  const [examConfig] = await Promise.all([
    db.studentMapping.findMany({
      where: {
        classId: classId,
        sectionId: sectionId,
        isCurrent: true,
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
                            sectionId: sectionId,
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
        rollNumber: true,
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
                exam: true,
                examId: true,
                examSubject: {
                  where: staffId
                    ? {
                        subject: {
                          academicSubjectForStaff: {
                            some: {
                              staffId: staffId,
                              sectionId: sectionId,
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
                  orderBy: [
                    {
                      subject: {
                        subjectOrder: 'asc',
                      },
                    },
                  ],
                },
              },
            },
          },
        },
      },
      orderBy: [
        {
          rollNumber: 'asc',
        },
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

  return {
    data: configResponse,
    permissions: permission,
  };
  // return configResponse;
}
