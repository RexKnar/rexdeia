'use client';

import { Loader2 } from 'lucide-react';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  Button,
  Input,
} from 'ui';
import { useToast } from 'ui/hooks/useToast';
import { copyToClipboard } from 'utils';

import { makeAPICall } from '../../api';
import { ADD_ADMISSION } from '../../endpoints';

type AdmissionFormProps = {
  formId: string;
  formConfig: Record<string, any>;
};

export function AdmissionForm({ formConfig, formId }: AdmissionFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const shareableURL = window
    ? `${window.location.origin}/forms/${formConfig.organizationId}`
    : '';

  const totalSteps = formConfig.json.formSections.length;
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedSectionIndex, setSelectedSectionIndex] = useState(0);

  const nextStep = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
      setSelectedSectionIndex(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setSelectedSectionIndex(currentStep - 1);
    }
  };

  async function addAdmissionHandler(data: Record<string, unknown>) {
    if (currentStep === totalSteps - 1) {
      try {
        await makeAPICall(
          ADD_ADMISSION,
          {
            ...data,
          },
          {
            formId,
          }
        );
      } catch (error) {
        console.log(error);
        // TODO: Handle error
      }
    } else {
      nextStep();
    }
  }

  const { toast } = useToast();
  const handleCopyClick = async () => {
    await copyToClipboard(shareableURL);
    toast({
      description: 'URL copied to clipboard',
    });
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(addAdmissionHandler)}
        className="relative p-4"
      >
        <section className="absolute -top-20 right-0">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                className="mt-6 cursor-pointer rounded-md bg-primary px-5 text-white hover:bg-primary/90"
                variant="outline"
              >
                Share
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-white">
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Copy the URL to share the admission form
                </AlertDialogTitle>
                <AlertDialogDescription>
                  <Input
                    type="text"
                    className="mt-2"
                    value={shareableURL}
                    readOnly
                  />
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogAction onClick={handleCopyClick}>
                  Copy
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </section>

        <div className="flex gap-4">
          <ul className="h-fit w-[215px] shrink-0 rounded-lg bg-white py-3">
            <li>
              {formConfig.json.formSections.map((section, index) => (
                <div key={section.sectionTitle} className="mt-3 px-4 py-1">
                  <h2
                    className={`inter px-2 text-sm font-semibold ${
                      selectedSectionIndex === index
                        ? 'border-l-2 border-primary text-primary'
                        : 'text-gray-800'
                    }`}
                  >
                    {section.sectionTitle}
                  </h2>
                </div>
              ))}
            </li>
          </ul>

          <div className="w-full rounded-lg bg-white p-2">
            {formConfig.json.formSections.map((section, index) => (
              <div
                key={section.sectionTitle}
                className="mt-1 p-4"
                style={{
                  display: currentStep === index ? 'block' : 'none',
                }}
              >
                <>
                  <h1 className="mb-5 text-sm font-semibold">
                    {section.sectionTitle}
                  </h1>
                  <div className="grid grid-cols-1 flex-wrap justify-between gap-4 md:grid md:grid-cols-1 lg:grid lg:grid-cols-3 ">
                    {section.sectionFields.map((field) => {
                      if (field.visible) {
                        switch (field.type) {
                          case 'text':
                          case 'email':
                          case 'date':
                            return (
                              <div key={field.id} className="w-full">
                                <label className="mt-1 block text-sm text-gray-700">
                                  {field.label}
                                </label>
                                <input
                                  {...register(
                                    field.name,
                                    field.validationRules
                                  )}
                                  type={field.type}
                                  placeholder={field.placeholder}
                                  className="ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring mt-1 flex h-9 w-full rounded-md border border-gray-300 bg-transparent px-3 py-1 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                />
                                {errors[field.name] && (
                                  <p className="h-2 p-1 text-sm text-red-600">
                                    {field.label} is required
                                  </p>
                                )}
                              </div>
                            );
                          case 'textarea':
                            return (
                              <div key={field.id} className="w-full">
                                <label className="block text-gray-700">
                                  {field.label}
                                </label>
                                <textarea
                                  {...register(
                                    field.name,
                                    field.validationRules
                                  )}
                                  placeholder={field.placeholder}
                                  className="ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring mt-1 flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                ></textarea>
                                {errors[field.name] && (
                                  <p className="h-2 p-1 text-sm text-red-600">
                                    {field.label} is required
                                  </p>
                                )}
                              </div>
                            );
                          case 'radio':
                            return (
                              <div key={field.id}>
                                <label className="mb-2 mt-1 block text-sm text-gray-700">
                                  {field.label}
                                </label>
                                {field.options.map((option) => (
                                  <React.Fragment key={option.value}>
                                    <input
                                      className="mr-2"
                                      type={field.type}
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

                                {errors[field.name] && (
                                  <p className="h-2 p-1 text-sm text-red-600">
                                    {field.label} is required
                                  </p>
                                )}
                              </div>
                            );
                          case 'dropdown':
                            return (
                              <div key={field.id}>
                                <label className="mb-2 mt-1 block text-sm text-gray-700">
                                  {field.label}
                                </label>
                                <select
                                  {...register(
                                    field.name,
                                    field.validationRules
                                  )}
                                  placeholder={field.placeholder}
                                  className="ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring mt-1 flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                  {field.options.map((option, index) => (
                                    <option key={index} value={option.value}>
                                      {option.label}
                                    </option>
                                  ))}
                                </select>
                                {errors[field.name] && (
                                  <p className="h-2 p-1 text-sm text-red-600">
                                    {field.label} is required
                                  </p>
                                )}
                              </div>
                            );
                          default:
                            return null;
                        }
                      } else {
                        return null;
                      }
                    })}
                  </div>
                </>
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-end gap-4">
          <button
            type="button"
            className="mt-6 cursor-pointer rounded-md bg-primary p-0 px-5  py-0  text-white hover:bg-primary/90"
            onClick={prevStep}
            disabled={currentStep === 0}
          >
            Back
          </button>

          {currentStep === totalSteps - 1 ? (
            <button
              type="submit"
              className="mt-6 h-12 cursor-pointer rounded-md  bg-primary px-4 py-3 text-white hover:bg-primary/90"
            >
              {isSubmitting ? (
                <div className="flex h-screen items-center justify-center">
                  <Loader2 className="mr-2 h-6 w-6 animate-spin text-white" />
                </div>
              ) : (
                'Submit'
              )}
            </button>
          ) : (
            <button
              type="button"
              onClick={nextStep}
              className="mt-6 h-12 cursor-pointer rounded-md  bg-primary px-4 py-3 text-white hover:bg-primary/90"
            >
              {isSubmitting ? (
                <div className="flex h-screen items-center justify-center">
                  <Loader2 className="mr-2 h-6 w-6 animate-spin text-white" />
                </div>
              ) : (
                'Save & Next'
              )}
            </button>
          )}
        </div>
      </form>
    </>
  );
}
