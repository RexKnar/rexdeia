import { useGetExamSubjectsByClassSectionIdQuery } from 'lib/queries/exams/subject/useGetExamSubjectsByClassSectionIdQuery';

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
        <table className="border-1 border">
          <thead>
            <tr>
              <th>Student Name</th>
              {subjectList.map((subject) => (
                <th key={subject.subject.id}>
                  <div>
                    <h1>{subject.subject.name}</h1>
                    <div className="flex">
                      {subject.examSubjectPartition.map((partition) => (
                        <span key={partition.id}>
                          {partition.assessmentFormat.name}
                        </span>
                      ))}
                      <div></div>
                    </div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id}>
                <td>
                  {student.firstName} {student.lastName}
                </td>
                {subjectList.map((subject) => (
                  <td key={subject.subjectId}>
                    <div>
                      <div className="flex">
                        {getMarkForSubject(student, subject.subject.id).map(
                          (mark) => (
                            <span key={mark.id}>{mark.mark}</span>
                          )
                        )}
                        <div></div>
                      </div>
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
