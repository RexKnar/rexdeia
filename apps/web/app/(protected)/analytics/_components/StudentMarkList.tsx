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
                    </div>
                  </div>
                </TableCell>
              ))}
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
                            <span key={mark.id}>{mark.mark}</span>
                          )
                        )}
                      </div>
                    </div>
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
