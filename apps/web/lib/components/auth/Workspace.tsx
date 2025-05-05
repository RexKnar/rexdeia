'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';

import signupGif from '../../../public/assets/images/signin.gif';

type WorkspaceProps = {
  branchId: string;
  organizationId: string;
  organizationName: string;
  institute: string;
};

export function Workspace({
  branchId,
  organizationId,
  institute,
  organizationName,
}: WorkspaceProps) {
  const router = useRouter();
  const { update, status } = useSession();

  useEffect(() => {
    if (status === 'authenticated') {
      update({
        branchId,
        organizationId,
        institute,
        organizationName,
      });

      router.push('/');
    }
    // This is intentional as we wanted to update the session only once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, router]);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="flex justify-center mt-36">
        <Image src={signupGif} alt={'logo'} width={400}></Image>
      </div>
      <h1 className="mb-4 text-2xl font-bold">Workspace</h1>
      <p className="text-sm text-gray-500">
        Design Required! This is the workspace page.
      </p>
    </div>
  );
}
