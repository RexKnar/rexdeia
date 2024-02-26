'use client';

import { Button, Input } from 'ui';
import { cn } from 'utils';

export function StudentAttendanceListTable() {
  return (
    <section>
      <h6>All Students</h6>
      <section className="w-1/4">
        <section
          className={cn(
            'flex w-full cursor-pointer flex-col gap-4 rounded-md border-[1.5px] bg-white p-4 shadow-sm hover:border-gray-700'
          )}
        >
          <div className="text-sm font-normal text-gray-700">
            Total Students
          </div>
          <div className="flex items-center justify-between gap-6">
            <div className="text-md font-semibold">32</div>
          </div>
        </section>
        <section
          className={cn(
            'flex w-full cursor-pointer flex-col gap-4 rounded-md border-[1.5px] bg-white p-4 shadow-sm hover:border-gray-700'
          )}
        >
          <div className="flex justify-between">
            <section className="flex w-1/2 flex-col ">
              <div className="text-sm font-normal text-gray-700">Absenties</div>
              <div className="text-sm font-semibold">32</div>
            </section>
            <section className="flex w-1/2 flex-col items-center">
              <div className="text-sm font-normal text-gray-700">OnLeave</div>
              <div className="text-sm font-semibold">32</div>
            </section>
          </div>
          <Button variant="outline" className="w-30 h-9 px-3 py-2">
            Contact Parents
          </Button>
        </section>
        <section
          className={cn(
            'flex w-full cursor-pointer flex-col gap-4 rounded-md border-[1.5px] bg-white p-4 shadow-sm hover:border-gray-700'
          )}
        >
          <section>
            <Input type="date" />
          </section>
          <section>
            <Input type="date" />
          </section>
          <section>
            <Input type="date" />
          </section>
          <section>
            <Input type="date" />
          </section>
          <section>
            <Input type="date" />
          </section>
          <section>
            <Input type="date" />
          </section>
        </section>
      </section>
    </section>
  );
}
