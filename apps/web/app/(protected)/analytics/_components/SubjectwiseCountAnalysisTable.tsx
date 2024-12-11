import { useGetExamSubjectMasterByClassSectionIdQuery } from 'lib/queries/exams/subject/useGetExamSubjectMasterByClassSectionIdQuery';
import { useEffect, useState } from 'react';
import { Text } from 'ui';
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from 'ui/components/ui/Table';

export default function SubjectwiseCountAnalysisTable({
  students,
  classId,
  examId,
  sectionId,
}: {
  students: any[];
  subjectCount: number;
  classId: string;
  sectionId?: string;
  examId: string;
}) {
  interface AnalyticsModel {
    numberOfPassStudents: { male: number; female: number; overall: number };
    numberOfFailStudents: { male: number; female: number; overall: number };
  }
  const [subjectCountWiseStatusCount, setSubjectCountWiseStatusCount] =
    useState([]);

  const { data: subjectMasterList } =
    useGetExamSubjectMasterByClassSectionIdQuery(
      sectionId ? { examId, classId, sectionId } : { examId, classId },
      { enabled: !!examId && !!classId }
    );

  useEffect(() => {
    let overallStatusCount = [];
    for (let i = 0; i < subjectMasterList?.length; i++) {
      let subjectWiseStatusCount: AnalyticsModel = {
        numberOfPassStudents: { male: 0, female: 0, overall: 0 },
        numberOfFailStudents: { male: 0, female: 0, overall: 0 },
      };

      students.forEach((student) => {
        if (student['subjectPassed'] == i + 1) {
          subjectWiseStatusCount['numberOfPassStudents'].overall++;
          subjectWiseStatusCount['numberOfPassStudents'][
            student['gender'].toLowerCase()
          ]++;
        }
        if (student['subjectFailed'] == i + 1) {
          subjectWiseStatusCount['numberOfFailStudents'].overall++;
          subjectWiseStatusCount['numberOfFailStudents'][
            student['gender'].toLowerCase()
          ]++;
        }
      });
      overallStatusCount.push({
        subjectCount: i + 1,
        ...subjectWiseStatusCount,
      });
    }

    setSubjectCountWiseStatusCount(overallStatusCount);
  }, [students, subjectMasterList]);

  return (
    subjectCountWiseStatusCount && (
      <section>
        <Table>
          <TableHeader>
            <TableRow className="mt-5 bg-green-100  text-center ">
              <TableCell></TableCell>
              <TableCell className="text-center font-semibold">
                Fail Count
              </TableCell>
              <TableCell>
                <Text className="size-lg font-semibold">Pass Count</Text>
              </TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {subjectCountWiseStatusCount.map((subject) => (
              <TableRow className="mt-5 text-center" key={subject.id}>
                <TableCell className="bg-primary-300">
                  <Text className="size-lg font-semibold">
                    {subject.subjectCount} Subject(s)
                  </Text>
                </TableCell>
                <TableCell className="">
                  <div className="flex flex-col justify-evenly">
                    <Text className="size-lg text-center font-semibold">
                      {subject.numberOfFailStudents.overall}
                    </Text>
                    <div className="flex justify-evenly">
                      <Text className="text-primary-800">
                        M: {subject.numberOfFailStudents.male}
                      </Text>
                      <Text className="text-primary-800">
                        F: {subject.numberOfFailStudents.female}
                      </Text>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="">
                  <div className="flex flex-col justify-evenly">
                    <Text className="size-lg text-center font-semibold">
                      {subject.numberOfPassStudents.overall}
                    </Text>
                    <div className="flex justify-evenly">
                      <Text className="text-primary-800">
                        M: {subject.numberOfPassStudents.male}
                      </Text>
                      <Text className="text-primary-800">
                        F: {subject.numberOfPassStudents.female}
                      </Text>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </section>
    )
  );
}
