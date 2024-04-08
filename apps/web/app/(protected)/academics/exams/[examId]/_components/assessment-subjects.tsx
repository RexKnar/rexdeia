'use client';

import { useEffect } from 'react';
import { useFieldArray } from 'react-hook-form';

import { MarkFields } from './Mark-Fields';

export function AssessmentSubjects({ nestIndex, control, register }) {
  const { fields, append } = useFieldArray({
    control,
    name: `studentsMarkDetails.${nestIndex}.subjects`,
  });

  const subjects = [
    {
      id: '8a0d03d1-e016-488c-84b6-6c1b49d4a2e4',
      subject: {
        name: 'Tamil',
        id: '8ab473d1-a744-423f-89c7-1c47e7af5362',
      },
      examConfiguration: [
        {
          minPassMark: 27,
          markToConduct: 75,
          markToConvert: 75,
          assessmentFormat: {
            id: 'e3584f0c-37f7-41b0-a9ce-884773102ba2',
            name: 'Theory',
            isActive: true,
            hasMarkEntry: true,
            parentId: null,
            branchId: '491d705d-67ca-4b27-9546-6237ab9f3057',
            isDeleted: false,
            createdAt: '2024-04-05T06:28:03.176Z',
            updatedAt: '2024-04-05T06:28:03.176Z',
          },
        },
        {
          minPassMark: 35,
          markToConduct: 100,
          markToConvert: 100,
          assessmentFormat: null,
        },
      ],
    },
    {
      id: '69313600-1ba1-4b07-ac91-57e831d6b3d1',
      subject: {
        name: 'English',
        id: '5e34064a-83dc-4464-b5a6-f939146e7ec4',
      },
      examConfiguration: [
        {
          minPassMark: 27,
          markToConduct: 75,
          markToConvert: 75,
          assessmentFormat: {
            id: 'e3584f0c-37f7-41b0-a9ce-884773102ba2',
            name: 'Theory',
            isActive: true,
            hasMarkEntry: true,
            parentId: null,
            branchId: '491d705d-67ca-4b27-9546-6237ab9f3057',
            isDeleted: false,
            createdAt: '2024-04-05T06:28:03.176Z',
            updatedAt: '2024-04-05T06:28:03.176Z',
          },
        },
        {
          minPassMark: 35,
          markToConduct: 100,
          markToConvert: 100,
          assessmentFormat: null,
        },
      ],
    },
    {
      id: 'f3d90dba-66a3-4150-9ca0-c9806d5858a0',
      subject: {
        name: 'Maths',
        id: 'efcc9c13-4cee-4ba2-a506-6671b2330c22',
      },
      examConfiguration: [
        {
          minPassMark: 27,
          markToConduct: 75,
          markToConvert: 75,
          assessmentFormat: {
            id: 'e3584f0c-37f7-41b0-a9ce-884773102ba2',
            name: 'Theory',
            isActive: true,
            hasMarkEntry: true,
            parentId: null,
            branchId: '491d705d-67ca-4b27-9546-6237ab9f3057',
            isDeleted: false,
            createdAt: '2024-04-05T06:28:03.176Z',
            updatedAt: '2024-04-05T06:28:03.176Z',
          },
        },
        {
          minPassMark: 13,
          markToConduct: 25,
          markToConvert: 25,
          assessmentFormat: {
            id: '5cd2fbab-72f3-40df-9250-5a13858e5a98',
            name: 'Practical',
            isActive: true,
            hasMarkEntry: true,
            parentId: null,
            branchId: '491d705d-67ca-4b27-9546-6237ab9f3057',
            isDeleted: false,
            createdAt: '2024-04-05T06:28:18.050Z',
            updatedAt: '2024-04-05T06:28:18.050Z',
          },
        },
        {
          minPassMark: 35,
          markToConduct: 100,
          markToConvert: 100,
          assessmentFormat: null,
        },
      ],
    },
    {
      id: '62469e39-e1d4-4ff2-b921-e12ab1fa71c3',
      subject: {
        name: 'Science',
        id: '38210791-a2d8-4b86-b047-2efc62c8e921',
      },
      examConfiguration: [
        {
          minPassMark: 27,
          markToConduct: 75,
          markToConvert: 75,
          assessmentFormat: {
            id: 'e3584f0c-37f7-41b0-a9ce-884773102ba2',
            name: 'Theory',
            isActive: true,
            hasMarkEntry: true,
            parentId: null,
            branchId: '491d705d-67ca-4b27-9546-6237ab9f3057',
            isDeleted: false,
            createdAt: '2024-04-05T06:28:03.176Z',
            updatedAt: '2024-04-05T06:28:03.176Z',
          },
        },
        {
          minPassMark: 13,
          markToConduct: 25,
          markToConvert: 25,
          assessmentFormat: {
            id: '5cd2fbab-72f3-40df-9250-5a13858e5a98',
            name: 'Practical',
            isActive: true,
            hasMarkEntry: true,
            parentId: null,
            branchId: '491d705d-67ca-4b27-9546-6237ab9f3057',
            isDeleted: false,
            createdAt: '2024-04-05T06:28:18.050Z',
            updatedAt: '2024-04-05T06:28:18.050Z',
          },
        },
        {
          minPassMark: 35,
          markToConduct: 100,
          markToConvert: 100,
          assessmentFormat: null,
        },
      ],
    },
    {
      id: 'd4aadfd8-8478-4424-98b5-d4f35e6f64d1',
      subject: {
        name: 'Physics',
        id: '87c27d5a-e47a-4ae8-bf36-b960aabdc50f',
      },
      examConfiguration: [
        {
          minPassMark: 27,
          markToConduct: 75,
          markToConvert: 75,
          assessmentFormat: {
            id: 'e3584f0c-37f7-41b0-a9ce-884773102ba2',
            name: 'Theory',
            isActive: true,
            hasMarkEntry: true,
            parentId: null,
            branchId: '491d705d-67ca-4b27-9546-6237ab9f3057',
            isDeleted: false,
            createdAt: '2024-04-05T06:28:03.176Z',
            updatedAt: '2024-04-05T06:28:03.176Z',
          },
        },
        {
          minPassMark: 13,
          markToConduct: 25,
          markToConvert: 25,
          assessmentFormat: {
            id: '5cd2fbab-72f3-40df-9250-5a13858e5a98',
            name: 'Practical',
            isActive: true,
            hasMarkEntry: true,
            parentId: null,
            branchId: '491d705d-67ca-4b27-9546-6237ab9f3057',
            isDeleted: false,
            createdAt: '2024-04-05T06:28:18.050Z',
            updatedAt: '2024-04-05T06:28:18.050Z',
          },
        },
        {
          minPassMark: 35,
          markToConduct: 100,
          markToConvert: 100,
          assessmentFormat: null,
        },
      ],
    },
    {
      id: 'dfe2bcc2-dc7a-4ce7-b678-eeedbdd2879a',
      subject: {
        name: 'Zoology',
        id: '9004af94-f02a-4432-90f8-47b8e978ac72',
      },
      examConfiguration: [
        {
          minPassMark: 27,
          markToConduct: 75,
          markToConvert: 75,
          assessmentFormat: {
            id: 'e3584f0c-37f7-41b0-a9ce-884773102ba2',
            name: 'Theory',
            isActive: true,
            hasMarkEntry: true,
            parentId: null,
            branchId: '491d705d-67ca-4b27-9546-6237ab9f3057',
            isDeleted: false,
            createdAt: '2024-04-05T06:28:03.176Z',
            updatedAt: '2024-04-05T06:28:03.176Z',
          },
        },
        {
          minPassMark: 35,
          markToConduct: 100,
          markToConvert: 100,
          assessmentFormat: null,
        },
      ],
    },
  ];

  useEffect(() => {
    if (fields.length === 0) {
      subjects?.forEach((format, index) => {
        if (subjects[index]) {
          append({
            subjectId: format.id,
          });
        }
      });
    }
  }, []);

  return (
    <div key={nestIndex} className="flex bg-green-100 p-4">
      {fields.map((subject, subjectIndex) => {
        if (subjects[subjectIndex]) {
          return (
            <div
              key={subjectIndex}
              className="flex w-2/5 border-2 border-black bg-green-100 p-4"
            >
              <MarkFields
                nestIndex={nestIndex}
                subjectIndex={subjectIndex}
                control={control}
                register={register}
                assessmentFormats={subjects[subjectIndex]}
                assessmentId={subject.id}
              />
            </div>
          );
        } else {
          return null;
        }
      })}
    </div>
  );
}
