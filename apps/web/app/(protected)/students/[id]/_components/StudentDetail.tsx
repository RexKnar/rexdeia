'use client';

import { Loader2 } from 'lucide-react';
import { useParams } from 'next/navigation';
import {
  // Avatar,
  // AvatarImage,
  // Card,
  // CardContent,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Text,
} from 'ui';

import { useGetStudentByIdQuery } from '../../../../../lib/queries/students/useGetStudentByIdQuery';
// import { admissionForm } from '../../enroll-new-student/data';

export function StudentDetail() {
  const { id } = useParams<{ id: string }>();

  const { data: getStudentByIdResponse, isLoading: isGetStudentByIdLoading } =
    useGetStudentByIdQuery(id);
  
  if (isGetStudentByIdLoading) {
    return (
      <div className="flex h-20 items-center justify-center">
        <Loader2 className="mr-2  w-6 animate-spin text-black" />
        <p className=" text-black">Fetching Student Details...</p>
      </div>
    );
  }
  return (
    <section>
      <section className="mt-4 rounded-md bg-white p-6">
        <Text variant="sm-semibold"> {''}</Text>
        <div className="mt-8 flex flex-wrap gap-12">
          <div>
            <label className="text-sm font-semibold text-gray-700"></label>
            <Text variant="base-regular">{''}</Text>
          </div>
        </div>
        <Tabs>
          <TabsList className="w-full justify-start border-b-2 border-gray-400">
            <TabsTrigger
              value="profile"
              className="mr-2 text-base focus:border-b-4 focus:border-primary"
            >
              Personal Information
            </TabsTrigger>
            <TabsTrigger
              value="document"
              className="mr-2 text-base focus:border-b-4 focus:border-primary"
            >
              Documents
            </TabsTrigger>
          </TabsList>
          <Text>{getStudentByIdResponse.firstName}</Text>
          <TabsContent className="w-full" value="profile">
            <section className="max-h-[60vh] overflow-y-auto"></section>
          </TabsContent>
        </Tabs>
      </section>
    </section>
  );
}
