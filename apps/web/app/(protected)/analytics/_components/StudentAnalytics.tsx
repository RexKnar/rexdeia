/* eslint-disable react/jsx-key */
'use client';

import { useGetClassListQuery } from 'lib/queries/class/useGetClassListQuery';
import { useGetExamListQuery } from 'lib/queries/exams/useGetExamListQuery';
import { useGetGroupListQuery } from 'lib/queries/group/useGetGroupListQuery';
import { useGetAllSectionByClassIdQuery } from 'lib/queries/section/useGetAllSectionsByClassIdQuery';
import React, { useState } from 'react';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Checkbox,
  RadioGroup,
  RadioGroupItem,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Slider,
  Text,
} from 'ui';

export function StudentAnalytics() {
  const [sliderValues, setSliderValues] = useState([0, 100]);
  const page = 1;
  const limit = 999;
  const filter = {};
  const classId = '';
  const { data: examList } = useGetExamListQuery({
    page,
    limit,
  });
  const { data: classList } = useGetClassListQuery({
    page,
    limit,
    filter,
  });
  const { data: sectionList } = useGetAllSectionByClassIdQuery({
    filter,
    classId,
  });
  const { data: groupList } = useGetGroupListQuery({
    page,
    limit,
    filter,
  });
  const handleValueChange = (newValue) => {
    setSliderValues(newValue);
  };
  const marks = [
    {
      status1: 'Pass',
      passPersentage: '95%',
      girlsPassPercentage: '97%',
      boysPassPercentage: '98%',
      status2: 'Fail',
      failPercentage: '5%',
      girlsFailPercentage: '3%',
      boysFailPercentage: '2%',
      firstMarkStudent: 'Name',
      firstMark: '495',
      lastmarkstudent: 'Name',
      lastMark: '264',
    },
  ];
  const subjects = [
    {
      id: 'subjectd',
      value: 'Tamil',
    },
    {
      id: 'subjectd',
      value: 'English',
    },
    {
      id: 'subjectd',
      value: 'Maths',
    },
    {
      id: 'subjectd',
      value: 'Science',
    },
    {
      id: 'subjectd',
      value: 'Social',
    },
  ];
  return (
    <section className=" ">
      <section className="space-y-2 rounded-md bg-white p-6">
        <div className="flex gap-4">
          <div className="w-4/12">
            <label className="mt-1 block text-sm text-gray-700">Exam</label>
            <Select autoComplete="off">
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {examList?.data?.map((item) => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="w-4/12">
            <label className="mt-1 block text-sm text-gray-700">Class</label>
            <Select autoComplete="off">
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
            <label className="mt-1 block text-sm text-gray-700">Status</label>
            <RadioGroup className="mt-3 flex gap-2">
              <RadioGroupItem className="mr-1 mt-1" value={'pass'} /> {'Pass'}
              <RadioGroupItem className="ml-3 mr-1 mt-1 " value={'fail'} />
              {'Fail'}
              <RadioGroupItem className="ml-3 mr-1 mt-1 " value={'both'} />
              {'Both'}
            </RadioGroup>
          </div>
        </div>
        <div>
          <div className="mt-7 flex gap-4">
            <div className="w-4/12">
              <label className="mt-1 block text-sm text-gray-700">
                Section
              </label>
              <Select autoComplete="off">
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
              <label className="mt-1 block text-sm text-gray-700">Group</label>
              <Select autoComplete="off">
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {groupList?.data?.map((item) => (
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
                No of Subjects
              </label>
              <Select autoComplete="off">
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {subjects.map((item, index) => (
                      <SelectItem value={(index + 1).toString()} key={index}>
                        {index + 1}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="mt-7 flex gap-4">
            <div className="w-8/12">
              <label className="mt-2 text-gray-700">Filter By Mark</label>
              <div className="mt-2 flex">
                {' '}
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
                  max={100}
                  step={1}
                  className="ml-3"
                />
                <input
                  className="ml-3 mt-2 w-8 text-center	"
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
            <div className="grid grid-cols-3 grid-rows-2 gap-3">
              {subjects.map((item, index) => (
                <div className="flex items-center gap-2">
                  <Checkbox value={item.id} key={index} />
                  <span>{item.value}</span>
                </div>
              ))}{' '}
            </div>
          </div>
        </div>
        <div className="mt-10 flex items-center justify-center ">
          <Button className="mt-10 rounded px-4 py-2 font-bold text-white ">
            {'Apply'}
          </Button>
        </div>
      </section>
      <section className="mt-4 space-y-4 rounded-md bg-white p-6">
        <div className="flex gap-4">
          <div>
            <Card className="w-72 rounded-md bg-white">
              {marks.map((item) => (
                <>
                  <CardHeader>
                    <div>
                      <Text variant="base-bold">{'Pass Persentage'}</Text>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-center gap-5">
                      <Text>{item.status1}</Text>
                      <Text
                        variant="base-regular"
                        className=" rounded-lg border bg-violet-100 px-2"
                      >
                        {item.passPersentage}
                      </Text>
                    </div>
                    <div className="mt-6 flex gap-4">
                      <div className="flex justify-center gap-3">
                        <Text>{'Girls'}</Text>
                        <Text
                          variant="base-regular"
                          className=" rounded-lg border bg-violet-100 px-2"
                        >
                          {item.girlsPassPercentage}
                        </Text>
                      </div>
                      <div className="flex justify-center gap-3">
                        <Text>{'Boys'}</Text>
                        <Text
                          variant="base-regular"
                          className=" rounded-lg border bg-violet-100 px-2"
                        >
                          {item.boysPassPercentage}
                        </Text>
                      </div>
                    </div>
                  </CardContent>
                </>
              ))}
            </Card>
          </div>
          <div>
            <Card className="w-72 rounded-md bg-white">
              {marks.map((item) => (
                <>
                  <CardHeader>
                    <div>
                      <Text variant="base-bold">{'Fail Percentage'}</Text>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-center gap-5">
                      <Text>{item.status2}</Text>
                      <Text
                        variant="base-regular"
                        className=" rounded-lg border bg-violet-100 px-2"
                      >
                        {item.failPercentage}
                      </Text>
                    </div>
                    <div className="mt-6 flex gap-4">
                      <div className="flex justify-center gap-3">
                        <Text>{'Girls'}</Text>
                        <Text
                          variant="base-regular"
                          className=" rounded-lg border bg-violet-100 px-2"
                        >
                          {item.girlsFailPercentage}
                        </Text>
                      </div>
                      <div className="flex justify-center gap-3">
                        <Text>{'Boys'}</Text>
                        <Text
                          variant="base-regular"
                          className=" rounded-lg border bg-violet-100 px-2"
                        >
                          {item.boysFailPercentage}
                        </Text>
                      </div>
                    </div>
                  </CardContent>
                </>
              ))}
            </Card>
          </div>
        </div>
        <div className="mt-4 flex gap-4">
          <div>
            <Card className="w-72 rounded-md bg-white">
              {marks.map((item) => (
                <>
                  <CardHeader>
                    <div>
                      <Text variant="base-bold">{'First Mark'}</Text>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="my-auto flex justify-center px-5 pb-2 ">
                      <Text variant="base-bold">{item.firstMarkStudent}</Text>
                    </div>
                    <div className="flex justify-center gap-5">
                      <Text>{'Mark'}</Text>
                      <Text
                        variant="base-regular"
                        className=" rounded-lg border bg-violet-100 px-2"
                      >
                        {item.firstMark}
                      </Text>
                    </div>
                  </CardContent>
                </>
              ))}
            </Card>
          </div>
          <div>
            <Card className="w-72 rounded-md bg-white">
              {marks.map((item) => (
                <>
                  <CardHeader>
                    <div>
                      <Text variant="base-bold">{'Last Mark'}</Text>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="my-auto flex justify-center px-5 pb-2 ">
                      <Text variant="base-bold">{item.lastmarkstudent}</Text>
                    </div>
                    <div className="flex justify-center gap-5">
                      <Text>{'Mark'}</Text>
                      <Text
                        variant="base-regular"
                        className=" rounded-lg border bg-violet-100 px-2"
                      >
                        {item.lastMark}
                      </Text>
                    </div>
                  </CardContent>
                </>
              ))}
            </Card>
          </div>
        </div>
      </section>
    </section>
  );
}
