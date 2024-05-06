'use client';

const studentsMarks = [
  {
    studentId: '6aa723d9-d41e-474e-944a-96e4c69f5f6c',
    studentName: 'Krishna',
    subjects: [
      {
        subjectId: '45e114c6-245b-4989-a3a4-09a1fafa3689',
        subjectName: 'Tamil',
        marks: [
          {
            mark: 86,
            attandance: 0,
            assessmentFormat: {
              id: 'fbcb2abd-6584-4166-8b0c-b1bde4b6aaa1',
              name: 'Theory',
            },
            student: {
              id: '6aa723d9-d41e-474e-944a-96e4c69f5f6c',
              firstName: 'Krishna',
            },
          },
        ],
      },
      {
        subjectId: '7b57cf8d-ac90-474c-9939-5d0be8169522',
        subjectName: 'English',
        marks: [],
      },
      {
        subjectId: '4f571025-c51c-43d3-8806-b77c885f5a16',
        subjectName: 'Maths',
        marks: [
          {
            mark: 23,
            attandance: 0,
            assessmentFormat: {
              id: '14c0c31d-8809-4c4a-99ad-d3ddbc42b39c',
              name: 'Practial',
            },
            student: {
              id: '6aa723d9-d41e-474e-944a-96e4c69f5f6c',
              firstName: 'Krishna',
            },
          },
          {
            mark: 67,
            attandance: 0,
            assessmentFormat: {
              id: 'fbcb2abd-6584-4166-8b0c-b1bde4b6aaa1',
              name: 'Theory',
            },
            student: {
              id: '6aa723d9-d41e-474e-944a-96e4c69f5f6c',
              firstName: 'Krishna',
            },
          },
        ],
      },
    ],
  },
  {
    studentId: 'ab5410ad-2fcf-436b-9420-be93568a6997',
    studentName: 'Gopi',
    subjects: [
      {
        subjectId: '45e114c6-245b-4989-a3a4-09a1fafa3689',
        subjectName: 'Tamil',
        marks: [
          {
            mark: 98,
            attandance: 0,
            assessmentFormat: {
              id: 'fbcb2abd-6584-4166-8b0c-b1bde4b6aaa1',
              name: 'Theory',
            },
            student: {
              id: 'ab5410ad-2fcf-436b-9420-be93568a6997',
              firstName: 'Gopi',
            },
          },
        ],
      },
      {
        subjectId: '7b57cf8d-ac90-474c-9939-5d0be8169522',
        subjectName: 'English',
        marks: [],
      },
      {
        subjectId: '4f571025-c51c-43d3-8806-b77c885f5a16',
        subjectName: 'Maths',
        marks: [
          {
            mark: 24,
            attandance: 0,
            assessmentFormat: {
              id: '14c0c31d-8809-4c4a-99ad-d3ddbc42b39c',
              name: 'Practial',
            },
            student: {
              id: 'ab5410ad-2fcf-436b-9420-be93568a6997',
              firstName: 'Gopi',
            },
          },
          {
            mark: 73,
            attandance: 0,
            assessmentFormat: {
              id: 'fbcb2abd-6584-4166-8b0c-b1bde4b6aaa1',
              name: 'Theory',
            },
            student: {
              id: 'ab5410ad-2fcf-436b-9420-be93568a6997',
              firstName: 'Gopi',
            },
          },
        ],
      },
    ],
  },
  {
    studentId: 'b40e5a1a-2864-4673-8ef0-4c421c38fb24',
    studentName: 'Raji',
    subjects: [
      {
        subjectId: '45e114c6-245b-4989-a3a4-09a1fafa3689',
        subjectName: 'Tamil',
        marks: [
          {
            mark: 93,
            attandance: 0,
            assessmentFormat: {
              id: 'fbcb2abd-6584-4166-8b0c-b1bde4b6aaa1',
              name: 'Theory',
            },
            student: {
              id: 'b40e5a1a-2864-4673-8ef0-4c421c38fb24',
              firstName: 'Raji',
            },
          },
        ],
      },
      {
        subjectId: '7b57cf8d-ac90-474c-9939-5d0be8169522',
        subjectName: 'English',
        marks: [],
      },
      {
        subjectId: '4f571025-c51c-43d3-8806-b77c885f5a16',
        subjectName: 'Maths',
        marks: [
          {
            mark: 22,
            attandance: 0,
            assessmentFormat: {
              id: '14c0c31d-8809-4c4a-99ad-d3ddbc42b39c',
              name: 'Practial',
            },
            student: {
              id: 'b40e5a1a-2864-4673-8ef0-4c421c38fb24',
              firstName: 'Raji',
            },
          },
          {
            mark: 56,
            attandance: 0,
            assessmentFormat: {
              id: 'fbcb2abd-6584-4166-8b0c-b1bde4b6aaa1',
              name: 'Theory',
            },
            student: {
              id: 'b40e5a1a-2864-4673-8ef0-4c421c38fb24',
              firstName: 'Raji',
            },
          },
        ],
      },
    ],
  },
];

export function StudentsMarks() {
  return (
    <table className="min-w-full divide-y divide-gray-200 shadow-md">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-black">
            Student
          </th>
          {studentsMarks[0].subjects.map((subject) => (
            <th
              key={subject.subjectId}
              className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-black"
            >
              {subject.subjectName}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200 bg-white">
        {studentsMarks.map((student) => (
          <tr key={student.studentId}>
            <td className="whitespace-nowrap px-6 py-4">
              {student.studentName}
            </td>
            {student.subjects.map((subject) => (
              <td
                key={subject.subjectId}
                className="whitespace-nowrap px-6 py-4"
              >
                {subject.marks.length === 0 ? (
                  <div className="text-sm text-gray-900">-</div>
                ) : (
                  subject.marks.map((mark, index) => (
                    <div key={index} className="text-sm text-gray-900">
                      {mark.assessmentFormat.name} : {mark.mark}
                    </div>
                  ))
                )}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
