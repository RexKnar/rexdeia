import React from 'react';

import { OnboardStaffSidebar } from './OnboardStaffSidebar';

export function OnboardStaffForm() {
  return (
    <form autoFocus autoComplete="off" className="mt-5 w-full">
      <section className="flex gap-4">
        <OnboardStaffSidebar />
      </section>
    </form>
  );
}
