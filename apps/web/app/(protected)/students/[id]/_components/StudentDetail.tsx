/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/no-unescaped-entities */
'use client';

import { Loader2 } from 'lucide-react';
import { useParams } from 'next/navigation';
import {
  Avatar,
  AvatarImage,
  Card,
  CardContent,
  CardHeader,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Text,
} from 'ui';

import { useGetStudentByIdQuery } from '../../../../../lib/queries/students/useGetStudentByIdQuery';

export function StudentDetail() {
  const { id } = useParams<{ id: string }>();

  const { data: getStudentByIdResponse, isLoading: isGetStudentByIdLoading } =
    useGetStudentByIdQuery(id);

  if (isGetStudentByIdLoading) {
    return (
      <div className="flex items-center justify-center h-20">
        <Loader2 className="w-6 mr-2 text-black animate-spin" />
        <p className="text-black ">Fetching Student Details...</p>
      </div>
    );
  }
  return (
    <section className="flex justify-start w-full gap-5 mt-10">
      <section className="col-span-3 ">
        <Card className="bg-white rounded-md w-72">
          <CardHeader>
            <div className="">
              <div className="flex justify-center">
                <Avatar className="w-20 h-20 border-2 cursor-pointer border-violet-200">
                  <AvatarImage src="https://png.pngtree.com/thumb_back/fh260/background/20230612/pngtree-man-wearing-glasses-is-wearing-colorful-background-image_2905240.jpg" />
                </Avatar>
              </div>
              <div className="flex justify-center px-5 pt-3 pb-2 my-auto">
                <Text variant="base-bold">
                  {getStudentByIdResponse.firstName}
                </Text>
              </div>
              <div className="flex justify-center">
                <Text
                  variant="base-regular"
                  className="px-2 mx-2 border rounded-lg bg-violet-100"
                >
                  {getStudentByIdResponse.additionalAttributes.admissionNumber}
                </Text>
                <Text
                  variant="base-regular"
                  className="px-2 border rounded-lg bg-violet-100"
                >
                  {getStudentByIdResponse.additionalAttributes.age}
                </Text>
                <Text
                  variant="base-regular"
                  className="px-2 mx-2 border rounded-lg bg-violet-100"
                >
                  {getStudentByIdResponse.bloodGroup}
                </Text>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pl-0">
            <div className="pl-3 mt-5 ">
              <div className="grid grid-cols-3 ml-5 ">
                <Text className="pt-1 text-xs text-gray-800 w-18">{'DOB'}</Text>
                <Text className="col-span-2">
                  {getStudentByIdResponse.dob.toString()}
                </Text>
              </div>
              <div className="grid grid-cols-3 pt-3 ml-5">
                <Text className="pt-1 text-xs text-gray-800 w-18">
                  {'Gender'}
                </Text>
                <Text className="col">{getStudentByIdResponse.gender}</Text>
              </div>

              <div className="grid grid-cols-3 pt-3 ml-5">
                <Text className="pt-1 text-xs text-gray-800 w-18">
                  {'Mobile'}
                </Text>
                <Text className="">{getStudentByIdResponse.phoneNumber}</Text>
              </div>
              <div className="grid grid-cols-3 pt-3 ml-5">
                <Text className="pt-1 text-xs text-gray-800 w-18">
                  {'Email'}
                </Text>
                <Text className="col-span-2 break-words">
                  {getStudentByIdResponse.emailId}
                </Text>
              </div>
              <div className="grid grid-cols-3 pt-3 ml-5">
                <Text className="pt-1 text-xs text-gray-800 w-18">{'DOA'}</Text>
                <Text className="">
                  {getStudentByIdResponse.additionalAttributes.dateOfJoining.toString()}
                </Text>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
      <section className="col-span-7">
        <Tabs defaultValue="profile" className="border-0 ">
          <TabsList className="justify-start w-full border-b-2 border-gray-100">
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
            <section className="max-h-[60vh] overflow-y-auto">
              <div className="bg-white rounded-md ">
                <Text className="pt-5 pl-5" variant="sm-semibold">
                  {'BASIC DETAILS'}
                </Text>
                <div className="flex flex-wrap gap-12 p-6 mt-2">
                  <div>
                    <label className="text-sm font-semibold text-gray-700">
                      First name
                    </label>
                    <Text variant="base-regular">
                      {getStudentByIdResponse.firstName}
                    </Text>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700">
                      Middle name
                    </label>
                    <Text variant="base-regular">
                      {getStudentByIdResponse.middleName}
                    </Text>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700">
                      Last name
                    </label>
                    <Text variant="base-regular">
                      {getStudentByIdResponse.lastName}
                    </Text>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700">
                      Date of Birth
                    </label>
                    <Text variant="base-regular">
                      {getStudentByIdResponse.dob}
                    </Text>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700">
                      Age
                    </label>
                    <Text variant="base-regular">
                      {getStudentByIdResponse.additionalAttributes?.age}
                    </Text>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700">
                      Gender
                    </label>
                    <Text variant="base-regular">
                      {getStudentByIdResponse.gender}
                    </Text>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700">
                      Mobile Number
                    </label>
                    <Text variant="base-regular">
                      {getStudentByIdResponse.phoneNumber}
                    </Text>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700">
                      Email
                    </label>
                    <Text variant="base-regular">
                      {getStudentByIdResponse.emailId}
                    </Text>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700">
                      Blood Group
                    </label>
                    <Text variant="base-regular">
                      {getStudentByIdResponse.bloodGroup}
                    </Text>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700">
                      Aadhar Card Number
                    </label>
                    <Text variant="base-regular">
                      {getStudentByIdResponse.aadharCardNumber}
                    </Text>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700">
                      Mother Tongue
                    </label>
                    <Text variant="base-regular">
                      {getStudentByIdResponse.motherTongueId}
                    </Text>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700">
                      Religion
                    </label>
                    <Text variant="base-regular">
                      {getStudentByIdResponse.religion}
                    </Text>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700">
                      Community
                    </label>
                    <Text variant="base-regular">
                      {getStudentByIdResponse.additionalAttributes.community}
                    </Text>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700">
                      Caste
                    </label>
                    <Text variant="base-regular">
                      {getStudentByIdResponse.additionalAttributes?.caste}
                    </Text>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700">
                      Differently abled
                    </label>
                    <Text variant="base-regular">
                      {
                        getStudentByIdResponse.additionalAttributes
                          ?.differentlyAbled
                      }
                    </Text>
                  </div>
                </div>

                <div className="mt-4 bg-white border-t-8 border-gray-100">
                  <Text variant="sm-semibold" className="pt-5 pl-6">
                    {'PARENTS DETAILS'}
                  </Text>
                  <div className="flex flex-wrap gap-12 p-6 mt-2">
                    <div>
                      <label className="text-sm font-semibold text-gray-700">
                        Father's Name`
                      </label>
                      <Text variant="base-regular">
                        {getStudentByIdResponse.fatherName}
                      </Text>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-700">
                        Father's Occupation
                      </label>
                      <Text variant="base-regular">
                        {getStudentByIdResponse.fatherOccupation}
                      </Text>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-700">
                        Father's Phone Number
                      </label>
                      <Text variant="base-regular">
                        {getStudentByIdResponse.fatherPhoneNumber}
                      </Text>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-700">
                        Father's Education
                      </label>
                      <Text variant="base-regular">
                        {
                          getStudentByIdResponse.additionalAttributes
                            ?.fatherEducation
                        }
                      </Text>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-700">
                        Father's Aadhar Card Number
                      </label>
                      <Text variant="base-regular">
                        {
                          getStudentByIdResponse.additionalAttributes
                            ?.fatherAadharCardNumber
                        }
                      </Text>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-700">
                        Mother's Name
                      </label>
                      <Text variant="base-regular">
                        {getStudentByIdResponse.motherName}
                      </Text>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-700">
                        Mother's Occupation
                      </label>
                      <Text variant="base-regular">
                        {getStudentByIdResponse.motherOccupation}
                      </Text>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-700">
                        Mother's Phone Number
                      </label>
                      <Text variant="base-regular">
                        {getStudentByIdResponse.motherPhoneNumber}
                      </Text>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-700">
                        Mother's Education
                      </label>
                      <Text variant="base-regular">
                        {
                          getStudentByIdResponse.additionalAttributes
                            .motherEducation
                        }
                      </Text>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-700">
                        Mother's Aadhar Card Number
                      </label>
                      <Text variant="base-regular">
                        {
                          getStudentByIdResponse.additionalAttributes
                            .motherAadharCardNumber
                        }
                      </Text>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-700">
                        Annual Income
                      </label>
                      <Text variant="base-regular">
                        {
                          getStudentByIdResponse.additionalAttributes
                            .annualIncome
                        }
                      </Text>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-700">
                        Parents Separated
                      </label>
                      <Text variant="base-regular">
                        {
                          getStudentByIdResponse.additionalAttributes
                            .parentsSeparated
                        }
                      </Text>
                    </div>
                  </div>
                </div>

                <div className="mt-4 bg-white border-t-8 border-gray-100">
                  <Text variant="sm-semibold" className="pt-5 pl-6">
                    {'GARDIANS DETAILS'}
                  </Text>
                  <div className="flex flex-wrap gap-12 p-6 mt-2">
                    <div>
                      <label className="text-sm font-semibold text-gray-700">
                        Guardian's Name
                      </label>
                      <Text variant="base-regular">
                        {getStudentByIdResponse.guardianName}
                      </Text>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-700">
                        Guardian's Occupation
                      </label>
                      <Text variant="base-regular">
                        {getStudentByIdResponse.guardiansOccupation}
                      </Text>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-700">
                        Relationship Type
                      </label>
                      <Text variant="base-regular">
                        {
                          getStudentByIdResponse.additionalAttributes
                            .relationshipType
                        }
                      </Text>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-700">
                        Guardian's Phone Number
                      </label>
                      <Text variant="base-regular">
                        {getStudentByIdResponse.guardianPhoneNumber}
                      </Text>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-700">
                        Guardian's Aadhar Card Number
                      </label>
                      <Text variant="base-regular">
                        {
                          getStudentByIdResponse.additionalAttributes
                            .guardianAadharCardNumber
                        }
                      </Text>
                    </div>
                  </div>
                </div>

                <div className="mt-4 bg-white border-t-8 border-gray-100">
                  <Text variant="sm-semibold" className="pt-5 pl-6">
                    {'ADDRESS DETAILS'}
                  </Text>
                  <div className="flex flex-wrap gap-12 p-6 mt-2">
                    <div>
                      <label className="text-sm font-semibold text-gray-700">
                        Residential Address
                      </label>
                      <Text variant="base-regular">
                        {
                          getStudentByIdResponse.additionalAttributes
                            .residentialAddress
                        }
                      </Text>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-700">
                        District
                      </label>
                      <Text variant="base-regular">
                        {
                          getStudentByIdResponse.additionalAttributes
                            .residentialDistrict
                        }
                      </Text>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-700">
                        State
                      </label>
                      <Text variant="base-regular">
                        {
                          getStudentByIdResponse.additionalAttributes
                            .residentialState
                        }
                      </Text>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-700">
                        Postal / ZIP Code
                      </label>
                      <Text variant="base-regular">
                        {
                          getStudentByIdResponse.additionalAttributes
                            .residentialPostalCode
                        }
                      </Text>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-700">
                        Permanent Address
                      </label>
                      <Text variant="base-regular">
                        {
                          getStudentByIdResponse.additionalAttributes
                            .permanentAddress
                        }
                      </Text>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-700">
                        District
                      </label>
                      <Text variant="base-regular">
                        {
                          getStudentByIdResponse.additionalAttributes
                            .permanentDistrict
                        }
                      </Text>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-700">
                        State
                      </label>
                      <Text variant="base-regular">
                        {
                          getStudentByIdResponse.additionalAttributes
                            .permanentState
                        }
                      </Text>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-700">
                        Postal / ZIP Code
                      </label>
                      <Text variant="base-regular">
                        {
                          getStudentByIdResponse.additionalAttributes
                            .permanentPostalCode
                        }
                      </Text>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-700">
                        Nationality
                      </label>
                      <Text variant="base-regular">
                        {getStudentByIdResponse.nationality}
                      </Text>
                    </div>
                  </div>
                </div>

                <div className="mt-4 bg-white border-t-8 border-gray-100">
                  <Text variant="sm-semibold" className="pt-5 pl-6">
                    {'EDUCATIONAL DETAILS'}
                  </Text>
                  <div className="flex flex-wrap gap-12 p-6 mt-2">
                    <div>
                      <label className="text-sm font-semibold text-gray-700">
                        School Name (10th std)
                      </label>
                      <Text variant="base-regular">
                        {
                          getStudentByIdResponse.additionalAttributes
                            .schoolName10th
                        }
                      </Text>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-700">
                        Year of Passing
                      </label>
                      <Text variant="base-regular">
                        {
                          getStudentByIdResponse.additionalAttributes
                            .yearOfPassing10th
                        }
                      </Text>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-700">
                        Obtained Mark
                      </label>
                      <Text variant="base-regular">
                        {
                          getStudentByIdResponse.additionalAttributes
                            .obtainedMark10th
                        }
                      </Text>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-700">
                        Medium of Education 10th
                      </label>
                      <Text variant="base-regular">
                        {
                          getStudentByIdResponse.additionalAttributes
                            .mediumOfEducation10th
                        }
                      </Text>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-700">
                        School Name (11th std)
                      </label>
                      <Text variant="base-regular">
                        {
                          getStudentByIdResponse.additionalAttributes
                            .schoolName11th
                        }
                      </Text>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-700">
                        Year of Passing
                      </label>
                      <Text variant="base-regular">
                        {
                          getStudentByIdResponse.additionalAttributes
                            .yearOfPassing11th
                        }
                      </Text>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-700">
                        Obtained Mark
                      </label>
                      <Text variant="base-regular">
                        {
                          getStudentByIdResponse.additionalAttributes
                            .obtainedMark11th
                        }
                      </Text>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-700">
                        Medium of Education 11th
                      </label>
                      <Text variant="base-regular">
                        {
                          getStudentByIdResponse.additionalAttributes
                            .mediumOfEducation11th
                        }
                      </Text>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-700">
                        EMIS Number
                      </label>
                      <Text variant="base-regular">
                        {getStudentByIdResponse.additionalAttributes.emisNumber}
                      </Text>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-700">
                        Admission Number
                      </label>
                      <Text variant="base-regular">
                        {
                          getStudentByIdResponse.additionalAttributes
                            .admissionNumber
                        }
                      </Text>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-700">
                        Date Of Joining
                      </label>
                      <Text variant="base-regular">
                        {
                          getStudentByIdResponse.additionalAttributes
                            .dateOfJoining
                        }
                      </Text>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-700">
                        Medium
                      </label>
                      <Text variant="base-regular">
                        {getStudentByIdResponse.medium.name}
                      </Text>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-700">
                        Class
                      </label>
                      <Text variant="base-regular">
                        {getStudentByIdResponse.class.name}
                      </Text>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-700">
                        Group
                      </label>
                      <Text variant="base-regular">
                        {getStudentByIdResponse.group.name}
                      </Text>
                    </div>
                  </div>
                </div>

                <div className="mt-4 bg-white border-t-8 border-gray-100">
                  <Text variant="sm-semibold" className="pt-5 pl-6">
                    {'OTHER DETAILS'}
                  </Text>
                  <div className="flex flex-wrap gap-12 p-6 mt-2">
                    <div>
                      <label className="text-sm font-semibold text-gray-700">
                        Batch
                      </label>
                      <Text variant="base-regular">
                        {getStudentByIdResponse?.batch?.name}
                      </Text>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-700">
                        Admission Type
                      </label>
                      <Text variant="base-regular">
                        {
                          getStudentByIdResponse.additionalAttributes
                            .admissionType
                        }
                      </Text>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-700">
                        Admission Mode
                      </label>
                      <Text variant="base-regular">
                        {
                          getStudentByIdResponse.additionalAttributes
                            .admissionMode
                        }
                      </Text>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-700">
                        Scholarship
                      </label>
                      <Text variant="base-regular">
                        {
                          getStudentByIdResponse.additionalAttributes
                            .scholarship
                        }
                      </Text>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-700">
                        First Language
                      </label>
                      <Text variant="base-regular">
                        {
                          getStudentByIdResponse.additionalAttributes
                            .firstLanguage
                        }
                      </Text>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </TabsContent>
          <TabsContent className="w-full" value="document">
            <section className="p-5 bg-white ">
              <div>
                <label className="pl-1">Document</label>
              </div>
              <div className=" max-h-[60vh]overflow-y-auto flex flex-wrap gap-5 p-0 pl-2">
                <div className="mt-4 bg-white rounded-md">
                  <Card className="w-40 max-w-60">
                    <CardContent className="p-0">
                      <div className="flex justify-center pt-3 pb-3 bg-indigo-100">
                        <img className="" src="/pdf.png" alt="" />
                      </div>
                      <div className="grid grid-cols-2 p-2 bg-white">
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
                <div className="mt-4 bg-white rounded-md">
                  <Card className="w-40 max-w-60">
                    <CardContent className="p-0 ">
                      <div className="flex justify-center pt-3 pb-3 bg-indigo-100">
                        <img className="" src="/pdf.png" alt="" />
                      </div>
                      <div className="grid grid-cols-2 p-2 bg-white">
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

                <div className="mt-4 bg-white rounded-md">
                  <Card className="w-40 max-w-60">
                    <CardContent className="p-0 ">
                      <div className="flex justify-center pt-3 pb-3 bg-indigo-100">
                        <img className="" src="/pdf.png" alt="" />
                      </div>
                      <div className="grid grid-cols-2 p-2 bg-white">
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
                <div className="mt-4 bg-white rounded-md">
                  <Card className="w-40 max-w-60">
                    <CardContent className="p-0 ">
                      <div className="flex justify-center pt-3 pb-3 bg-indigo-100">
                        <img className="" src="/pdf.png" alt="" />
                      </div>
                      <div className="grid grid-cols-2 p-2 bg-white">
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
        </Tabs>
      </section>
    </section>
  );
}
