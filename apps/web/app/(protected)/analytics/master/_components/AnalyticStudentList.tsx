'use client';

import { useGetMarkMasterWithFilterQuery } from 'lib/queries/analytics/exam/useGetMarkMasterWithFilterQuery';
import { useGetClassListQuery } from 'lib/queries/class/useGetClassListQuery';
import { useGetExamsBySectionIdQuery } from 'lib/queries/exams/useGetExamBySectionIdQuery';
import { useGetAllSectionByClassIdQuery } from 'lib/queries/section/useGetAllSectionsByClassIdQuery';
import React, { useEffect, useState } from 'react';
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

import OverallAnalytics from '../../_components/OverallAnalytics';
import StudentMarkList from '../../_components/StudentMarkList';

export function AnalyticStudentList() {
  const [studentMarkList, setStudentMarkList] = useState([]);

  const page = 1;
  const limit = 999;
  const filter = {};
  const [classId, setClassId] = useState('');
  const [sectionId, setSectionId] = useState('');
  const [examId, setExamId] = useState('');

  const { data: examList } = useGetExamsBySectionIdQuery(
    { classId, sectionId },
    {
      enabled: !!classId && !!sectionId,
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

  const { data: markDetails } = useGetMarkMasterWithFilterQuery(
    {
      classId,
      sectionId,
      examId,
      pagination: {
        page: 1,
        limit: 10,
      },
    },
    {
      enabled: !!examId,
    }
  );

  useEffect(() => {
    if (markDetails) {
      const { markList } = markDetails;
      setStudentMarkList(markList);
    }
  }, [markDetails]);

  return (
    <>
      <section className="space-y-2 rounded-md bg-white p-6">
        <div className="flex gap-4">
          <div className="w-4/12">
            <label className="mt-1 block text-sm text-gray-700">Class</label>
            <Select
              autoComplete="off"
              onValueChange={(value) => {
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
                setSectionId(value);
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
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
                setExamId(value);
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
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
      {/* <section className="p-6 mt-4 space-y-4 bg-white rounded-md">
        <div className="flex gap-2">
          {analyticsWidgetData.map((widget, index) => (
            <div
              key={index + widget.percentage + widget.label}
              className="w-full"
            >
              <BasicAnalyticsCardWidget
                icon={widget.icon}
                percentage={widget.percentage}
                label={widget.label}
                value={widget.value}
                className={widget.className}
                subData={widget.subData}
              />
            </div>
          ))}
        </div>
      </section> */}
      <Tabs defaultValue="profile" className="border-0 ">
        <TabsList className="w-full justify-start border-b-2 border-gray-100">
          <TabsTrigger
            value="overall"
            className="mr-2 text-base focus:border-b-4 focus:border-primary print:hidden"
          >
            Overall
          </TabsTrigger>
          <TabsTrigger
            value="markList"
            className="mr-2 text-base focus:border-b-4 focus:border-primary print:hidden"
          >
            Mark List
          </TabsTrigger>
        </TabsList>
        <TabsContent className="w-full" value="overall">
          <section>
            <OverallAnalytics
              examId={examId}
              classId={classId}
              sectionId={sectionId}
              students={studentMarkList}
            />
          </section>
        </TabsContent>
        <TabsContent className="w-full" value="markList">
          <section>
            {studentMarkList && (
              <StudentMarkList
                examId={examId}
                classId={classId}
                sectionId={sectionId}
                students={studentMarkList}
              />
            )}
          </section>
        </TabsContent>
      </Tabs>
    </>
  );
}
