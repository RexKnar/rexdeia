/* eslint-disable react-hooks/exhaustive-deps */
'use client';

/* eslint-disable react/no-unescaped-entities */
import { useGetBatchesListQuery } from 'lib/queries/batches/useGetBatchesListQuery';
import { useGetClassListQuery } from 'lib/queries/class/useGetClassListQuery';
import { useGetCityByStateCodeQuery } from 'lib/queries/common/useGetCityListQuery';
import { useGetCountryListQuery } from 'lib/queries/common/useGetCountryListQuery';
import { useGetStateByCountryCodeQuery } from 'lib/queries/common/useGetStateListQuery';
import { useGetCommunityListQuery } from 'lib/queries/community/useGetCommunityListQuery';
import { useGetGroupListQuery } from 'lib/queries/group/useGetGroupListQuery';
import { useGetLanguageListQuery } from 'lib/queries/language/useGetLanguageListQurey';
import { useGetMediumListQuery } from 'lib/queries/medium/useGetMediumListQuery';
import { useGetStudentByIdQuery } from 'lib/queries/students/useGetStudentByIdQuery';
import { useUpdateStudentMutationById } from 'lib/queries/students/useUpdateStudentMutationByIdQuery';
import { formatStudentPayload } from 'lib/utils/formatters';
import { Check, Loader2 } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  Button,
  Input,
  RadioGroup,
  RadioGroupItem,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from 'ui';
import { formatDate } from 'utils';

export function EditStudentDetail() {
  const [currentPage, setCurrentPage] = useState(1);
  const [communityList, setCommunityList] = useState([]);
  const [languageList, setLanguageList] = useState([]);
  const [Country, setCountry] = useState([]);
  const [residentialCountryCode, setResidentialCountryCode] = useState('');
  const [permanentCountryCode, setPermanentCountryCode] = useState('');
  const [residentialStateCode, setResidentialStateCode] = useState('');
  const [permanentStateCode, setPermanentStateCode] = useState('');
  const [residentialState, setResidentialState] = useState([]);
  const [permanentState, setPermanentState] = useState([]);
  const [residentialCityList, setResidentialCityList] = useState([]);
  const [permanentCity, setPermanentCity] = useState([]);

  const {
    control,
    watch,
    setValue,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const { id } = useParams<{ id: string }>();

  const page = 1;
  const limit = 999;
  const filter = {};

  const { data: mediumList } = useGetMediumListQuery({
    page,
    limit,
    filter,
  });
  const { data: classList } = useGetClassListQuery({
    page,
    limit,
    filter,
  });

  const { data: groupList } = useGetGroupListQuery({
    page,
    limit,
    filter,
  });
  const { data: batchList } = useGetBatchesListQuery({
    page,
    limit,
    filter,
  });
  const router = useRouter();
  const { mutateAsync: updateStudentMutationAsync } =
    useUpdateStudentMutationById();

  const { data: studentDetail, isLoading: isStudentDetailLoading } =
    useGetStudentByIdQuery(id);

  const { data: getCountryListResponse } = useGetCountryListQuery();
  const { data: getCommunityListResponse } = useGetCommunityListQuery();
  const { data: getLanguageListResponse } = useGetLanguageListQuery();
  const { data: getResidentialStateByCountryIdResponse } =
    useGetStateByCountryCodeQuery(residentialCountryCode, {
      enabled: !!residentialCountryCode,
    });

  const { data: getPermanentStateByCountryIdResponse } =
    useGetStateByCountryCodeQuery(permanentCountryCode, {
      enabled: !!permanentCountryCode,
    });
  const { data: getResidentialCityByStateCodeResponse } =
    useGetCityByStateCodeQuery(residentialCountryCode, residentialStateCode, {
      enabled: !!residentialStateCode,
    });
  const { data: getPermanentCityByStateCodeResponse } =
    useGetCityByStateCodeQuery(permanentCountryCode, permanentStateCode, {
      enabled: !!permanentStateCode,
    });

  useEffect(() => {
    if (getCountryListResponse) {
      setCountry(getCountryListResponse as any[]);
    }
    if (getLanguageListResponse) {
      setLanguageList(getLanguageListResponse as any[]);
    }
    if (getCommunityListResponse) {
      setCommunityList(getCommunityListResponse as any[]);
    }
    if (getResidentialStateByCountryIdResponse) {
      setResidentialState(getResidentialStateByCountryIdResponse as any[]);
    }
    if (getResidentialCityByStateCodeResponse) {
      setResidentialCityList(getResidentialCityByStateCodeResponse as any[]);
    }
    if (getPermanentStateByCountryIdResponse) {
      setPermanentState(getPermanentStateByCountryIdResponse as any[]);
    }
    if (getPermanentCityByStateCodeResponse) {
      setPermanentCity(getPermanentCityByStateCodeResponse as any[]);
    }
  });

  useEffect(() => {
    if (studentDetail) {
      const dob = formatDate(studentDetail.dob, 'yyyy/mm/dd');

      const initialValue = {
        firstName: studentDetail.firstName,
        middleName: studentDetail.middleName,
        lastName: studentDetail.lastName,
        dob: dob,
        age: studentDetail.additionalAttributes.age,
        gender: studentDetail.gender,
        phoneNumber: studentDetail.phoneNumber,
        emailId: studentDetail.emailId,
        bloodGroup: studentDetail.bloodGroup,
        aadharCardNumber: studentDetail.aadharCardNumber,
        motherTongueId: studentDetail.motherTongueId,
        religion: studentDetail.religion,
        communityId: studentDetail.communityId,
        caste: studentDetail.additionalAttributes.caste,
        differentlyAbled: studentDetail.additionalAttributes.differentlyAbled,
        fatherName: studentDetail.fatherName,
        fatherOccupation: studentDetail.fatherOccupation,
        fatherPhoneNumber: studentDetail.fatherPhoneNumber,
        fatherEducation: studentDetail.additionalAttributes.fatherEducation,
        fatherAadharCardNumber:
          studentDetail.additionalAttributes.fatherAadharCardNumber,
        motherName: studentDetail.motherName,
        motherOccupation: studentDetail.motherOccupation,
        motherPhoneNumber: studentDetail.motherPhoneNumber,
        motherEducation: studentDetail.additionalAttributes.motherEducation,
        motherAadharCardNumber:
          studentDetail.additionalAttributes.motherAadharCardNumber,
        annualIncome: studentDetail.additionalAttributes.annualIncome,
        parentsSeparated: studentDetail.additionalAttributes.parentsSeparated,
        noOfSiblings: studentDetail.additionalAttributes.noOfSiblings,
        siblingName1: studentDetail.additionalAttributes.siblingName1,
        siblingRelation1: studentDetail.additionalAttributes.siblingRelation1,
        siblingClass1: studentDetail.additionalAttributes.siblingClass1,
        siblingName2: studentDetail.additionalAttributes.siblingName2,
        siblingRelation2: studentDetail.additionalAttributes.siblingRelation2,
        siblingClass2: studentDetail.additionalAttributes.siblingClass2,
        guardianName: studentDetail.guardianName,
        guardiansOccupation: studentDetail.guardiansOccupation,
        relationshipType: studentDetail.additionalAttributes.relationshipType,
        guardianPhoneNumber: studentDetail.guardianPhoneNumber,
        guardianAadharCardNumber:
          studentDetail.additionalAttributes.guardianAadharCardNumber,
        residentialAddress:
          studentDetail.additionalAttributes.residentialAddress,
        residentialPostalCode:
          studentDetail.additionalAttributes.residentialPostalCode,
        permanentAddress: studentDetail.additionalAttributes.permanentAddress,
        permanentDistrict: studentDetail.additionalAttributes.permanentDistrict,
        permanentPostalCode:
          studentDetail.additionalAttributes.permanentPostalCode,
        nationality: studentDetail.nationality,
        schoolName10th: studentDetail.additionalAttributes.schoolName10th,
        yearOfPassing10th: studentDetail.additionalAttributes.yearOfPassing10th,
        obtainedMark10th: studentDetail.additionalAttributes.obtainedMark10th,
        mediumOfEducation10th:
          studentDetail.additionalAttributes.mediumOfEducation10th,
        schoolName11th: studentDetail.additionalAttributes.schoolName11th,
        yearOfPassing11th: studentDetail.additionalAttributes.yearOfPassing11th,
        obtainedMark11th: studentDetail.additionalAttributes.obtainedMark11th,
        mediumOfEducation11th:
          studentDetail.additionalAttributes.mediumOfEducation11th,
        emisNumber: studentDetail.emisNumber,
        admissionNumber: studentDetail.admissionNumber,
        dateOfJoining: studentDetail.additionalAttributes.dateOfJoining,
        joiningMedium: studentDetail.additionalAttributes.joiningMedium,
        joiningClass: studentDetail.additionalAttributes.joiningClass,
        joiningGroup: studentDetail.additionalAttributes.joiningGroup,
        batchId: studentDetail.batchId,
        admissionType: studentDetail.additionalAttributes.admissionType,
        admissionMode: studentDetail.additionalAttributes.admissionMode,
        scholarship: studentDetail.additionalAttributes.scholarship,
        firstLanguage: studentDetail.additionalAttributes.firstLanguage,
        pickupPoint: studentDetail.additionalAttributes.pickupPoint,
        enrollmentId: studentDetail.additionalAttributes.enrollmentId,
        fatherEmailId: studentDetail.fatherEmailId,
        motherEmailId: studentDetail.motherEmailId,
        fatherAnnualIncome:
          studentDetail.additionalAttributes.fatherAnnualIncome,
        motherAnnualIncome:
          studentDetail.additionalAttributes.motherAnnualIncome,
        guardianAnnualIncome:
          studentDetail.additionalAttributes.guardianAnnualIncome,
        guardianEmailId: studentDetail.guardianEmailId,
        typeOfDisability: studentDetail.additionalAttributes.typeOfDisability,
        permanentCountry: studentDetail.additionalAttributes.permanentCountry,
        residentialCountry:
          studentDetail.additionalAttributes.residentialCountry,
        residentialState: studentDetail.additionalAttributes.residentialState,
        residentialCity: studentDetail.additionalAttributes.residentialCity,
        permanentState: studentDetail.additionalAttributes.permanentState,
        permanentCity: studentDetail.additionalAttributes.permanentCity,
        tcNumber10th: studentDetail.additionalAttributes.tcNumber10th,
        boardOfEducation10th:
          studentDetail.additionalAttributes.boardOfEducation10th,
        boardOfEducation11th:
          studentDetail.additionalAttributes.boardOfEducation11th,
      };
      setResidentialCountryCode(
        studentDetail.additionalAttributes.residentialCountry
      );
      setResidentialStateCode(
        studentDetail.additionalAttributes.residentialState
      );
      setPermanentCountryCode(
        studentDetail.additionalAttributes.permanentCountry
      );
      setPermanentStateCode(studentDetail.additionalAttributes.permanentState);

      reset(initialValue);
    }
  }, [studentDetail]);

  const handleOnFormSubmit = async (data: Record<string, unknown>) => {
    const payload = formatStudentPayload(data);
    const response = await updateStudentMutationAsync({
      id: id,
      ...payload,
    });
    if (response) {
      router.push(`/students/list`);
    }
  };

  if (isStudentDetailLoading) {
    return (
      <div className="flex h-20 items-center justify-center">
        <Loader2 className="mr-2 w-6 animate-spin text-black" />
        <p className="text-black ">Fetching Student Details...</p>
      </div>
    );
  }

  const validateEmail = (value, field) => {
    const atIndex = value.indexOf('@');
    const dotIndex = value.lastIndexOf('.');

    if (value === '') {
      return `${field} is required`;
    }

    if (
      atIndex === -1 ||
      dotIndex === -1 ||
      dotIndex <= atIndex + 1 ||
      dotIndex === value.length - 1
    ) {
      return `${field} must be a valid email address`;
    }
  };

  const goToPage = (page) => {
    setCurrentPage(page);
  };

  const prevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const nextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, 7));
  };

  return (
    <form
      onSubmit={handleSubmit(handleOnFormSubmit)}
      autoFocus
      autoComplete="off"
      className="relative mt-[20px] w-full"
    >
      <section className="flex gap-4">
        <ul className="h-fit w-[215px] shrink-0 rounded-lg bg-white py-3">
          <li className="flex justify-between">
            <Button
              type="button"
              variant="link"
              onClick={() => goToPage(1)}
              className="cursor-pointer px-4 py-1 hover:no-underline"
            >
              <div>
                <h2
                  className={`px-2 text-left text-sm font-semibold ${
                    currentPage === 1 ? 'text-primary' : 'text-gray-800'
                  }`}
                >
                  {'Personal Details'}
                </h2>
              </div>
            </Button>
            <div className="p-3">
              <Check className="h-4 w-4 text-green-500 transition-opacity duration-500" />
            </div>
          </li>
          <li className="flex justify-between">
            <Button
              type="button"
              variant="link"
              onClick={() => goToPage(2)}
              className="cursor-pointer px-4 py-1 hover:no-underline"
            >
              <h2
                className={`px-2 text-left text-sm font-semibold ${
                  currentPage === 2 ? 'text-primary' : 'text-gray-800'
                }`}
              >
                Parent’s Details
              </h2>
            </Button>
            <div className="p-3">
              <Check className="h-4 w-4 text-green-500 transition-opacity duration-500" />
            </div>
          </li>
          <li className="flex justify-between">
            <Button
              type="button"
              variant="link"
              onClick={() => goToPage(3)}
              className="cursor-pointer px-4 py-1 hover:no-underline"
            >
              <h2
                className={`px-2 text-left text-sm font-semibold ${
                  currentPage === 3 ? 'text-primary' : 'text-gray-800'
                }`}
              >
                Information of Siblings
              </h2>
            </Button>
            <div className="p-3">
              <Check className="h-4 w-4 text-green-500 transition-opacity duration-500" />
            </div>
          </li>
          <li className="flex justify-between">
            <Button
              type="button"
              variant="link"
              onClick={() => goToPage(4)}
              className="cursor-pointer px-4 py-1 hover:no-underline"
            >
              <h2
                className={`px-2 text-left text-sm font-semibold ${
                  currentPage === 4 ? 'text-primary' : 'text-gray-800'
                }`}
              >
                Gurdian’s Details
              </h2>
            </Button>
            <div className="p-3">
              <Check className="h-4 w-4 text-green-500 transition-opacity duration-500" />
            </div>
          </li>
          <li className="flex justify-between">
            <Button
              type="button"
              variant="link"
              onClick={() => goToPage(5)}
              className="cursor-pointer px-4 py-1 hover:no-underline"
            >
              <h2
                className={`px-2  text-sm font-semibold ${
                  currentPage === 5 ? 'text-primary' : 'text-gray-800'
                }`}
              >
                Address Details
              </h2>
            </Button>
            <div className="p-3">
              <Check className="h-4 w-4 text-green-500 transition-opacity duration-500" />
            </div>
          </li>
          <li className="flex justify-between">
            <Button
              type="button"
              variant="link"
              onClick={() => goToPage(6)}
              className="cursor-pointer px-4 py-1 hover:no-underline"
            >
              <h2
                className={`px-2 text-left text-sm font-semibold ${
                  currentPage === 6 ? 'text-primary' : 'text-gray-800'
                }`}
              >
                Educational Details
              </h2>
            </Button>
            <div className="p-3">
              <Check className="h-4 w-4 text-green-500 transition-opacity duration-500" />
            </div>
          </li>
          <li className="flex justify-between">
            <Button
              type="button"
              variant="link"
              onClick={() => goToPage(7)}
              className="cursor-pointer px-4 py-1 hover:no-underline"
            >
              <h2
                className={`px-2 text-left text-sm font-semibold ${
                  currentPage === 7 ? 'text-primary' : 'text-gray-800'
                }`}
              >
                Other Details
              </h2>
            </Button>
            <div className="p-3">
              <Check className="h-4 w-4 text-green-500 transition-opacity duration-500" />
            </div>
          </li>
        </ul>
        <section className="w-full rounded-lg bg-white p-5">
          <div className={currentPage === 1 ? 'block' : 'hidden'}>
            <h1 className="mb-5 text-sm font-semibold">{'Personal Details'}</h1>
            <section className="grid grid-cols-1 flex-wrap justify-between gap-4 md:grid md:grid-cols-1 lg:grid lg:grid-cols-3 ">
              <div className="w-full">
                <label className="mt-1 block text-sm text-gray-700">
                  First Name
                  <span className="text-red-300"> *</span>
                </label>
                <Input
                  {...register('firstName', {
                    required: 'First Name is required',
                  })}
                  aria-invalid={errors.name ? 'true' : 'false'}
                  errorMessage={errors?.name?.message.toString()}
                  className="mt-1"
                  autoComplete="off"
                  autoFocus
                  name="firstName"
                />
                {errors['firstName'] && (
                  <p className="h-2 p-1 text-sm text-red-600">
                    {errors['firstName'].message as string}
                  </p>
                )}
              </div>
              <div className="w-full">
                <label className="mt-1 block text-sm text-gray-700">
                  Middle Name
                </label>
                <Input
                  {...register('middleName')}
                  className="mt-1"
                  autoComplete="off"
                />
              </div>
              <div className="w-full">
                <label className="mt-1 block text-sm text-gray-700">
                  Last Name
                </label>
                <Input
                  {...register('lastName')}
                  className="mt-1"
                  autoComplete="off"
                />
              </div>
              <div className="w-full">
                <label className="mt-1 block text-sm text-gray-700">
                  Date of Birth
                </label>
                <Input
                  type="date"
                  className="mt-1"
                  autoComplete="off"
                  {...register('dob', {
                    required: 'Date of Birth is required',
                  })}
                  aria-invalid={errors.date ? 'true' : 'false'}
                  errorMessage={errors?.date?.message.toString()}
                />
                {errors['dob'] && (
                  <p className="h-2 p-1 text-sm text-red-600">
                    {errors['dob'].message as string}
                  </p>
                )}
              </div>
              <div className="w-full">
                <label className="mt-1 block text-sm text-gray-700">Age</label>
                <Input
                  {...register('age')}
                  className="mt-1"
                  autoComplete="off"
                />
              </div>
              <div className="w-full">
                <label className="mt-1 block text-sm text-gray-700">
                  Gender
                </label>
                <Controller
                  name="gender"
                  control={control}
                  defaultValue={studentDetail.gender}
                  render={({ field: { onChange, value } }) => (
                    <RadioGroup
                      onValueChange={onChange}
                      value={value}
                      className="mt-3 flex gap-2"
                    >
                      <RadioGroupItem className="mr-1 mt-1" value={'male'} />{' '}
                      {'Male'}
                      <RadioGroupItem
                        className="ml-3 mr-1 mt-1 "
                        value={'female'}
                      />{' '}
                      {'Female'}
                    </RadioGroup>
                  )}
                />
              </div>
              <div className="w-full">
                <label className="mt-1 block text-sm text-gray-700">
                  Phone Number
                </label>
                <Input
                  {...register('phoneNumber')}
                  className="mt-1"
                  autoComplete="off"
                />
              </div>
              <div className="w-full">
                <label className="mt-1 block text-sm text-gray-700">
                  Email
                  <span className="text-red-300"> *</span>
                </label>
                <Input
                  {...register('emailId', {
                    required: 'Email is required',
                    validate: (value) => {
                      return validateEmail(value, 'emailId');
                    },
                  })}
                  aria-invalid={errors.email ? 'true' : 'false'}
                  className="mt-1"
                  autoComplete="off"
                />
                {errors['emailId'] && (
                  <p className="h-2 p-1 text-sm text-red-600">
                    {errors?.email?.message.toString()}
                  </p>
                )}
              </div>
              <div className="w-full">
                <label className="mt-1 block text-sm text-gray-700">
                  Blood Group
                </label>
                <Select
                  autoComplete="off"
                  value={watch('bloodGroup')}
                  {...register('bloodGroup')}
                  onValueChange={(value) => {
                    if (value) {
                      setValue('bloodGroup', value);
                    }
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value={'O+'}>{'O+'}</SelectItem>
                      <SelectItem value={'O-'}>{'O-'}</SelectItem>
                      <SelectItem value={'A+'}>{'A+'}</SelectItem>
                      <SelectItem value={'A-'}>{'A-'}</SelectItem>
                      <SelectItem value={'B+'}>{'B+'}</SelectItem>
                      <SelectItem value={'B-'}>{'B-'}</SelectItem>
                      <SelectItem value={'AB+'}>{'AB+'}</SelectItem>
                      <SelectItem value={'AB-'}>{'AB-'}</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="w-full">
                <label className="mt-1 block text-sm text-gray-700">
                  Pickup Point
                </label>
                <Input
                  {...register('pickupPoint')}
                  className="mt-1"
                  autoComplete="off"
                />
              </div>
              <div className="w-full">
                <label className="mt-1 block text-sm text-gray-700">
                  EMIS Number
                </label>
                <Input
                  {...register('emisNumber')}
                  className="mt-1"
                  autoComplete="off"
                />
              </div>
              <div className="w-full">
                <label className="mt-1 block text-sm text-gray-700">
                  Admission Number
                </label>
                <Input
                  {...register('admissionNumber')}
                  className="mt-1"
                  autoComplete="off"
                />
              </div>
              <div className="w-full">
                <label className="mt-1 block text-sm text-gray-700">
                  Date Of Joining
                </label>
                <Input
                  {...register('dateOfJoining')}
                  type="date"
                  className="mt-1"
                  autoComplete="off"
                />
              </div>

              <div className="w-full">
                <label className="mt-1 block text-sm text-gray-700">
                  Medium
                  <span className="text-red-300"> *</span>
                </label>
                <Select
                  autoComplete="off"
                  value={watch('joiningMedium')}
                  {...register('joiningMedium')}
                  onValueChange={(value) => {
                    if (value) {
                      setValue('joiningMedium', value);
                    }
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {mediumList?.data?.map((item) => (
                        <SelectItem key={item.id} value={item.id}>
                          {item.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {errors['joiningMedium'] && (
                  <p className="h-2 p-1 text-sm text-red-600">
                    {errors['joiningMedium'].message as string}
                  </p>
                )}
              </div>
              <div className="w-full">
                <label className="mt-1 block text-sm text-gray-700">
                  Class
                  <span className="text-red-300"> *</span>
                </label>
                <Select
                  autoComplete="off"
                  value={watch('joiningClass')}
                  {...register('joiningClass')}
                  onValueChange={(value) => {
                    if (value) {
                      setValue('joiningClass', value);
                    }
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {classList?.data?.map((item) => (
                        <SelectItem key={item.id} value={item.id}>
                          {item.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {errors['joiningClass'] && (
                  <p className="h-2 p-1 text-sm text-red-600">
                    {errors['joiningClass'].message as string}
                  </p>
                )}
              </div>
              <div className="w-full">
                <label className="mt-1 block text-sm text-gray-700">
                  Group
                  <span className="text-red-300"> *</span>
                </label>
                <Select
                  autoComplete="off"
                  value={watch('joiningGroup')}
                  {...register('joiningGroup')}
                  onValueChange={(value) => {
                    if (value) {
                      setValue('joiningGroup', value);
                    }
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {groupList?.data?.map((item) => (
                        <SelectItem key={item.id} value={item.id}>
                          {item.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {errors['joiningGroup'] && (
                  <p className="h-2 p-1 text-sm text-red-600">
                    {errors['joiningGroup'].message as string}
                  </p>
                )}
              </div>

              <div className="w-full">
                <label className="mt-1 block text-sm text-gray-700">
                  Enrollment ID
                </label>
                <Input
                  {...register('enrollmentId')}
                  className="mt-1"
                  autoComplete="off"
                />
              </div>
            </section>
          </div>
          <div className={currentPage === 2 ? 'block' : 'hidden'}>
            <h1 className="mb-5 text-sm font-semibold">{'Parent’s Details'}</h1>
            <section className="grid grid-cols-1 flex-wrap justify-between gap-4 md:grid md:grid-cols-1 lg:grid lg:grid-cols-3 ">
              <div className="w-full">
                <label className="mt-1 block text-sm text-gray-700">
                  Father's Name
                </label>
                <Input
                  {...register('fatherName')}
                  className="mt-1"
                  autoComplete="off"
                />
              </div>
              <div className="w-full">
                <label className="mt-1 block text-sm text-gray-700">
                  Father's Occupation
                </label>
                <Input
                  {...register('fatherOccupation')}
                  className="mt-1"
                  autoComplete="off"
                />
              </div>
              <div className="w-full">
                <label className="mt-1 block text-sm text-gray-700">
                  Father's Phone Number
                </label>
                <Input
                  {...register('fatherPhoneNumber')}
                  className="mt-1"
                  autoComplete="off"
                />
              </div>
              <div className="w-full">
                <label className="mt-1 block text-sm text-gray-700">
                  Father's Education
                </label>
                <Input
                  {...register('fatherEducation')}
                  className="mt-1"
                  autoComplete="off"
                />
              </div>
              <div className="w-full">
                <label className="mt-1 block text-sm text-gray-700">
                  Father's Aadhar Card Number
                </label>
                <Input
                  {...register('fatherAadharCardNumber')}
                  className="mt-1"
                  autoComplete="off"
                />
              </div>
              <div className="w-full">
                <label className="mt-1 block text-sm text-gray-700">
                  Fathers's Email Id
                </label>
                <Input
                  {...register('fatherEmailId')}
                  className="mt-1"
                  autoComplete="off"
                />
              </div>
              <div className="w-full">
                <label className="mt-1 block text-sm text-gray-700">
                  Father's Annual Income
                </label>
                <Input
                  {...register('fatherAnnualIncome')}
                  className="mt-1"
                  autoComplete="off"
                />
              </div>
              <div className="w-full">
                <label className="mt-1 block text-sm text-gray-700">
                  Mother's Name
                </label>
                <Input
                  {...register('motherName')}
                  className="mt-1"
                  autoComplete="off"
                />
              </div>
              <div className="w-full">
                <label className="mt-1 block text-sm text-gray-700">
                  Mother's Occupation
                </label>
                <Input
                  {...register('motherOccupation')}
                  className="mt-1"
                  autoComplete="off"
                />
              </div>
              <div className="w-full">
                <label className="mt-1 block text-sm text-gray-700">
                  Mother's Phone Number
                </label>
                <Input
                  {...register('motherPhoneNumber')}
                  className="mt-1"
                  autoComplete="off"
                />
              </div>
              <div className="w-full">
                <label className="mt-1 block text-sm text-gray-700">
                  Mother's Education
                </label>
                <Input
                  {...register('motherEducation')}
                  className="mt-1"
                  autoComplete="off"
                />
              </div>
              <div className="w-full">
                <label className="mt-1 block text-sm text-gray-700">
                  Mother's Aadhar Card Number
                </label>
                <Input
                  {...register('motherAadharCardNumber')}
                  className="mt-1"
                  autoComplete="off"
                />
              </div>
              <div className="w-full">
                <label className="mt-1 block text-sm text-gray-700">
                  Mother's Email Id
                </label>
                <Input
                  {...register('motherEmailId')}
                  className="mt-1"
                  autoComplete="off"
                />
              </div>
              <div className="w-full">
                <label className="mt-1 block text-sm text-gray-700">
                  Mother's Annual Income
                </label>
                <Input
                  {...register('motherAnnualIncome')}
                  className="mt-1"
                  autoComplete="off"
                />
              </div>
              <div className="w-full">
                <label className="mt-1 block text-sm text-gray-700">
                  Parents Separated
                </label>
                <Controller
                  name="parentsSeparated"
                  control={control}
                  defaultValue={
                    studentDetail.additionalAttributes.parentsSeparated
                  }
                  render={({ field: { onChange, value } }) => (
                    <RadioGroup
                      onValueChange={onChange}
                      value={value}
                      className="mt-3 flex gap-2"
                    >
                      <RadioGroupItem className="mr-1 mt-1" value={'yes'} />
                      {'Yes'}
                      <RadioGroupItem
                        className="ml-3 mr-1 mt-1 "
                        value={'no'}
                      />
                      {'No'}
                    </RadioGroup>
                  )}
                />
              </div>
            </section>
          </div>
          <div className={currentPage === 3 ? 'block' : 'hidden'}>
            <h1 className="mb-5 text-sm font-semibold">
              {'Information of Siblings'}
            </h1>
            <section className="grid grid-cols-1 flex-wrap justify-between gap-4 md:grid md:grid-cols-1 lg:grid lg:grid-cols-3 ">
              <div className="w-full">
                <label className="mt-1 block text-sm text-gray-700">
                  No of Siblings
                </label>
                <Select
                  autoComplete="off"
                  value={watch('noOfSiblings')}
                  {...register('noOfSiblings')}
                  onValueChange={(value) => {
                    if (value) {
                      setValue('noOfSiblings', value);
                    }
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value={'0'}>{'0'}</SelectItem>
                      <SelectItem value={'1'}>{'1'}</SelectItem>
                      <SelectItem value={'2'}>{'2'}</SelectItem>
                      <SelectItem value={'3'}>{'3'}</SelectItem>
                      <SelectItem value={'4'}>{'4'}</SelectItem>
                      <SelectItem value={'5'}>{'5'}</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="w-full">
                <label className="mt-1 block text-sm text-gray-700">
                  Sibling Name 1
                </label>
                <Input
                  {...register('siblingName1')}
                  className="mt-1"
                  autoComplete="off"
                />
              </div>
              <div className="w-full">
                <label className="mt-1 block text-sm text-gray-700">
                  Relation
                </label>
                <Controller
                  name="siblingRelation1"
                  control={control}
                  defaultValue={
                    studentDetail.additionalAttributes.siblingRelation1
                  }
                  render={({ field: { onChange, value } }) => (
                    <RadioGroup
                      onValueChange={onChange}
                      value={value}
                      className="mt-3 flex gap-2"
                    >
                      <RadioGroupItem className="mr-1 mt-1" value={'brother'} />
                      {'Brother'}
                      <RadioGroupItem
                        className="ml-3 mr-1 mt-1 "
                        value={'sister'}
                      />
                      {'Sister'}
                    </RadioGroup>
                  )}
                />
              </div>
              <div className="w-full">
                <label className="mt-1 block text-sm text-gray-700">
                  Class for sibling 1
                </label>
                <Input
                  {...register('siblingClass1')}
                  className="mt-1"
                  autoComplete="off"
                />
              </div>
              <div className="w-full">
                <label className="mt-1 block text-sm text-gray-700">
                  Sibling Name 2
                </label>
                <Input
                  {...register('siblingName2')}
                  className="mt-1"
                  autoComplete="off"
                />
              </div>
              <div className="w-full">
                <label className="mt-1 block text-sm text-gray-700">
                  Relation
                </label>
                <Controller
                  name="siblingRelation2"
                  control={control}
                  defaultValue={
                    studentDetail.additionalAttributes.siblingRelation2
                  }
                  render={({ field: { onChange, value } }) => (
                    <RadioGroup
                      onValueChange={onChange}
                      value={value}
                      className="mt-3 flex gap-2"
                    >
                      <RadioGroupItem className="mr-1 mt-1" value={'brother'} />
                      {'Brother'}
                      <RadioGroupItem
                        className="ml-3 mr-1 mt-1 "
                        value={'sister'}
                      />
                      {'Sister'}
                    </RadioGroup>
                  )}
                />
              </div>
              <div className="w-full">
                <label className="mt-1 block text-sm text-gray-700">
                  Class for sibling 2
                </label>
                <Input
                  {...register('siblingClass2')}
                  className="mt-1"
                  autoComplete="off"
                />
              </div>
            </section>
          </div>
          <div className={currentPage === 4 ? 'block' : 'hidden'}>
            <h1 className="mb-5 text-sm font-semibold">
              {'Gurdian’s Details'}
            </h1>
            <section className="grid grid-cols-1 flex-wrap justify-between gap-4 md:grid md:grid-cols-1 lg:grid lg:grid-cols-3 ">
              <div className="w-full">
                <label className="mt-1 block text-sm text-gray-700">
                  Guardian's Name
                </label>
                <Input
                  {...register('guardianName')}
                  className="mt-1"
                  autoComplete="off"
                />
              </div>
              <div className="w-full">
                <label className="mt-1 block text-sm text-gray-700">
                  Guardian's Occupation
                </label>
                <Input
                  {...register('guardiansOccupation')}
                  className="mt-1"
                  autoComplete="off"
                />
              </div>
              <div className="w-full">
                <label className="mt-1 block text-sm text-gray-700">
                  Relationship Type
                </label>
                <Input
                  {...register('relationshipType')}
                  className="mt-1"
                  autoComplete="off"
                />
              </div>
              <div className="w-full">
                <label className="mt-1 block text-sm text-gray-700">
                  Guardian's Phone Number
                </label>
                <Input
                  {...register('guardianPhoneNumber')}
                  className="mt-1"
                  autoComplete="off"
                />
              </div>
              <div className="w-full">
                <label className="mt-1 block text-sm text-gray-700">
                  Guardian's Email Id
                </label>
                <Input
                  {...register('guardianEmailId')}
                  className="mt-1"
                  autoComplete="off"
                />
              </div>
              <div className="w-full">
                <label className="mt-1 block text-sm text-gray-700">
                  Guardian's Aadhar Card Number
                </label>
                <Input
                  {...register('guardianAadharCardNumber')}
                  className="mt-1"
                  autoComplete="off"
                />
              </div>
              <div className="w-full">
                <label className="mt-1 block text-sm text-gray-700">
                  Guardian's Annual Income
                </label>
                <Input
                  {...register('guardianAnnualIncome')}
                  className="mt-1"
                  autoComplete="off"
                />
              </div>
            </section>
          </div>
          <div className={currentPage === 5 ? 'block' : 'hidden'}>
            <h1 className="mb-5 text-sm font-semibold">{'Address Details'}</h1>
            <section className="grid grid-cols-1 flex-wrap justify-between gap-4 md:grid md:grid-cols-1 lg:grid lg:grid-cols-3 ">
              <div className="w-full">
                <label className="mt-1 block text-sm text-gray-700">
                  Residential Address
                </label>
                <textarea
                  {...register('residentialAddress')}
                  autoComplete="off"
                  className="ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring mt-1 flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                ></textarea>
              </div>
              <div className="w-full">
                <label className="mb-1 mt-1 block text-sm text-gray-700 ">
                  Residential Country
                </label>
                <Select
                  autoComplete="off"
                  value={watch('residentialCountry')}
                  {...register('residentialCountry')}
                  onValueChange={(value) => {
                    if (value) {
                      setValue('residentialCountry', value);
                      setResidentialCountryCode(value);
                    }
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {Country?.map((item, index) => (
                        <SelectItem value={item.isoCode} key={index}>
                          {item.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="w-full">
                <label className="mt-1 block text-sm text-gray-700">
                  Residential State
                </label>
                <Select
                  autoComplete="off"
                  value={watch('residentialState')}
                  {...register('residentialState')}
                  onValueChange={(value) => {
                    if (value) {
                      setValue('residentialState', value);
                      setResidentialStateCode(value);
                    }
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {residentialState?.map((item, index) => (
                        <SelectItem value={item.isoCode} key={index}>
                          {item.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="w-full">
                <label className="mt-1 block text-sm text-gray-700">
                  Residential City
                </label>
                <Select
                  autoComplete="off"
                  value={watch('residentialCity')}
                  {...register('residentialCity')}
                  onValueChange={(value) => {
                    if (value) {
                      setValue('residentialCity', value);
                    }
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {residentialCityList?.map((item, index) => (
                        <SelectItem value={item.name} key={index}>
                          {item.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <div className="w-full">
                <label className="mt-1 block text-sm text-gray-700">
                  Postal / ZIP Code
                </label>
                <Input
                  {...register('residentialPostalCode')}
                  className="mt-1"
                  autoComplete="off"
                />
              </div>
              <div className="w-full">
                <label className="mt-1 block text-sm text-gray-700">
                  Permanent Address
                </label>
                <textarea
                  {...register('permanentAddress')}
                  autoComplete="off"
                  className="ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring mt-1 flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                ></textarea>
              </div>
              <div className="w-full">
                <label className="mb-1 mt-1 block text-sm text-gray-700">
                  Permanent Country
                </label>
                <Select
                  autoComplete="off"
                  value={watch('permanentCountry')}
                  {...register('permanentCountry')}
                  onValueChange={(value) => {
                    if (value) {
                      setValue('permanentCountry', value);
                      setPermanentCountryCode(value);
                    }
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {Country?.map((item, index) => (
                        <SelectItem value={item.isoCode} key={index}>
                          {item.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="w-full">
                <label className="mt-1 block text-sm text-gray-700">
                  Permanent State
                </label>
                <Select
                  autoComplete="off"
                  value={watch('permanentState')}
                  {...register('permanentState')}
                  onValueChange={(value) => {
                    if (value) {
                      setValue('permanentState', value);
                      setPermanentStateCode(value);
                    }
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {permanentState?.map((item, index) => (
                        <SelectItem value={item.isoCode} key={index}>
                          {item.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="w-full">
                <label className="mt-1 block text-sm text-gray-700">
                  Permanent City
                </label>
                <Select
                  autoComplete="off"
                  value={watch('permanentCity')}
                  {...register('permanentCity')}
                  onValueChange={(value) => {
                    if (value) {
                      setValue('permanentCity', value);
                    }
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {permanentCity?.map((item, index) => (
                        <SelectItem value={item.name} key={index}>
                          {item.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <div className="w-full">
                <label className="mt-1 block text-sm text-gray-700">
                  Postal / ZIP Code
                </label>
                <Input
                  {...register('permanentPostalCode')}
                  className="mt-1"
                  autoComplete="off"
                />
              </div>
            </section>
          </div>
          <div className={currentPage === 6 ? 'block' : 'hidden'}>
            <h1 className="mb-5 text-sm font-semibold">
              {'Educational Details'}
            </h1>
            <section className="grid grid-cols-1 flex-wrap justify-between gap-4 md:grid md:grid-cols-1 lg:grid lg:grid-cols-3 ">
              <div className="w-full">
                <label className="mt-1 block text-sm text-gray-700">
                  School Name (10th std)
                </label>
                <Input
                  {...register('schoolName10th')}
                  className="mt-1"
                  autoComplete="off"
                />
              </div>
              <div className="w-full">
                <label className="mt-1 block text-sm text-gray-700">
                  Year of Passing
                </label>
                <Input
                  {...register('yearOfPassing10th')}
                  className="mt-1"
                  autoComplete="off"
                />
              </div>
              <div className="w-full">
                <label className="mt-1 block text-sm text-gray-700">
                  Obtained Mark
                </label>
                <Input
                  {...register('obtainedMark10th')}
                  className="mt-1"
                  autoComplete="off"
                />
              </div>
              <div className="w-full">
                <label className="mt-1 block text-sm text-gray-700">
                  Medium of Education 10th
                </label>
                <Input
                  {...register('mediumOfEducation10th')}
                  className="mt-1"
                  autoComplete="off"
                />
              </div>
              <div className="w-full">
                <label className="mt-1 block text-sm text-gray-700">
                  Board of Education 10th
                </label>
                <Input
                  {...register('boardOfEducation10th')}
                  className="mt-1"
                  autoComplete="off"
                />
              </div>
              <div className="w-full">
                <label className="mt-1 block text-sm text-gray-700">
                  TC Number(10th)
                </label>
                <Input
                  {...register('tcNumber10th')}
                  className="mt-1"
                  autoComplete="off"
                />
              </div>
              <div className="w-full">
                <label className="mt-1 block text-sm text-gray-700">
                  School Name (11th std)
                </label>
                <Input
                  {...register('schoolName11th')}
                  className="mt-1"
                  autoComplete="off"
                />
              </div>
              <div className="w-full">
                <label className="mt-1 block text-sm text-gray-700">
                  Year of Passing
                </label>
                <Input
                  {...register('yearOfPassing11th')}
                  className="mt-1"
                  autoComplete="off"
                />
              </div>
              <div className="w-full">
                <label className="mt-1 block text-sm text-gray-700">
                  Obtained Mark
                </label>
                <Input
                  {...register('obtainedMark11th')}
                  className="mt-1"
                  autoComplete="off"
                />
              </div>
              <div className="w-full">
                <label className="mt-1 block text-sm text-gray-700">
                  Medium of Education 11th
                </label>
                <Input
                  {...register('mediumOfEducation11th')}
                  className="mt-1"
                  autoComplete="off"
                />
              </div>
              <div className="w-full">
                <label className="mt-1 block text-sm text-gray-700">
                  Board of Education 11th
                </label>
                <Input
                  {...register('boardOfEducation11th')}
                  className="mt-1"
                  autoComplete="off"
                />
              </div>
            </section>
          </div>
          <div className={currentPage === 7 ? 'block' : 'hidden'}>
            <h1 className="mb-5 text-sm font-semibold">
              {'Educational Details'}
            </h1>
            <section className="grid grid-cols-1 flex-wrap justify-between gap-4 md:grid md:grid-cols-1 lg:grid lg:grid-cols-3 ">
              <div className="w-full">
                <label className="mt-1 block text-sm text-gray-700">
                  Academic Year
                  <span className="text-red-300"> *</span>
                </label>
                <Select
                  autoComplete="off"
                  value={watch('batchId')}
                  {...register('batchId')}
                  onValueChange={(value) => {
                    if (value) {
                      setValue('batchId', value);
                    }
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {batchList?.data?.map((item) => (
                        <SelectItem key={item.id} value={item.id}>
                          {item.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {errors['batchId'] && (
                  <p className="h-2 p-1 text-sm text-red-600">
                    {errors['batchId'].message as string}
                  </p>
                )}
              </div>
              <div className="w-full">
                <label className="mt-1 block text-sm text-gray-700">
                  Scholarship
                </label>
                <Controller
                  name="scholarship"
                  control={control}
                  defaultValue={studentDetail.additionalAttributes.scholarship}
                  render={({ field: { onChange, value } }) => (
                    <RadioGroup
                      onValueChange={onChange}
                      value={value}
                      className="mt-3 flex gap-2"
                    >
                      <RadioGroupItem className="mr-1 mt-1" value={'yes'} />
                      {'Yes'}
                      <RadioGroupItem
                        className="ml-3 mr-1 mt-1 "
                        value={'no'}
                      />
                      {'No'}
                    </RadioGroup>
                  )}
                />
              </div>
              <div className="w-full">
                <label className="mt-1 block text-sm text-gray-700">
                  Aadhar Card Number
                  <span className="text-red-300"> *</span>
                </label>
                <Input
                  {...register('aadharCardNumber')}
                  aria-invalid={errors.name ? 'true' : 'false'}
                  errorMessage={errors?.name?.message.toString()}
                  className="mt-1"
                  autoComplete="off"
                  name="aadharCardNumber"
                />
                {errors['aadharCardNumber'] && (
                  <p className="h-2 p-1 text-sm text-red-600">
                    {errors['aadharCardNumber'].message as string}
                  </p>
                )}
              </div>

              <div className="w-full">
                <label className="mt-1 block text-sm text-gray-700">
                  Mother Tongue
                </label>
                <Select
                  autoComplete="off"
                  value={watch('motherTongueId')}
                  {...register('motherTongueId')}
                  onValueChange={(value) => {
                    if (value) {
                      setValue('motherTongueId', value);
                    }
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {languageList.map((item, index) => (
                        <SelectItem value={item.id} key={index}>
                          {item.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="w-full">
                <label className="mt-1 block text-sm text-gray-700">
                  Religion
                </label>
                <Select
                  autoComplete="off"
                  value={watch('religion')}
                  {...register('religion')}
                  onValueChange={(value) => {
                    if (value) {
                      setValue('religion', value);
                    }
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value={'hindu'}>{'Hindu'}</SelectItem>
                      <SelectItem value={'muslim'}>{'Muslim'}</SelectItem>
                      <SelectItem value={'christian'}>{'christian'}</SelectItem>
                      <SelectItem value={'others'}>{'Others'}</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="w-full">
                <label className="mt-1 block text-sm text-gray-700">
                  Community
                </label>
                <Select
                  autoComplete="off"
                  value={watch('communityId')}
                  {...register('communityId')}
                  onValueChange={(value) => {
                    if (value) {
                      setValue('communityId', value);
                    }
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {communityList.map((item, index) => (
                        <SelectItem value={item.id} key={index}>
                          {item.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="w-full">
                <label className="mt-1 block text-sm text-gray-700">
                  Caste
                </label>
                <Select
                  autoComplete="off"
                  value={watch('caste')}
                  {...register('caste')}
                  onValueChange={(value) => {
                    if (value) {
                      setValue('caste', value);
                    }
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value={'noCaste'}>{'No Caste'}</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="w-full">
                <label className="mt-1 block text-sm text-gray-700">
                  Differently abled
                </label>
                <Controller
                  name="differentlyAbled"
                  control={control}
                  defaultValue={
                    studentDetail.additionalAttributes.differentlyAbled
                  }
                  render={({ field: { onChange, value } }) => (
                    <RadioGroup
                      onValueChange={onChange}
                      value={value}
                      className="mt-3 flex gap-2"
                    >
                      <RadioGroupItem className="mr-1 mt-1" value={'yes'} />{' '}
                      {'Yes'}
                      <RadioGroupItem
                        className="ml-3 mr-1 mt-1 "
                        value={'no'}
                      />
                      {'No'}
                    </RadioGroup>
                  )}
                />
              </div>
              <div className="w-full">
                <label className="mt-1 block text-sm text-gray-700">
                  Type of Disability
                </label>
                <Input
                  {...register('typeOfDisability')}
                  className="mt-1"
                  autoComplete="off"
                />
              </div>
              <div className="w-full">
                <label className="mt-1 block text-sm text-gray-700">
                  First Language
                </label>
                <Input
                  {...register('firstLanguage')}
                  className="mt-1"
                  autoComplete="off"
                />
              </div>
              <div className="w-full">
                <label className="mt-1 block text-sm text-gray-700">
                  Nationality
                </label>
                <Input
                  {...register('nationality')}
                  className="mt-1"
                  autoComplete="off"
                />
              </div>
            </section>
          </div>
          <div className={currentPage < 7 ? 'block' : 'hidden'}>
            <section className="mt-8 flex justify-end gap-2">
              <Button
                type="button"
                onClick={prevPage}
                disabled={currentPage === 1}
                className="mr-2 rounded px-4 py-2 font-bold text-white"
              >
                Back
              </Button>
              <Button
                type="button"
                onClick={nextPage}
                className="rounded px-4 py-2 font-bold text-white "
              >
                Next
              </Button>
            </section>
          </div>
          <div className={currentPage === 7 ? 'block' : 'hidden'}>
            <section className="mt-8 flex justify-end gap-2">
              <Button
                type="button"
                onClick={prevPage}
                className="mr-2 rounded px-4 py-2 font-bold text-white"
              >
                Back
              </Button>
              <Button
                type="submit"
                onClick={nextPage}
                className="rounded px-4 py-2 font-bold text-white "
              >
                Update
              </Button>
            </section>
          </div>
        </section>
      </section>
    </form>
  );
}
