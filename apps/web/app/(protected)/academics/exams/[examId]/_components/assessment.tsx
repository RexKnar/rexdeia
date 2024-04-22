'use client';
import { useGetClassListQuery } from 'lib/queries/class/useGetClassListQuery';
import { useCreateMarkEntryQuery } from 'lib/queries/mark-entry/useCreateMarkEntryMutationQuery';
import { useGetExamsByClassSectionQuery } from 'lib/queries/mark-entry/useGetExamsByClassSectionQuery';
import { useGetStaffsBySectionQuery } from 'lib/queries/mark-entry/useGetStaffsBySectionQuery';
import { useGetSubjectsWithFormatsQuery } from 'lib/queries/mark-entry/useGetSubjectsWithFormatsQuery';
import { useGetAllSectionByClassIdQuery } from 'lib/queries/section/useGetAllSectionsByClassIdQuery';
import { ChevronDown, Loader2 } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import {
  Button,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from 'ui';
import { cn } from 'utils';

import { StudentRecords } from './SudentRecords';

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
  const columnColor = [
    'bg-green-100',
    'bg-red-100 ',
    'bg-primary-100 ',
    'bg-yellow-100 ',
    'bg-purple-100 ',
    'bg-green-100',
    'bg-red-100 ',
    'bg-primary-100 ',
    'bg-yellow-100 ',
    'bg-purple-100 ',
  ];

  const { control, register, handleSubmit } = useForm();

  const { data: classList } = useGetClassListQuery({
    page,
    limit,
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
  const { data: subjectsWithFormats } = useGetSubjectsWithFormatsQuery(
    { classId, sectionId, examId },
    {
      enabled: !!examId,
    }
  );
  const { data: staffList } = useGetStaffsBySectionQuery(
    { sectionId },
    {
      enabled: !!sectionId,
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
      <div className="w-auto overflow-x-scroll bg-green-100">
        <div className="flex items-center justify-between bg-green-100 p-4 font-bold ">
          <div className="w-1/5 flex-none">Student</div>
          {subjectsWithFormats?.map((subject, index) => (
            <div
              key={index}
              className={cn(
                'w-2/5 flex-none border-l-2 border-black bg-green-100 p-1 p-4',
                columnColor[index % 10]
              )}
            >
              {subject.subject.name}
            </div>
          ))}
        </div>

        <StudentRecords {...{ control, register }} />
      </div>

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
