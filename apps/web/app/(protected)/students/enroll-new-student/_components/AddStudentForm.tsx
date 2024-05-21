'use client';

import { motion } from 'framer-motion';
import { useGetClassListQuery } from 'lib/queries/class/useGetClassListQuery';
import { useGetGroupListQuery } from 'lib/queries/group/useGetGroupListQuery';
import { useGetMediumListQuery } from 'lib/queries/medium/useGetMediumListQuery';
import { AlertTriangle, Check } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Else, If, Then, When } from 'react-if';
import { Button, Input, RadioGroup, RadioGroupItem } from 'ui';
import { cn } from 'utils';

import { useGetCityByStateCodeQuery } from '../../../../../lib/queries/common/useGetCityListQuery';
import { useGetCountryListQuery } from '../../../../../lib/queries/common/useGetCountryListQuery';
import { useGetStateByCountryCodeQuery } from '../../../../../lib/queries/common/useGetStateListQuery';
import { admissionForm } from '../data';
import { AddStudentPreviewModal } from '../modals/AddStudentPreviewModal';
import { BatchDropDown } from './BatchDropDown';

const formConfig: Record<string, any> = admissionForm;

export function AddStudentForm() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentStep = parseInt(searchParams.get('step')) || 0;

  const {
    control,
    trigger,
    getValues,
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    mode: 'all',
    reValidateMode: 'onChange',
  });

  const totalSteps = formConfig.formSections.length;

  const [formData, setFormData] = useState({} as Record<string, unknown>);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [visitedSteps, setVisitedSteps] = useState([]);
  const [residentialCountryCode, setCurrentCountryCode] = useState('');
  const [permanentCountryCode, setPermanentCountryCode] = useState('');
  const [residentialStateCode, setCurrentStateCode] = useState('');
  const [permanentStateCode, setPermanentStateCode] = useState('');

  const page = 1;
  const limit = 999;
  const filter = { isActive: true };

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

  const { data: getCurrentStateByCountryIdResponse } =
    useGetStateByCountryCodeQuery(residentialCountryCode, {
      enabled: !!residentialCountryCode,
    });
  const { data: getPermanentStateByCountryIdResponse } =
    useGetStateByCountryCodeQuery(permanentCountryCode, {
      enabled: !!permanentCountryCode,
    });
  const { data: getCurrentCityByStateCodeResponse } =
    useGetCityByStateCodeQuery(residentialCountryCode, residentialStateCode, {
      enabled: !!residentialStateCode,
    });
  const { data: getPermanentCityByStateCodeResponse } =
    useGetCityByStateCodeQuery(permanentCountryCode, permanentStateCode, {
      enabled: !!permanentStateCode,
    });
  const { data: getCountryListResponse } = useGetCountryListQuery();

  let customDataList = {
    joiningMedium: mediumList?.data || [],
    joiningClass: classList?.data || [],
    joiningGroup: groupList?.data || [],
    permanentCountry: getCountryListResponse || [],
    permanentState: getPermanentStateByCountryIdResponse || [],
    permanentCity: getPermanentCityByStateCodeResponse || [],
    residentialCountry: getCountryListResponse || [],
    residentialState: getCurrentStateByCountryIdResponse || [],
    residentialCity: getCurrentCityByStateCodeResponse || [],
  };

  const handleOnFormSubmit = async (data: Record<string, unknown>) => {
    setFormData(data);
    setIsPreviewModalOpen(true);
  };

  const isSectionCompleted = (section: any) => {
    const totalRequiredFields = section.sectionFields.filter(
      (field) => field.validationRules?.required.value
    ).length;

    const totalFilledFields = section.sectionFields.filter((field) =>
      getValues(field.name)
    ).length;

    const noErrors = section.sectionFields.every(
      (field) => !errors[field.name]
    );

    return totalRequiredFields <= totalFilledFields && noErrors;
  };

  const isSectionError = (section: any, sectionIndex: number) => {
    const hasErrors = section.sectionFields.some((field) => errors[field.name]);

    const isVisitedOrLast =
      visitedSteps.includes(sectionIndex) ||
      sectionIndex === formConfig.formSections.length - 1;

    return hasErrors && isVisitedOrLast;
  };

  const validateEmail = (value, field) => {
    const atIndex = value.indexOf('@');
    const dotIndex = value.lastIndexOf('.');

    if (value === '') {
      return `${field.label} is required`;
    }

    if (
      atIndex === -1 ||
      dotIndex === -1 ||
      dotIndex <= atIndex + 1 ||
      dotIndex === value.length - 1
    ) {
      return `${field.label} must be a valid email address`;
    }
  };

  return (
    <form
      autoFocus
      autoComplete="off"
      className="relative mt-[20px] w-full"
      onSubmit={handleSubmit(handleOnFormSubmit)}
    >
      <section className="flex gap-4">
        <ul className="h-fit w-[215px] shrink-0 rounded-lg bg-white py-3">
          <li>
            {formConfig.formSections.map((section, index: number) => (
              <Button
                type="button"
                variant="link"
                key={section.sectionTitle}
                onClick={() => {
                  if (!visitedSteps.includes(currentStep)) {
                    setVisitedSteps([...visitedSteps, currentStep]);
                  }
                  const params = new URLSearchParams(searchParams);
                  params.set('step', index.toString());

                  router.replace(pathname + '?' + params.toString());
                }}
                className="grid cursor-pointer grid-cols-[4px_minmax(170px,_1fr)_10px] px-4 py-1 hover:no-underline"
              >
                <motion.div
                  initial={false}
                  animate={{
                    opacity: currentStep === index ? 1 : 0,
                  }}
                  className="h-6 border-l-2 border-primary"
                />
                <h2
                  className={`px-2 text-left text-sm font-semibold ${
                    currentStep === index ? 'text-primary' : 'text-gray-800'
                  }`}
                >
                  {section.sectionTitle}
                </h2>
                <section>
                  <When condition={isSectionCompleted(section)}>
                    <Check className="h-4 w-4 text-green-500 transition-opacity duration-500" />
                  </When>
                  <When condition={isSectionError(section, index)}>
                    <AlertTriangle className="h-4 w-4 text-red-500 transition-opacity duration-500" />
                  </When>
                </section>
              </Button>
            ))}
          </li>
        </ul>
        <section className="w-full rounded-lg bg-white p-2">
          {formConfig.formSections.map((section, index) => (
            <motion.section
              key={section.sectionTitle}
              className={cn(
                'mt-1 hidden p-4',
                currentStep === index && 'block'
              )}
              initial={false}
              animate={{
                opacity: currentStep === index ? 1 : 0,
                y: currentStep === index ? 0 : 20,
              }}
              transition={{ duration: 0.2, ease: 'anticipate' }}
            >
              <h1 className="mb-5 text-sm font-semibold">
                {section.sectionTitle}
              </h1>
              <section className="grid grid-cols-1 flex-wrap justify-between gap-4 md:grid md:grid-cols-1 lg:grid lg:grid-cols-3 ">
                {section.sectionTitle === 'Other Details' && <BatchDropDown />}
                {section.sectionFields.map((field) => {
                  if (field.visible) {
                    switch (field.type) {
                      case 'text':
                      case 'date':
                        return (
                          <div key={field.id} className="w-full">
                            <label className="mt-1 block text-sm text-gray-700">
                              {field.label}
                              {field.validationRules.required.value && (
                                <span className="text-red-300"> *</span>
                              )}
                            </label>
                            <Input
                              {...register(field.name, field.validationRules)}
                              type={field.type}
                              placeholder={field.placeholder}
                              className="mt-1"
                              autoComplete="off"
                            />
                            <motion.p
                              initial={{ opacity: 0 }}
                              animate={{
                                opacity: errors[field.name] ? 1 : 0,
                              }}
                              transition={{ duration: 0.5 }}
                              className="h-3 pb-2 pt-0.5 text-sm text-red-300"
                            >
                              {errors[field.name]?.message as string}
                            </motion.p>
                          </div>
                        );
                      case 'email':
                        return (
                          <div key={field.id} className="w-full">
                            <label className="mt-1 block text-sm text-gray-700">
                              {field.label}
                              {field.validationRules.required.value && (
                                <span className="text-red-300"> *</span>
                              )}
                            </label>
                            <Input
                              {...register(field.name, {
                                ...field.validationRules,
                                required: 'Email is required',
                                validate: (value) => {
                                  return validateEmail(value, field);
                                },
                              })}
                              type={field.type}
                              placeholder={field.placeholder}
                              className="mt-1"
                            />
                            {errors[field.name] && (
                              <p className="h-2 p-1 text-sm text-red-600">
                                {errors[field.name].message as string}
                              </p>
                            )}
                          </div>
                        );
                      case 'textarea':
                        return (
                          <div key={field.id} className="w-full">
                            <label className="block text-gray-700">
                              {field.label}
                              {field.validationRules.required.value && (
                                <span className="text-red-300"> *</span>
                              )}
                            </label>
                            <textarea
                              {...register(field.name, field.validationRules)}
                              placeholder={field.placeholder}
                              autoComplete="off"
                              className="ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring mt-1 flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            ></textarea>
                            <motion.p
                              initial={{ opacity: 0 }}
                              animate={{
                                opacity: errors[field.name] ? 1 : 0,
                              }}
                              transition={{ duration: 0.5 }}
                              className="h-3 pb-2 pt-0.5 text-sm text-red-300"
                            >
                              {errors[field.name]?.message as string}
                            </motion.p>
                          </div>
                        );
                      case 'radio':
                        return (
                          <Controller
                            name={field.name}
                            control={control}
                            render={({ field: { onChange, value } }) => (
                              <RadioGroup
                                onValueChange={onChange}
                                value={value}
                              >
                                <div key={field.id}>
                                  <label className="mb-2 mt-1 block text-sm text-gray-700">
                                    {field.label}
                                    {field.validationRules.required.value && (
                                      <span className="text-red-300"> *</span>
                                    )}
                                  </label>
                                  {field.options.map((option) => (
                                    <React.Fragment key={option.value}>
                                      <RadioGroupItem
                                        className="mr-2"
                                        value={option.value}
                                      />
                                      <span className="me-3">
                                        {option.label}
                                      </span>
                                    </React.Fragment>
                                  ))}
                                  <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{
                                      opacity: errors[field.name] ? 1 : 0,
                                    }}
                                    transition={{ duration: 0.5 }}
                                    className="h-3 pb-2 pt-0.5 text-sm text-red-300"
                                  >
                                    {errors[field.name]?.message as string}
                                  </motion.p>
                                </div>
                              </RadioGroup>
                            )}
                          />
                        );
                      case 'dropdown':
                        return (
                          <div key={field.id}>
                            <label className="mb-2 mt-1 block text-sm text-gray-700">
                              {field.label}
                              {field.validationRules.required.value && (
                                <span className="text-red-300"> *</span>
                              )}
                            </label>
                            <select
                              {...register(field.name, field.validationRules)}
                              onChange={(e) => {
                                const selectedValue = e.target.value;
                                if (field.name === 'residentialCountry') {
                                  setCurrentCountryCode(selectedValue);
                                } else if (field.name === 'permanentCountry') {
                                  setPermanentCountryCode(selectedValue);
                                } else if (field.name === 'residentialState') {
                                  setCurrentStateCode(selectedValue);
                                } else if (field.name === 'permanentState') {
                                  setPermanentStateCode(selectedValue);
                                }
                              }}
                              placeholder={field.placeholder}
                              className="ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring mt-1 flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              {(field.options && field.options.length > 0
                                ? field.options
                                : customDataList[field.name]
                              ).map((option, index) => (
                                <option
                                  key={index}
                                  value={option[field.optionValue]}
                                >
                                  {option[field.optionKey]}
                                </option>
                              ))}
                            </select>
                            <motion.p
                              initial={{ opacity: 0 }}
                              animate={{
                                opacity: errors[field.name] ? 1 : 0,
                              }}
                              transition={{ duration: 0.5 }}
                              className="h-3 pb-2 pt-0.5 text-sm text-red-300"
                            >
                              {errors[field.name]?.message as string}
                            </motion.p>
                          </div>
                        );
                      default:
                        return null;
                    }
                  } else {
                    return null;
                  }
                })}
              </section>

              <section className="mt-8 flex justify-end gap-2">
                <Button
                  type="button"
                  className="mr-2"
                  disabled={currentStep === 0}
                  onClick={() => {
                    section.sectionFields.forEach((field) => {
                      trigger(field.name);
                    });

                    if (currentStep > 0) {
                      if (!visitedSteps.includes(currentStep)) {
                        setVisitedSteps([...visitedSteps, currentStep]);
                      }

                      const params = new URLSearchParams(searchParams);
                      params.set('step', (currentStep - 1).toString());

                      router.replace(pathname + '?' + params.toString());
                    }
                  }}
                >
                  Back
                </Button>
                <If condition={currentStep === totalSteps - 1}>
                  <Then>
                    <Button
                      type="submit"
                      disabled={!isValid}
                      aria-disabled={!isValid}
                    >
                      Preview & Submit
                    </Button>
                    <AddStudentPreviewModal
                      formData={formData}
                      open={isPreviewModalOpen}
                      onOpenChange={setIsPreviewModalOpen}
                      formSections={formConfig.formSections}
                    />
                  </Then>
                  <Else>
                    <Button
                      type="button"
                      onClick={(e) => {
                        section.sectionFields.forEach((field) => {
                          trigger(field.name);
                        });

                        if (!visitedSteps.includes(currentStep)) {
                          setVisitedSteps([...visitedSteps, currentStep]);
                        }
                        const params = new URLSearchParams(searchParams);
                        params.set('step', (currentStep + 1).toString());

                        router.replace(pathname + '?' + params.toString());
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                    >
                      Next
                    </Button>
                  </Else>
                </If>
              </section>
            </motion.section>
          ))}
        </section>
      </section>
    </form>
  );
}
