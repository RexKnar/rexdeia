import { db } from 'lib/db';

export async function getExamSubjectsByClassSectionId(
  examId: string,
  classId?: string,
  sectionId?: string
) {
  const response = await db.examSubject.findMany({
    where: {
      examGroup: {
        examId,
        classId,
        sectionId,
      },
    },
    orderBy: {
      subject: {
        subjectOrder: 'asc',
      },
    },
    select: {
      id: true,
      totalMarks: true,
      convertTo: true,
      minMark: true,
      examGroup: {
        select: {
          classId: true,
          sectionId: true,
          examId: true,
          exam: true,
        },
      },
      subject: {
        select: {
          id: true,
          name: true,
          subjectOrder: true,
          subjectMaster: true,
        },
      },
      examSubjectPartition: {
        include: {
          assessmentFormat: true,
        },
      },
    },
  });

  return response;
}

export async function getExamSubjectsByMaster(
  examId: string,
  classId?: string,
  sectionId?: string
) {
  const response = await db.examSubject.findMany({
    where: {
      examGroup: {
        examId,
        classId,
        sectionId,
      },
    },
    orderBy: {
      subject: {
        subjectOrder: 'asc',
      },
    },
    select: {
      id: true,
      totalMarks: true,
      convertTo: true,
      minMark: true,
      examGroup: {
        select: {
          classId: true,
          sectionId: true,
          examId: true,
          exam: true,
        },
      },
      subject: {
        select: {
          id: true,
          name: true,
          subjectOrder: true,
          subjectMaster: true,
        },
      },
      examSubjectPartition: {
        include: {
          assessmentFormat: true,
        },
      },
    },
  });

  // Group subjects by subjectMaster
  const groupedSubjects = response.reduce(
    (acc, examSubject) => {
      const subjectMasterId = examSubject.subject.subjectMaster.id;
      const subjectMasterName = examSubject.subject.subjectMaster.name;

      if (!acc[subjectMasterId]) {
        acc[subjectMasterId] = {
          id: subjectMasterId,
          name: subjectMasterName,
          subjects: [],
        };
      }

      acc[subjectMasterId].subjects.push({
        id: examSubject.id,
        name: examSubject.subject.name,
        totalMarks: examSubject.totalMarks,
        convertTo: examSubject.convertTo,
        minMark: examSubject.minMark,
        subjectOrder: examSubject.subject.subjectOrder,
        examSubjectPartition: examSubject.examSubjectPartition,
      });

      return acc;
    },
    {} as Record<string, { id: string; name: string; subjects: any[] }>
  );

  // Convert the grouped subjects object to an array
  return Object.values(groupedSubjects);
}
