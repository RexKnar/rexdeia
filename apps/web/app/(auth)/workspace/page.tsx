import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { Button } from 'ui';

import { Workspace } from '@/components/auth/Workspace';

import { authOptions } from '../../../lib/auth';
import { getOrganisationsByUserId } from '../../api/user/organization/service';

export const metadata = {
  title: 'Rexdeia | Workspace Selector',
  description:
    'Your step to streamline every aspect of education management starts here.',
};

export default async function Page() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect('/signin');
  }

  const userOrganizations = await getOrganisationsByUserId(session.user.id);

  //TODO: Handle when user is part of multiple organizations/ branches
  //Need to change the workspace component to take organization array input instead of single organization
  return userOrganizations.length >= 1 ? (
    <Workspace
      branchId={userOrganizations[0].branchId}
      organizationId={userOrganizations[0].organizationId}
      organizationName={userOrganizations[0].organization.name}
      institute={userOrganizations[0].organization.institute}
      organizationRole={userOrganizations[0].role}
    />
  ) : (
    <section className="card">
      <div className="flex flex-col items-center justify-center">
        <h2>Choose an organization</h2>
        <p>You are part of multiple organizations</p>
      </div>
      <div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {userOrganizations.map((organization) => (
            <div
              key={organization.organizationId}
              className="flex flex-wrap content-start items-start gap-6 self-stretch md:gap-24 md:space-x-24"
            >
              <div className="widget h-full w-full rounded-xl border border-primary-200 bg-white p-4 shadow-md shadow-primary-200">
                <div className="widget-title flex items-center justify-between text-lg font-semibold">
                  <h3>
                    {organization.organization.name} ({organization.branch.name}
                    )
                  </h3>

                  <Button variant="default" className="mt-4">
                    Go to {organization.organization.name}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
