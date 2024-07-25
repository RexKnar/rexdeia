import { useGetExamSubjectsByClassSectionIdQuery } from 'lib/queries/exams/subject/useGetExamSubjectsByClassSectionIdQuery';
import { useCallback } from 'react';
import { Text } from 'ui';
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from 'ui/components/ui/Table';

export default function StudentMarkList({
  students,
  classId,
  examId,
  sectionId,
}: {
  students: any[];
  classId: string;
  sectionId?: string;
  examId: string;
}) {
  const { data: subjectList } = useGetExamSubjectsByClassSectionIdQuery(
    sectionId ? { examId, classId, sectionId } : { examId, classId },
    { enabled: !!examId && !!classId }
  );

  const getStudentSubject = useCallback((student, subjectId) => {
    return student.subjects.find((subject) => subject.id === subjectId);
  }, []);

  const renderStudentRow = (student, index) => {
    return (
      <TableRow key={student.id}>
        <TableCell className="text-center print:p-0">{index + 1}</TableCell>
        <TableCell className="sticky print:p-0">
          {student.firstName} {student.lastName}
        </TableCell>
        {subjectList.map((subject) => {
          const studentDetail = getStudentSubject(student, subject.subject.id);

          return (
            <TableCell key={subject.subjectId} className="w:1/3 print:p-0">
              <div className="w-full">
                <div className="flex justify-evenly ">
                  {studentDetail?.marks.map((mark) =>
                    mark.attandance ? (
                      <span
                        key={mark.id}
                        className="text-bold text-red-500 print:hidden"
                      >
                        A
                      </span>
                    ) : (
                      <span className="print:hidden" key={mark.id}>
                        {mark.total}
                      </span>
                    )
                  )}

                  {studentDetail?.marks?.length > 0 ? (
                    !studentDetail.absentStatus ? (
                      <b>
                        {studentDetail?.failingStatus ? (
                          <span className="text-red-500 print:p-0 print:text-sm">
                            {studentDetail.subjectTotalMark || 0}
                            (F)
                          </span>
                        ) : (
                          <span className="text-green-500 print:p-0 print:text-sm">
                            {studentDetail?.subjectTotalMark || 0}
                            (P)
                          </span>
                        )}
                      </b>
                    ) : (
                      <span className="text-red-500 print:p-0 print:text-sm">
                        A
                      </span>
                    )
                  ) : (
                    '-'
                  )}
                </div>
              </div>
            </TableCell>
          );
        })}
        <TableCell>
          {student.failingStatus ? (
            <>
              <p className="text-red-500 print:p-0 print:text-sm">(F)</p>
              <p className="text-red-500 print:p-0 print:text-sm">
                {student.totalMark}({student.totalPercentage?.toFixed(2)}%)
              </p>
            </>
          ) : (
            <>
              <p className="text-green-500 print:p-0 print:text-sm">(P)</p>
              <p className="text-green-500 print:p-0 print:text-sm">
                {student.totalMark}({student.totalPercentage?.toFixed(2)}%)
              </p>
            </>
          )}
        </TableCell>
        <TableCell className="text-center print:p-0">
          {student.rank || '-'}

          <br />
          {!student.attendance && (
            <span className="text-red-500 print:p-0 print:text-sm">A</span>
          )}
        </TableCell>
      </TableRow>
    );
  };

  return (
    <section>
      {subjectList && (
        <div className="mt-4 space-y-4 overflow-x-auto rounded-md bg-white p-6 print:m-0 print:p-0 ">
          <Table className="border-1 border">
            <TableHeader>
              <TableRow className="bg-primary-300">
                <TableCell>
                  <Text className="text-center text-lg font-semibold print:text-sm">
                    #{' '}
                  </Text>
                </TableCell>
                <TableCell>
                  <Text className="text-lg font-semibold print:text-sm">
                    Student Name{' '}
                  </Text>
                </TableCell>
                {subjectList.map((subject) => (
                  <TableCell key={subject.subject.id}>
                    <div className="w-full ">
                      <div className="text-center">
                        <Text className="size-lg font-semibold print:text-sm">
                          {subject.subject.name}
                        </Text>
                      </div>
                      <div className="flex justify-evenly print:hidden">
                        {subject.examSubjectPartition.map((partition) => (
                          <span
                            className="size-lg font-semibold print:text-sm"
                            key={partition.id}
                          >
                            {partition.assessmentFormat.name}
                          </span>
                        ))}
                        <span className="print:hidden">Tot</span>
                      </div>
                    </div>
                  </TableCell>
                ))}
                <TableCell>
                  <Text className="text-xs font-semibold">Total </Text>
                </TableCell>
                <TableCell>Rank</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>{students.map(renderStudentRow)}</TableBody>
          </Table>
        </div>
      )}
    </section>
  );
}
