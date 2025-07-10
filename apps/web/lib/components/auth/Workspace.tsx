'use client';

import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { toast } from 'ui';

import signupGif from '../../../public/assets/images/signin.gif';

type WorkspaceProps = {
  branchId: string;
  organizationId: string;
  organizationName: string;
  institute: string;
  organizationRole: any;
};

export function Workspace({
  branchId,
  organizationId,
  institute,
  organizationName,
  organizationRole,
}: WorkspaceProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentBatch = searchParams.get('currentBatch');
  const callBackUrl = searchParams.get('callBackUrl');
  const { update, status } = useSession();
  const handleSessionUpdate = async (payload) => {
    try {
      const url = new URL(`${window.location.origin}/api/session`);

      const response = await fetch(url.toString(), {
        method: 'PUT',
        body: JSON.stringify(payload),
      });
      if (response) {
        toast({
          title: 'Success',
          description: 'Academic Year updated successfully',
        });
      } else {
        toast({
          title: 'Failed!',
          variant: 'destructive',
          description: 'Something went wrong, please try again!',
        });
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        variant: 'destructive',
        title: 'Upload failed',
        description: 'There was an error updating Academic Year',
      });
    }
  };

  useEffect(() => {
    if (status === 'authenticated') {
      if (currentBatch) {
        handleSessionUpdate({
          branchId,
          organizationId,
          institute,
          organizationName,
          organizationRole,
          currentBatch: currentBatch ?? '',
        });
      }
      update({
        branchId,
        organizationId,
        institute,
        organizationName,
        organizationRole,
        currentBatch: currentBatch ?? '',
      });
      if (callBackUrl) {
        router.push(callBackUrl);
      } else {
        router.push('/');
      }
    }

    // This is intentional as we wanted to update the session only once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, router]);

  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <div className="mt-36 flex justify-center">
        <Image src={signupGif} alt={'logo'} width={400}></Image>
      </div>
      <h1 className="mb-4 text-2xl font-bold">Workspace</h1>
      <p className="text-sm text-gray-500">
        Design Required! This is the workspace page.
      </p>
    </div>
  );
}
