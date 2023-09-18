'use client';
import { useForm } from 'react-hook-form';
import { Loader2 } from 'lucide-react';
import {
  ADD_DEPARTMENT,
  GET_DEPARTMENT,
  UPDATE_DEPARTMENT,
} from '../../endpoints';
import { makeAPICall } from '../../api';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export function DepartmentForm({ formConfig }) {
  const searchParams = useSearchParams();
  const departmentId = searchParams.get('id');
  const [departmentValue, setDepartmentValue] = useState([]);
  const [departmentKeys, setDepartmentKeys] = useState([]);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();
  async function addDepartmentHandler(data: Record<string, unknown>) {
    try {
      console.log(data);
      await makeAPICall(ADD_DEPARTMENT, {
        ...data,
      });
      router.push('/admission/department');
    } catch (error) {
      console.log(error);
    }
  }

  async function editDepartmentHandler() {
    let newValue = {};
    setDepartmentValue(departmentValue.unshift(departmentId));
    departmentKeys.forEach((key, indux) => {
      newValue[key] = departmentValue[indux];
    });
    try {
      await makeAPICall(UPDATE_DEPARTMENT, {
        ...newValue,
      });
      router.push('/admission/department');
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (departmentId) {
      (async function getDepartmentHandler() {
        try {
          const department = await makeAPICall(GET_DEPARTMENT, {
            departmentId,
          });
          setDepartmentKeys(Object.keys(department[0]));
          setTimeout(() => {
            const arrayOfValues = Object.values(department[0]);
            setDepartmentValue(arrayOfValues.slice(1, 6));
          }, 1000);
        } catch (error) {
          console.log(error);
        }
      })();
    }
  }, [departmentId]);

  const handleDepartmentValueChange = (index, e) => {
    const updatedValues = [...departmentValue];
    updatedValues[index] = e.target.value;
    setDepartmentValue(updatedValues);
  };

  return (
    <form
      onSubmit={
        !departmentId
          ? handleSubmit(addDepartmentHandler)
          : editDepartmentHandler
      }
      className="mt-4 w-full border p-5"
    >
      <h1 className="text-center text-3xl font-semibold text-primary">
        {formConfig.json.title}
      </h1>
      <p className="mb-4 text-center text-gray-600">
        {formConfig.json.description}
      </p>
      {formConfig.json.formSections.map((section) => (
        <div key={section.sectionTitle} className="mt-3 px-12">
          <h2 className="text-3xl font-semibold text-primary">
            {section.sectionTitle}
          </h2>
          <p>{section.sectionDescription}</p>
          {section.sectionFields.map((field, index) => {
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
                        value={departmentValue[index]}
                        onChange={(e) => handleDepartmentValueChange(index, e)}
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
