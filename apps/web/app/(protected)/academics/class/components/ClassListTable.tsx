'use client';

import { ClassFlyout } from './ClassFlyout';

export function ClassList() {
  return (
    <section className="p-3 bg-gray-50">
      <div className="flex justify-end mx-7">
        <ClassFlyout />
      </div>
    </section>
  );
}
