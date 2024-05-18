'use client';
import { useGetClassListQuery } from 'lib/queries/class/useGetClassListQuery';
import { useCreateMarkEntryQuery } from 'lib/queries/mark-entry/useCreateMarkEntryMutationQuery';
import { useGetExamsByClassSectionQuery } from 'lib/queries/mark-entry/useGetExamsByClassSectionQuery';
import { useGetMarkEntryFormStructureQuery } from 'lib/queries/mark-entry/useGetMarkEntryFormStructureQuery';
import { useGetStudentsMarksByClassIdExamIdQuery } from 'lib/queries/mark-entry/useGetMarkswithFormatbyExamQuery';
import { useGetStaffsBySectionQuery } from 'lib/queries/mark-entry/useGetStaffsBySectionQuery';
import { useGetAllSectionByClassIdQuery } from 'lib/queries/section/useGetAllSectionsByClassIdQuery';
import { ChevronDown, Loader2 } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import {
  Button,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from 'ui';

import { AssessmentSubjects } from './assessment-subjects';

export function Assessment() {
  const page = 1;
  const limit = 999;
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const classId = searchParams.get('classId');
  const filter = {};
  const sectionId = searchParams.get('sectionId');
  const examId = searchParams.get('examId');
  const staffId = searchParams.get('staffId');

  const { control, register, handleSubmit } = useForm();

  const { data: classList } = useGetClassListQuery({
    page,
    limit,
    filter,
  });
  const { data: sectionList } = useGetAllSectionByClassIdQuery(
    { classId, filter },
    {
      enabled: !!classId,
    }
  );
  const { data: examList } = useGetExamsByClassSectionQuery(
    { classId, sectionId },
    {
      enabled: !!sectionId,
    }
  );
  const { data: staffList } = useGetStaffsBySectionQuery(
    { sectionId },
    {
      enabled: !!sectionId,
    }
  );
  const {
    data: markEntryFormStructure,
    isLoading: isMarkEntryFormStructureLoading,
  } = useGetMarkEntryFormStructureQuery(
    { classId, examId },
    {
      enabled: !!examId,
    }
  );
  const { data: studentsMarks, isLoading: isStudentsMarksLoading } =
    useGetStudentsMarksByClassIdExamIdQuery(
      {
        classId,
        examId,
      },
      {
        enabled: !!examId,
      }
    );
  const {
    isPending: isPendingCreateMarkEntry,
    mutateAsync: mutateCreateMarkEntryAsync,
  } = useCreateMarkEntryQuery();
  async function saveMarkEntry(payload) {
    const markEntryPayload = {
      staffId: staffId,
      ...payload,
    };
    mutateCreateMarkEntryAsync(markEntryPayload);
  }

  const { fields: studentFields, append } = useFieldArray({
    control,
    name: 'studentsMarkDetails',
  });

  useEffect(() => {
    if (studentFields.length === 0 && markEntryFormStructure) {
      markEntryFormStructure?.forEach((studentDetail) => {
        append({
          studentId: studentDetail.id,
        });
      });
    }
  }, [markEntryFormStructure]);

  if (isMarkEntryFormStructureLoading) {
    return (
      <div className="flex items-center justify-center">
        <Loader2 className="mr-2 h-6 w-6 animate-spin text-black" />
        <p className="text-black ">Fetching FormData...</p>
      </div>
    );
  }

  if (isStudentsMarksLoading) {
    return (
      <div className="flex items-center justify-center">
        <Loader2 className="mr-2 h-6 w-6 animate-spin text-black" />
        <p className="text-black ">Fetching Students Mark...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(saveMarkEntry)}>
      <div className="mb-4 flex justify-between rounded-md bg-white">
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
            <SelectValue className="text-gray-400" placeholder="Class Name" />
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

        <Select
          onValueChange={(value) => {
            if (value) {
              const params = new URLSearchParams(searchParams);
              params.set('sectionId', value);
              router.replace(pathname + '?' + params.toString());
            }
          }}
        >
          <SelectTrigger className="ml-4 basis-1/5">
            <SelectValue className="text-gray-400" placeholder="Section" />
            <ChevronDown className="text-primary-400" />
          </SelectTrigger>
          <SelectContent className="border border-primary-200">
            <SelectGroup>
              {sectionList?.data?.map((section) => (
                <SelectItem key={section.id} value={section.id}>
                  {section.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

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
              {examList?.map((exam) => (
                <SelectItem key={exam.id} value={exam.id}>
                  {exam.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <Select
          onValueChange={(value) => {
            if (value) {
              const params = new URLSearchParams(searchParams);
              params.set('staffId', value);
              router.replace(pathname + '?' + params.toString());
            }
          }}
        >
          <SelectTrigger className="ml-4 basis-1/5">
            <SelectValue className="text-gray-400" placeholder="Staff Name" />
            <ChevronDown className="text-primary-400" />
          </SelectTrigger>
          <SelectContent className="border border-primary-200">
            <SelectGroup>
              {staffList?.map((staff) => (
                <SelectItem key={staff.id} value={staff.id}>
                  {staff.firstName} + {staff.lastName}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      {markEntryFormStructure ? (
        <table className="min-w-full divide-y divide-gray-200 shadow-md">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-black">
                Student
              </th>
              {markEntryFormStructure[0]?.subjects.map((subject) => (
                <th
                  key={subject.id}
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-black"
                >
                  {subject.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {studentFields.map((student, studentIndex) => {
              let studentDetailsIndex = studentsMarks?.length
                ? studentsMarks?.findIndex(
                    (obj) => obj.id === student['studentId']
                  )
                : null;
              const subjectDetail =
                studentDetailsIndex > -1
                  ? studentsMarks[studentDetailsIndex]?.subjects
                  : [];

              return (
                <tr key={student.id}>
                  <td className="whitespace-nowrap px-6 py-4">
                    {markEntryFormStructure[studentIndex]?.name}
                  </td>
                  <AssessmentSubjects
                    nestIndex={studentIndex}
                    subjects={markEntryFormStructure[studentIndex]?.subjects}
                    {...{ control, register }}
                    markEnteredSubjects={subjectDetail}
                  />
                </tr>
              );
            })}
          </tbody>
        </table>
      ) : (
        <div className="text-center">loading</div>
      )}

      <Button className="text-center" type="submit">
        {isPendingCreateMarkEntry ? (
          <div className="flex items-center justify-center">
            <Loader2 className="mr-2 h-6 w-6 animate-spin text-white" />
            Saving
          </div>
        ) : (
          'Submit'
        )}
      </Button>
    </form>
  );
}
