'use client';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';

import { makeAPICall } from '../../api';
import { ADD_DEPARTMENT } from '../../endpoints';

export function DepartmentForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();
  async function addDepartmentHandler(data: Record<string, unknown>) {
    try {
      await makeAPICall(ADD_DEPARTMENT, {
        ...data,
      });
      router.push('/admission/department');
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <form
      onSubmit={handleSubmit(addDepartmentHandler)}
      className="mt-4 w-full border p-5"
    >
      <h1 className="text-center text-3xl font-semibold text-primary">
        DEPARTMENT FORM
      </h1>
      <p className="mb-4 text-center text-gray-600">
        If you'd like to apply to our college, please fill in this Department
        Form and we will contact you as soon as possible.
      </p>
      <div className="mt-3 px-12">
        <div>
          <label className="mt-5 block text-gray-700">Department Name</label>
          <input
            {...register('departmentName', {
              required: 'Department Name is Required',
            })}
            type="text"
            placeholder="Enter your department name"
            name="departmentName"
            className="ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring mt-1 flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
          <p
            className={`h-2 p-1 text-sm text-red-600 ${
              errors.departmentName
                ? 'opacity-100 transition-opacity duration-300'
                : 'opacity-0 transition-opacity duration-300'
            }`}
          >
            {errors.departmentName?.message as string}
          </p>
        </div>
        <div>
          <label className="mt-5 block text-gray-700">No of Years</label>
          <input
            {...register('noOfYears', {
              required: 'No of Years is Required',
            })}
            type="text"
            placeholder="Enter the No of Years"
            name="noOfYears"
            className="ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring mt-1 flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
          <p
            className={`h-2 p-1 text-sm text-red-600 ${
              errors.noOfYears
                ? 'opacity-100 transition-opacity duration-300'
                : 'opacity-0 transition-opacity duration-300'
            }`}
          >
            {errors.noOfYears?.message as string}
          </p>
        </div>
        <div>
          <label className="mt-5 block text-gray-700">Department Code</label>
          <input
            {...register('departmentCode', {
              required: 'Department Code is Required',
            })}
            type="text"
            placeholder="Enter your department code"
            name="departmentCode"
            className="ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring mt-1 flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
          <p
            className={`h-2 p-1 text-sm text-red-600 ${
              errors.departmentCode
                ? 'opacity-100 transition-opacity duration-300'
                : 'opacity-0 transition-opacity duration-300'
            }`}
          >
            {errors.departmentCode?.message as string}
          </p>
        </div>
        <div>
          <label className="mt-5 block text-gray-700">Active Status</label>
          <input
            {...register('activeStatus', {
              required: 'Active Status is Required',
            })}
            type="radio"
            name="activeStatus"
            value={'active'}
          />
          <span className="me-3">Active</span>
          <input
            {...register('activeStatus', {
              required: 'Active Status is Required',
            })}
            type="radio"
            name="activeStatus"
            value={'inActive'}
          />
          <span className="me-3">Inactive</span>
          <p
            className={`h-2 p-1 text-sm text-red-600 ${
              errors.activeStatus
                ? 'opacity-100 transition-opacity duration-300'
                : 'opacity-0 transition-opacity duration-300'
            }`}
          >
            {errors.activeStatus?.message as string}
          </p>
        </div>
        <div>
          <label className="mt-5 block text-gray-700">Note/Description</label>
          <input
            {...register('description', {
              required: 'Description is Required',
            })}
            type="text"
            placeholder="Enter Note/Description"
            name="description"
            className="ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring mt-1 flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
          <p
            className={`h-2 p-1 text-sm text-red-600 ${
              errors.description
                ? 'opacity-100 transition-opacity duration-300'
                : 'opacity-0 transition-opacity duration-300'
            }`}
          >
            {errors.description?.message as string}
          </p>
        </div>
      </div>
      <button
        type="submit"
        className="text-primary-foreground mt-6 h-12 w-full cursor-pointer rounded-md bg-primary text-white hover:bg-primary/90"
      >
        {isSubmitting && (
          <div className="flex h-screen items-center justify-center">
            <Loader2 className="mr-2 h-6 w-6 animate-spin text-white" />
          </div>
        )}
        Save
      </button>
    </form>
  );
}
