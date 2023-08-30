'use client';
import 'configs/tailwind/styles.css';
import { useForm } from 'react-hook-form';
import { Loader2 } from 'lucide-react';
import { ADD_ADMISSION } from '../../endpoints';
import { makeAPICall } from '../../api';
export function AdmissionForm({ formConfig }) {
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
  return (
    <form
      onSubmit={handleSubmit(addAdmissionHandler)}
      className="mt-4 w-full border p-5"
    >
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
  );
}
