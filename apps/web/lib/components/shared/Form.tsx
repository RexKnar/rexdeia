'use client';
import 'configs/tailwind/styles.css';

import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { makeAPICall } from '../../api';
import { ADD_ADMISSION } from '../../endpoints';

export function Form({ formConfig }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();
  const [currentStep, setCurrentStep] = useState(0);
  const totalSteps = formConfig.json.formSections.length;
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
    try {
      await makeAPICall(ADD_ADMISSION, {
        ...data,
      });
    } catch (error1) {
      console.error(error1);
    }
  }
  return (
    <>
      <form
        onSubmit={handleSubmit(addAdmissionHandler)}
        className="mt-4 w-full p-5"
      >
        <h1 className="text-center text-3xl font-semibold text-primary">
          {formConfig.json.title}
        </h1>
        <p className="mb-4 text-center text-black">
          {formConfig.json.description}
        </p>
        <div className="flex justify-around gap-4">
          <ul className="h-fit w-[215px] shrink-0 rounded-lg bg-white py-3">
            <li>
              {formConfig.json.formSections.map((section, index) => (
                <div key={section.sectionTitle} className="mt-3 px-4">
                  <h2
                    className={`inter px-2 text-sm font-semibold ${
                      selectedSectionIndex === index
                        ? 'border-l-2 border-primary text-primary' // Apply the highlight class
                        : 'text-gray-800'
                    }`}
                  >
                    {section.sectionTitle}
                  </h2>
                </div>
              ))}
            </li>
          </ul>
          <div className="rounded-lg bg-white p-8">
            {formConfig.json.formSections.map((section, index) => (
              <div
                key={section.sectionTitle}
                className="mt-3 px-12"
                style={{
                  display: currentStep === index ? 'block' : 'none',
                }}
              >
                <>
                  <h1 className="text-sm font-semibold">
                    {section.sectionTitle}
                  </h1>
                  <div className="flex flex-wrap justify-between gap-3">
                    {section.sectionFields.map((field) => {
                      if (field.visible) {
                        switch (field.type) {
                          case 'text':
                          case 'email':
                          case 'date':
                            return (
                              <div key={field.id} className="w-[47%]">
                                <label className="mt-5 block text-gray-700">
                                  {field.label}
                                </label>
                                <input
                                  {...register(
                                    field.name,
                                    field.validationRules
                                  )}
                                  type={field.type}
                                  placeholder={field.placeholder}
                                  className="ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring mt-1 flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
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
                              <div key={field.id} className="w-[47%]">
                                <label className="mt-5 block text-gray-700">
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
                                <label className="mt-5 block text-gray-700">
                                  {field.label}
                                </label>
                                {field.options.map((option) => (
                                  <>
                                    <input
                                      type={field.type}
                                      name={field.name}
                                      value={option.value}
                                      {...register(
                                        field.name,
                                        field.validationRules
                                      )}
                                    />
                                    <span className="me-3">{option.label}</span>
                                  </>
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
                                <label className="mt-5 block text-gray-700">
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
            className="text-primary-foreground mt-6 h-12 cursor-pointer rounded-md bg-primary px-4 py-3 text-white hover:bg-primary/90"
            onClick={prevStep}
            disabled={currentStep === 0}
          >
            Back
          </button>

          {currentStep === totalSteps - 1 ? (
            <button
              type="submit"
              className="text-primary-foreground mt-6 h-12 cursor-pointer rounded-md bg-primary px-4 py-3 text-white hover:bg-primary/90"
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
              className="text-primary-foreground mt-6 h-12 cursor-pointer rounded-md bg-primary px-4 py-3 text-white hover:bg-primary/90"
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
