import * as z from 'zod';

export const saveBatchSchema = z
  .object({
    name: z
      .string({
        required_error: 'Name is required',
        invalid_type_error: 'Name is required',
      })
      .min(1, 'Name is required'),
    endYear: z.string({
      invalid_type_error: 'End Year is required',
    }),
    startYear: z.string({
      invalid_type_error: 'Start Year is required',
    }),
    refine: z.string().nullable().optional(),
    isActive: z.boolean().default(false),
    description: z.string().default('').optional(),
  })
  .refine(
    (data) => {
      if (data.startYear && data.endYear) {
        const start = new Date(data.startYear);
        const end = new Date(data.endYear);

        if (start > end) {
          return false;
        }
      }

      return true;
    },
    { message: 'Start year should be less than end year', path: ['refine'] }
  );

export type SaveBatchSchemaType = z.infer<typeof saveBatchSchema>;
