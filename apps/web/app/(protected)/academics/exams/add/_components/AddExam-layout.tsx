'use client';
import { Loader2 } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
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

  const { data: classList, isLoading: isClassListLoading } =
    useGetClassListQuery({
      page,
      limit,
    });
  const { data: sectionListResponse, isLoading: isSectionListLoading } =
    useGetAllSectionByClassIdQuery(classId, {
      enabled: !!classId,
    });

  return (
    <>
      <section className="mb-4 flex flex-row gap-5 rounded-md bg-white p-4">
        <Input placeholder="Exam Name" className="basis-1/4" />
        <Select>
          <SelectTrigger className=" basis-1/4">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value={'Value1'}>Value1</SelectItem>
              <SelectItem value={'Value2'}>Value2</SelectItem>
              <SelectItem value={'Value3'}>Value3</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <Select>
          <SelectTrigger className=" basis-1/4">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value={'Value1'}>Value1</SelectItem>
              <SelectItem value={'Value2'}>Value2</SelectItem>
              <SelectItem value={'Value3'}>Value3</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <Select>
          <SelectTrigger className=" basis-1/4">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value={'Value1'}>Value1</SelectItem>
              <SelectItem value={'Value2'}>Value2</SelectItem>
              <SelectItem value={'Value3'}>Value3</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </section>
      <section className="flex h-screen flex-row gap-1 rounded-xl bg-white p-1">
        <div className="basis-1/6 rounded-l-lg bg-gray-50 text-center">
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
        <div className="basis-1/6 bg-red-50 text-center">
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
        <div className="basis-1/6 bg-green-50 text-center">
          <div className="p-2">Curriculam</div>
          <div>
            <ExamCard examProps="Curriculam1" />
            <ExamCard examProps="Curriculam2" />
            <ExamCard examProps="Curriculam3" />
          </div>
        </div>
        <div className="basis-1/6 bg-blue-50 text-center">
          <div className="p-2">Category</div>
          <div>
            <ExamCard examProps="Category1" />
            <ExamCard examProps="Category2" />
            <ExamCard examProps="Category3" />
            <ExamCard examProps="Category4" />
            <ExamCard examProps="Category5" />
          </div>
        </div>
        <div className="basis-1/6 bg-slate-200 text-center">
          <div className="p-2">FA</div>
          <div>
            <ExamCard examProps="FA1" />
            <ExamCard examProps="FA2" />
            <ExamCard examProps="FA3" />
          </div>
        </div>
        <div className="basis-1/6 rounded-r-lg bg-white text-center">
          <div className="p-2">Configaration</div>
        </div>
      </section>
    </>
  );
}
