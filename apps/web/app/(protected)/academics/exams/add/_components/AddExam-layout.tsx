'use client';
import { useGetBatchesListQuery } from 'lib/queries/batches/useGetBatchesListQuery';
import { useGetExamTypeListQuery } from 'lib/queries/exams/useGetExamTypeListQuery';
import { useGetSubjectListByFilter } from 'lib/queries/exams/useGetSubjectByFilterQuery';
import { useGetTermsListQuery } from 'lib/queries/exams/useGetTermListQuery';
import { useGetSubjectTypeList } from 'lib/queries/subject-type/useGetSubjectTypeQuery';
import { Loader2 } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import {
  Input,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from 'ui';

import { useGetClassListQuery } from '../../../../../../lib/queries/class/useGetClassListQuery';
import { useGetAllSectionByClassIdQuery } from '../../../../../../lib/queries/section/useGetAllSectionsByClassIdQuery';
import { ExamCard } from './ExamCard';

export function AddExamLayout() {
  const page = 1;
  const limit = 999;
  const searchParams = useSearchParams();
  const classId = searchParams.get('classId');
  const sectionId = searchParams.get('sectionId');
  const subjectTypeId = searchParams.get('subjectTypeId');

  const { data: examTypeList } = useGetExamTypeListQuery({
    page,
    limit,
  });

  const { data: termsList } = useGetTermsListQuery({
    page,
    limit,
  });

  const { data: academicYears } = useGetBatchesListQuery({
    page,
    limit,
  });

  const { data: classList, isLoading: isClassListLoading } =
    useGetClassListQuery({
      page,
      limit,
    });
  const { data: sectionListResponse, isLoading: isSectionListLoading } =
    useGetAllSectionByClassIdQuery(classId, {
      enabled: !!classId,
    });

  const { data: subjectTypeListResponse, isLoading: isSubjectTypeListLoading } =
    useGetSubjectTypeList({
      page,
      limit,
    });
  const {
    data: getSubjectByFilterResponse,
    isPending: isPendingSubjectListResponse,
    mutateAsync: mutateGetSubjectAsync,
  } = useGetSubjectListByFilter();

  useEffect(() => {
    if (subjectTypeId) {
      const payload = {
        subjectTypeId: subjectTypeId,
        sectionId: sectionId,
      };
      mutateGetSubjectAsync(payload).catch((error) => {
        console.error(error);
      });
    }
  }, [subjectTypeId, sectionId, mutateGetSubjectAsync]);

  return (
    <>
      <section className="mb-4 flex flex-row gap-5 rounded-md bg-white p-4">
        <div className="basis-1/4">
          <label htmlFor="exam" className="text-sm font-semibold text-gray-700">
            Exam Name
          </label>
          <Input placeholder="Exam Name" />
        </div>
        <div className=" basis-1/4">
          <label
            htmlFor="academicYear"
            className="text-sm font-semibold text-gray-700"
          >
            Academic Year
          </label>
          <Select>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {academicYears?.data?.map((academicYear) => (
                  <SelectItem key={academicYear.id} value={academicYear.id}>
                    {academicYear.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className=" basis-1/4">
          <label htmlFor="Term" className="text-sm font-semibold text-gray-700">
            Term
          </label>
          <Select>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {termsList?.data?.map((term) => (
                  <SelectItem key={term.id} value={term.id}>
                    {term.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className=" basis-1/4">
          <label
            htmlFor="Exam Type"
            className="text-sm font-semibold text-gray-700"
          >
            Exam Type
          </label>
          <Select>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {examTypeList?.data?.map((examType) => (
                  <SelectItem key={examType.id} value={examType.id}>
                    {examType.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </section>
      <section className="flex h-screen flex-row gap-1 rounded-xl bg-white p-1">
        <div className="basis-1/4 rounded-l-lg bg-gray-50 text-center">
          <div className="p-2">Class</div>
          {!isClassListLoading ? (
            <div className="">
              {classList?.data.map((cardData) => (
                <ExamCard examProps={cardData} key={cardData.id} />
              ))}
            </div>
          ) : (
            <div className="flex justify-center pt-36 ">
              <Loader2 className="mr-2 h-6 w-6 animate-spin text-black" />
              <p className="text-black ">Fetching Classes...</p>
            </div>
          )}
        </div>
        <div className="basis-1/4 bg-red-50 text-center">
          <div className="p-2">Section</div>
          {!isSectionListLoading ? (
            <div>
              {sectionListResponse?.map((cardData) => (
                <ExamCard examProps={cardData} key={cardData.id} />
              ))}
            </div>
          ) : (
            <div className="flex justify-center pt-36">
              <Loader2 className="mr-2 h-6 w-6 animate-spin text-black" />
              <p className="text-black ">Fetching Sections...</p>
            </div>
          )}
        </div>
        <div className="basis-1/4 bg-blue-50 text-center">
          <div className="p-2">Subject Type</div>
          <div>
            {sectionId ? (
              <div>
                {!isSubjectTypeListLoading ? (
                  <div>
                    {subjectTypeListResponse?.data.map((cardData) => (
                      <ExamCard examProps={cardData} key={cardData.id} />
                    ))}
                  </div>
                ) : (
                  <div className="flex justify-center pt-36">
                    <Loader2 className="mr-2 h-6 w-6 animate-spin text-black" />
                    <p className="text-black ">Fetching Sections...</p>
                  </div>
                )}
              </div>
            ) : null}
          </div>
        </div>
        <div className="basis-1/4 bg-slate-200 text-center">
          <div className="p-2">Subject</div>
          <div>
            {!isPendingSubjectListResponse ? (
              <div>
                {getSubjectByFilterResponse?.data.map((cardData) => (
                  <ExamCard examProps={cardData} key={cardData.id} />
                ))}
              </div>
            ) : (
              <div className="flex justify-center pt-36">
                <Loader2 className="mr-2 h-6 w-6 animate-spin text-black" />
                <p className="text-black ">Fetching Subjects...</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
