'use client';
import { Loader2, PencilLine, Search } from 'lucide-react';
import { useParams } from 'next/navigation';
import {
  Avatar,
  AvatarImage,
  Button,
  Input,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Text,
} from 'ui';

import { useGetStaffByIdQuery } from '../../../../../lib/queries/staff/useGetStaffByIdQuery';
import staffForm from '../../onboard-new-staff/data/onboard-staff-fields';

export function StaffDetail() {
  const params = useParams<{ id: string }>();

  const { data: getStaffByIdResponse, isLoading: isGetStaffByIdLoading } =
    useGetStaffByIdQuery(params?.id);
  if (isGetStaffByIdLoading) {
    return (
      <div className="flex h-20 items-center justify-center">
        <Loader2 className="mr-2  w-6 animate-spin text-black" />
        <p className=" text-black">Fetching Staff Details...</p>
      </div>
    );
  }
  return (
    <section className="w-full bg-gray-50 p-3">
      <div className="space-between mx-auto my-5 flex justify-between rounded-md bg-white p-6">
        <div className="flex">
          <Avatar className="h-20 w-20 cursor-pointer">
            <AvatarImage src="https://png.pngtree.com/thumb_back/fh260/background/20230612/pngtree-man-wearing-glasses-is-wearing-colorful-background-image_2905240.jpg" />
          </Avatar>
          <div className="my-auto px-5">
            <Text variant="base-bold">{getStaffByIdResponse.firstName}</Text>
            <Text variant="base-regular">{getStaffByIdResponse.mobile}</Text>
          </div>
        </div>
        <div className="my-auto flex gap-4 px-5">
          <div className="relative">
            <Input
              type="text"
              className="border-primary-500 text-sm"
              placeholder="Search"
            />
            <div className="absolute inset-y-0 right-0 flex cursor-pointer items-center pr-2">
              <Search
                className="text-primary-500"
                size={18}
                strokeWidth={1.5}
              />
            </div>
          </div>
          <div className="relative my-auto">
            <Button variant="outline" className="mb-2 text-primary">
              <PencilLine size={18} strokeWidth={0.5} />
              <span className="pl-2">Edit</span>
            </Button>
          </div>
        </div>
      </div>
      <Tabs defaultValue="profile" className="mt-4">
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
        <TabsContent className="w-full" value="profile">
          <section className="max-h-[50vh] overflow-y-auto">
            {staffForm.map((section) => (
              <div
                key={section.sectionTitle}
                className="mt-4 rounded-md bg-white p-6"
              >
                <Text variant="sm-semibold">{section.sectionTitle}</Text>
                <div className="mt-8 flex flex-wrap gap-12">
                  {section.sectionFields.map((field) => (
                    <div key={field.name}>
                      <label className="text-sm font-semibold text-gray-700">
                        {field.label}
                      </label>
                      <Text variant="base-regular">
                        {getStaffByIdResponse[field.name]
                          ? getStaffByIdResponse[field.name]
                          : 'N/A'}
                      </Text>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </section>
        </TabsContent>
        <TabsContent value="document">
          <h1>Page 2</h1>
        </TabsContent>
      </Tabs>
    </section>
  );
}
