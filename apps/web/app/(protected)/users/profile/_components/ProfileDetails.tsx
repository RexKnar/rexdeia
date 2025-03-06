'use client';
import { useGetUserDetailsQuery } from 'lib/queries/useGetUserDetailsQuery';
import { PencilLine, Loader2, Lock } from 'lucide-react';
import Link from 'next/link';
import { Avatar, AvatarImage, Text, Button } from 'ui';

export function ProfileDetails() {
  const { data: userDetails, isLoading, error } = useGetUserDetailsQuery();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-6 h-6 text-black animate-spin" />
        <p className="ml-2 text-black">Loading Profile...</p>
      </div>
    );
  }

  if (error || !userDetails) {
    return <p className="text-center text-red-500">Failed to load profile data.</p>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <section className="w-full max-w-sm overflow-hidden text-center bg-white rounded-lg shadow-lg">
        <div className="h-24 bg-gradient-to-r from-blue-500 to-purple-500"></div>
        <div className="relative flex flex-col items-center -mt-12">
          <Avatar className="w-24 h-24 border-4 border-white rounded-full shadow-md">
            <AvatarImage src={userDetails.image} />
          </Avatar>
          <div className="w-full px-6 mt-4 text-left">
            <div className="flex justify-between pb-2 border-b">
              <Text className="font-semibold text-gray-700">Name</Text>
              <Text className="text-gray-600">{userDetails.name}</Text>
            </div>
            <div className="flex justify-between pb-2 border-b">
              <Text className="font-semibold text-gray-700">Email</Text>
              <Text className="text-gray-600">{userDetails.email}</Text>
            </div>
            <div className="flex justify-between pb-2 border-b">
              <Text className="font-semibold text-gray-700">Mobile</Text>
              <Text className="text-gray-600">{userDetails.phoneNumber}</Text>
            </div>
          </div>

          <div className="relative flex justify-center gap-3 pt-6 mb-6">
            <Link href="/users/profile/editProfile">
              <Button variant="outline">
                <PencilLine size={18} strokeWidth={2} className="text-primary" />
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