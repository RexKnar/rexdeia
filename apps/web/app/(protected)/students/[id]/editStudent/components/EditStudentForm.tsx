'use client';

/* eslint-disable react/no-unescaped-entities */
import { Check } from 'lucide-react';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button, Input, RadioGroup, RadioGroupItem } from 'ui';

export function EditStudentDetail() {
  const [currentPage, setCurrentPage] = useState(1);

  const {
    watch,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [, setFormData] = useState({} as Record<string, unknown>);

  const handleOnFormSubmit = async (data: Record<string, unknown>) => {
    setFormData(data);
  };
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
          <li>
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
              <section>
                <Check className="h-4 w-4 text-green-500 transition-opacity duration-500" />
              </section>
            </Button>
          </li>
          <li>
            <Button
              type="button"
              variant="link"
              onClick={() => goToPage(2)}
              className=" cursor-pointer  px-4 py-1 hover:no-underline"
            >
              <h2
                className={`px-2 text-left text-sm font-semibold ${
                  currentPage === 2 ? 'text-primary' : 'text-gray-800'
                }`}
              >
                Parent’s Details
              </h2>
              <section>
                <Check className="h-4 w-4 text-green-500 transition-opacity duration-500" />
              </section>
            </Button>
          </li>
          <li>
            <Button
              type="button"
              variant="link"
              onClick={() => goToPage(3)}
              className=" cursor-pointer px-4 py-1 hover:no-underline"
            >
              <h2
                className={`px-2 text-left text-sm font-semibold ${
                  currentPage === 3 ? 'text-primary' : 'text-gray-800'
                }`}
              >
                Information of Siblings
              </h2>
              <section>
                <Check className="h-4 w-4 text-green-500 transition-opacity duration-500" />
              </section>
            </Button>
          </li>
          <li>
            <Button
              type="button"
              variant="link"
              onClick={() => goToPage(4)}
              className=" cursor-pointer px-4 py-1 hover:no-underline"
            >
              <h2
                className={`px-2 text-left text-sm font-semibold ${
                  currentPage === 4 ? 'text-primary' : 'text-gray-800'
                }`}
              >
                Gurdian’s Details
              </h2>
              <section>
                <Check className="h-4 w-4 text-green-500 transition-opacity duration-500" />
              </section>
            </Button>
          </li>
          <li>
            <Button
              type="button"
              variant="link"
              onClick={() => goToPage(5)}
              className=" cursor-pointer px-4 py-1 hover:no-underline"
            >
              <h2
                className={`px-2  text-sm font-semibold ${
                  currentPage === 5 ? 'text-primary' : 'text-gray-800'
                }`}
              >
                Address Details
              </h2>
              <section>
                <Check className="h-4 w-4 text-green-500 transition-opacity duration-500" />
              </section>
            </Button>
          </li>
          <li>
            <Button
              type="button"
              variant="link"
              onClick={() => goToPage(6)}
              className=" cursor-pointer  px-4 py-1 hover:no-underline"
            >
              <h2
                className={`px-2 text-left text-sm font-semibold ${
                  currentPage === 6 ? 'text-primary' : 'text-gray-800'
                }`}
              >
                Educational Details
              </h2>
              <section>
                <Check className="h-4 w-4 text-green-500 transition-opacity duration-500" />
              </section>
            </Button>
          </li>

          <li>
            <Button
              type="button"
              variant="link"
              onClick={() => goToPage(7)}
              className=" cursor-pointer px-4 py-1 hover:no-underline"
            >
              <h2
                className={`px-2 text-left text-sm font-semibold ${
                  currentPage === 7 ? 'text-primary' : 'text-gray-800'
                }`}
              >
                Other Details
              </h2>
              <section>
                <Check className="h-4 w-4 text-green-500 transition-opacity duration-500" />
              </section>
            </Button>
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
                <RadioGroup {...register('gender')} className="mt-3 flex gap-2">
                  <RadioGroupItem className="mr-1 mt-1" value={'male'} />{' '}
                  {'Male'}
                  <RadioGroupItem
                    className="ml-3 mr-1 mt-1 "
                    value={'female'}
                  />{' '}
                  {'Female'}
                </RadioGroup>
              </div>
              <div className="w-full">
                <label className="mt-1 block text-sm text-gray-700">
                  Phone Number
                </label>
                <Input
                  {...register('phone number')}
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
                <select
                  autoComplete="off"
                  value={watch('bloodGroup')}
                  {...register('bloodGroup')}
                  className="ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring mt-1 flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option>O+</option>
                </select>
              </div>
              <div className="w-full">
                <label className="mt-1 block text-sm text-gray-700">
                  Aadhar Card Number
                  <span className="text-red-300"> *</span>
                </label>
                <Input
                  {...register('aadhar number', {
                    required: 'Aadhar Number is required',
                  })}
                  className="mt-1"
                  autoComplete="off"
                />
              </div>
              <div className="w-full">
                <label className="mt-1 block text-sm text-gray-700">
                  Mother Tongue
                </label>
                <select
                  autoComplete="off"
                  {...register('motherTongue')}
                  className="ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring mt-1 flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option>Tamil</option>
                  <option>Malayalam</option>
                  <option>Telugu</option>
                  <option>Hindi</option>
                </select>
              </div>
              <div className="w-full">
                <label className="mt-1 block text-sm text-gray-700">
                  Religion
                </label>
                <select
                  autoComplete="off"
                  {...register('religion')}
                  className="ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring mt-1 flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option>Himdu</option>
                  <option>Muslim</option>
                  <option>Christian</option>
                  <option>Others</option>
                </select>
              </div>
              <div className="w-full">
                <label className="mt-1 block text-sm text-gray-700">
                  Community
                </label>
                <select
                  {...register('languageId')}
                  className="ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring mt-1 flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option>bc</option>
                  <option>sc</option>
                  <option>st</option>
                  <option>mbc</option>
                </select>
              </div>
              <div className="w-full">
                <label className="mt-1 block text-sm text-gray-700">
                  Caste
                </label>
                <select
                  {...register('language')}
                  className="ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring mt-1 flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option>caste</option>
                </select>
              </div>
              <div className="w-full">
                <label className="mt-1 block text-sm text-gray-700">
                  Differently abled
                </label>
                <RadioGroup
                  {...register('language')}
                  className="mt-3 flex gap-2"
                >
                  <RadioGroupItem className="mr-1 mt-1" value={'yes'} /> {'Yes'}
                  <RadioGroupItem className="ml-3 mr-1 mt-1 " value={'no'} />
                  {'No'}
                </RadioGroup>
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
                  Annual Income
                </label>
                <Input
                  {...register('annualIncome')}
                  className="mt-1"
                  autoComplete="off"
                />
              </div>
              <div className="w-full">
                <label className="mt-1 block text-sm text-gray-700">
                  Parents Separated
                </label>
                <RadioGroup
                  {...register('parentsSeparated')}
                  className="mt-3 flex gap-2"
                >
                  <RadioGroupItem className="mr-1 mt-1" value={'yes'} />
                  {'Yes'}
                  <RadioGroupItem className="ml-3 mr-1 mt-1 " value={'no'} />
                  {'No'}
                </RadioGroup>
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
                <select
                  value={watch('language')}
                  {...register('middleName')}
                  className="ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring mt-1 flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option>0</option>
                  <option>1</option>
                  <option>2</option>
                </select>
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
                <RadioGroup
                  {...register('relation')}
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
              </div>
              <div className="w-full">
                <label className="mt-1 block text-sm text-gray-700">
                  Class for sibling 1
                </label>
                <Input
                  {...register('classForSibling1')}
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
                <RadioGroup
                  {...register('relation')}
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
              </div>
              <div className="w-full">
                <label className="mt-1 block text-sm text-gray-700">
                  Class for sibling 2
                </label>
                <Input
                  {...register('classForSibling 2')}
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
                  {...register('guardianOccupation')}
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
                  Guardian's Aadhar Card Number
                </label>
                <Input
                  {...register('guardianAadharCardNumber')}
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
                <label className="mt-1 block text-sm text-gray-700">
                  District
                </label>
                <Input
                  {...register('district')}
                  className="mt-1"
                  autoComplete="off"
                />
              </div>
              <div className="w-full">
                <label className="mt-1 block text-sm text-gray-700">
                  State
                </label>
                <Input
                  {...register('state')}
                  className="mt-1"
                  autoComplete="off"
                />
              </div>
              <div className="w-full">
                <label className="mt-1 block text-sm text-gray-700">
                  Postal / ZIP Code
                </label>
                <Input
                  {...register('postal/ZIPCode')}
                  className="mt-1"
                  autoComplete="off"
                />
              </div>
              <div className="w-full">
                <label className="mt-1 block text-sm text-gray-700">
                  Permanent Address
                </label>
                <textarea
                  {...register('permanentaddress')}
                  autoComplete="off"
                  className="ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring mt-1 flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                ></textarea>
              </div>
              <div className="w-full">
                <label className="mt-1 block text-sm text-gray-700">
                  District
                </label>
                <Input
                  {...register('permanentDistrict')}
                  className="mt-1"
                  autoComplete="off"
                />
              </div>
              <div className="w-full">
                <label className="mt-1 block text-sm text-gray-700">
                  State
                </label>
                <Input
                  {...register('permanentState')}
                  className="mt-1"
                  autoComplete="off"
                />
              </div>
              <div className="w-full">
                <label className="mt-1 block text-sm text-gray-700">
                  Postal / ZIP Code
                </label>
                <Input
                  {...register('permanentPostal/ZIPCode')}
                  className="mt-1"
                  autoComplete="off"
                />
              </div>
              <div className="w-full">
                <label className="mt-1 block text-sm text-gray-700">
                  Nationality
                </label>
                <Input
                  {...register('Nationality')}
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
                  {...register('schoolName10thstd')}
                  className="mt-1"
                  autoComplete="off"
                />
              </div>
              <div className="w-full">
                <label className="mt-1 block text-sm text-gray-700">
                  Year of Passing
                </label>
                <Input
                  {...register('yearOfpassing10')}
                  className="mt-1"
                  autoComplete="off"
                />
              </div>
              <div className="w-full">
                <label className="mt-1 block text-sm text-gray-700">
                  Obtained Mark
                </label>
                <Input
                  {...register('obtainedMark10')}
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
                  School Name (11th std)
                </label>
                <Input
                  {...register('schoolName11thstd')}
                  className="mt-1"
                  autoComplete="off"
                />
              </div>
              <div className="w-full">
                <label className="mt-1 block text-sm text-gray-700">
                  Year of Passing
                </label>
                <Input
                  {...register('yearOfPassing11')}
                  className="mt-1"
                  autoComplete="off"
                />
              </div>
              <div className="w-full">
                <label className="mt-1 block text-sm text-gray-700">
                  Obtained Mark
                </label>
                <Input
                  {...register('obtainedMark')}
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
                  EMIS Number
                </label>
                <Input
                  {...register('EMISNumber')}
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
                  Blood Group
                </label>
                <Input
                  {...register('bloodGroup')}
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
                <select
                  {...register('medium', {
                    required: 'Medium is required',
                  })}
                  className="ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring mt-1 flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option>medium</option>
                </select>
                {errors['medium'] && (
                  <p className="h-2 p-1 text-sm text-red-600">
                    {errors['medium'].message as string}
                  </p>
                )}
              </div>

              <div className="w-full">
                <label className="mt-1 block text-sm text-gray-700">
                  Class
                  <span className="text-red-300"> *</span>
                </label>
                <select
                  {...register('class', {
                    required: 'Class is required',
                  })}
                  className="ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring mt-1 flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option>class</option>
                </select>
                {errors['class'] && (
                  <p className="h-2 p-1 text-sm text-red-600">
                    {errors['class'].message as string}
                  </p>
                )}
              </div>
              <div className="w-full">
                <label className="mt-1 block text-sm text-gray-700">
                  Group
                  <span className="text-red-300"> *</span>
                </label>
                <select
                  {...register('group', {
                    required: 'Group is required',
                  })}
                  className="ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring mt-1 flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option>group</option>
                </select>
                {errors['group'] && (
                  <p className="h-2 p-1 text-sm text-red-600">
                    {errors['group'].message as string}
                  </p>
                )}
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
                  Batch
                  <span className="text-red-300"> *</span>
                </label>
                <select
                  {...register('batch', {
                    required: 'Batch is required',
                  })}
                  className="ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring mt-1 flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option>group</option>
                </select>
                {errors['batch'] && (
                  <p className="h-2 p-1 text-sm text-red-600">
                    {errors['batch'].message as string}
                  </p>
                )}
              </div>
              <div className="w-full">
                <label className="mt-1 block text-sm text-gray-700">
                  Admission Type
                </label>
                <RadioGroup
                  {...register('admissionType')}
                  className="mt-3 flex gap-2"
                >
                  <RadioGroupItem className="mr-1 mt-1" value={'new'} />
                  {'New'}
                  <RadioGroupItem
                    className="ml-3 mr-1 mt-1 "
                    value={'lateral Entry'}
                  />
                  {'Lateral Entry'}
                </RadioGroup>
              </div>
              <div className="w-full">
                <label className="mt-1 block text-sm text-gray-700">
                  Admission Mode
                </label>
                <RadioGroup
                  {...register('admiddionMode')}
                  className="mt-3 flex gap-2"
                >
                  <RadioGroupItem className="mr-1 mt-1" value={'counselling'} />
                  {'Counselling'}
                  <RadioGroupItem
                    className="ml-3 mr-1 mt-1 "
                    value={'management'}
                  />
                  {'Management'}
                </RadioGroup>
              </div>
              <div className="w-full">
                <label className="mt-1 block text-sm text-gray-700">
                  Scholarship
                </label>
                <RadioGroup
                  {...register('scholarship')}
                  className="mt-3 flex gap-2"
                >
                  <RadioGroupItem className="mr-1 mt-1" value={'yes'} />
                  {'Yes'}
                  <RadioGroupItem className="ml-3 mr-1 mt-1 " value={'no'} />
                  {'No'}
                </RadioGroup>
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
            </section>
          </div>
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
              type="submit"
              onClick={nextPage}
              className="rounded px-4 py-2 font-bold text-white "
            >
              {currentPage === 7 ? 'Update' : 'Next'}
            </Button>
          </section>
        </section>
      </section>
    </form>
  );
}
