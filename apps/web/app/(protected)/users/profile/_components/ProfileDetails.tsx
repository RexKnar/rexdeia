'use client';
import { useGetUserDetailsQuery } from 'lib/queries/useGetUserDetailsQuery';
import { Loader2, Lock, PencilLine } from 'lucide-react';
import Link from 'next/link';
import { Avatar, AvatarImage, Button, Text } from 'ui';

export function ProfileDetails() {
  const { data: userDetails, isLoading, error } = useGetUserDetailsQuery();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-black" />
        <p className="ml-2 text-black">Loading Profile...</p>
      </div>
    );
  }

  if (error || !userDetails) {
    return (
      <p className="text-center text-red-500">Failed to load profile data.</p>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6">
      <section className="w-full max-w-sm overflow-hidden rounded-lg bg-white text-center shadow-lg">
        <div className="h-24 bg-gradient-to-r from-blue-500 to-purple-500"></div>
        <div className="relative -mt-12 flex flex-col items-center">
          <Avatar className="h-24 w-24 rounded-full border-4 border-white shadow-md">
            <AvatarImage src={userDetails.image} />
          </Avatar>
          <div className="mt-4 w-full px-6 text-left">
            <div className="flex justify-between border-b pb-2">
              <Text className="font-semibold text-gray-700">Name</Text>
              <Text className="text-gray-600">{userDetails.name}</Text>
            </div>
            <div className="flex justify-between border-b pb-2">
              <Text className="font-semibold text-gray-700">Email</Text>
              <Text className="text-gray-600">{userDetails.email}</Text>
            </div>
            <div className="flex justify-between border-b pb-2">
              <Text className="font-semibold text-gray-700">Mobile</Text>
              <Text className="text-gray-600">{userDetails.phoneNumber}</Text>
            </div>
          </div>

          <div className="relative mb-6 flex justify-center gap-3 pt-6">
            <Link href="/users/profile/editProfile">
              <Button variant="outline">
                <PencilLine
                  size={18}
                  strokeWidth={2}
                  className="text-primary"
                />
                <span className="pl-2 text-primary">Edit</span>
              </Button>
            </Link>
            <Link href="/user/profile/">
              <Button variant="outline">
                <Lock size={18} strokeWidth={2} className="text-primary" />
                <span className="pl-2 text-primary">Change Password</span>
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
