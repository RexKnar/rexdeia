'use client';
import React, { useRef } from 'react';
import { useForm } from 'react-hook-form';
import { Loader2 } from 'lucide-react';
import { ADD_ADMISSION } from '../../endpoints';
import { makeAPICall } from '../../api';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  Button,
  Input,
} from 'ui';
export function AdmissionForm({ formConfig }) {
  let isModalOpen = false;
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();
  async function addAdmissionHandler(data: Record<string, unknown>) {
    try {
      await makeAPICall(ADD_ADMISSION, {
        ...data,
      });
    } catch (error) {
      console.log(error);
      // TODO: Handle error
    }
  }
    const shareableURL = `localhost:3000/forms/${formConfig.organizationId}`;
    const inputRef = useRef(null);
    const handleCopyClick = () => {
      if (inputRef.current) {
        inputRef.current.select();
        document.execCommand('copy');
      }
    };
  return (
    <>
      <form
        onSubmit={handleSubmit(addAdmissionHandler)}
        className="mt-4 w-full border p-5"
      >
        <div className="flex justify-end">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90 mt-6 h-12 cursor-pointer rounded-md px-5 text-white" variant="outline">Share</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Copy the URL to share the admission form</AlertDialogTitle>
                <AlertDialogDescription>
                  <Input
                    type="text"
                    className="mt-2"
                    value={shareableURL}
                    readOnly
                    ref={inputRef}
                  />
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogAction onClick={handleCopyClick }>Copy</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        <h1 className="text-primary text-center text-3xl font-semibold">
          {formConfig.json.title}
        </h1>
        <p className="mb-4 text-center text-gray-600">
          {formConfig.json.description}
        </p>
        {formConfig.json.formSections.map((section) => (
          <div key={section.sectionTitle} className="mt-3 px-12">
            <h2 className="text-primary text-3xl font-semibold">
              {section.sectionTitle}
            </h2>
            <p>{section.sectionDescription}</p>
            {section.sectionFields.map((field) => {
              if (field.visible) {
                switch (field.type) {
                  case 'text':
                  case 'email':
                  case 'date':
                    return (
                      <div key={field.id}>
                        <label className="mt-5 block text-gray-700">
                          {field.label}
                        </label>
                        <input
                          {...register(field.name, field.validationRules)}
                          type={field.type}
                          placeholder={field.placeholder}
                          className="ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring mt-1 flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        />
                        {errors[field.id] && (
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
                        {field.options.map((option, index) => (
                          <>
                            <input
                              type={field.type}
                              name={field.name}
                              value={option.value}
                              {...register(field.name, field.validationRules)}
                            />
                            <span className="me-3">{option.label}</span>
                          </>
                        ))}

                        {errors[field.id] && (
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
        ))}
        <button
          type="submit"
          className="bg-primary text-primary-foreground hover:bg-primary/90 mt-6 h-12 w-full cursor-pointer rounded-md text-white"
        >
          {isSubmitting && (
            <div className="flex h-screen items-center justify-center">
              <Loader2 className="mr-2 h-6 w-6 animate-spin text-white" />
            </div>
          )}
          Save
        </button>
      </form>
    </>
  );
}
