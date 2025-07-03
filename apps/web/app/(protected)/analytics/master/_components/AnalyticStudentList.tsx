'use client';

import { useGetMarkMasterWithFilterQuery } from 'lib/queries/analytics/exam/useGetMarkMasterWithFilterQuery';
import { useGetClassListQuery } from 'lib/queries/class/useGetClassListQuery';
import { useGetExamSubjectsByClassSectionIdQuery } from 'lib/queries/exams/subject/useGetExamSubjectsByClassSectionIdQuery';
import { useGetExamsBySectionIdQuery } from 'lib/queries/exams/useGetExamBySectionIdQuery';
import { useGetAllSectionByClassIdQuery } from 'lib/queries/section/useGetAllSectionsByClassIdQuery';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from 'ui';

import { SearchableSelect } from '@/components/SearchableSelect';

import dataSegmentationGif from '../../../../../public/assets/images/data-segmentation.gif';
import noClassListImage from '../../../../../public/assets/images/options.svg';
import { DataLoadingPlaceholder } from '../../_components/DataLoadingPlaceholder';
import OverallAnalytics from '../../_components/OverallAnalytics';
import RangeAnalyticsTable from '../../_components/RangeAnalyticsTable';
import SectionAnalytics from '../../_components/SectionAnalytics';
import StudentMarkList from '../../_components/StudentMarkList';
import SubjectwiseCountAnalysisTable from '../../_components/SubjectwiseCountAnalysisTable';
import StaffAnalysisTable from '../../staff-analysis/_components/StaffAnalysisTable';

export function AnalyticStudentList() {
  const [studentMarkList, setStudentMarkList] = useState([]);

  const page = 1;
  const limit = 999;
  const filter = {};
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const params = new URLSearchParams(searchParams);
  const classId = searchParams.get('classId');
  const examId = searchParams.get('examId');
  const sectionId = searchParams.get('sectionId');

  const [examDetail, setExamDetail] = useState('');
  const [sectionDetail, setSectionDetail] = useState('');
  const [classDetail, setClassDetail] = useState('');

  const { data: examList, isLoading: isExamLoading } =
    useGetExamsBySectionIdQuery(
      sectionId ? { classId, sectionId } : { classId },
      {
        enabled: !!classId,
      }
    );

  const { data: classList, isLoading: isClassLoading } = useGetClassListQuery({
    page,
    limit,
    filter,
  });
  const { data: sectionList, isLoading: isSectionLoading } =
    useGetAllSectionByClassIdQuery(
      {
        filter,
        classId,
      },
      {
        enabled: !!classId,
      }
    );
  const { data: subjects } = useGetExamSubjectsByClassSectionIdQuery(
    {
      examId,
      classId,
      sectionId,
    },
    {
      enabled: !!examId && !!classId,
    }
  );

  const { data: markDetails, isLoading: isStudentDetailsLoading } =
    useGetMarkMasterWithFilterQuery(
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
            <SearchableSelect
              label="Class"
              value={params.get('classId') || ''}
              onChange={(value) => {
                params.set('classId', value);
                params.delete('sectionId');
                router.replace(pathname + '?' + params.toString());
              }}
              options={classList?.data || []}
              placeholder={isClassLoading ? 'Loading...' : 'Select Class'}
              disabled={isClassLoading}
            />
          </div>
          <div className="w-4/12">
            <div className="w-4/12">
              <SearchableSelect
                label="Section"
                value={sectionId ?? 'all'}
                onChange={(value) => {
                  value === 'all'
                    ? params.delete('sectionId')
                    : params.set('sectionId', value);

                  router.replace(pathname + '?' + params.toString());
                }}
                options={[
                  { id: 'all', name: 'All' },
                  ...(sectionList?.data || []),
                ]}
                placeholder={isSectionLoading ? 'Loading...' : 'Select Section'}
                disabled={isSectionLoading}
              />
            </div>
          </div>
          <div className="w-4/12">
            <div className="w-4/12">
              <SearchableSelect
                label="Exam"
                value={examId ?? 'all'}
                onChange={(value) => {
                  value === 'all'
                    ? params.delete('examId')
                    : params.set('examId', value);

                  router.replace(`${pathname}?${params.toString()}`);
                }}
                options={[
                  { id: 'all', name: 'Choose a Exam' },
                  ...(examList || []),
                ]}
                placeholder={isExamLoading ? 'Loading...' : 'Select Exam'}
                disabled={isExamLoading}
              />
            </div>
          </div>
        </div>
      </section>
      {markDetails ? (
        <Tabs defaultValue="overall" className="border-0 ">
          <TabsList className="w-full justify-start border-b-2 border-gray-100">
            <TabsTrigger
              value="overall"
              className="mr-2 text-base focus:border-b-4 focus:border-primary print:hidden"
            >
              Overall-Analytics
            </TabsTrigger>
            <TabsTrigger
              value="sectionAnalytics"
              className="mr-2 text-base focus:border-b-4 focus:border-primary print:hidden"
            >
              Section-Analytics
            </TabsTrigger>
            <TabsTrigger
              value="staffAnalytics"
              className="mr-2 text-base focus:border-b-4 focus:border-primary print:hidden"
            >
              Staff-Analytics
            </TabsTrigger>
            <TabsTrigger value="rangeAnalytics" className="mr-2 text-base">
              Range Analytics
            </TabsTrigger>
            <TabsTrigger
              value="subjectCountAnalytics"
              className="mr-2 text-base"
            >
              Subject Count Analytics
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
                examDetails={examDetail}
                sectionDetails={sectionDetail}
                classDetails={classDetail}
              />
            </section>
          </TabsContent>
          <TabsContent className="w-full" value="sectionAnalytics">
            <section>
              <SectionAnalytics
                examId={examId}
                classId={classId}
                sectionId={sectionId}
              />
            </section>
          </TabsContent>
          <TabsContent className="w-full" value="staffAnalytics">
            <section>
              <StaffAnalysisTable />
            </section>
          </TabsContent>
          <TabsContent className="w-full" value="rangeAnalytics">
            <section>
              <RangeAnalyticsTable
                markList={studentMarkList}
                subjectList={subjects}
                classId={classId}
              />
            </section>
          </TabsContent>
          <TabsContent className="w-full" value="subjectCountAnalytics">
            <section>
              <SubjectwiseCountAnalysisTable
                students={studentMarkList}
                subjectCount={subjects?.length}
                classId={classId}
                sectionId={sectionId}
                examId={examId}
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
                  examDetails={examDetail}
                  sectionDetails={sectionDetail}
                  classDetails={classDetail}
                />
              )}
            </section>
          </TabsContent>
        </Tabs>
      ) : (
        <section className="mt-4 space-y-4 overflow-x-auto rounded-md bg-white p-6 print:m-0 print:p-0 ">
          {isStudentDetailsLoading ? (
            <DataLoadingPlaceholder
              image={dataSegmentationGif}
              description="Please wait while we fetch the data for you..."
            />
          ) : (
            <DataLoadingPlaceholder
              title={'No Options Selected'}
              image={noClassListImage}
              description="It looks like there are no options selected at the moment."
              subDescription="Please choose Class/Section/Exam to view the analytics."
            />
          )}
        </section>
      )}
    </>
  );
}
