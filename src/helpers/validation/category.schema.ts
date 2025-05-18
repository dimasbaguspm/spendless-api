import { z } from 'zod';

// Schema for creating a category
export const createCategorySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  type: z.enum(['income', 'expense'], {
    errorMap: () => ({ message: 'Type must be either "income" or "expense"' }),
  }),
  color: z.string().optional(),
});

// Schema for updating a category
export const updateCategorySchema = z.object({
  name: z.string().min(1, 'Name is required').optional(),
  type: z
    .enum(['income', 'expense'], {
      errorMap: () => ({ message: 'Type must be either "income" or "expense"' }),
    })
    .optional(),
  color: z.string().optional(),
});

// Schema for category query parameters
export const categoryQuerySchema = z.object({
  type: z
    .string()
    .optional()
    .transform((val) => (val === '' ? undefined : val))
    .refine((val) => val === undefined || ['income', 'expense'].includes(val), {
      message: 'Type must be either "income" or "expense"',
    }),
  name: z
    .string()
    .optional()
    .transform((val) => (val === '' ? undefined : val)),
  pageNumber: z.coerce.number().min(1).default(1).optional(),
  pageSize: z.coerce.number().min(1).default(25).optional(),
  sortBy: z
    .string()
    .optional()
    .transform((val) => (val === '' ? undefined : val))
    .refine((val) => val === undefined || ['name', 'createdAt'].includes(val), {
      message: 'sortBy must be one of: name, createdAt',
    }),
  sortOrder: z
    .string()
    .optional()
    .transform((val) => (val === '' ? undefined : val))
    .refine((val) => val === undefined || ['asc', 'desc'].includes(val), {
      message: 'sortOrder must be one of: asc, desc',
    }),
});

// Export types based on the schemas for use in controllers and services
export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
export type CategoryQueryInput = z.infer<typeof categoryQuerySchema>;
