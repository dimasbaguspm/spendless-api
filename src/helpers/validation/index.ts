import { ZodError, ZodSchema } from 'zod';

export const validate = async <Schema>(schema: ZodSchema<Schema>, input: unknown) => {
  return await schema.safeParseAsync(input);
};

export const getZodErrorDetails = (error: ZodError) => {
  return error.errors.map((err) => ({
    field: err.path.join('.'),
    message: err.message,
  }));
};
