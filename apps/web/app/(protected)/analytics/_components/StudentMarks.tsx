'use client';

const studentsMarks = [
  {
    studentId: 'bb30db99-4534-4a4c-a5aa-1a7ff12caec1',
    studentName: 'Krishna',
    subjects: [
      {
        subjectId: '1850dd26-30e8-4035-a3c1-394049695947',
        subjectName: 'English',
        assessmentFormat: [{ name: 'practical', id: '', mark: '98' }],
      },
      {
        subjectId: 'e5d79993-bf27-48a6-908b-d90851442406',
        subjectName: 'Maths',
        assessmentFormat: [
          { name: 'theory', id: '', mark: '85' },
          { name: 'practical', id: '', mark: '85' },
        ],
      },
    ],
  },
  {
    studentId: 'ef2a9157-56ea-4e77-a6e6-aaa1eb6268a9',
    studentName: 'Lakshmi',
    subjects: [
      {
        subjectId: '1850dd26-30e8-4035-a3c1-394049695947',
        subjectName: 'English',
        assessmentFormat: [{ name: 'practical', id: '', mark: '98' }],
      },
      {
        subjectId: 'e5d79993-bf27-48a6-908b-d90851442406',
        subjectName: 'Maths',
        assessmentFormat: [
          { name: 'theory', id: '', mark: '85' },
          { name: 'practical', id: '', mark: '85' },
        ],
      },
    ],
  },
  {
    studentId: '3d329074-6afb-4dcf-8359-30deb7163d4a',
    studentName: 'Raji',
    subjects: [
      {
        subjectId: '1850dd26-30e8-4035-a3c1-394049695947',
        subjectName: 'English',
        assessmentFormat: [{ name: 'practical', id: '', mark: '98' }],
      },
      {
        subjectId: 'e5d79993-bf27-48a6-908b-d90851442406',
        subjectName: 'Maths',
        assessmentFormat: [
          { name: 'theory', id: '', mark: '85' },
          { name: 'practical', id: '', mark: '85' },
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
                {subject.assessmentFormat.map((format) => (
                  <div key={format.id} className="text-sm text-gray-900">
                    {format.name} {format.mark}
                  </div>
                ))}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
