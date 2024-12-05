'use client';

import { useGetExamsBySectionIdQuery } from 'lib/queries/exams/useGetExamBySectionIdQuery';
import { useGetSubjectByStaffIdQuery } from 'lib/queries/staff/useGetSubjectListByStaffIdQurey';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from 'ui';

export default function MarkListInputArea() {
  const { id } = useParams<{ id: string }>();
  const { data: subjectListResponse } = useGetSubjectByStaffIdQuery(id);

  // const [studentMarkList, setStudentMarkList] = useState([]);

  // const page = 1;
  // const limit = 999;
  // const filter = {};
  const [classId, setClassId] = useState('');
  const [sectionId, setSectionId] = useState('');
  const [subjectId, setSubjectId] = useState('');
  const [examId, setExamId] = useState('');
  // const [examDetail, setExamDetail] = useState('');
  // const [sectionDetail, setSectionDetail] = useState('');
  // const [classDetail, setClassDetail] = useState('');
  const [classList, setClassList] = useState([]);
  const [sectionList, setSectionList] = useState({});
  const [subjectList, setSubjectList] = useState({});

  const { data: examList } = useGetExamsBySectionIdQuery(
    sectionId ? { classId, sectionId } : { classId },
    {
      enabled: !!classId,
    }
  );

  // const { data: classList } = useGetClassListQuery({
  //   page,
  //   limit,
  //   filter,
  // });
  // const { data: sectionList } = useGetAllSectionByClassIdQuery(
  //   {
  //     filter,
  //     classId,
  //   },
  //   {
  //     enabled: !!classId,
  //   }
  // );

  useEffect(() => {
    console.log(subjectListResponse);
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
      setSubjectList(subjects);
    }
  }, [subjectListResponse]);

  useEffect(() => {
    console.log(classList, sectionList, subjectList);
  }, [classList, sectionList, subjectList]);
  return (
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
                {subjectList[sectionId]
                  ? subjectList[sectionId]?.map((item) => (
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
  );
}
