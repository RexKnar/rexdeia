'use client';

/* eslint-disable react-hooks/exhaustive-deps */
import { useGetClassListQuery } from 'lib/queries/class/useGetClassListQuery';
import { useGetMarkWithMarkEntryQuery } from 'lib/queries/exams/mark-entry/useGetMarkWithMarkEntryQuery';
import { useNewMarkEntryQuery } from 'lib/queries/exams/mark-entry/useNewMarkEntryQuery';
import { useGetExamsBySectionIdQuery } from 'lib/queries/exams/useGetExamBySectionIdQuery';
import { useGetStaffsBySectionQuery } from 'lib/queries/mark-entry/useGetStaffsBySectionQuery';
import { useGetAllSectionByClassIdQuery } from 'lib/queries/section/useGetAllSectionsByClassIdQuery';
import { ChevronDown, Loader2 } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import {
  Button,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
  useToast,
} from 'ui';

import { ExamSubjects } from './ExamSubjects';

export function MarkEntryLayout() {
  const { data: session } = useSession();
  const [userRole, setUserRole] = useState<string>('User');
  const [userId, setUserId] = useState<string>('');

  const { toast } = useToast();
  const page = 1;
  const limit = 999;

  const filter = {};

  const [classId, setClassId] = useState('');
  const [sectionId, setSectionId] = useState('');
  const [examId, setExamId] = useState('');
  const [staffId, setStaffId] = useState('');
  const [markEntryResponse, setMarkEntryResponse] = useState([]);

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
  const { data: examList } = useGetExamsBySectionIdQuery(
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

  const { data: markEntryConfigResponse, isLoading: isMarkEntryConfigLoading } =
    useGetMarkWithMarkEntryQuery(
      { classId, examId, sectionId, staffId },
      {
        enabled: !!examId,
      }
    );

  const {
    isSuccess: isMarkEntrySuccess,
    isPending: isPendingCreateMarkEntry,
    mutateAsync: mutateNewMarkEntryAsync,
  } = useNewMarkEntryQuery();

  useEffect(() => {
    if (isMarkEntrySuccess) {
      toast({
        title: 'Success',
        variant: 'default',
        description: 'Mark Entered successfully',
      });
    }
  }, [isMarkEntrySuccess, toast]);

  useEffect(() => {
    if (session?.user?.role) {
      setUserRole(session?.user?.role);
      setUserId(session?.user?.id);
    }
    if (session?.user?.role !== 'Admin') {
      setStaffId(session?.user?.staffId);
    }
  }, [session]);

  async function submitMarkEntry(payload) {
    const markEntryPayload = {
      userId: userId,
      ...payload,
    };
    mutateNewMarkEntryAsync(markEntryPayload);
  }
  useEffect(() => {
    setMarkEntryResponse(markEntryConfigResponse);
  }, [markEntryConfigResponse]);

  const {
    fields: studentFields,
    append,
    remove,
  } = useFieldArray({
    control,
    name: 'studentsMarkDetails',
  });

  useEffect(() => {
    remove();
    if (markEntryResponse) {
      markEntryResponse?.forEach((studentDetail) => {
        append({
          studentId: studentDetail.id,
          userId,
          name: `${studentDetail.firstName} ${studentDetail.middleName} ${studentDetail.lastName}`,
        });
      });
    }
  }, [markEntryResponse]);

  useEffect(() => {
    setExamId('');
  }, [classId, sectionId]);

  useEffect(() => {
    setExamId('');
    setSectionId('');
  }, [classId]);

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
    }
  };

  return (
    <>
      <div className="mb-4 flex justify-between rounded-md bg-white">
        <Select
          onValueChange={(value) => {
            setClassId(value);
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
            setSectionId(value);
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
            setExamId(value);
          }}
        >
          <SelectTrigger className="ml-4 basis-1/5">
            <SelectValue className="text-gray-400" placeholder="Exam" />
            <ChevronDown className="text-primary-400" />
          </SelectTrigger>
          <SelectContent className="border border-primary-200">
            <SelectGroup>
              <SelectItem value="1">Select a Exam</SelectItem>
              {examList?.map((exam) => (
                <SelectItem key={exam.id} value={exam.id}>
                  {exam.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        {userRole === 'Admin' ? (
          <Select
            onValueChange={(value) => {
              setStaffId(value);
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
                    {staff.firstName} {staff.lastName}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        ) : null}
      </div>
      <form onSubmit={handleSubmit(submitMarkEntry)} onKeyDown={handleKeyDown}>
        {!isMarkEntryConfigLoading ? (
          <>
            {markEntryResponse?.length ? (
              <table className="min-w-full divide-y divide-gray-200 shadow-md">
                <thead className="bg-gray-50">
                  <tr>
                    <th>#</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-black">
                      Student
                    </th>
                    {markEntryResponse[0]?.examSubjects.map((examSubject) => (
                      <th
                        key={examSubject.id}
                        className="justify-start px-6 py-3 text-start text-xs font-medium uppercase tracking-wider text-black"
                      >
                        <div className="border-1 flex w-full space-x-2 border border-b-primary-200">
                          <p className="flex-1 text-center ">
                            {examSubject.subject.name}
                          </p>
                        </div>
                        <div className="flex w-full space-x-2">
                          {examSubject.examSubjectPartition
                            .filter(
                              (config) => config.assessmentFormat !== null
                            )
                            .map((formatItem, index) => {
                              return (
                                <div key={index} className="flex-1 text-center">
                                  {formatItem.assessmentFormat.name || ''}
                                </div>
                              );
                            })}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {studentFields.map((student, studentIndex) => {
                    return (
                      <tr key={student.id}>
                        <td>{studentIndex + 1}</td>
                        <td className="whitespace-nowrap px-6 py-4">
                          {student['name']}
                        </td>
                        <ExamSubjects
                          nestIndex={studentIndex}
                          examSubjects={
                            markEntryResponse[studentIndex]?.examSubjects
                          }
                          {...{ control, register }}
                        />
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <div className="flex items-center justify-center">
                <p className="text-black ">No Data Found</p>
              </div>
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
          </>
        ) : (
          <div className="flex items-center justify-center">
            <Loader2 className="mr-2 h-6 w-6 animate-spin text-black" />
            <p className="text-black ">Fetching Data...</p>
          </div>
        )}
      </form>
    </>
  );
}
