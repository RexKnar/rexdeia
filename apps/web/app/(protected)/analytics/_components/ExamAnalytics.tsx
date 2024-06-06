'use client';

import { BiaxialBarChart } from 'lib/Charts/BarChart/BiaxialBarChart';
import { PieChartWithCustomLabel } from 'lib/Charts/Pie/PieChartWithCustomLabel';
import { useExamAnalyticsQuery } from 'lib/queries/analytics/exam/useGetExamAnalyticsQuery';
import { useGetClassListQuery } from 'lib/queries/class/useGetClassListQuery';
import { useGetExamsBySectionIdQuery } from 'lib/queries/exams/useGetExamBySectionIdQuery';
import { useGetAllSectionByClassIdQuery } from 'lib/queries/section/useGetAllSectionsByClassIdQuery';
import {
  ArrowDown10,
  ArrowUp10,
  Loader2,
  UserCheck,
  UserX,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Text,
} from 'ui';

import AnalyticsEmptyState from './AnalyticsEmptyState';
import { BasicAnalyticsCardWidget } from './BasicAnalyticsCardWidget';
import StudentMarkList from './StudentMarkList';

export function ExamAnalytics() {
  const [passFailPieData, setPassFailPieData] = useState(null);
  const [examStatusBarChartData, setExamStatusBarChartData] = useState([]);
  const [studentMarkList, setStudentMarkList] = useState([]);
  const page = 1;
  const limit = 999;
  const filter = {};
  const [classId, setClassId] = useState('');
  const [sectionId, setSectionId] = useState('');
  const [examId, setExamId] = useState('');
  const [passFailWidgetData, setPassFailWidgetData] = useState([]);
  const [passFailStudentsWidgetData, setPassFailStudentsWidgetData] = useState(
    []
  );

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

  const { data: analyticsDetail, isLoading: isAnalyticsDetail } =
    useExamAnalyticsQuery(
      {
        classId,
        sectionId,
        examId,
      },
      {
        enabled: !!classId && !!sectionId && !!examId,
      }
    );
  useEffect(() => {
    if (analyticsDetail) {
      const { analytics, markList } = analyticsDetail;
      const passFailData = [
        {
          name: 'Pass',
          value: analytics?.totalPassCount || 0,
        },
        {
          name: 'Fail',
          value: analytics?.totalFailCount || 0,
        },
      ];

      const barChartLocalData = [
        {
          name: 'Pass',
          boy: analytics?.malePassCount,
          girl: analytics?.femalePassCount,
        },
        {
          name: 'Fail',
          boy: analytics?.maleFailCount,
          girl: analytics?.femaleFailCount,
        },
        {
          name: 'Absent',
          boy: analytics?.maleAbsentCount,
          girl: analytics?.femaleAbsentCount,
        },
      ];
      const passFailWidgetList = [
        {
          value: analytics?.totalPassCount || 0,
          percentage: analytics?.totalPassPercentage || 0,
          label: 'Pass Students',
          icon: UserCheck,
          className: 'bg-green-100 text-green-800',
          subData: [
            {
              title: 'Male',
              value: analytics?.malePassCount || 0,
              percentage: analytics?.malePassPercentage || 0,
            },
            {
              title: 'Female',
              value: analytics?.femalePassCount || 0,
              percentage: analytics?.femalePassPercentage || 0,
            },
          ],
        },
        {
          value: analytics?.totalFailCount || 0,
          percentage: analytics?.totalFailPercentage || 0,
          label: 'Failed Students',
          icon: UserX,
          className: 'bg-red-100 text-red-800',
          subData: [
            {
              title: 'Male',
              value: analytics?.maleFailCount || 0,
              percentage: analytics?.maleFailPercentage || 0,
            },
            {
              title: 'Female',
              value: analytics?.femaleFailCount || 0,
              percentage: analytics?.femaleFailPercentage || 0,
            },
          ],
        },
      ];
      const highestMaleStudent = analytics.highestStudentByGender?.male || null;
      const highestFemaleStudent =
        analytics.highestStudentByGender?.female || null;

      const lowestMaleStudent = analytics.lowestStudentByGender?.male || null;
      const lowestFemaleStudent =
        analytics.lowestStudentByGender?.female || null;

      const passFailStudentAnalytics = [
        {
          value: analytics?.highestTotalMark || 0,
          percentage:
            `${analytics?.highestStudent?.firstName} ${analytics?.highestStudent?.middleName} ${analytics?.highestStudent?.lastName}` ||
            '-',
          label: 'Highest Mark',
          icon: ArrowUp10,
          className: 'bg-green-100 text-green-800',
          subData: [
            {
              title: 'Male',
              value: highestMaleStudent?.totalMarks || 0,
              percentage: highestMaleStudent
                ? `${highestMaleStudent?.firstName} ${highestMaleStudent?.middleName} ${highestMaleStudent?.lastName}`
                : '-',
            },
            {
              title: 'Female',
              value: highestFemaleStudent?.totalMarks || 0,
              percentage: highestFemaleStudent
                ? `${highestFemaleStudent?.firstName} ${highestFemaleStudent?.middleName} ${highestFemaleStudent?.lastName}`
                : '-',
            },
          ],
        },
        {
          value: analytics?.lowestTotalMark || 0,
          percentage:
            `${analytics?.lowestStudent?.firstName} ${analytics?.lowestStudent?.middleName} ${analytics?.lowestStudent?.lastName}` ||
            '-',
          label: 'Lowest Mark',
          icon: ArrowDown10,
          className: 'bg-red-100 text-red-800',
          subData: [
            {
              title: 'Male',
              value: lowestMaleStudent?.totalMarks || 0,
              percentage: lowestMaleStudent
                ? `${lowestMaleStudent?.firstName} ${lowestMaleStudent?.middleName} ${lowestMaleStudent?.lastName}`
                : '-',
            },
            {
              title: 'Female',
              value: lowestFemaleStudent?.totalMarks || 0,
              percentage: lowestFemaleStudent
                ? `${lowestFemaleStudent?.firstName} ${lowestFemaleStudent?.middleName} ${lowestFemaleStudent?.lastName}`
                : '-',
            },
          ],
        },
      ];

      setPassFailStudentsWidgetData(passFailStudentAnalytics);
      setPassFailWidgetData(passFailWidgetList);
      setExamStatusBarChartData(barChartLocalData);

      setPassFailPieData(passFailData);
      setStudentMarkList(markList);
    }
  }, [analyticsDetail]);

  return (
    <>
      <section>
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
              <label className="mt-1 block text-sm text-gray-700">
                Section
              </label>
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
        {analyticsDetail?.subjectWiseCount && (
          <>
            <section className="mt-4 space-y-4 rounded-md bg-white p-6">
              <p className="text-xl font-semibold text-gray-800">
                Students Overview
              </p>
              <p className="text-gray-700">
                This section provides a comprehensive overview of student
                statistics.
              </p>
              <div className="flex gap-2">
                {passFailWidgetData.map((widget, index) => (
                  <div key={index} className="w-full">
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

              <div className="flex gap-2">
                {passFailStudentsWidgetData.map((widget, index) => (
                  <div key={index} className="w-full">
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

              <div className="flex gap-1">
                <div className="w-1/2">
                  {analyticsDetail && (
                    <BiaxialBarChart chartData={examStatusBarChartData} />
                  )}
                </div>
                <div className="w-1/2">
                  {analyticsDetail && (
                    <PieChartWithCustomLabel
                      pieData={passFailPieData}
                      colorCodeIndex={5}
                    />
                  )}
                </div>
              </div>
            </section>
            <section className="mt-4 space-y-4 rounded-md ">
              <Text className="text-xl font-semibold text-gray-800">
                Subject Wise Analytics
              </Text>

              <div>
                <div className="flex gap-4">
                  <div className="w-1/2 rounded-md bg-white p-4">
                    <Text className="text-lg font-semibold text-gray-800">
                      Failed Student Analytics
                    </Text>
                    {analyticsDetail && (
                      <BiaxialBarChart
                        chartData={analyticsDetail?.subjectWiseCount || []}
                        collectiveKey={'subjectCount'}
                        firstBarKey="maleFailed"
                        secondBarKey="femaleFailed"
                      />
                    )}
                  </div>
                  <div className="flex w-1/2 flex-col rounded-md bg-white p-4">
                    <Text className="text-lg font-semibold text-gray-800">
                      Failed Student Analytics
                    </Text>
                    {analyticsDetail && (
                      <PieChartWithCustomLabel
                        pieData={analyticsDetail?.subjectWiseCount}
                        dataKey="totalFailed"
                        nameKey="totalFailed"
                        colorCodeIndex={5}
                      />
                    )}
                  </div>
                </div>
              </div>
            </section>
            <section className="mt-4 space-y-4 rounded-md ">
              <div>
                <div className="flex gap-4">
                  <div className="w-1/2 rounded-md bg-white p-4">
                    <Text className="text-lg font-semibold text-gray-800">
                      Passed Student Analytics
                    </Text>
                    {analyticsDetail && (
                      <BiaxialBarChart
                        chartData={analyticsDetail?.subjectWiseCount || []}
                        collectiveKey={'subjectCount'}
                        firstBarKey="malePassed"
                        secondBarKey="femalePassed"
                      />
                    )}
                  </div>
                  <div className="flex w-1/2 flex-col rounded-md bg-white p-4">
                    <Text className="text-lg font-semibold text-gray-800">
                      Passed Student Analytics
                    </Text>
                    {analyticsDetail && (
                      <PieChartWithCustomLabel
                        pieData={analyticsDetail?.subjectWiseCount}
                        dataKey="totalPassed"
                        nameKey="totalPassed"
                        colorCodeIndex={5}
                      />
                    )}
                  </div>
                </div>
              </div>
            </section>
          </>
        )}
        {!analyticsDetail && !isAnalyticsDetail && <AnalyticsEmptyState />}

        {isAnalyticsDetail && (
          <div className="mt-4 flex items-center justify-center ">
            <Loader2 className="mr-2 h-6 w-6 animate-spin text-black" />
            <p className="text-black">Fetching Details...</p>
          </div>
        )}
      </section>

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
    </>
  );
}
