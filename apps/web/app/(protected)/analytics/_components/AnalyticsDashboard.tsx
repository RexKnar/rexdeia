'use client';

import { useGetMarkMasterWithFilterQuery } from 'lib/queries/analytics/exam/useGetMarkMasterWithFilterQuery';
import { useGetExamSubjectsByClassSectionIdQuery } from 'lib/queries/exams/subject/useGetExamSubjectsByClassSectionIdQuery';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from 'ui';

import dataSegmentationGif from '../../../../public/assets/images/data-segmentation.gif';
import noClassListImage from '../../../../public/assets/images/options.svg';
import { AnalyticsFilterBar } from './AnalyticsFilterBar';
import { AnalyticsSummary } from './AnalyticsSummary';
import { DataLoadingPlaceholder } from './DataLoadingPlaceholder';
import OverallAnalytics from './OverallAnalytics';
import OverallForStaff from './OverallForStaff';
import RangeAnalyticsTable from './RangeAnalyticsTable';
import SectionAnalytics from './SectionAnalytics';
import StudentMarkList from './StudentMarkList';
import SubjectwiseCountAnalysisTable from './SubjectwiseCountAnalysisTable';
import StaffAnalysisTable from '../staff-analysis/_components/StaffAnalysisTable';

const TAB_TRIGGER_CLASS =
  'whitespace-nowrap rounded-md px-3 py-1.5 text-sm text-gray-600 data-[state=active]:bg-primary data-[state=active]:text-white';

export function AnalyticsDashboard() {
  const searchParams = useSearchParams();
  const classId = searchParams.get('classId');
  const sectionId = searchParams.get('sectionId');
  const examId = searchParams.get('examId');

  const [studentMarkList, setStudentMarkList] = useState([]);
  const [examDetail, setExamDetail] = useState('');
  const [sectionDetail, setSectionDetail] = useState('');
  const [classDetail, setClassDetail] = useState('');

  const { data: subjects } = useGetExamSubjectsByClassSectionIdQuery(
    { examId, classId, sectionId },
    { enabled: !!examId && !!classId }
  );

  const { data: markDetails, isLoading: isMarkDetailsLoading } =
    useGetMarkMasterWithFilterQuery(
      {
        classId,
        sectionId,
        examId,
        pagination: { page: 1, limit: 999 },
      },
      { enabled: !!examId }
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

  const hasData = !!markDetails && !!examId;

  return (
    <section className="space-y-4">
      <AnalyticsFilterBar />

      {!examId ? (
        <section className="rounded-md bg-white p-6 shadow-sm">
          {isMarkDetailsLoading ? (
            <DataLoadingPlaceholder
              image={dataSegmentationGif}
              description="Please wait while we fetch the data for you..."
            />
          ) : (
            <DataLoadingPlaceholder
              title="No Options Selected"
              image={noClassListImage}
              description="It looks like there are no options selected at the moment."
              subDescription="Please choose Class / Section / Exam to view the analytics."
            />
          )}
        </section>
      ) : (
        <>
          <section className="space-y-3">
            <div>
              <p className="text-lg font-semibold text-gray-800">
                Performance Overview
              </p>
              <p className="text-sm text-gray-600">
                Headline metrics and visual breakdown for the selected exam.
              </p>
            </div>
            <AnalyticsSummary
              classId={classId}
              sectionId={sectionId}
              examId={examId}
            />
          </section>

          {hasData && (
            <section className="space-y-3 rounded-md bg-white p-4 shadow-sm sm:p-6">
              <div>
                <p className="text-lg font-semibold text-gray-800">
                  Detailed Analytics
                </p>
                <p className="text-sm text-gray-600">
                  Explore subject, section, staff, range and student-level
                  breakdowns. Each view supports export.
                </p>
              </div>

              <Tabs defaultValue="overall" className="border-0">
                <TabsList className="flex w-full flex-nowrap justify-start gap-1 overflow-x-auto rounded-md bg-gray-50 p-1">
                  <TabsTrigger value="overall" className={TAB_TRIGGER_CLASS}>
                    Overall
                  </TabsTrigger>
                  <TabsTrigger value="section" className={TAB_TRIGGER_CLASS}>
                    Section
                  </TabsTrigger>
                  <TabsTrigger value="staff" className={TAB_TRIGGER_CLASS}>
                    Staff
                  </TabsTrigger>
                  <TabsTrigger value="range" className={TAB_TRIGGER_CLASS}>
                    Range
                  </TabsTrigger>
                  <TabsTrigger value="subjectCount" className={TAB_TRIGGER_CLASS}>
                    Subject Count
                  </TabsTrigger>
                  <TabsTrigger value="markList" className={TAB_TRIGGER_CLASS}>
                    Mark List
                  </TabsTrigger>
                  <TabsTrigger value="overallForStaff" className={TAB_TRIGGER_CLASS}>
                    For Staff
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="overall" className="w-full overflow-x-auto">
                  <OverallAnalytics
                    examId={examId}
                    classId={classId}
                    sectionId={sectionId}
                    students={studentMarkList}
                    examDetails={examDetail}
                    sectionDetails={sectionDetail}
                    classDetails={classDetail}
                  />
                </TabsContent>

                <TabsContent value="section" className="w-full overflow-x-auto">
                  <SectionAnalytics
                    examId={examId}
                    classId={classId}
                    sectionId={sectionId}
                  />
                </TabsContent>

                <TabsContent value="staff" className="w-full overflow-x-auto">
                  <StaffAnalysisTable />
                </TabsContent>

                <TabsContent value="range" className="w-full overflow-x-auto">
                  <RangeAnalyticsTable
                    markList={studentMarkList}
                    subjectList={subjects}
                    classId={classId}
                  />
                </TabsContent>

                <TabsContent
                  value="subjectCount"
                  className="w-full overflow-x-auto"
                >
                  <SubjectwiseCountAnalysisTable
                    students={studentMarkList}
                    subjectCount={subjects?.length}
                    classId={classId}
                    sectionId={sectionId}
                    examId={examId}
                  />
                </TabsContent>

                <TabsContent value="markList" className="w-full overflow-x-auto">
                  <StudentMarkList
                    examId={examId}
                    classId={classId}
                    sectionId={sectionId}
                    students={studentMarkList}
                    examDetails={examDetail}
                    sectionDetails={sectionDetail}
                    classDetails={classDetail}
                  />
                </TabsContent>

                <TabsContent
                  value="overallForStaff"
                  className="w-full overflow-x-auto"
                >
                  <OverallForStaff
                    examId={examId}
                    classId={classId}
                    sectionId={sectionId}
                    students={studentMarkList}
                    examDetails={examDetail}
                    sectionDetails={sectionDetail}
                    classDetails={classDetail}
                  />
                </TabsContent>
              </Tabs>
            </section>
          )}
        </>
      )}
    </section>
  );
}
