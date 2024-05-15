/* eslint-disable react/jsx-key */
'use client';

import { useGetClassListQuery } from 'lib/queries/class/useGetClassListQuery';
import { useGetExamListQuery } from 'lib/queries/exams/useGetExamListQuery';
import { useGetAllSectionByClassIdQuery } from 'lib/queries/section/useGetAllSectionsByClassIdQuery';
import {
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
            <label className="mt-1 block text-sm text-gray-700">Section</label>
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
          <div>
            <label className="mt-1 block text-sm text-gray-700">Status</label>
            <RadioGroup className="mt-3 flex gap-2">
              <RadioGroupItem className="mr-1 mt-1" value={'pass'} /> {'Pass'}
              <RadioGroupItem className="ml-3 mr-1 mt-1 " value={'fail'} />
              {'Fail'}
            </RadioGroup>
          </div>
        </div>
        <div>
          <div className="mt-7 flex gap-4">
            <div className="w-full">
              <label className="mt-2 text-gray-700">Filter By Mark</label>
              <Slider
                sliderValues={[1]}
                defaultValue={[0, 100]}
                max={100}
                step={1}
                className="w-12/12 mt-3"
              />
            </div>
            {subjects.map((item, index) => (
              <div className="mt-10 ">
                <div className="flex justify-center gap-2">
                  <Checkbox value={item.id} key={index} />
                  <span>{item.value}</span>
                </div>
              </div>
            ))}
            <div className="w-6/12">
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
                      <SelectItem value={item.id} key={index}>
                        {index + 1}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
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
