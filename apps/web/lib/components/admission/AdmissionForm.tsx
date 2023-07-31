'use client';
import { useForm } from 'react-hook-form';
import { FormModel } from '../../../app/api/forms/models';
import 'configs/tailwind/styles.css';
export function AdmissionForm({ formConfig }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const onSubmit = (data) => console.log(data);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-4 w-full border p-5">
      <h1 className="text-primary text-3xl font-semibold text-center">{formConfig.json.title}</h1>
      <p className="text-gray-600 text-center mb-4">{formConfig.json.description}</p>
      {formConfig.json.formSections.map((section) => (
        <div key={section.sectionTitle} className="px-12 mt-3">
          <h2 className="text-primary text-3xl font-semibold text-center">{section.sectionTitle}</h2>
          <p>{section.sectionDescription}</p>
          {section.sectionFields.map((field) => {
            if (field.visible) {
              switch (field.type) {
                case 'text':
                case 'email':
                  return (
                    <div key={field.id}>
                      <label className="block text-gray-700 mt-5">{field.label}</label>
                      <input
                        {...register(field.id, field.validationRules)}
                        type={field.type}
                        placeholder={field.placeholder}
                        className='mt-1 ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
                      />
                      {errors[field.id] && <p className="h-2 p-1 text-sm text-red-600">{field.label} is required</p>}
                    </div>
                  );
                case 'dropdown':
                  return (
                    <div key={field.id}>
                      <label className="block text-gray-700 mt-5">{field.label}</label>
                      <select
                        {...register(field.id, field.validationRules)}
                        placeholder={field.placeholder}
                        className="mt-1 ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {field.options.map((option, index) => (
                          <option key={index} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      {errors[field.id] && <p className="h-2 p-1 text-sm text-red-600">{field.label} is required</p>}
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
      <input type="submit" className="mt-6 w-full rounded-md h-12 text-white cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90" />
    </form>
  );
}
