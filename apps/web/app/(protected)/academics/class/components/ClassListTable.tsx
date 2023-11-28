'use client';

import { ClassFlyout } from './ClassFlyout';

export function ClassList() {
  return (
    <section className="bg-gray-50 p-3">
      <div className="mx-7 flex justify-end">
        <ClassFlyout />
      </div>
    </section>
  );
}
