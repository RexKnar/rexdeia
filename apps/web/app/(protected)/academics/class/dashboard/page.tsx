import { authOptions } from 'lib/auth';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import React from 'react';

import { ClassDashboardBanner } from './_components/ClassDashboardBanner';
import { ClassWidgetContainer } from './_components/ClassWidgetContainer';

export default async function Page() {
  const session = await getServerSession(authOptions);
  if (!session || !session.branchId || !session.organizationId) {
    return redirect('/signin?callbackUrl=/academics/class');
  }
  return (
    <div>
      <ClassDashboardBanner />
      <ClassWidgetContainer />
    </div>
  );
}
