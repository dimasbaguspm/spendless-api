import { z } from 'zod';

// Schema for creating a transaction
export const createTransactionSchema = z.object({
  categoryId: z.number().int().positive('Category ID is required'),
  amount: z.string(),
  date: z.string().refine((value) => !isNaN(new Date(value).getTime()), { message: 'Invalid date format' }),
  note: z.string().optional(),
});

// Schema for updating a transaction
export const updateTransactionSchema = z.object({
  categoryId: z.number().int().positive('Category ID is required').optional(),
  amount: z
    .number({
      invalid_type_error: 'Amount must be a number',
    })
    .optional(),
  date: z
    .string()
    .refine((value) => !isNaN(new Date(value).getTime()), { message: 'Invalid date format' })
    .optional(),
  note: z.string().optional(),
});

// Schema for transaction query parameters
export const transactionQuerySchema = z.object({
  categoryId: z
    .union([z.number(), z.string().refine((val) => !isNaN(+val), { message: 'Category ID must be a number' })])
    .optional()
    .transform((val) => (val === undefined ? undefined : +val)),
  note: z
    .string()
    .optional()
    .transform((val) => (val === '' ? undefined : val))
    .refine((val) => val === undefined || val.length > 0, { message: 'Note must be a non-empty string' }),
  startDate: z
    .string()
    .optional()
    .refine((val) => val === undefined || !isNaN(new Date(val).getTime()), { message: 'Invalid start date format' }),
  endDate: z
    .string()
    .optional()
    .refine((val) => val === undefined || !isNaN(new Date(val).getTime()), { message: 'Invalid end date format' }),
  pageNumber: z.coerce.number().min(1).default(1).optional(),
  pageSize: z.coerce.number().min(1).default(25).optional(),
  sortBy: z.enum(['date', 'amount', 'createdAt']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
});

// Export types based on the schemas for use in controllers and services
export type CreateTransactionInput = z.infer<typeof createTransactionSchema>;
export type UpdateTransactionInput = z.infer<typeof updateTransactionSchema>;
export type TransactionQueryInput = z.infer<typeof transactionQuerySchema>;
