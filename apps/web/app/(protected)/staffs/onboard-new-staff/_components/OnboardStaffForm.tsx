'use client';
import { motion } from 'framer-motion';
import { parseAsInteger, useQueryState } from 'next-usequerystate';
import React from 'react';
import { useForm } from 'react-hook-form';
import { Input, RadioGroup, RadioGroupItem } from 'ui';
import { cn } from 'utils';

import staffForm from '../data/onboard-staff-fields';
import { OnboardStaffSidebar } from './OnboardStaffSidebar';

export function OnboardStaffForm() {
  const [currentStep] = useQueryState('step', parseAsInteger.withDefault(0));
  const {
    register,
    formState: { errors },
  } = useForm({
    mode: 'all',
    reValidateMode: 'onChange',
  });
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
    <form autoFocus autoComplete="off" className="relative mt-[20px] w-full">
      <section className="flex gap-4">
        <OnboardStaffSidebar />

        <section className="w-full rounded-lg bg-white p-2">
          {staffForm.map((section, index) => (
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
                {section.sectionFields.map((field) => {
                  if (field.visible) {
                    switch (field.type) {
                      case 'text':
                      case 'date':
                        return (
                          <div key={field.id} className="w-full">
                            <label className="mt-1 block text-sm text-gray-700">
                              {field.label}
                              {field.validationRules.required && (
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
                              {field.validationRules.required && (
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
                          <RadioGroup>
                            <div key={field.id}>
                              <label className="mb-2 mt-1 block text-sm text-gray-700">
                                {field.label}
                                {field.validationRules.required && (
                                  <span className="text-red-300"> *</span>
                                )}
                              </label>
                              {field.options.map((option) => (
                                <React.Fragment key={option.value}>
                                  <RadioGroupItem
                                    className="mr-2"
                                    name={field.name}
                                    value={option.value}
                                    {...register(
                                      field.name,
                                      field.validationRules
                                    )}
                                  />
                                  <span className="me-3">{option.label}</span>
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
                        );
                      case 'dropdown':
                        return (
                          <div key={field.id}>
                            <label className="mb-2 mt-1 block text-sm text-gray-700">
                              {field.label}
                              {field.validationRules.required && (
                                <span className="text-red-300"> *</span>
                              )}
                            </label>
                            <select
                              {...register(field.name, field.validationRules)}
                              placeholder={field.placeholder}
                              className="ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring mt-1 flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              {field.options.map((option, index) => (
                                <option key={index} value={option.value}>
                                  {option.label}
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
            </motion.section>
          ))}
        </section>
      </section>
    </form>
  );
}
