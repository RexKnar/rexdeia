'use client';

import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';

type WorkspaceProps = {
  branchId: string;
  organizationId: string;
};

export function Workspace({ branchId, organizationId }: WorkspaceProps) {
  const router = useRouter();
  const { update, status } = useSession();

  useEffect(() => {
    if (status === 'authenticated') {
      update({
        branchId,
        organizationId,
      });

      router.push('/');
    }
    // This is intentional as we wanted to update the session only once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, router]);

  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <h1 className="mb-4 text-2xl font-bold">Workspace</h1>
      <p className="text-sm text-gray-500">
        Design Required! This is the workspace page.
      </p>
    </div>
  );
}
