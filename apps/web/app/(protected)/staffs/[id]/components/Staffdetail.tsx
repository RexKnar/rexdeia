'use client';
/* eslint-disable @next/next/no-img-element */

import { useGetSubjectByStaffIdQuery } from 'lib/queries/staff/useGetSubjectListByStaffIdQurey';
import { Loader2 } from 'lucide-react';
import { useParams } from 'next/navigation';
import {
  Avatar,
  AvatarImage,
  Card,
  CardContent,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Text,
} from 'ui';
import { formatDate } from 'utils';

import { SubjectCard } from '@/components/subjectcard/SubjectCard';

import { useGetStaffByIdQuery } from '../../../../../lib/queries/staff/useGetStaffByIdQuery';
import staffForm from '../../onboard-new-staff/data/onboard-staff-fields';

export function StaffDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: SubjectListResponse } = useGetSubjectByStaffIdQuery(id);

  const { data: getStaffByIdResponse, isLoading: isGetStaffByIdLoading } =
    useGetStaffByIdQuery(id);
  if (isGetStaffByIdLoading) {
    return (
      <div className="flex h-20 items-center justify-center">
        <Loader2 className="mr-2 w-6 animate-spin text-black" />
        <p className="text-black ">Fetching Staff Details...</p>
      </div>
    );
  }
  return (
    <section className="grid w-full grid-cols-3 bg-gray-50">
      <div className="mx-auto my-5 mr-4 max-w-80 rounded-md bg-white py-5 pr-3">
        <div className="">
          <div className="flex justify-center">
            <Avatar className="h-20 w-20 cursor-pointer border-2 border-violet-200">
              <AvatarImage src="https://png.pngtree.com/thumb_back/fh260/background/20230612/pngtree-man-wearing-glasses-is-wearing-colorful-background-image_2905240.jpg" />
            </Avatar>
          </div>
          <div className="my-auto flex justify-center px-5 pb-2 pt-3">
            <Text variant="base-bold">{getStaffByIdResponse.firstName}</Text>
          </div>
          <div className="flex justify-center">
            <Text
              variant="base-regular"
              className="mx-2 rounded-lg border bg-violet-100 px-2"
            >
              {getStaffByIdResponse.subjectHandling}
            </Text>
            <Text
              variant="base-regular"
              className="rounded-lg border bg-violet-100 px-2"
            >
              {getStaffByIdResponse.employmentType}
            </Text>
            <Text
              variant="base-regular"
              className="mx-2 rounded-lg border bg-violet-100 px-2"
            >
              {getStaffByIdResponse.bloodGroup}
            </Text>
          </div>
        </div>
        <div className="mt-5 pl-3 ">
          <div className="ml-5 grid grid-cols-4 ">
            <Text className="w-18 pt-1 text-xs text-gray-800">{'DOB'}</Text>
            <Text className="col-span-3">
              {formatDate(getStaffByIdResponse.dateOfBirth.toString())}
            </Text>
          </div>
          <div className="ml-5 grid grid-cols-4 pt-3">
            <Text className="w-18 pt-1 text-xs text-gray-800">{'Gender'}</Text>
            <Text className="col-span-3">{getStaffByIdResponse.gender}</Text>
          </div>

          <div className="ml-5 grid grid-cols-4 pt-3">
            <Text className="w-18 pt-1 text-xs text-gray-800">{'Mobile'} </Text>
            <Text className="col-span-3">{getStaffByIdResponse.mobile}</Text>
          </div>
          <div className="ml-5 grid grid-cols-4 pt-3">
            <Text className="w-18 pt-1 text-xs text-gray-800">{'Email'} </Text>
            <Text className="col-span-3 break-words">
              {getStaffByIdResponse.email}
            </Text>
          </div>
          <div className="ml-5 grid grid-cols-4 pt-3">
            <Text className="w-18 pt-1 text-xs text-gray-800">{'DOJ'} </Text>
            <Text className="col-span-3">
              {formatDate(getStaffByIdResponse.dateOfJoining.toString())}
            </Text>
          </div>
          <div className="ml-5 grid grid-cols-4 pt-3">
            <Text className="w-18 pt-1 text-xs text-gray-800">
              {'Designation'}{' '}
            </Text>
            <Text className="col-span-3">
              {getStaffByIdResponse.employmentType}
            </Text>
          </div>
        </div>
      </div>
      <div className="col-span-2">
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
            <TabsTrigger
              value="subjects"
              className="mr-2 text-base focus:border-b-4 focus:border-primary"
            >
              Subjects
            </TabsTrigger>
          </TabsList>
          <TabsContent className="w-full" value="profile">
            <section className="max-h-[60vh] overflow-y-auto">
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
          <TabsContent className="w-full" value="document">
            <section className="bg-white p-5 ">
              <div>
                <label className="pl-1">Document</label>
              </div>
              <div className=" max-h-[60vh]overflow-y-auto flex flex-wrap gap-5 p-0 pl-2">
                <div className="mt-4 rounded-md bg-white">
                  <Card className="w-40 max-w-60">
                    <CardContent className="p-0">
                      <div className="flex justify-center bg-indigo-100 pb-3 pt-3">
                        <img className="" src="/pdf.png" alt="" />
                      </div>
                      <div className="grid grid-cols-2 bg-white p-2">
                        <Text>{'Document'}</Text>
                        <img
                          className="justify-self-end"
                          src="/dots.png"
                          alt=""
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>
                <div className="mt-4 rounded-md bg-white">
                  <Card className="w-40 max-w-60">
                    <CardContent className="p-0 ">
                      <div className="flex justify-center bg-indigo-100 pb-3 pt-3">
                        <img className="" src="/pdf.png" alt="" />
                      </div>
                      <div className="grid grid-cols-2 bg-white p-2">
                        <Text>{'Document'}</Text>
                        <img
                          className="justify-self-end"
                          src="/dots.png"
                          alt=""
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="mt-4 rounded-md bg-white">
                  <Card className="w-40 max-w-60">
                    <CardContent className="p-0 ">
                      <div className="flex justify-center bg-indigo-100 pb-3 pt-3">
                        <img className="" src="/pdf.png" alt="" />
                      </div>
                      <div className="grid grid-cols-2 bg-white p-2">
                        <Text>{'Document'}</Text>
                        <img
                          className="justify-self-end"
                          src="/dots.png"
                          alt=""
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>
                <div className="mt-4 rounded-md bg-white">
                  <Card className="w-40 max-w-60">
                    <CardContent className="p-0 ">
                      <div className="flex justify-center bg-indigo-100 pb-3 pt-3">
                        <img className="" src="/pdf.png" alt="" />
                      </div>
                      <div className="grid grid-cols-2 bg-white p-2">
                        <Text>{'Document'}</Text>
                        <img
                          className="justify-self-end"
                          src="/dots.png"
                          alt=""
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </section>
          </TabsContent>
          <TabsContent className="w-full" value="subjects">
            <section>
              {SubjectListResponse?.map((classList) => (
                <div key={classList.id}>
                  <div className="my-2 w-full bg-white px-3 py-1">
                    <Text> {classList.name}</Text>
                  </div>
                  <div>
                    {classList.sections?.map((section) => (
                      <div key={section.id}>
                        <div className="my-2 w-full bg-lime-50 px-3 py-2">
                          <Text> {section.name}</Text>

                          <div className="grid w-full grid-cols-3 justify-between gap-4">
                            {section.subjects?.map((subject) => (
                              <div key={subject.id}>
                                <SubjectCard
                                  id={subject.id}
                                  name={subject.name}
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </section>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
