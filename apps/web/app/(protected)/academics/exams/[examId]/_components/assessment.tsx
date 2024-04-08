'use client';
import { useGetClassListQuery } from 'lib/queries/class/useGetClassListQuery';
import { useGetExamsByClassSectionQuery } from 'lib/queries/mark-entry/useGetExamsByClassSectionQuery';
import { useGetStudentsByClassSectionQuery } from 'lib/queries/mark-entry/useGetStudentsByClassSectionQuery';
// import { useGetSubjectsWithFormatsQuery } from 'lib/queries/mark-entry/useGetSubjectsWithFormatsQuery';
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

  const subjectsWithFormats = [
    {
      id: '8a0d03d1-e016-488c-84b6-6c1b49d4a2e4',
      subject: {
        name: 'Tamil',
        id: '8ab473d1-a744-423f-89c7-1c47e7af5362',
      },
      examConfiguration: [
        {
          minPassMark: 27,
          markToConduct: 75,
          markToConvert: 75,
          assessmentFormat: {
            id: 'e3584f0c-37f7-41b0-a9ce-884773102ba2',
            name: 'Theory',
            isActive: true,
            hasMarkEntry: true,
            parentId: null,
            branchId: '491d705d-67ca-4b27-9546-6237ab9f3057',
            isDeleted: false,
            createdAt: '2024-04-05T06:28:03.176Z',
            updatedAt: '2024-04-05T06:28:03.176Z',
          },
        },
        {
          minPassMark: 35,
          markToConduct: 100,
          markToConvert: 100,
          assessmentFormat: null,
        },
      ],
    },
    {
      id: '69313600-1ba1-4b07-ac91-57e831d6b3d1',
      subject: {
        name: 'English',
        id: '5e34064a-83dc-4464-b5a6-f939146e7ec4',
      },
      examConfiguration: [
        {
          minPassMark: 27,
          markToConduct: 75,
          markToConvert: 75,
          assessmentFormat: {
            id: 'e3584f0c-37f7-41b0-a9ce-884773102ba2',
            name: 'Theory',
            isActive: true,
            hasMarkEntry: true,
            parentId: null,
            branchId: '491d705d-67ca-4b27-9546-6237ab9f3057',
            isDeleted: false,
            createdAt: '2024-04-05T06:28:03.176Z',
            updatedAt: '2024-04-05T06:28:03.176Z',
          },
        },
        {
          minPassMark: 35,
          markToConduct: 100,
          markToConvert: 100,
          assessmentFormat: null,
        },
      ],
    },
    {
      id: 'f3d90dba-66a3-4150-9ca0-c9806d5858a0',
      subject: {
        name: 'Maths',
        id: 'efcc9c13-4cee-4ba2-a506-6671b2330c22',
      },
      examConfiguration: [
        {
          minPassMark: 27,
          markToConduct: 75,
          markToConvert: 75,
          assessmentFormat: {
            id: 'e3584f0c-37f7-41b0-a9ce-884773102ba2',
            name: 'Theory',
            isActive: true,
            hasMarkEntry: true,
            parentId: null,
            branchId: '491d705d-67ca-4b27-9546-6237ab9f3057',
            isDeleted: false,
            createdAt: '2024-04-05T06:28:03.176Z',
            updatedAt: '2024-04-05T06:28:03.176Z',
          },
        },
        {
          minPassMark: 13,
          markToConduct: 25,
          markToConvert: 25,
          assessmentFormat: {
            id: '5cd2fbab-72f3-40df-9250-5a13858e5a98',
            name: 'Practical',
            isActive: true,
            hasMarkEntry: true,
            parentId: null,
            branchId: '491d705d-67ca-4b27-9546-6237ab9f3057',
            isDeleted: false,
            createdAt: '2024-04-05T06:28:18.050Z',
            updatedAt: '2024-04-05T06:28:18.050Z',
          },
        },
        {
          minPassMark: 35,
          markToConduct: 100,
          markToConvert: 100,
          assessmentFormat: null,
        },
      ],
    },
    {
      id: '62469e39-e1d4-4ff2-b921-e12ab1fa71c3',
      subject: {
        name: 'Science',
        id: '38210791-a2d8-4b86-b047-2efc62c8e921',
      },
      examConfiguration: [
        {
          minPassMark: 27,
          markToConduct: 75,
          markToConvert: 75,
          assessmentFormat: {
            id: 'e3584f0c-37f7-41b0-a9ce-884773102ba2',
            name: 'Theory',
            isActive: true,
            hasMarkEntry: true,
            parentId: null,
            branchId: '491d705d-67ca-4b27-9546-6237ab9f3057',
            isDeleted: false,
            createdAt: '2024-04-05T06:28:03.176Z',
            updatedAt: '2024-04-05T06:28:03.176Z',
          },
        },
        {
          minPassMark: 13,
          markToConduct: 25,
          markToConvert: 25,
          assessmentFormat: {
            id: '5cd2fbab-72f3-40df-9250-5a13858e5a98',
            name: 'Practical',
            isActive: true,
            hasMarkEntry: true,
            parentId: null,
            branchId: '491d705d-67ca-4b27-9546-6237ab9f3057',
            isDeleted: false,
            createdAt: '2024-04-05T06:28:18.050Z',
            updatedAt: '2024-04-05T06:28:18.050Z',
          },
        },
        {
          minPassMark: 35,
          markToConduct: 100,
          markToConvert: 100,
          assessmentFormat: null,
        },
      ],
    },
    {
      id: 'd4aadfd8-8478-4424-98b5-d4f35e6f64d1',
      subject: {
        name: 'Physics',
        id: '87c27d5a-e47a-4ae8-bf36-b960aabdc50f',
      },
      examConfiguration: [
        {
          minPassMark: 27,
          markToConduct: 75,
          markToConvert: 75,
          assessmentFormat: {
            id: 'e3584f0c-37f7-41b0-a9ce-884773102ba2',
            name: 'Theory',
            isActive: true,
            hasMarkEntry: true,
            parentId: null,
            branchId: '491d705d-67ca-4b27-9546-6237ab9f3057',
            isDeleted: false,
            createdAt: '2024-04-05T06:28:03.176Z',
            updatedAt: '2024-04-05T06:28:03.176Z',
          },
        },
        {
          minPassMark: 13,
          markToConduct: 25,
          markToConvert: 25,
          assessmentFormat: {
            id: '5cd2fbab-72f3-40df-9250-5a13858e5a98',
            name: 'Practical',
            isActive: true,
            hasMarkEntry: true,
            parentId: null,
            branchId: '491d705d-67ca-4b27-9546-6237ab9f3057',
            isDeleted: false,
            createdAt: '2024-04-05T06:28:18.050Z',
            updatedAt: '2024-04-05T06:28:18.050Z',
          },
        },
        {
          minPassMark: 35,
          markToConduct: 100,
          markToConvert: 100,
          assessmentFormat: null,
        },
      ],
    },
    {
      id: 'dfe2bcc2-dc7a-4ce7-b678-eeedbdd2879a',
      subject: {
        name: 'Zoology',
        id: '9004af94-f02a-4432-90f8-47b8e978ac72',
      },
      examConfiguration: [
        {
          minPassMark: 27,
          markToConduct: 75,
          markToConvert: 75,
          assessmentFormat: {
            id: 'e3584f0c-37f7-41b0-a9ce-884773102ba2',
            name: 'Theory',
            isActive: true,
            hasMarkEntry: true,
            parentId: null,
            branchId: '491d705d-67ca-4b27-9546-6237ab9f3057',
            isDeleted: false,
            createdAt: '2024-04-05T06:28:03.176Z',
            updatedAt: '2024-04-05T06:28:03.176Z',
          },
        },
        {
          minPassMark: 35,
          markToConduct: 100,
          markToConvert: 100,
          assessmentFormat: null,
        },
      ],
    },
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
        queryKey: [],
      }
    );
  // const { data: subjectsWithFormats, isPending: isSubjectsWithFormatsLoading } =
  //   useGetSubjectsWithFormatsQuery(
  //     { classId, sectionId, examId },
  //     {
  //       enabled: !!examId,
  //       queryKey: [],
  //     }
  //   );
  const { data: studentsList, isPending: isStudentListPending } =
    useGetStudentsByClassSectionQuery(
      { classId, sectionId },
      {
        enabled: !!sectionId,
        queryKey: [],
      }
    );
  function saveMarkEntry(payload) {
    console.log(payload);
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
            {/* <SelectGroup>
              {examList?.map((exam) => (
                <SelectItem key={exam.exam.id} value={exam.exam.id}>
                  {exam.exam.name}
                </SelectItem>
              ))}
            </SelectGroup> */}
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
      <div className="w-auto overflow-x-scroll">
        <div className="flex items-center justify-between bg-green-100 p-4 font-bold ">
          <div className="w-1/5 flex-none">Student</div>
          {/* <div className="flex items-center justify-between w-auto space-x-4 "> */}
          {subjectsWithFormats?.map((subject, index) => (
            <div key={index} className="w-2/5 flex-none bg-green-100 p-4 ">
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
