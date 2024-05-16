'use client';

import { useGetStudentsMarksByClassIdAndExamIdQuery } from 'lib/queries/analytics/useGetStudentsMarksByClassIdAndExamIdQuery';
import { useGetClassListQuery } from 'lib/queries/class/useGetClassListQuery';
import { useGetExamsByClassSectionQuery } from 'lib/queries/mark-entry/useGetExamsByClassSectionQuery';
import { ChevronDown, Loader2 } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from 'ui';

import { useQueryParams } from '@/hooks/useQueryParams';

import admissionRequestIcon from '../../../../public/assets/images/admission-request.svg';
import { AnalyticsWidget } from './AnalyticsWidget';

const analyticsCardList = [
  {
    count: '87%',
    title: 'Pass Percentage',
    icon: admissionRequestIcon,
  },
  {
    count: '13%',
    title: 'Fail Percentage',
    icon: admissionRequestIcon,
  },
  {
    count: 1300,
    title: 'No Of Stu Attendant Exam',
    icon: admissionRequestIcon,
  },
  {
    count: 70,
    title: "No of didn't Attendant Exam",
    icon: admissionRequestIcon,
  },
];
export function StudentsMarks() {
  const { getParam } = useQueryParams();
  const classId = getParam('classId');
  const examId = getParam('examId');
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const page = 1;
  const limit = 999;
  const filter = {};

  const { data: classList } = useGetClassListQuery({
    page,
    limit,
    filter,
  });

  const { data: examListByClassId } = useGetExamsByClassSectionQuery(
    { classId },
    {
      enabled: !!classId,
    }
  );

  const { data: studentsMarks, isLoading: isStudentsMarksLoading } =
    useGetStudentsMarksByClassIdAndExamIdQuery(
      { classId, examId },
      {
        enabled: !!classId || !!examId,
      }
    );

  if (isStudentsMarksLoading) {
    return (
      <div className="flex items-center justify-center">
        <Loader2 className="mr-2 h-6 w-6 animate-spin text-black" />
        <p className="text-black ">Fetching Students Marks...</p>
      </div>
    );
  }
  return (
    <>
      <div className="flex justify-between p-5">
        {analyticsCardList.map((analytics, index) => (
          <AnalyticsWidget
            key={index}
            icon={analytics.icon}
            title={analytics.title}
            count={analytics.count}
          />
        ))}
      </div>
      <div className="flex">
        <div className="width-auto flex-auto text-start">
          {classList ? (
            <Select
              onValueChange={(value) => {
                if (value) {
                  const params = new URLSearchParams(searchParams);
                  params.set('classId', value);
                  router.replace(pathname + '?' + params.toString());
                }
              }}
            >
              <SelectTrigger className="ml-0 basis-1/5">
                <SelectValue
                  className="text-gray-400"
                  placeholder="Class Name"
                />
                <ChevronDown className="text-primary-400" />
              </SelectTrigger>
              <SelectContent className="border border-primary-200">
                <SelectGroup>
                  {classList?.data?.map((classDetails) => (
                    <SelectItem key={classDetails.id} value={classDetails.id}>
                      {classDetails.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          ) : (
            <span className="text-center">loading...</span>
          )}
        </div>
        <div className="width-auto flex-auto text-start">
          {examListByClassId ? (
            <Select
              onValueChange={(value) => {
                if (value) {
                  const params = new URLSearchParams(searchParams);
                  params.set('examId', value);
                  router.replace(pathname + '?' + params.toString());
                }
              }}
            >
              <SelectTrigger className="ml-4 basis-1/5">
                <SelectValue className="text-gray-400" placeholder="Exam" />
                <ChevronDown className="text-primary-400" />
              </SelectTrigger>
              <SelectContent className="border border-primary-200">
                <SelectGroup>
                  {examListByClassId?.map((exam) => (
                    <SelectItem key={exam.id} value={exam.id}>
                      {exam.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          ) : (
            <span className="text-center">loading...</span>
          )}
        </div>
      </div>

      <table className="min-w-full divide-y divide-gray-200 shadow-md">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-black">
              Student
            </th>
            {studentsMarks[0].subjects.map((subject) => (
              <th
                key={subject.subjectId}
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-black"
              >
                {subject.subjectName}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {studentsMarks.map((student) => (
            <tr key={student.studentId}>
              <td className="whitespace-nowrap px-6 py-4">
                {student.studentName}
              </td>
              {student.subjects.map((subject) => (
                <td
                  key={subject.subjectId}
                  className="whitespace-nowrap px-6 py-4"
                >
                  {subject.marks.length === 0 ? (
                    <div className="text-sm text-gray-900">-</div>
                  ) : (
                    subject.marks.map((mark, index) => (
                      <div key={index} className="text-sm text-gray-900">
                        {mark.assessmentFormat.name} : {mark.mark}
                      </div>
                    ))
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
