'use client';

import { useGetMarkListWithFilterQuery } from 'lib/queries/analytics/exam/useGetMarkListWithFilterQuery';
import { useGetClassListQuery } from 'lib/queries/class/useGetClassListQuery';
import { useGetExamSubjectsByClassSectionIdQuery } from 'lib/queries/exams/subject/useGetExamSubjectsByClassSectionIdQuery';
import { useGetExamsBySectionIdQuery } from 'lib/queries/exams/useGetExamBySectionIdQuery';
import { useGetAllSectionByClassIdQuery } from 'lib/queries/section/useGetAllSectionsByClassIdQuery';
import React, { useEffect, useState } from 'react';
import {
  Checkbox,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Slider,
} from 'ui';

import StudentMarkList from '../../_components/StudentMarkList';

export function AnalyticStudentList() {
  const [studentMarkList, setStudentMarkList] = useState([]);

  const page = 1;
  const limit = 999;
  const filter = {};
  const [classId, setClassId] = useState('');
  const [sectionId, setSectionId] = useState('');
  const [examId, setExamId] = useState('');
  const [filterSubjects, setFilterSubjects] = useState([]);
  const [filterTotalMarks, setFilterTotalMarks] = useState(100);

  const [sliderValues, setSliderValues] = useState([0, 100]);
  const handleValueChange = (newValue) => {
    setSliderValues(newValue);
  };

  const { data: subjects } = useGetExamSubjectsByClassSectionIdQuery(
    {
      examId,
      classId,
      sectionId,
    },
    {
      enabled: !!examId && !!classId && !!sectionId,
    }
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

  const handleSubjectCheckedChange = (subject: any) => {
    setFilterSubjects((prevSubjects) => {
      const isPresent = prevSubjects.some((item) => item.id === subject.id);

      if (isPresent) {
        return prevSubjects.filter((item) => item.id !== subject.id);
      } else {
        return [...prevSubjects, subject];
      }
    });
  };

  useEffect(() => {
    let currentTotalMarks = 0;
    if (filterSubjects?.length > 0) {
      filterSubjects.map((subject) => {
        currentTotalMarks += subject.convertTo;
      });
    }
    setFilterTotalMarks(currentTotalMarks || 100);
    setSliderValues([sliderValues[0], currentTotalMarks || 100]);
    refetchMarkList();
  }, [filterSubjects]);

  useEffect(() => {
    if (subjects) {
      setFilterSubjects([...subjects]);
    }
  }, [subjects]);

  const { data: markDetails, refetch: refetchMarkList } =
    useGetMarkListWithFilterQuery(
      {
        classId,
        sectionId,
        examId,
        pagination: {
          page: 1,
          limit: 10,
        },
        markRange: sliderValues || [],
        filterSubjects: filterSubjects.length ? filterSubjects : [],
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
      <section className="space-y-2 rounded-md bg-white p-6 print:hidden">
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
        <section>
          <div>
            <div className="mt-7 flex gap-4">
              <div className="w-8/12">
                <label className="mt-2 text-gray-700">Filter By Mark</label>
                <div className="mt-2 flex">
                  <input
                    className="mt-2 w-8 text-center"
                    type="number"
                    maxLength={sliderValues[1]}
                    value={sliderValues[0]}
                    onChange={(e) => {
                      setSliderValues([
                        parseInt(e.target.value),
                        sliderValues[1],
                      ]);
                    }}
                  />
                  <Slider
                    sliderValues={sliderValues}
                    value={sliderValues}
                    onValueChange={(value) => handleValueChange(value)}
                    defaultValue={sliderValues}
                    max={filterTotalMarks}
                    step={1}
                    className="ml-3"
                  />
                  <input
                    className="ml-3 mt-2 w-8 text-center "
                    type="number"
                    minLength={sliderValues[0]}
                    maxLength={100}
                    value={sliderValues[1]}
                    onChange={(e) => {
                      setSliderValues([
                        sliderValues[0],
                        parseInt(e.target.value),
                      ]);
                    }}
                  />
                </div>
              </div>
              {subjects && (
                <div className="grid grid-cols-3 grid-rows-2 gap-3">
                  {subjects.map((item, index) => (
                    <div className="flex items-center gap-2" key={index}>
                      <Checkbox
                        value={item.id}
                        key={index}
                        checked={filterSubjects.some((s) => s.id === item.id)}
                        onCheckedChange={() => {
                          handleSubjectCheckedChange(item);
                        }}
                      />
                      <span>{item.subject.name}</span>
                    </div>
                  ))}{' '}
                </div>
              )}
            </div>
          </div>
        </section>
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
