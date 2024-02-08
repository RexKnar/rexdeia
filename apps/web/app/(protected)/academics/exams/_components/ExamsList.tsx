'use client';

import { ExamCard } from './ExamCard';

export function ExamsList() {
  return (
    <div className="container p-4">
      <h2 className="mb-4  text-sm font-semibold text-gray-600">In Progress</h2>
      <div className=" grid grid-cols-6 gap-2 ">
        <ExamCard
          termName="Term name"
          academicYear="Academic year"
          className=" border border-lime-200 bg-lime-50 "
        />

        <ExamCard
          termName="Term name"
          academicYear="Academic year"
          className="ml-2 border border-purple-200 bg-purple-50"
        />

        <ExamCard
          termName="Term name"
          academicYear="Academic year"
          className="ml-2 border border-amber-200 bg-yellow-50 "
        />
      </div>

      <h2 className="mb-4 mt-4 text-sm font-semibold text-gray-600">
        Scheduled
      </h2>
      <div className=" grid grid-cols-6 gap-2 ">
        <ExamCard
          termName="Term name"
          academicYear="Academic year"
          className="mb-4 border border-amber-200 bg-yellow-50  "
        />

        <ExamCard
          termName="Term name"
          academicYear="Academic year"
          className="mb-4 ml-2 border border-lime-200 bg-lime-50"
        />

        <ExamCard
          termName="Term name"
          academicYear="Academic year"
          className="mb-4 ml-2 border border-purple-200 bg-purple-50 "
        />
        <ExamCard
          termName="Term name"
          academicYear="Academic year"
          className="mb-4 ml-2 border border-amber-200 bg-amber-50 "
        />

        <ExamCard
          termName="Term name"
          academicYear="Academic year"
          className="mb-4 ml-2 border border-blue-200 bg-slate-50"
        />

        <ExamCard
          termName="Term name"
          academicYear="Academic year"
          className="mb-4 ml-2 border border-red-200 bg-red-50 "
        />
        <ExamCard
          termName="Term name"
          academicYear="Academic year"
          className="border border-green-200 bg-green-50 "
        />

        <ExamCard
          termName="Term name"
          academicYear="Academic year"
          className="ml-2 border border-violet-200 bg-slate-100 "
        />

        <ExamCard
          termName="Term name"
          academicYear="Academic year"
          className="ml-2 border border-pink-200 bg-pink-50 "
        />
      </div>
      <h2 className="mb-4 ml-2 mt-4 text-sm font-semibold  text-gray-600">
        Completed
      </h2>
      <div className="grid grid-cols-6 gap-2 ">
        <ExamCard
          termName="Term name"
          academicYear="Academic year"
          className="border border-purple-200 bg-purple-50 "
        />

        <ExamCard
          termName="Term name"
          academicYear="Academic year"
          className="ml-2 border border-lime-200 bg-lime-50 "
        />

        <ExamCard
          termName="Term name"
          academicYear="Academic year"
          className="ml-2 border border-amber-200 bg-amber-50  "
        />
        <ExamCard
          termName="Term name"
          academicYear="Academic year"
          className="ml-2 border border-amber-200 bg-yellow-50 "
        />

        <ExamCard
          termName="Term name"
          academicYear="Academic year"
          className="ml-2 border border-red-200 bg-red-50 "
        />

        <ExamCard
          termName="Term name"
          academicYear="Academic year"
          className="ml-2 border border-blue-200 bg-slate-50  "
        />
      </div>
    </div>
  );
}
