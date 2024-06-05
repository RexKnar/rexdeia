'use client';
/* eslint-disable react-hooks/exhaustive-deps */

import { UpdateStaffModel } from 'lib/domain/staff';
import { useGetBloodGroupListQuery } from 'lib/queries/common/useGetBloodGroupListQuery';
import { useGetCityByStateCodeQuery } from 'lib/queries/common/useGetCityListQuery';
import { useGetCountryListQuery } from 'lib/queries/common/useGetCountryListQuery';
import { useGetStateByCountryCodeQuery } from 'lib/queries/common/useGetStateListQuery';
import { useGetStaffByIdQuery } from 'lib/queries/staff/useGetStaffByIdQuery';
import { useUpdateStaffMutationById } from 'lib/queries/staff/useUpdateStaffMutationByIdQuery';
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

export function EditStaffDetails() {
  const [currentPage, setCurrentPage] = useState(1);

  const {
    control,
    watch,
    setValue,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const [currentCountryCode, setCurrentCountryCode] = useState('');
  const [permanentCountryCode, setPermanentCountryCode] = useState('');
  const [currentStateCode, setCurrentStateCode] = useState('');
  const [permanentStateCode, setPermanentStateCode] = useState('');
  const [currentCountry, setCurrentCountry] = useState([]);
  const [correntState, setCourrentState] = useState([]);
  const [currentCityList, setCurrentCityList] = useState([]);
  const [permanentCountry, setPermanentCountry] = useState([]);
  const [permanentState, setPermanentState] = useState([]);
  const [permanentCity, setPermanentCity] = useState([]);
  const [bloodGroupList, setBloodGroupList] = useState([]);

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
    setCurrentPage((prevPage) => Math.min(prevPage + 1, 6));
  };
  const religion = [
    {
      label: 'Christian',
      value: 'Christian',
    },
    {
      label: 'Hindu',
      value: 'Hindu',
    },
    {
      label: 'Muslim',
      value: 'Muslim',
    },
  ];
  const caste = [
    {
      id: '1',
      label: 'BC',
      value: 'bc',
    },
    {
      id: '2',
      label: 'SC',
      value: 'sc',
    },
    {
      id: '3',
      label: 'SC',
      value: 'sc',
    },
    {
      id: '4',
      label: 'ST',
      value: 'st',
    },
    {
      id: '5',
      label: 'MBC',
      value: 'mbc',
    },
    {
      id: '6',
      label: 'OC',
      value: 'oc',
    },
  ];
  const nationality = [
    {
      id: '1',
      label: 'Indian',
      value: 'indian',
    },
    {
      id: '2',
      label: 'American',
      value: 'american',
    },
  ];
  const motherTongue = [
    {
      id: '1',
      label: 'Tamil',
      value: 'tamil',
    },
    {
      id: '2',
      label: 'English',
      value: 'english',
    },
    {
      id: '3',
      label: 'Malayalam',
      value: 'malayalam',
    },
  ];
  const category = [
    {
      id: '1',
      label: 'Teaching',
      value: 'teaching',
    },
    {
      id: '2',
      label: 'Non Teaching',
      value: 'nonTeaching',
    },
  ];
  const employmentType = [
    {
      id: '1',
      label: 'Management',
      value: 'management',
    },
    {
      id: '2',
      label: 'Aided',
      value: 'aided',
    },
  ];
  const designation = [
    {
      id: '1',
      label: 'HM',
      value: 'hm',
    },
    {
      id: '2',
      label: 'AHM',
      value: 'ahm',
    },
    {
      id: '3',
      label: 'PG',
      value: 'pg',
    },
  ];
  const natureOfPosting = [
    {
      id: '1',
      label: 'Government',
      value: 'government',
    },
    {
      id: '2',
      label: 'Management',
      value: 'management',
    },
  ];

  const router = useRouter();

  const { id } = useParams<{ id: string }>();
  const { data: getBloodGroupListResponse } = useGetBloodGroupListQuery();
  const { data: getCountryListResponse } = useGetCountryListQuery();

  const { data: getCurrentStateByCountryIdResponse } =
    useGetStateByCountryCodeQuery(currentCountryCode, {
      enabled: !!currentCountryCode,
    });
  const { data: getPermanentStateByCountryIdResponse } =
    useGetStateByCountryCodeQuery(permanentCountryCode, {
      enabled: !!permanentCountryCode,
    });
  const { data: getCurrentCityByStateCodeResponse } =
    useGetCityByStateCodeQuery(currentCountryCode, currentStateCode, {
      enabled: !!currentStateCode,
    });
  const { data: getPermanentCityByStateCodeResponse } =
    useGetCityByStateCodeQuery(permanentCountryCode, permanentStateCode, {
      enabled: !!permanentStateCode,
    });

  useEffect(() => {
    if (getCountryListResponse) {
      setCurrentCountry(getCountryListResponse as any[]);
    }
    if (getCurrentStateByCountryIdResponse) {
      setCourrentState(getCurrentStateByCountryIdResponse as any[]);
    }
    if (getCurrentCityByStateCodeResponse) {
      setCurrentCityList(getCurrentCityByStateCodeResponse as any[]);
    }
    if (getCountryListResponse) {
      setPermanentCountry(getCountryListResponse as any[]);
    }
    if (getPermanentStateByCountryIdResponse) {
      setPermanentState(getPermanentStateByCountryIdResponse as any[]);
    }
    if (getPermanentCityByStateCodeResponse) {
      setPermanentCity(getPermanentCityByStateCodeResponse as any[]);
    }
    if (getBloodGroupListResponse) {
      setBloodGroupList(getBloodGroupListResponse as any[]);
    }
  }, [
    getCountryListResponse,
    getCurrentStateByCountryIdResponse,
    getCurrentCityByStateCodeResponse,
    getPermanentStateByCountryIdResponse,
    getPermanentCityByStateCodeResponse,
    getBloodGroupListResponse,
  ]);

  const { mutateAsync: updateStaffMutationAsync } =
    useUpdateStaffMutationById();

  const { data: staffDetail, isLoading: isStaffDetailLoading } =
    useGetStaffByIdQuery(id);

  useEffect(() => {
    if (staffDetail) {
      const initialValue = {
        firstName: staffDetail.firstName,
        middleName: staffDetail.middleName,
        lastName: staffDetail.lastName,
        dateOfBirth: staffDetail.dateOfBirth,
        age: staffDetail.age,
        gender: staffDetail.gender,
        mobile: staffDetail.mobile,
        email: staffDetail.email,
        bloodGroup: staffDetail.bloodGroup,
        religion: staffDetail.religion,
        caste: staffDetail.caste,
        nationality: staffDetail.nationality,
        motherTongue: staffDetail.motherTongue,
        enrollmentId: staffDetail.enrollmentId,
        aadharCardNumber: staffDetail.aadharCardNumber,
        differentlyAbled: staffDetail.differentlyAbled,
        specialCategory: staffDetail.specialCategory,
        epfNumber: staffDetail.epfNumber,
        fatherName: staffDetail.fatherName,
        motherName: staffDetail.motherName,
        spouseName: staffDetail.spouseName,
        currentAddressLine1: staffDetail.currentAddressLine1,
        currentAddressLine2: staffDetail.currentAddressLine2,
        currentPincode: staffDetail.currentPincode,
        currentCountry: staffDetail.currentCountry,
        currentState: staffDetail.currentState,
        currentCity: staffDetail.currentCity,
        permanentCountry: staffDetail.permanentCountry,
        permanentState: staffDetail.permanentState,
        permanentCity: staffDetail.permanentCity,
        permanentAddress1: staffDetail.permanentAddress1,
        permanentAddress2: staffDetail.permanentAddress2,
        permanentPincode: staffDetail.permanentPincode,
        category: staffDetail.category,
        employmentType: staffDetail.employmentType,
        designation: staffDetail.designation,
        natureOfPosting: staffDetail.natureOfPosting,
        dateOfJoining: staffDetail.dateOfJoining,
        subjectHandling: staffDetail.subjectHandling,
        employeeId: staffDetail.employeeId,
        cps: staffDetail.cps,
        tpf: staffDetail.tpf,
        collegeName: staffDetail.collegeName,
        passOutYear: staffDetail.passOutYear,
        marksObtained: staffDetail.marksObtained,
        accountHolderName: staffDetail.accountHolderName,
        accountNumber: staffDetail.accountNumber,
        branchName: staffDetail.branchName,
        IFSC_Code: staffDetail.IFSC_Code,
      };
      reset(initialValue);
    }
  }, [staffDetail]);

  const dob = staffDetail?.dateOfBirth
    ? new Date(staffDetail?.dateOfBirth).toISOString().split('T')[0]
    : '';
  const doj = staffDetail?.dateOfJoining
    ? new Date(staffDetail?.dateOfJoining).toISOString().split('T')[0]
    : '';
  const dod = staffDetail?.dateOfDetainment
    ? new Date(staffDetail?.dateOfDetainment).toISOString().split('T')[0]
    : '';
  const doreg = staffDetail?.dateOfRegularization
    ? new Date(staffDetail?.dateOfRegularization).toISOString().split('T')[0]
    : '';
  const doret = staffDetail?.dateOfRetirement
    ? new Date(staffDetail?.dateOfRetirement).toISOString().split('T')[0]
    : '';
  const poy = staffDetail?.passOutYear
    ? new Date(staffDetail?.passOutYear).toISOString().split('T')[0]
    : '';
  useEffect(() => {
    if (dob) {
      setValue('dateOfBirth', dob);
    }
    if (doj) {
      setValue('dateOfJoining', doj);
    }
    if (dod) {
      setValue('dateOfDetainment', dod);
    }
    if (doreg) {
      setValue('dateOfRegularization', doreg);
    }
    if (doret) {
      setValue('dateOfRetirement', doret);
    }
    if (poy) {
      setValue('passOutYear', poy);
    }
  }, [setValue, dob, doj, dod, doreg, doret, poy]);

  const handleOnFormSubmit = async (data: UpdateStaffModel) => {
    const payload = data;
    const response = await updateStaffMutationAsync({
      id: id,
      ...payload,
      differentlyAbled: !!data.differentlyAbled,
      dateOfJoining: new Date(data.dateOfJoining),
      dateOfDetainment: new Date(data.dateOfDetainment),
      dateOfRetirement: new Date(data.dateOfRetirement),
      dateOfRegularization: new Date(data.dateOfRegularization),
      passOutYear: new Date(data.passOutYear),
      dateOfBirth: new Date(data.dateOfBirth),
    });
    if (response) {
      router.push(`/staffs/list`);
    }
  };

  if (isStaffDetailLoading) {
    return (
      <div className="flex h-20 items-center justify-center">
        <Loader2 className="mr-2 w-6 animate-spin text-black" />
        <p className="text-black ">Fetching Student Details...</p>
      </div>
    );
  }
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
                  {'Basic Details'}
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
              <div>
                <h2
                  className={`px-2 text-left text-sm font-semibold ${
                    currentPage === 2 ? 'text-primary' : 'text-gray-800'
                  }`}
                >
                  {'Parents Details'}
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
              onClick={() => goToPage(3)}
              className="cursor-pointer px-4 py-1 hover:no-underline"
            >
              <div>
                <h2
                  className={`px-2 text-left text-sm font-semibold ${
                    currentPage === 3 ? 'text-primary' : 'text-gray-800'
                  }`}
                >
                  {'Address Details'}
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
              onClick={() => goToPage(4)}
              className="cursor-pointer px-4 py-1 hover:no-underline"
            >
              <div>
                <h2
                  className={`px-2 text-left text-sm font-semibold ${
                    currentPage === 4 ? 'text-primary' : 'text-gray-800'
                  }`}
                >
                  {'Work Details'}
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
              onClick={() => goToPage(5)}
              className="cursor-pointer px-4 py-1 hover:no-underline"
            >
              <div>
                <h2
                  className={`px-2 text-left text-sm font-semibold ${
                    currentPage === 5 ? 'text-primary' : 'text-gray-800'
                  }`}
                >
                  {'Education Details'}
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
              onClick={() => goToPage(6)}
              className="cursor-pointer px-4 py-1 hover:no-underline"
            >
              <div>
                <h2
                  className={`px-2 text-left text-sm font-semibold ${
                    currentPage === 6 ? 'text-primary' : 'text-gray-800'
                  }`}
                >
                  {'Bank Details'}
                </h2>
              </div>
            </Button>
            <div className="p-3">
              <Check className="h-4 w-4 text-green-500 transition-opacity duration-500" />
            </div>
          </li>
        </ul>
        <section className="w-full rounded-lg bg-white p-5">
          <section className={currentPage === 1 ? 'block' : 'hidden'}>
            <h1 className="mb-5 text-sm font-semibold">{'Personal Details'}</h1>
            <div className="grid grid-cols-1 flex-wrap justify-between gap-4 md:grid md:grid-cols-1 lg:grid lg:grid-cols-3 ">
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
                  <span className="text-red-300"> *</span>
                </label>
                <Input
                  type="date"
                  className="mt-1"
                  autoComplete="off"
                  {...register('dateOfBirth', {
                    required: 'Date of Birth is required',
                  })}
                  aria-invalid={errors.date ? 'true' : 'false'}
                  errorMessage={errors?.date?.message.toString()}
                />
                {errors['dateOfBirth'] && (
                  <p className="h-2 p-1 text-sm text-red-600">
                    {errors['dateOfBirth'].message as string}
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
                  render={({ field: { onChange, value } }) => (
                    <RadioGroup
                      onValueChange={onChange}
                      value={value}
                      className="mt-3 flex gap-2"
                    >
                      <RadioGroupItem className="mr-1 mt-1" value={'male'} />
                      {'Male'}
                      <RadioGroupItem
                        className="ml-3 mr-1 mt-1 "
                        value={'female'}
                      />
                      {'Female'}
                    </RadioGroup>
                  )}
                />
              </div>
              <div className="w-full">
                <label className="mt-1 block text-sm text-gray-700">
                  Mobile Number
                </label>
                <Input
                  {...register('mobile')}
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
                  {...register('email', {
                    required: 'Email is required',
                    validate: (value) => {
                      return validateEmail(value, 'email');
                    },
                  })}
                  aria-invalid={errors.email ? 'true' : 'false'}
                  className="mt-1"
                  autoComplete="off"
                />
                {errors['email'] && (
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
                      {bloodGroupList?.map((item, index) => (
                        <SelectItem value={item.bloodType} key={index}>
                          {item.bloodType}
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
                      {religion.map((item, index) => (
                        <SelectItem value={item.value} key={index}>
                          {item.label}
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
                      {caste.map((item, index) => (
                        <SelectItem value={item.id} key={index}>
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="w-full">
                <label className="mt-1 block text-sm text-gray-700">
                  Nationality
                </label>
                <Select
                  autoComplete="off"
                  value={watch('nationality')}
                  {...register('nationality')}
                  onValueChange={(value) => {
                    if (value) {
                      setValue('nationality', value);
                    }
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {nationality.map((item, index) => (
                        <SelectItem value={item.id} key={index}>
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="w-full">
                <label className="mt-1 block text-sm text-gray-700">
                  Mother Tongue
                </label>
                <Select
                  autoComplete="off"
                  value={watch('motherTongue')}
                  {...register('motherTongue')}
                  onValueChange={(value) => {
                    if (value) {
                      setValue('motherTongue', value);
                    }
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {motherTongue.map((item, index) => (
                        <SelectItem value={item.id} key={index}>
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
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
              <div className="w-full">
                <label className="mt-1 block text-sm text-gray-700">
                  Aadhar Number
                </label>
                <Input
                  {...register('aadharCardNumber')}
                  className="mt-1"
                  autoComplete="off"
                />
              </div>
              <div className="w-full">
                <label className="mt-1 block text-sm text-gray-700">
                  Differently Abled
                </label>
                <Controller
                  name="differentlyAbled"
                  control={control}
                  defaultValue={staffDetail.differentlyAbled.toString()}
                  render={({ field: { onChange, value } }) => (
                    <RadioGroup
                      onValueChange={onChange}
                      value={value}
                      className="mt-3 flex gap-2"
                    >
                      <RadioGroupItem className="mr-1 mt-1" value={'true'} />
                      {'Yes'}
                      <RadioGroupItem
                        className="ml-3 mr-1 mt-1 "
                        value={'false'}
                      />
                      {'No'}
                    </RadioGroup>
                  )}
                />
              </div>
              <div className="w-full">
                <label className="mt-1 block text-sm text-gray-700">
                  Special Category
                </label>
                <Input
                  {...register('specialCategory')}
                  className="mt-1"
                  autoComplete="off"
                />
              </div>
              <div className="w-full">
                <label className="mt-1 block text-sm text-gray-700">
                  ESI/EPF NO
                </label>
                <Input
                  {...register('epfNumber')}
                  className="mt-1"
                  autoComplete="off"
                />
              </div>
            </div>
          </section>
          <section className={currentPage === 2 ? 'block' : 'hidden'}>
            <h1 className="mb-5 text-sm font-semibold">{'Parent Details'}</h1>
            <div className="grid grid-cols-1 flex-wrap justify-between gap-4 md:grid md:grid-cols-1 lg:grid lg:grid-cols-3 ">
              <div className="w-full">
                <label className="mt-1 block text-sm text-gray-700">
                  Father Name
                </label>
                <Input
                  {...register('fatherName')}
                  className="mt-1"
                  autoComplete="off"
                  placeholder="Father Name"
                />
              </div>
              <div className="w-full">
                <label className="mt-1 block text-sm text-gray-700">
                  Mother Name
                </label>
                <Input
                  {...register('motherName')}
                  className="mt-1"
                  autoComplete="off"
                  placeholder="Mother Name"
                />
              </div>
              <div className="w-full">
                <label className="mt-1 block text-sm text-gray-700">
                  Spouse Name
                </label>
                <Input
                  {...register('spouseName')}
                  className="mt-1"
                  autoComplete="off"
                  placeholder="Spouse Name"
                />
              </div>
            </div>
          </section>
          <section className={currentPage === 3 ? 'block' : 'hidden'}>
            <h1 className="mb-5 text-sm font-semibold">{'Address Details'}</h1>
            <div className="grid grid-cols-1 flex-wrap justify-between gap-4 md:grid md:grid-cols-1 lg:grid lg:grid-cols-3 ">
              <div className="w-full">
                <label className="mt-1 block text-sm text-gray-700">
                  Current Address1
                </label>
                <textarea
                  {...register('currentAddressLine1')}
                  className="ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring mt-1 flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  autoComplete="off"
                  placeholder="Current Address1"
                />
              </div>
              <div className="w-full">
                <label className="mt-1 block text-sm text-gray-700">
                  Current Address2
                </label>
                <textarea
                  {...register('currentAddressLine2')}
                  className="ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring mt-1 flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  autoComplete="off"
                  placeholder="Current Address2"
                />
              </div>
              <div className="w-full">
                <label className="mt-1 block text-sm text-gray-700">
                  Current Pioncode
                </label>
                <Input
                  {...register('currentPincode')}
                  className="mt-1"
                  autoComplete="off"
                  placeholder="Current Pioncode"
                />
              </div>
              <div className="w-full">
                <label className="mt-1 block text-sm text-gray-700">
                  Current Country
                </label>
                <Select
                  autoComplete="off"
                  value={watch('currentCountry')}
                  {...register('currentCountry')}
                  onValueChange={(value) => {
                    if (value) {
                      setValue('currentCountry', value);
                      setCurrentCountryCode(value);
                    }
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {currentCountry?.map((item, index) => (
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
                  Current State
                </label>
                <Select
                  autoComplete="off"
                  value={watch('currentState')}
                  {...register('currentState')}
                  onValueChange={(value) => {
                    if (value) {
                      setValue('currentState', value);
                      setCurrentStateCode(value);
                    }
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {correntState?.map((item, index) => (
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
                  Current City
                </label>
                <Select
                  autoComplete="off"
                  value={watch('currentCity')}
                  {...register('currentCity')}
                  onValueChange={(value) => {
                    if (value) {
                      setValue('currentCity', value);
                    }
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {currentCityList?.map((item, index) => (
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
                  Permanent Address1
                </label>
                <textarea
                  name=""
                  id=""
                  {...register('permanentAddress1')}
                  className="ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring mt-1 flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  autoComplete="off"
                  placeholder="Permanent Address1"
                />
              </div>
              <div className="w-full">
                <label className="mt-1 block text-sm text-gray-700">
                  Permanent Address2
                </label>
                <textarea
                  {...register('permanentAddress2')}
                  className="ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring mt-1 flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  autoComplete="off"
                  placeholder="Permanent Address2"
                />
              </div>
              <div className="w-full">
                <label className="mt-1 block text-sm text-gray-700">
                  Permanent Pioncode
                </label>
                <Input
                  {...register('permanentPincode')}
                  className="mt-1"
                  autoComplete="off"
                  placeholder="Permanent Pioncode"
                />
              </div>
              <div className="w-full">
                <label className="mt-1 block text-sm text-gray-700">
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
                      {permanentCountry?.map((item, index) => (
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
            </div>
          </section>
          <section className={currentPage === 4 ? 'block' : 'hidden'}>
            <h1 className="mb-5 text-sm font-semibold">{'Work Details'}</h1>
            <div className="grid grid-cols-1 flex-wrap justify-between gap-4 md:grid md:grid-cols-1 lg:grid lg:grid-cols-3 ">
              <div className="w-full">
                <label className="mt-1 block text-sm text-gray-700">
                  Category
                  <span className="text-red-300"> *</span>
                </label>
                <Select
                  autoComplete="off"
                  value={watch('category')}
                  {...register('category', {
                    required: 'Category is required',
                  })}
                  onValueChange={(value) => {
                    if (value) {
                      setValue('category', value);
                    }
                  }}
                  aria-invalid={errors.category ? 'true' : 'false'}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {category.map((item, index) => (
                        <SelectItem value={item.id} key={index}>
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {errors['category'] && (
                  <p className="h-2 p-1 text-sm text-red-600">
                    {errors?.category?.message.toString()}
                  </p>
                )}
              </div>
              <div className="w-full">
                <label className="mt-1 block text-sm text-gray-700">
                  Employment Type
                  <span className="text-red-300"> *</span>
                </label>
                <Select
                  autoComplete="off"
                  value={watch('employmentType')}
                  {...register('employmentType', {
                    required: 'Employment Type is required',
                  })}
                  onValueChange={(value) => {
                    if (value) {
                      setValue('employmentType', value);
                    }
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {employmentType.map((item, index) => (
                        <SelectItem value={item.id} key={index}>
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {errors['employmentType'] && (
                  <p className="h-2 p-1 text-sm text-red-600">
                    {errors?.employmentType?.message.toString()}
                  </p>
                )}
              </div>
              <div className="w-full">
                <label className="mt-1 block text-sm text-gray-700">
                  Designation
                  <span className="text-red-300"> *</span>
                </label>
                <Select
                  autoComplete="off"
                  value={watch('designation')}
                  {...register('designation', {
                    required: 'Designation is required',
                  })}
                  onValueChange={(value) => {
                    if (value) {
                      setValue('designation', value);
                    }
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {designation.map((item, index) => (
                        <SelectItem value={item.id} key={index}>
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {errors['designation'] && (
                  <p className="h-2 p-1 text-sm text-red-600">
                    {errors['designation'].message.toString()}
                  </p>
                )}
              </div>
              <div className="w-full">
                <label className="mt-1 block text-sm text-gray-700">
                  Date Of Joining
                  <span className="text-red-300"> *</span>
                </label>
                <Input
                  type="date"
                  className="mt-1"
                  autoComplete="off"
                  {...register('dateOfJoining', {
                    required: 'Date of Joining is required',
                  })}
                  aria-invalid={errors.date ? 'true' : 'false'}
                  errorMessage={errors?.date?.message.toString()}
                />
                {errors['dateOfJoining'] && (
                  <p className="h-2 p-1 text-sm text-red-600">
                    {errors['dateOfJoining'].message as string}
                  </p>
                )}
              </div>
              <div className="w-full">
                <label className="mt-1 block text-sm text-gray-700">
                  Date Of Detainment
                </label>
                <Input
                  type="date"
                  className="mt-1"
                  autoComplete="off"
                  {...register('dateOfDetainment')}
                  aria-invalid={errors.date ? 'true' : 'false'}
                />
              </div>
              <div className="w-full">
                <label className="mt-1 block text-sm text-gray-700">
                  Date of Regularisation
                </label>
                <Input
                  type="date"
                  className="mt-1"
                  autoComplete="off"
                  {...register('dateOfRegularization')}
                  aria-invalid={errors.date ? 'true' : 'false'}
                />
              </div>
              <div className="w-full">
                <label className="mt-1 block text-sm text-gray-700">
                  Date of Retirement
                </label>
                <Input
                  type="date"
                  className="mt-1"
                  autoComplete="off"
                  {...register('dateOfRetirement')}
                  aria-invalid={errors.date ? 'true' : 'false'}
                />
              </div>
              <div className="w-full">
                <label className="mt-1 block text-sm text-gray-700">
                  Subject Handling
                </label>
                <Input
                  {...register('subjectHandling')}
                  className="mt-1"
                  autoComplete="off"
                />
              </div>
              <div className="w-full">
                <label className="mt-1 block text-sm text-gray-700">
                  Nature Of Posting
                </label>
                <Select
                  autoComplete="off"
                  value={watch('natureOfPosting')}
                  {...register('natureOfPosting')}
                  onValueChange={(value) => {
                    if (value) {
                      setValue('natureOfPosting', value);
                    }
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {natureOfPosting.map((item, index) => (
                        <SelectItem value={item.id} key={index}>
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="w-full">
                <label className="mt-1 block text-sm text-gray-700">
                  Employee Id
                </label>
                <Input
                  {...register('employeeId')}
                  className="mt-1"
                  autoComplete="off"
                />
              </div>
              <div className="w-full">
                <label className="mt-1 block text-sm text-gray-700">CPS</label>
                <Input
                  {...register('cps')}
                  className="mt-1"
                  autoComplete="off"
                />
              </div>
              <div className="w-full">
                <label className="mt-1 block text-sm text-gray-700">TPF</label>
                <Input
                  {...register('tpf')}
                  className="mt-1"
                  autoComplete="off"
                />
              </div>
            </div>
          </section>
          <section className={currentPage === 5 ? 'block' : 'hidden'}>
            <h1 className="mb-5 text-sm font-semibold">
              {'Education Details'}
            </h1>
            <div className="grid grid-cols-1 flex-wrap justify-between gap-4 md:grid md:grid-cols-1 lg:grid lg:grid-cols-3 ">
              <div className="w-full">
                <label className="mt-1 block text-sm text-gray-700">
                  College Name
                </label>
                <Input
                  {...register('collegeName')}
                  className="mt-1"
                  autoComplete="off"
                  placeholder="collegeName"
                />
              </div>
              <div className="w-full">
                <label className="mt-1 block text-sm text-gray-700">
                  Pass Out Year
                </label>
                <Input
                  type="date"
                  className="mt-1"
                  autoComplete="off"
                  {...register('passOutYear', {
                    required: 'Date of Birth is required',
                  })}
                  aria-invalid={errors.date ? 'true' : 'false'}
                  errorMessage={errors?.date?.message.toString()}
                />
              </div>
              <div className="w-full">
                <label className="mt-1 block text-sm text-gray-700">
                  Marks/Percentage Obtained
                </label>
                <Input
                  {...register('marksObtained')}
                  className="mt-1"
                  autoComplete="off"
                  placeholder=" Marks/Percentage Obtained"
                />
              </div>
            </div>
          </section>
          <section className={currentPage === 6 ? 'block' : 'hidden'}>
            <h1 className="mb-5 text-sm font-semibold">{'Bank Details'}</h1>
            <div className="grid grid-cols-1 flex-wrap justify-between gap-4 md:grid md:grid-cols-1 lg:grid lg:grid-cols-3 ">
              <div className="w-full">
                <label className="mt-1 block text-sm text-gray-700">
                  Account Holder Name
                </label>
                <Input
                  {...register('accountHolderName')}
                  className="mt-1"
                  autoComplete="off"
                  placeholder="Account Holder Name"
                />
              </div>
              <div className="w-full">
                <label className="mt-1 block text-sm text-gray-700">
                  Account Number
                </label>
                <Input
                  {...register('accountNumber')}
                  className="mt-1"
                  autoComplete="off"
                  placeholder="Account Number"
                />
              </div>
              <div className="w-full">
                <label className="mt-1 block text-sm text-gray-700">
                  Branch Name
                </label>
                <Input
                  {...register('branchName')}
                  className="mt-1"
                  autoComplete="off"
                  placeholder="Branch Name"
                />
              </div>
              <div className="w-full">
                <label className="mt-1 block text-sm text-gray-700">
                  IFSC Code
                </label>
                <Input
                  {...register('IFSC_Code')}
                  className="mt-1"
                  autoComplete="off"
                  placeholder="IFSC Code"
                />
              </div>
            </div>
          </section>
          <div className={currentPage < 6 ? 'block' : 'hidden'}>
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
          <div className={currentPage === 6 ? 'block' : 'hidden'}>
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
