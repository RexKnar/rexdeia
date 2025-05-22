import { useCallback } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from 'ui/components/ui/Table';

export default function MarkList({ markDetails }: { markDetails: any }) {
  const { subjectList, calculatedMarkList } = markDetails;

  const getExamSubjectPartitionBySubjectId = useCallback(
    (subjectsArray, subjectId) => {
      const subjectObject = subjectsArray.find(
        (subject) => subject.id === subjectId
      );

      if (subjectObject) {
        return subjectObject;
      } else {
        return null;
      }
    },
    []
  );

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableCell>#</TableCell>
          <TableCell>Exam Name</TableCell>
          {subjectList?.map((subject) => (
            <TableCell key={subject.subjectId}>{subject.subjectName}</TableCell>
          ))}
          <TableCell> Total</TableCell>
        </TableRow>
      </TableHeader>
      <TableBody>
        {calculatedMarkList?.map((examDetails, index) => {
          const { subjects: examSubjects } = examDetails;
          return (
            <TableRow key={examDetails.id}>
              <TableCell key={index}>{index + 1}</TableCell>
              <TableCell key={examDetails.id}>{examDetails?.name}</TableCell>
              {subjectList?.map((subject) => {
                const subjectMarks = getExamSubjectPartitionBySubjectId(
                  examSubjects,
                  subject.subjectId
                );
                return subjectMarks ? (
                  <TableCell key={subject.subjectId}>
                    <div className="flex justify-evenly">
                      {subjectMarks.marks?.map((mark) => {
                        mark.attandance ? (
                          <span
                            key={mark.id}
                            className="text-bold text-red-500 print:hidden"
                          >
                            A
                          </span>
                        ) : (
                          <span key={mark.id}>{mark.total}</span>
                        );
                      })}
                      {subjectMarks ? (
                        !subjectMarks.absentStatus ? (
                          <b>
                            {subjectMarks?.failingStatus ? (
                              <span className="text-red-500 print:p-0 print:text-sm">
                                {subjectMarks.subjectTotalMark || 0}(F)
                              </span>
                            ) : (
                              <span className="text-green-500 print:p-0 print:text-sm">
                                {subjectMarks.subjectTotalMark || 0}(P)
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
                  </TableCell>
                ) : (
                  <TableCell key={subject.subjectId}>-</TableCell>
                );
              })}
              <div>
                {examDetails?.failingStatus || examDetails?.totalMark == 0 ? (
                  <>
                    <p className="text-red-500 print:p-0 print:text-sm">(F)</p>
                    <p className="text-red-500 print:p-0 print:text-sm">
                      {examDetails.totalMark}(
                      {examDetails.totalPercentage?.toFixed(2)}%)
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-green-500 print:p-0 print:text-sm">
                      (P)
                    </p>
                    <p className="text-green-500 print:p-0 print:text-sm">
                      {examDetails.totalMark}(
                      {examDetails.totalPercentage?.toFixed(2)}%)
                    </p>
                  </>
                )}
              </div>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
