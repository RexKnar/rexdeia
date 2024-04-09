'use client';
import { useGetClassListQuery } from 'lib/queries/class/useGetClassListQuery';
import { useCreateMarkEntryQuery } from 'lib/queries/mark-entry/useCreateMarkEntryMutationQuery';
import { useGetExamsByClassSectionQuery } from 'lib/queries/mark-entry/useGetExamsByClassSectionQuery';
import { useGetSubjectsWithFormatsQuery } from 'lib/queries/mark-entry/useGetSubjectsWithFormatsQuery';
import { useGetAllSectionByClassIdQuery } from 'lib/queries/section/useGetAllSectionsByClassIdQuery';
import { ChevronDown } from 'lucide-react';
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
  const sectionId = searchParams.get('sectionId');
  const examId = searchParams.get('examId');
  // const staffId = searchParams.get('staffId');
  const staffId = '49294599-b381-4e62-9436-3e1aed6cf5b8';
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

  const { data: classList, isLoading: isClassListLoading } =
    useGetClassListQuery({
      page,
      limit,
    });
  const { data: sectionList, isLoading: isSectionLoading } =
    useGetAllSectionByClassIdQuery(classId, {
      enabled: !!classId,
    });
  const { data: examList, isLoading: isExamLoading } =
    useGetExamsByClassSectionQuery(
      { classId, sectionId },
      {
        enabled: !!sectionId,
      }
    );
  const { data: subjectsWithFormats, isPending: isSubjectsWithFormatsLoading } =
    useGetSubjectsWithFormatsQuery(
      { classId, sectionId, examId },
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
            <SelectValue className="text-gray-400" placeholder="Class Name" />{' '}
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
            <SelectValue className="text-gray-400" placeholder="Section" />{' '}
            <ChevronDown className="text-primary-400" />
          </SelectTrigger>
          <SelectContent className="border border-primary-200">
            {' '}
            <SelectGroup>
              {sectionList?.map((section) => (
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
            <SelectValue className="text-gray-400" placeholder="Exam" />{' '}
            <ChevronDown className="text-primary-400" />
          </SelectTrigger>
          <SelectContent className="border border-primary-200">
            {' '}
            <SelectGroup>
              {examList?.map((exam) => (
                <SelectItem key={exam.id} value={exam.id}>
                  {exam.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <Select>
          <SelectTrigger className="ml-4 basis-1/5">
            <SelectValue className="text-gray-400" placeholder="Staff Name" />{' '}
            <ChevronDown className="text-primary-400" />
          </SelectTrigger>
          <SelectContent className="border border-primary-200">
            {' '}
            <SelectGroup>
              <SelectItem value={'Value1'}>Value1</SelectItem>
              <SelectItem value={'Value2'}>Value2</SelectItem>
              <SelectItem value={'Value3'}>Value3</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

        <Select>
          <SelectTrigger className="ml-4 basis-1/5">
            <SelectValue className="text-gray-400" placeholder="Subject" />{' '}
            <ChevronDown className="text-primary-400" />
          </SelectTrigger>
          <SelectContent className="border border-primary-200">
            {' '}
            <SelectGroup>
              <SelectItem value={'Value1'}>Value1</SelectItem>
              <SelectItem value={'Value2'}>Value2</SelectItem>
              <SelectItem value={'Value3'}>Value3</SelectItem>
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
          {/* </div> */}
        </div>

        <StudentRecords {...{ control, register }} />
      </div>

      <Button className="text-center" type="submit">
        Submit
      </Button>
    </form>
  );
}
