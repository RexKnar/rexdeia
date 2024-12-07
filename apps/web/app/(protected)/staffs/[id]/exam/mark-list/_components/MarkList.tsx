'use client';
import { useGetMarkMasterWithFilterQuery } from 'lib/queries/analytics/exam/useGetMarkMasterWithFilterQuery';
import { useGetAnalyticsSubjectsForStaffQuery } from 'lib/queries/analytics/subject/useGetAnalyticsSubjectsForStaffQuery';
import { useGetExamsBySectionIdQuery } from 'lib/queries/exams/useGetExamBySectionIdQuery';
import { useGetSubjectByStaffIdQuery } from 'lib/queries/staff/useGetSubjectListByStaffIdQurey';
import { useParams, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
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

import OverallDetails from './OverallDetails';
import StudentMarkList from './StudentMarkList';

// import MarkListInputArea from './MarkListInputArea';

export default function MarkList() {
  const { data: session } = useSession();
  const { id } = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const paramsClassId = searchParams.get('classId');
  const paramsSectionId = searchParams.get('sectionId');
  const paramsExamId = searchParams.get('examId');

  const [classId, setClassId] = useState('');
  const [sectionId, setSectionId] = useState('');
  const [subjectId, setSubjectId] = useState('');
  const [examId, setExamId] = useState('');
  const [classList, setClassList] = useState([]);
  const [sectionList, setSectionList] = useState({});
  // const [subjectList, setSubjectList] = useState({});
  const [examDetail, setExamDetail] = useState('');
  const [sectionDetail, setSectionDetail] = useState('');
  const [classDetail, setClassDetail] = useState('');
  const [studentMarkList, setStudentMarkList] = useState([]);
  const [staffId, setStaffId] = useState('');

  useEffect(() => {
    if (paramsClassId) {
      setClassId(paramsClassId);
    }
    if (paramsSectionId) {
      setSectionId(paramsSectionId);
    }
    if (paramsExamId) {
      setExamId(paramsExamId);
    }
  }, [paramsClassId, paramsSectionId, paramsExamId]);

  const { data: examList } = useGetExamsBySectionIdQuery(
    sectionId ? { classId, sectionId } : { classId },
    {
      enabled: !!classId,
    }
  );
  const { data: subjectListResponse } = useGetSubjectByStaffIdQuery(
    staffId || id
  );
  useEffect(() => {
    if (session?.user?.role !== 'Admin') {
      setStaffId(session?.user?.staffId);
    }
  }, [session]);
  useEffect(() => {
    let classes = [];
    let sections = {};
    let subjects = {};
    if (subjectListResponse) {
      subjectListResponse?.forEach((classDetail: any) => {
        classes.push({ id: classDetail.id, name: classDetail.name });
        const section = classDetail.sections;
        let tempSection = [];
        section.forEach((sectionDetail: any) => {
          tempSection.push({
            id: sectionDetail.id,
            name: sectionDetail.name,
          });
          let tempSubjects = [];
          sectionDetail.subjects.forEach((subjectDetail: any) => {
            tempSubjects.push({
              id: subjectDetail.id,
              name: subjectDetail.name,
            });
          });
          subjects[sectionDetail.id] = tempSubjects;
        });
        sections[classDetail.id] = tempSection;
      });

      setClassList(classes);
      setSectionList(sections);
      // setSubjectList(subjects);
    }
  }, [subjectListResponse]);

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

  const { data: subjectList } = useGetAnalyticsSubjectsForStaffQuery(
    staffId || id,
    sectionId,

    {
      enabled: !!sectionId,
    }
  );

  useEffect(() => {
    // eslint-disable-next-line no-console
    console.log(classList, sectionList, subjectList, subjectId, examId);
  }, [classList, sectionList, subjectList, subjectId, examId]);

  useEffect(() => {
    if (markDetails) {
      const { markList, exam, section, class: classDetails } = markDetails;
      setStudentMarkList(markList);
      setExamDetail(exam);
      setSectionDetail(section);
      setClassDetail(classDetails);
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
                  {classList?.map((item) => (
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
                  {sectionList[classId]
                    ? sectionList[classId]?.map((item) => (
                        <SelectItem key={item.id} value={item.id}>
                          {item.name}
                        </SelectItem>
                      ))
                    : null}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="w-4/12">
            <label className="mt-1 block text-sm text-gray-700">Subject</label>
            <Select
              autoComplete="off"
              onValueChange={(value) => {
                setExamId(null);
                setSubjectId(value === 'all' ? null : value);
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="all">All</SelectItem>
                  {subjectList
                    ? subjectList?.map((item) => (
                        <SelectItem key={item.id} value={item.id}>
                          {item.name}
                        </SelectItem>
                      ))
                    : null}
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
      <Tabs defaultValue="overall" className="border-0 ">
        <TabsList className="w-full justify-start border-b-2 border-gray-100">
          <TabsTrigger
            value="overall"
            className="mr-2 text-base focus:border-b-4 focus:border-primary print:hidden"
          >
            Overall-Analytics
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
            <OverallDetails
              students={studentMarkList}
              examDetails={examDetail}
              sectionDetails={sectionDetail}
              classDetails={classDetail}
              subjectList={subjectList}
            />
          </section>
        </TabsContent>

        <TabsContent className="w-full" value="markList">
          <section>
            {studentMarkList && (
              <StudentMarkList
                students={studentMarkList}
                examDetails={examDetail}
                sectionDetails={sectionDetail}
                classDetails={classDetail}
                subjectList={subjectList}
              />
            )}
          </section>
        </TabsContent>
      </Tabs>
    </>
  );
}
