import { getSubjectToStudentByGroupAndClassId } from 'app/api/group/[id]/subjects/service';
import { authOptions } from 'lib/auth';
import { db } from 'lib/db';
import { getServerSession } from 'next-auth';

export async function getStudentMarksById(
  studentId: string,
  sectionId: string,
  groupId?: string,
  classId?: string
) {
  const session = await getServerSession(authOptions);

  const examData = await db.examGroup.findMany({
    where: {
      sectionId: sectionId,
      classId: classId,
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
                  studentId: studentId,
                },
              },
            },
          },
        },
      },
    },
  });

  const subjectListResponse = await getSubjectToStudentByGroupAndClassId(
    groupId,
    classId
  );

  const subjectList = subjectListResponse.map((subjectMap) => ({
    subjectId: subjectMap.subject.id,
    subjectName: subjectMap.subject.name,
    subjectOrder: subjectMap.subject.subjectOrder,
    subjectMasterId: subjectMap.subject.subjectMasterId,
  }));

  let subjectCount = 0;
  const calculatedMarkList = examData.map((examDetails: any) => {
    const { examSubject } = examDetails;
    const studentDetail = { ...examDetails.exam };
    let subjectPassed = 0;
    let subjectFailed = 0;

    let totalMark = 0;
    let actualTotalMarks = 0;
    let subjectMasters = [];
    let attendance = false;
    let centumCount = 0;

    const subjects = examSubject.map((examSubject) => {
      const examSubjectPartition = examSubject.examSubjectPartition;

      let subjectTotalMark = 0;
      let failingStatus = false;
      let failingOn = [];
      let absentStatus = true;
      let absentOn = [];
      let centum = true;

      if (!subjectMasters.includes(examSubject.subject.subjectMasterId)) {
        subjectMasters.push(examSubject.subject.subjectMasterId);
      }
      const marks = examSubjectPartition.reduce((acc, partition) => {
        const subjectMarks = partition.Mark.filter(
          (subjectMark) => subjectMark.studentId === studentId
        );
        actualTotalMarks += Number(partition.convertTo);

        subjectMarks.forEach((mark) => {
          if (mark) {
            absentStatus = false;
            if (
              Number(mark.mark) < Number(partition.minMark) ||
              mark.attandance
            ) {
              failingStatus = true;
              failingOn.push(partition.assessmentFormat.name);
            }
            if (mark.attandance) {
              absentOn.push(partition.assessmentFormat.name);
            } else {
              attendance = true;
            }
            const markValue = Number(mark.mark);
            const totalMarksValue = Number(partition.totalMarks);

            if (!failingStatus && markValue !== totalMarksValue) {
              centum = false;
            }

            const actualMark =
              (Number(mark.mark) / Number(partition.totalMarks)) *
              Number(partition.convertTo);
            subjectTotalMark += Math.round(actualMark);
            mark['total'] = Math.round(actualMark);
            mark['entryStatus'] = true;
            mark['centum'] = centum;
          } else {
            mark['entryStatus'] = false;
            mark['total'] = 0;
          }
          mark['subjectName'] = examSubject.subject.name;
          mark['subjectId'] = examSubject.subject.id;
          acc.push(mark);
        });

        return acc;
      }, []);

      if (failingStatus) {
        subjectFailed++;
      } else {
        subjectPassed++;
      }

      if (marks.length == absentOn.length) {
        absentStatus = true;
      }
      totalMark += subjectTotalMark;

      const subject = {
        ...examSubject.subject,
        marks,
        subjectTotalMark,
        absentStatus,
        absentOn,
        failingStatus,
        failingOn,
        centum,
        subjectPassed,
        subjectFailed,
      };

      if (!subject.absentStatus) attendance = true;
      if (!failingStatus && centum) {
        centumCount++;
      }
      return subject;
    });
    subjectCount =
      subjectCount < subjects.length ? subjects.length : subjectCount;
    studentDetail['subjectMasterCount'] = subjectMasters.length;
    studentDetail['subjects'] = subjects;
    studentDetail['centumCount'] = centumCount;
    studentDetail['totalMark'] = totalMark;
    studentDetail['totalAverage'] = totalMark / subjectMasters.length;
    studentDetail['subjectPassed'] = subjectPassed;
    studentDetail['subjectFailed'] = subjectFailed;
    studentDetail['failingStatus'] = subjectFailed > 0 ? true : false;
    studentDetail['totalPercentage'] = (totalMark / actualTotalMarks) * 100;
    studentDetail['attendance'] = attendance;

    return studentDetail;
  });

  return { calculatedMarkList, subjectList };
}
