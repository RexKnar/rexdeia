import Image from 'next/image';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';

import { authOptions } from '../../../lib/auth';
import { SetupForm } from '../../../lib/components/auth/SetupForm';
import logo from '../../../public/assets/images/acadx-logo.png';

export const metadata = {
  title: 'acadx | Sign up',
  description:
    'Your step to streamline every aspect of education management starts here.',
};

export default async function Page({
  searchParams,
}: {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect('/signin');
  }

  const selectedBranchId = searchParams.branch as string;
  const selectedOrganizationId = searchParams.organization as string;

  const branchesToSetup = session.user.createdBranches.filter(
    (branch) => !branch.isActivated
  );

  const [{ id: branchId, organizationId }] = branchesToSetup;

  if (
    branchesToSetup.length === 1 &&
    branchId === selectedBranchId &&
    organizationId === selectedOrganizationId
  ) {
    return (
      <section className="flex h-full flex-col sm:flex-row">
        <section
          className="hidden flex-grow bg-cover bg-center bg-no-repeat sm:flex sm:w-auto"
          style={{
            backgroundImage: 'url(/assets/images/online-communication1.png)',
          }}
        ></section>

        <section className="flex h-full w-full translate-y-0 transform flex-col  p-8 opacity-100 transition-all duration-500 ease-in-out sm:w-3/4 md:w-3/4">
          <div className="mt-3 flex justify-center">
            <Image src={logo} alt={'logo'} width={150}></Image>
          </div>
          <div className="mt-1 flex justify-center">
            <SetupForm branchId={branchId} organizationId={organizationId} />
          </div>
        </section>
      </section>
    );
  }

  // TODO: Add a page to select the branch to setup
  return redirect('/');
}
