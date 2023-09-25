import { z } from 'zod';

const FormFieldValidationRules = z.object({
  email: z.boolean().optional(),
  required: z.boolean().optional(),
  minLength: z.number().optional(),
  maxLength: z.number().optional(),
});

const FormFieldOption = z.object({
  label: z.string(),
  value: z.string(),
});

const FormField = z.object({
  id: z.string(),
  type: z.string(),
  name: z.string(),
  label: z.string(),
  value: z.string(),
  visible: z.boolean(),
  placeholder: z.string(),
  options: z.array(FormFieldOption).optional(),
  validationRules: FormFieldValidationRules.optional(),
});

const FormSection = z.object({
  sectionTitle: z.string(),
  sectionDescription: z.string(),
  sectionFields: z.array(FormField),
});

export const CreateFormRequestPayloadSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  formSections: z.array(FormSection),
});

export type CreateFormRequestPayload = z.infer<
  typeof CreateFormRequestPayloadSchema
>;

export type FormModel = {
  id: string;
  isActive: boolean;
  organizationId: string;
  type: 'Admission' | 'Enquiry';
  json: CreateFormRequestPayload;
};

export type FormCriteriaModel = {
  branchId: string;
  organizationId: string;
  type: 'Admission' | 'Enquiry';
};
