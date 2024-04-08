'use client';
import { useGetClassListQuery } from 'lib/queries/class/useGetClassListQuery';
import { useGetExamsByClassSectionQuery } from 'lib/queries/mark-entry/useGetExamsByClassSectionQuery';
import { useGetStaffsBySectionQuery } from 'lib/queries/mark-entry/useGetStaffsBySectionQuery';
import { useGetStudentsByClassSectionQuery } from 'lib/queries/mark-entry/useGetStudentsByClassSectionQuery';
import { useGetSubjectsWithFormatsQuery } from 'lib/queries/mark-entry/useGetSubjectsWithFormatsQuery';
import { useGetAllSectionByClassIdQuery } from 'lib/queries/section/useGetAllSectionsByClassIdQuery';
import { ChevronDown } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import {
  Button,
  Input,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from 'ui';

export function Assessment() {
  const page = 1;
  const limit = 999;
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const classId = searchParams.get('classId');
  const sectionId = searchParams.get('sectionId');
  const examId = searchParams.get('examId');
  const { register, handleSubmit } = useForm();
  const { data: classList } = useGetClassListQuery({
    page,
    limit,
  });
  const { data: sectionList } = useGetAllSectionByClassIdQuery(classId, {
    enabled: !!classId,
  });
  const { data: examList } = useGetExamsByClassSectionQuery(
    { classId, sectionId },
    {
      enabled: !!sectionId,
      queryKey: [],
    }
  );
  const { data: subjectsWithFormats } = useGetSubjectsWithFormatsQuery(
    { classId, sectionId, examId },
    {
      enabled: !!examId,
      queryKey: [],
    }
  );
  const { data: studentsList } = useGetStudentsByClassSectionQuery(
    { classId, sectionId },
    {
      enabled: !!sectionId,
      queryKey: [],
    }
  );
  const { data: staffsList } = useGetStaffsBySectionQuery(
    { sectionId },
    {
      enabled: !!sectionId,
      queryKey: [],
    }
  );

  function saveMarkEntry(payload) {
    // eslint-disable-next-line no-console
    console.log(payload);
  }

  return (
    <form onSubmit={handleSubmit(saveMarkEntry)}>
      <div className="mb-4 flex justify-between overflow-x-auto rounded-md bg-white">
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
              {staffsList?.map((staff) => (
                <SelectItem key={staff.id} value={staff.id}>
                  {staff.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        {/* <Select>
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
        </Select> */}
      </div>
      <div className="overflow-x-hidden">
        <div className="flex items-center justify-between bg-green-100 p-4 font-bold">
          <div className="w-1/4">Student</div>
          <div className="flex w-3/4 items-center justify-between space-x-4">
            {subjectsWithFormats?.map((subject, index) => (
              <div key={index} className="flex-1 bg-green-100 p-4">
                {subject.subject.name}
              </div>
            ))}
          </div>
        </div>

        {studentsList?.map((student, index) => (
          <div
            key={student.id}
            className="flex items-center justify-between bg-green-100 p-4"
          >
            <div className="w-1/4">
              {student.firstName} {student.middleName}
              {student.lastName}
              <input
                type="hidden"
                defaultValue={student.id}
                {...register(`studentIds[${index}].id`)}
              />
            </div>

            <div className="flex w-3/4 items-center justify-between space-x-4">
              {subjectsWithFormats?.map((subject, index) => (
                <div key={index} className="flex bg-green-100 p-1">
                  {subject.examConfiguration.map((format, formatIndex) => (
                    <div
                      key={format?.assessmentFormat?.id}
                      className="bl-1 bg-gray-100"
                    >
                      {format?.assessmentFormat?.name ? (
                        <Input
                          // key={format?.assessmentFormat?.id}
                          type="text"
                          placeholder={format?.assessmentFormat?.name}
                          {...register(
                            `assessmentFormatMarks[${index}].[${formatIndex + format?.assessmentFormat?.name}]`
                          )}
                        />
                      ) : null}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <Button className="text-center" type="submit">
        Submit
      </Button>
    </form>
  );
}
