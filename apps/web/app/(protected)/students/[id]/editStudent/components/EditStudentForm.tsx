'use client';
/* eslint-disable react/no-unescaped-entities */
import { Check } from 'lucide-react';
import React, { useState } from 'react';
import { Button, Input, RadioGroup, RadioGroupItem } from 'ui';

export function EditStudentDetail() {
  const [currentPage, setCurrentPage] = useState(1);

  const goToPage = (page) => {
    setCurrentPage(page);
  };
  const nextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    setCurrentPage(currentPage - 1);
  };

  return (
    <form autoFocus autoComplete="off" className="relative mt-[20px] w-full">
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
                <Input className="mt-1" autoComplete="off" />
              </div>
              <div className="w-full">
                <label className="mt-1 block text-sm text-gray-700">
                  Middle Name
                </label>
                <Input className="mt-1" autoComplete="off" />
              </div>
              <div className="w-full">
                <label className="mt-1 block text-sm text-gray-700">
                  Last Name
                </label>
                <Input className="mt-1" autoComplete="off" />
              </div>
              <div className="w-full">
                <label className="mt-1 block text-sm text-gray-700">Date</label>
                <Input type="date" className="mt-1" autoComplete="off" />
              </div>
              <div className="w-full">
                <label className="mt-1 block text-sm text-gray-700">Age</label>
                <Input className="mt-1" autoComplete="off" />
              </div>
              <div className="w-full">
                <label className="mt-1 block text-sm text-gray-700">
                  Gender
                </label>
                <RadioGroup className="mt-3 flex gap-2">
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
                <Input className="mt-1" autoComplete="off" />
              </div>
              <div className="w-full">
                <label className="mt-1 block text-sm text-gray-700">
                  Email
                  <span className="text-red-300"> *</span>
                </label>
                <Input className="mt-1" autoComplete="off" />
              </div>
              <div className="w-full">
                <label className="mt-1 block text-sm text-gray-700">
                  Blood Group
                </label>
                <select className="ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring mt-1 flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                  <option>O+</option>
                </select>
              </div>
              <div className="w-full">
                <label className="mt-1 block text-sm text-gray-700">
                  Aadhar Number
                  <span className="text-red-300"> *</span>
                </label>
                <Input className="mt-1" autoComplete="off" />
              </div>
              <div className="w-full">
                <label className="mt-1 block text-sm text-gray-700">
                  Mother Tongue
                </label>
                <select className="ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring mt-1 flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
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
                <select className="ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring mt-1 flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
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
                <select className="ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring mt-1 flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
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
                <select className="ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring mt-1 flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                  <option>no caste</option>
                </select>
              </div>
              <div className="w-full">
                <label className="mt-1 block text-sm text-gray-700">
                  Differently abled
                </label>
                <RadioGroup className="mt-3 flex gap-2">
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
                <Input className="mt-1" autoComplete="off" />
              </div>
              <div className="w-full">
                <label className="mt-1 block text-sm text-gray-700">
                  Father's Occupation
                </label>
                <Input className="mt-1" autoComplete="off" />
              </div>
              <div className="w-full">
                <label className="mt-1 block text-sm text-gray-700">
                  Father's Phone Number
                </label>
                <Input className="mt-1" autoComplete="off" />
              </div>
              <div className="w-full">
                <label className="mt-1 block text-sm text-gray-700">
                  Father's Education
                </label>
                <Input className="mt-1" autoComplete="off" />
              </div>
              <div className="w-full">
                <label className="mt-1 block text-sm text-gray-700">
                  Father's Aadhar Card Number
                </label>
                <Input className="mt-1" autoComplete="off" />
              </div>
              <div className="w-full">
                <label className="mt-1 block text-sm text-gray-700">
                  Mother's Name
                </label>
                <Input className="mt-1" autoComplete="off" />
              </div>
              <div className="w-full">
                <label className="mt-1 block text-sm text-gray-700">
                  Mother's Occupation
                </label>
                <Input className="mt-1" autoComplete="off" />
              </div>
              <div className="w-full">
                <label className="mt-1 block text-sm text-gray-700">
                  Mother's Phone Number
                </label>
                <Input className="mt-1" autoComplete="off" />
              </div>
              <div className="w-full">
                <label className="mt-1 block text-sm text-gray-700">
                  Mother's Education
                </label>
                <Input className="mt-1" autoComplete="off" />
              </div>
              <div className="w-full">
                <label className="mt-1 block text-sm text-gray-700">
                  Mother's Aadhar Card Number
                </label>
                <Input className="mt-1" autoComplete="off" />
              </div>
              <div className="w-full">
                <label className="mt-1 block text-sm text-gray-700">
                  Annual Income
                </label>
                <Input className="mt-1" autoComplete="off" />
              </div>
              <div className="w-full">
                <label className="mt-1 block text-sm text-gray-700">
                  Parents Separated
                </label>
                <RadioGroup className="mt-3 flex gap-2">
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
                <select className="ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring mt-1 flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                  <option>0</option>
                </select>
              </div>
              <div className="w-full">
                <label className="mt-1 block text-sm text-gray-700">
                  Sibling Name 1
                </label>
                <Input className="mt-1" autoComplete="off" />
              </div>
              <div className="w-full">
                <label className="mt-1 block text-sm text-gray-700">
                  Relation
                </label>
                <RadioGroup className="mt-3 flex gap-2">
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
                <Input className="mt-1" autoComplete="off" />
              </div>
              <div className="w-full">
                <label className="mt-1 block text-sm text-gray-700">
                  Sibling Name 2
                </label>
                <Input className="mt-1" autoComplete="off" />
              </div>
              <div className="w-full">
                <label className="mt-1 block text-sm text-gray-700">
                  Relation
                </label>
                <RadioGroup className="mt-3 flex gap-2">
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
                <Input className="mt-1" autoComplete="off" />
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
                <Input className="mt-1" autoComplete="off" />
              </div>
              <div className="w-full">
                <label className="mt-1 block text-sm text-gray-700">
                  Guardian's Occupation
                </label>
                <Input className="mt-1" autoComplete="off" />
              </div>
              <div className="w-full">
                <label className="mt-1 block text-sm text-gray-700">
                  Relationship Type
                </label>
                <Input className="mt-1" autoComplete="off" />
              </div>
              <div className="w-full">
                <label className="mt-1 block text-sm text-gray-700">
                  Guardian's Phone Number
                </label>
                <Input className="mt-1" autoComplete="off" />
              </div>
              <div className="w-full">
                <label className="mt-1 block text-sm text-gray-700">
                  Guardian's Aadhar Card Number
                </label>
                <Input className="mt-1" autoComplete="off" />
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
                  autoComplete="off"
                  className="ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring mt-1 flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                ></textarea>
              </div>
              <div className="w-full">
                <label className="mt-1 block text-sm text-gray-700">
                  District
                </label>
                <Input className="mt-1" autoComplete="off" />
              </div>
              <div className="w-full">
                <label className="mt-1 block text-sm text-gray-700">
                  State
                </label>
                <Input className="mt-1" autoComplete="off" />
              </div>
              <div className="w-full">
                <label className="mt-1 block text-sm text-gray-700">
                  Postal / ZIP Code
                </label>
                <Input className="mt-1" autoComplete="off" />
              </div>
              <div className="w-full">
                <label className="mt-1 block text-sm text-gray-700">
                  Permanent Address
                </label>
                <textarea
                  autoComplete="off"
                  className="ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring mt-1 flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                ></textarea>
              </div>
              <div className="w-full">
                <label className="mt-1 block text-sm text-gray-700">
                  District
                </label>
                <Input className="mt-1" autoComplete="off" />
              </div>
              <div className="w-full">
                <label className="mt-1 block text-sm text-gray-700">
                  State
                </label>
                <Input className="mt-1" autoComplete="off" />
              </div>
              <div className="w-full">
                <label className="mt-1 block text-sm text-gray-700">
                  Postal / ZIP Code
                </label>
                <Input className="mt-1" autoComplete="off" />
              </div>
              <div className="w-full">
                <label className="mt-1 block text-sm text-gray-700">
                  Nationality
                </label>
                <Input className="mt-1" autoComplete="off" />
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
                <Input className="mt-1" autoComplete="off" />
              </div>
              <div className="w-full">
                <label className="mt-1 block text-sm text-gray-700">
                  Year of Passing
                </label>
                <Input className="mt-1" autoComplete="off" />
              </div>
              <div className="w-full">
                <label className="mt-1 block text-sm text-gray-700">
                  Obtained Mark
                </label>
                <Input className="mt-1" autoComplete="off" />
              </div>
              <div className="w-full">
                <label className="mt-1 block text-sm text-gray-700">
                  Medium of Education 10th
                </label>
                <Input className="mt-1" autoComplete="off" />
              </div>
              <div className="w-full">
                <label className="mt-1 block text-sm text-gray-700">
                  School Name (11th std)
                </label>
                <Input className="mt-1" autoComplete="off" />
              </div>
              <div className="w-full">
                <label className="mt-1 block text-sm text-gray-700">
                  Year of Passing
                </label>
                <Input className="mt-1" autoComplete="off" />
              </div>
              <div className="w-full">
                <label className="mt-1 block text-sm text-gray-700">
                  Obtained Mark
                </label>
                <Input className="mt-1" autoComplete="off" />
              </div>
              <div className="w-full">
                <label className="mt-1 block text-sm text-gray-700">
                  Medium of Education 11th
                </label>
                <Input className="mt-1" autoComplete="off" />
              </div>
              <div className="w-full">
                <label className="mt-1 block text-sm text-gray-700">
                  EMIS Number
                </label>
                <Input className="mt-1" autoComplete="off" />
              </div>
              <div className="w-full">
                <label className="mt-1 block text-sm text-gray-700">
                  Admission Number
                </label>
                <Input className="mt-1" autoComplete="off" />
              </div>
              <div className="w-full">
                <label className="mt-1 block text-sm text-gray-700">
                  Blood Group
                </label>
                <Input type="date" className="mt-1" autoComplete="off" />
              </div>
              <div className="w-full">
                <label className="mt-1 block text-sm text-gray-700">
                  Medium
                  <span className="text-red-300"> *</span>
                </label>
                <select className="ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring mt-1 flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                  <option>medium</option>
                </select>
              </div>
              <div className="w-full">
                <label className="mt-1 block text-sm text-gray-700">
                  Class
                  <span className="text-red-300"> *</span>
                </label>
                <select className="ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring mt-1 flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                  <option>class</option>
                </select>
              </div>
              <div className="w-full">
                <label className="mt-1 block text-sm text-gray-700">
                  Group
                  <span className="text-red-300"> *</span>
                </label>
                <select className="ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring mt-1 flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                  <option>group</option>
                </select>
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
                <select className="ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring mt-1 flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                  <option>group</option>
                </select>
              </div>
              <div className="w-full">
                <label className="mt-1 block text-sm text-gray-700">
                  Admission Type
                </label>
                <RadioGroup className="mt-3 flex gap-2">
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
                <RadioGroup className="mt-3 flex gap-2">
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
                <RadioGroup className="mt-3 flex gap-2">
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
                <Input className="mt-1" autoComplete="off" />
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
              type="button"
              onClick={nextPage}
              disabled={currentPage === 7}
              className="rounded px-4 py-2 font-bold text-white "
            >
              {currentPage === 7 ? 'Preview & Submit' : 'Next'}
            </Button>
          </section>
        </section>
      </section>
    </form>
  );
}
