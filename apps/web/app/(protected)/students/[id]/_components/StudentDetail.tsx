'use client';

import { Loader2 } from 'lucide-react';
import { useParams } from 'next/navigation';
import {
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
import ProfilePicture from './ProfilePicture';

export function StudentDetail() {
  const { id } = useParams<{ id: string }>();

  const { data: getStudentByIdResponse, isLoading: isGetStudentByIdLoading } =
    useGetStudentByIdQuery(id);
  // const sectionId = getStudentByIdResponse?.section?.id;
  // const classId = getStudentByIdResponse?.class?.id;
  // const groupId = getStudentByIdResponse?.group?.id;

  // const {
  //   data: getStudentMarkListResponse,
  //   isLoading: isGetStudentMarkListLoading,
  // } = useGetStudentMarkListQuery(id, sectionId, classId, groupId);
  if (isGetStudentByIdLoading) {
    return (
      <div className="flex items-center justify-center h-20">
        <Loader2 className="w-6 mr-2 text-black animate-spin" />
        <p className="text-black ">Loading...</p>
      </div>
    );
  }
  return (
    <section className="grid justify-start w-full grid-cols-11 gap-2 mt-10">
      <section className="col-span-3 ">
        <Card className="bg-white rounded-md w-72">
          <CardHeader>
            <div>
              <ProfilePicture
                firstName={getStudentByIdResponse?.firstName}
                lastName={getStudentByIdResponse?.lastName}
                profileImage={
                  getStudentByIdResponse?.user?.image ||
                  getStudentByIdResponse?.profileImage
                }
                studentId={getStudentByIdResponse?.id}
              />
              <div className="flex justify-center px-5 pt-3 pb-2 my-auto">
                <Text variant="base-bold">
                  {getStudentByIdResponse?.firstName}
                </Text>
              </div>
              <div className="flex justify-center">
                {getStudentByIdResponse?.admissionNumber && (
                  <Text
                    variant="base-regular"
                    className="px-2 mx-2 border rounded-lg bg-violet-100"
                  >
                    {getStudentByIdResponse?.admissionNumber}
                  </Text>
                )}
                {getStudentByIdResponse.additionalAttributes?.age && (
                  <Text
                    variant="base-regular"
                    className="px-2 border rounded-lg bg-violet-100"
                  >
                    {getStudentByIdResponse.additionalAttributes?.age} 44
                  </Text>
                )}
                {getStudentByIdResponse.bloodGroup && (
                  <Text
                    variant="base-regular"
                    className="px-2 mx-2 border rounded-lg bg-violet-100"
                  >
                    {getStudentByIdResponse.bloodGroup}
                  </Text>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="pl-0">
            <div className="pl-3 mt-5 ">
              <div className="grid grid-cols-3 ml-5 ">
                <Text className="pt-1 text-xs text-gray-800 w-18">{'DOB'}</Text>
                <Text className="col-span-2">
                  {getStudentByIdResponse.dob?.toString()}
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
                  {getStudentByIdResponse.additionalAttributes?.dateOfJoining?.toString()}
                </Text>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
      <section className="col-span-8">
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
            <TabsTrigger
              value="report"
              className="mr-2 text-base focus:border-b-4 focus:border-primary"
            >
              Report
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
                      {getStudentByIdResponse.additionalAttributes?.community}
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
                        Father&apos;s Name`
                      </label>
                      <Text variant="base-regular">
                        {getStudentByIdResponse.fatherName}
                      </Text>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-700">
                        Father&apos;s Occupation
                      </label>
                      <Text variant="base-regular">
                        {getStudentByIdResponse.fatherOccupation}
                      </Text>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-700">
                        Father&apos;s Phone Number
                      </label>
                      <Text variant="base-regular">
                        {getStudentByIdResponse.fatherPhoneNumber}
                      </Text>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-700">
                        Father&apos;s Education
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
                        Father&apos;s Aadhar Card Number
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
                        Mother&apos;s Name
                      </label>
                      <Text variant="base-regular">
                        {getStudentByIdResponse.motherName}
                      </Text>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-700">
                        Mother&apos;s Occupation
                      </label>
                      <Text variant="base-regular">
                        {getStudentByIdResponse.motherOccupation}
                      </Text>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-700">
                        Mother&apos;s Phone Number
                      </label>
                      <Text variant="base-regular">
                        {getStudentByIdResponse.motherPhoneNumber}
                      </Text>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-700">
                        Mother&apos;s Education
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
                        Mother&apos;s Aadhar Card Number
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
                    {'GUARDIANS DETAILS'}
                  </Text>
                  <div className="flex flex-wrap gap-12 p-6 mt-2">
                    <div>
                      <label className="text-sm font-semibold text-gray-700">
                        Guardian&apos;s Name
                      </label>
                      <Text variant="base-regular">
                        {getStudentByIdResponse.guardianName}
                      </Text>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-700">
                        Guardian&apos;s Occupation
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
                        Guardian&apos;s Phone Number
                      </label>
                      <Text variant="base-regular">
                        {getStudentByIdResponse.guardianPhoneNumber}
                      </Text>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-700">
                        Guardian&apos;s Aadhar Card Number
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
                        {
                          getStudentByIdResponse.additionalAttributes
                            ?.emisNumber
                        }
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
          <TabsContent className="w-full " value="document">
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
          <TabsContent className="w-full min-w-full" value="report">
            {/* <section className="bg-white rounded-md ">
              {isGetStudentMarkListLoading ? (
                <div className="flex items-center justify-center h-20">
                  <Loader2 className="w-6 mr-2 text-black animate-spin" />
                  <p className="text-black ">Fetching Student Details...</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="mt-5 text-center bg-primary-300 print:hidden">
                      <TableCell>
                        <Text className="font-semibold size-lg">Exams</Text>
                      </TableCell>
                      {getStudentMarkListResponse.subjectList?.map(
                        (subject) => (
                          <TableCell key={subject.subjectId}>
                            <Text className="font-semibold size-lg">
                              {subject.subject.name}
                            </Text>
                          </TableCell>
                        )
                      )} 
                      <TableCell>
                        <Text className="font-semibold size-lg">Total</Text>
                      </TableCell>
                    </TableRow>
                  </TableHeader>
                  {getStudentMarkListResponse && (
                    <TableBody>
                      {getStudentMarkListResponse.markList.map((exam) => (
                        <TableRow key={exam.exam.id}>
                          <TableCell className="mt-5 text-center bg-green-100 print:hidden">
                            {exam.exam.name}
                          </TableCell>
                          {exam.subjects.map((subject) => (
                            <TableCell key={subject.id}>
                              {subject.subject.name}
                              <div>
                                {subject.examSubjectPartition.map(
                                  (partition) => (
                                    <div key={partition.id}>
                                      {partition.Mark[0].mark}
                                    </div>
                                  )
                                )}
                              </div>
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  )}
                </Table>
              )}
            </section> */}
          </TabsContent>
        </Tabs>
      </section>
    </section>
  );
}
