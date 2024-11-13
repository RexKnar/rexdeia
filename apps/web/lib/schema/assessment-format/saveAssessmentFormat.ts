import * as z from 'zod';

export const saveAssessmentSchema = z.object({
  name: z.string({
    required_error: 'Name is required',
    invalid_type_error: 'Name is required',
  }),
  isActive: z.boolean().default(false),
  parentId: z.string().nullable().optional(),
  hasMarkEntry: z.boolean().default(false),
});

export type SaveAssessmentSchemaType = z.infer;
