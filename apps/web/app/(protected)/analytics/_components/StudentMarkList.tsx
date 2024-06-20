import { useGetExamSubjectsByClassSectionIdQuery } from 'lib/queries/exams/subject/useGetExamSubjectsByClassSectionIdQuery';
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
  const getMarkForSubject = (student, subjectId) => {
    const subject = student.subjects.find(
      (subject) => subject.id === subjectId
    );

    if (subject && subject.marks.length > 0) {
      return subject.marks;
    }
    return [];
  };
  const getSubjectTotalMark = (student, subjectId) => {
    const subject = student.subjects.find(
      (subject) => subject.id === subjectId
    );

    if (subject && subject.marks.length > 0) {
      return subject.subjectTotalMark;
    }
    return 0;
  };
  const { data: subjectList } = useGetExamSubjectsByClassSectionIdQuery(
    {
      examId,
      classId,
      sectionId,
    },
    {
      enabled: !!examId && !!classId && !!sectionId,
    }
  );

  return (
    <div>
      {subjectList && (
        <Table className="border-1 border">
          <TableHeader>
            <TableRow>
              <TableCell>Student Name </TableCell>
              {subjectList.map((subject) => (
                <TableCell key={subject.subject.id}>
                  <div className="w-full ">
                    <div className="text-center">
                      <Text className="size-lg font-semibold">
                        {subject.subject.name}
                      </Text>
                    </div>
                    <div className="flex justify-evenly">
                      {subject.examSubjectPartition.map((partition) => (
                        <span
                          className="size-lg font-semibold"
                          key={partition.id}
                        >
                          {partition.assessmentFormat.name}
                        </span>
                      ))}
                      <span>Tot</span>
                    </div>
                  </div>
                </TableCell>
              ))}
              <TableCell>Total</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.map((student) => (
              <TableRow key={student.id}>
                <TableCell>
                  {student.firstName} {student.lastName}
                </TableCell>
                {subjectList.map((subject) => (
                  <TableCell key={subject.subjectId}>
                    <div className="w-full">
                      <div className="flex justify-evenly">
                        {getMarkForSubject(student, subject.subject.id).map(
                          (mark) => (
                            <span key={mark.id}>{mark.total}</span>
                          )
                        )}

                        <b>
                          {getSubjectTotalMark(student, subject.subject.id) ||
                            0}
                        </b>
                      </div>
                    </div>
                  </TableCell>
                ))}
                <TableCell>
                  {student.failingStatus ? (
                    <span className="text-red-500">{student.totalMark}(F)</span>
                  ) : (
                    <span className="text-green-500">
                      {student.totalMark}(P)
                    </span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
