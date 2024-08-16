'use client';

import { useGetClassListQuery } from 'lib/queries/class/useGetClassListQuery';
import { useGetExamsBySectionIdQuery } from 'lib/queries/exams/useGetExamBySectionIdQuery';
import { useGetAllSectionByClassIdQuery } from 'lib/queries/section/useGetAllSectionsByClassIdQuery';
import { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from 'ui';

import StaffAnalysisTable from './StaffAnalysisTable';

export function StaffAnalysis() {
  const page = 1;
  const limit = 999;
  const filter = {};
  const [classId, setClassId] = useState('');
  const [sectionId, setSectionId] = useState('');
  const [examId, setExamId] = useState('');

  const { data: examList } = useGetExamsBySectionIdQuery(
    sectionId ? { classId, sectionId } : { classId },
    {
      enabled: !!classId,
    }
  );

  const { data: classList } = useGetClassListQuery({
    page,
    limit,
    filter,
  });
  const { data: sectionList } = useGetAllSectionByClassIdQuery(
    {
      filter,
      classId,
    },
    {
      enabled: !!classId,
    }
  );

  return (
    <>
      <section className="space-y-2 rounded-md bg-white p-6">
        <div className="flex gap-4">
          <div className="w-4/12">
            <label className="mt-1 block text-sm text-gray-700">Class</label>
            <Select
              autoComplete="off"
              onValueChange={(value) => {
                setSectionId(null);
                setExamId(null);
                setClassId(value);
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {classList?.data?.map((item) => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="w-4/12">
            <label className="mt-1 block text-sm text-gray-700">Section</label>
            <Select
              autoComplete="off"
              onValueChange={(value) => {
                setExamId(null);
                setSectionId(value === 'all' ? null : value);
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="all">All</SelectItem>
                  {sectionList?.data?.map((item) => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="w-4/12">
            <label className="mt-1 block text-sm text-gray-700">Exam</label>
            <Select
              autoComplete="off"
              onValueChange={(value) => {
                setExamId(value === 'all' ? null : value);
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="all">Reset</SelectItem>
                  {examList?.map((item) => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>
      <Tabs defaultValue="sectionAnalytics" className="border-0 ">
        <TabsList className="w-full justify-start border-b-2 border-gray-100">
          <TabsTrigger
            value="sectionAnalytics"
            className="mr-2 text-base focus:border-b-4 focus:border-primary print:hidden"
          >
            Staff-Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent className="w-full" value="sectionAnalytics">
          <section>
            <StaffAnalysisTable
              examId={examId}
              classId={classId}
              sectionId={sectionId}
            />
          </section>
        </TabsContent>
      </Tabs>
    </>
  );
}
