'use client';
/* eslint-disable prettier/prettier */

import { useGetUserDetailsQuery } from 'lib/queries/useGetUserDetailsQuery';
import { Loader2, Lock, PencilLine } from 'lucide-react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Avatar, AvatarImage, Button, Text } from 'ui';

const EditUserPasswordFlyOut = dynamic(() =>
  import('../_modals/EditUserPasswordFlyOut').then((mod) => mod.default)
);
export function ProfileDetails() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: userDetails, isLoading, error } = useGetUserDetailsQuery();

  if (isLoading) {
    return (
      <div className="flex h-20 items-center justify-center">
        <Loader2 className="mr-2 w-6 animate-spin text-black" />
        <p className="text-black ">Fetching Staff Details...</p>
      </div>
    );
  }

  if (error || !userDetails) {
    return (
      <p className="text-center text-red-500">Failed to load profile data.</p>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-6">
      <section className="w-full max-w-sm rounded-xl border border-gray-200 bg-white shadow-lg">
        <div className="flex flex-col items-center p-6">
          <Avatar className="relative h-28 w-28 border-4 border-white shadow-md">
            <AvatarImage src={userDetails.image} />
          </Avatar>
          <div className="mt-4 w-full space-y-4">
            {[
              { label: 'Name', value: userDetails.name },
              { label: 'Email', value: userDetails.email },
              { label: 'Mobile', value: userDetails.phoneNumber },
            ].map((item, index) => (
              <div
                key={index}
                className="flex justify-between border-b border-gray-300 pb-2"
              >
                <Text className="font-medium text-gray-700">{item.label}</Text>
                <Text className="text-gray-600">{item.value}</Text>
              </div>
            ))}
          </div>
          <div className="flex justify-center gap-4 pt-6">
            <Link href="/users/profile/editProfile">
              <Button
                variant="outline"
                className="border-gray-300 transition-all hover:border-gray-400 hover:bg-gray-100"
              >
                <PencilLine
                  size={18}
                  strokeWidth={2}
                  className="text-primary"
                />
                <span className="pl-2 text-primary">Edit</span>
              </Button>
            </Link>
            <Button
              variant="outline"
              className="border-gray-300 transition-all hover:border-gray-400 hover:bg-gray-100"
              onClick={() => {
                const params = new URLSearchParams(searchParams);
                params.set('isUserPasswordFlyoutOpen', 'true');
                router.replace(pathname + '?' + params.toString());
              }}
            >
              <Lock size={18} strokeWidth={2} className="text-primary" />
              <span className="pl-2 text-primary">Change Password</span>
            </Button>
          </div>
        </div>
      </section>
      <EditUserPasswordFlyOut />
    </div>
  );
}
