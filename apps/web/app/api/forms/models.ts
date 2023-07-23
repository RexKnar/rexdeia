type FormFieldValidationRules = {
  email?: boolean;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
};

type FormFieldOption = {
  label: string;
  value: string;
};

type FormField = {
  id: string;
  type: string;
  label: string;
  placeholder: string;
  value: string;
  visible: boolean;
  options?: FormFieldOption[];
  validationRules?: FormFieldValidationRules;
};

type FormSection = {
  sectionTitle: string;
  sectionDescription: string;
  sectionFields: FormField[];
};

export type CreateFormRequestPayload = {
  title?: string;
  description?: string;
  formSections: FormSection[];
};

export type FormModel = {
  id: string;
  type: 'Admission';
  isActive: boolean;
  organizationId: string;
  json: CreateFormRequestPayload;
};
