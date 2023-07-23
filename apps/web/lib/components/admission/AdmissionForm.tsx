'use client';
import { useForm } from 'react-hook-form';
import { FormModel } from '../../../app/api/forms/models';

export function AdmissionForm({ formConfig }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const onSubmit = (data) => console.log(data);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h1>{formConfig.json.title}</h1>
      <p>{formConfig.json.description}</p>
      {formConfig.json.formSections.map((section) => (
        <div key={section.sectionTitle}>
          <h2>{section.sectionTitle}</h2>
          <p>{section.sectionDescription}</p>
          {section.sectionFields.map((field) => {
            if (field.visible) {
              switch (field.type) {
                case 'text':
                case 'email':
                  return (
                    <div key={field.id}>
                      <label>{field.label}</label>
                      <input
                        {...register(field.id, field.validationRules)}
                        type={field.type}
                        placeholder={field.placeholder}
                      />
                      {errors[field.id] && <p>{field.label} is required</p>}
                    </div>
                  );
                case 'dropdown':
                  return (
                    <div key={field.id}>
                      <label>{field.label}</label>
                      <select
                        {...register(field.id, field.validationRules)}
                        placeholder={field.placeholder}
                      >
                        {field.options.map((option, index) => (
                          <option key={index} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      {errors[field.id] && <p>{field.label} is required</p>}
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
      <input type="submit" />
    </form>
  );
}
