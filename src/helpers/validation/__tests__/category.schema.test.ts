import {
  createCategorySchema,
  updateCategorySchema,
  categoryQuerySchema,
  deleteCategorySchema,
} from '../category.schema.ts';

describe('Category Schema Validation', () => {
  describe('createCategorySchema', () => {
    it('should validate valid category creation data', () => {
      const validData = {
        groupId: 1,
        parentId: 2,
        name: 'Test Category',
        note: 'Test note',
      };

      const result = createCategorySchema.safeParse(validData);

      expect(result.success).toBe(true);
      expect(result.data).toEqual(validData);
    });

    it('should validate category without parentId and note', () => {
      const validData = {
        groupId: 1,
        name: 'Test Category',
      };

      const result = createCategorySchema.safeParse(validData);

      expect(result.success).toBe(true);
      expect(result.data).toEqual(validData);
    });

    it('should reject non-positive group ID', () => {
      const invalidData = {
        groupId: 0,
        name: 'Test Category',
      };

      const result = createCategorySchema.safeParse(invalidData);

      expect(result.success).toBe(false);
      expect(result.error?.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            message: 'Group ID is required',
            path: ['groupId'],
          }),
        ])
      );
    });

    it('should reject empty name', () => {
      const invalidData = {
        groupId: 1,
        name: '',
      };

      const result = createCategorySchema.safeParse(invalidData);

      expect(result.success).toBe(false);
      expect(result.error?.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            message: 'Name is required',
            path: ['name'],
          }),
        ])
      );
    });

    it('should reject name longer than 100 characters', () => {
      const invalidData = {
        groupId: 1,
        name: 'a'.repeat(101),
      };

      const result = createCategorySchema.safeParse(invalidData);

      expect(result.success).toBe(false);
      expect(result.error?.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            message: 'Name must be at most 100 characters',
            path: ['name'],
          }),
        ])
      );
    });

    it('should accept name exactly 100 characters', () => {
      const validData = {
        groupId: 1,
        name: 'a'.repeat(100),
      };

      const result = createCategorySchema.safeParse(validData);

      expect(result.success).toBe(true);
      expect(result.data?.name).toBe('a'.repeat(100));
    });
  });

  describe('updateCategorySchema', () => {
    it('should validate valid category update data', () => {
      const validData = {
        name: 'Updated Category',
        parentId: 3,
        note: 'Updated note',
      };

      const result = updateCategorySchema.safeParse(validData);

      expect(result.success).toBe(true);
      expect(result.data).toEqual(validData);
    });

    it('should allow partial updates', () => {
      const validData = {
        name: 'Updated Name Only',
      };

      const result = updateCategorySchema.safeParse(validData);

      expect(result.success).toBe(true);
      expect(result.data).toEqual(validData);
    });

    it('should allow null parentId', () => {
      const validData = {
        parentId: null,
      };

      const result = updateCategorySchema.safeParse(validData);

      expect(result.success).toBe(true);
      expect(result.data).toEqual(validData);
    });

    it('should allow empty object for update', () => {
      const result = updateCategorySchema.safeParse({});

      expect(result.success).toBe(true);
      expect(result.data).toEqual({});
    });

    it('should reject empty name when provided', () => {
      const invalidData = {
        name: '',
      };

      const result = updateCategorySchema.safeParse(invalidData);

      expect(result.success).toBe(false);
      expect(result.error?.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            message: 'Name is required',
            path: ['name'],
          }),
        ])
      );
    });
  });

  describe('categoryQuerySchema', () => {
    it('should validate valid query parameters', () => {
      const validData = {
        id: 1,
        groupId: 2,
        parentId: 3,
        name: 'Test Category',
        pageNumber: 2,
        pageSize: 10,
        sortBy: 'name',
        sortOrder: 'asc',
      };

      const result = categoryQuerySchema.safeParse(validData);

      expect(result.success).toBe(true);
      expect(result.data).toEqual(validData);
    });

    it('should use default pagination values', () => {
      const result = categoryQuerySchema.safeParse({});

      expect(result.success).toBe(true);
      expect(result.data?.pageNumber).toBe(1);
      expect(result.data?.pageSize).toBe(25);
    });

    it('should coerce string numbers to numbers for pagination', () => {
      const data = {
        pageNumber: '3',
        pageSize: '15',
      };

      const result = categoryQuerySchema.safeParse(data);

      expect(result.success).toBe(true);
      expect(result.data?.pageNumber).toBe(3);
      expect(result.data?.pageSize).toBe(15);
    });

    it('should transform empty strings to undefined', () => {
      const data = {
        name: '',
        sortBy: '',
        sortOrder: '',
      };

      const result = categoryQuerySchema.safeParse(data);

      expect(result.success).toBe(true);
      expect(result.data?.name).toBeUndefined();
      expect(result.data?.sortBy).toBeUndefined();
      expect(result.data?.sortOrder).toBeUndefined();
    });

    it('should allow null parentId', () => {
      const data = {
        parentId: null,
      };

      const result = categoryQuerySchema.safeParse(data);

      expect(result.success).toBe(true);
      expect(result.data?.parentId).toBeNull();
    });

    it('should reject invalid sortBy values', () => {
      const invalidData = {
        sortBy: 'invalid',
      };

      const result = categoryQuerySchema.safeParse(invalidData);

      expect(result.success).toBe(false);
      expect(result.error?.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            message: 'sortBy must be one of: name, createdAt',
          }),
        ])
      );
    });

    it('should reject invalid sortOrder values', () => {
      const invalidData = {
        sortOrder: 'invalid',
      };

      const result = categoryQuerySchema.safeParse(invalidData);

      expect(result.success).toBe(false);
      expect(result.error?.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            message: 'sortOrder must be one of: asc, desc',
          }),
        ])
      );
    });

    it('should accept valid sortBy values', () => {
      const validData1 = { sortBy: 'name' };
      const validData2 = { sortBy: 'createdAt' };

      expect(categoryQuerySchema.safeParse(validData1).success).toBe(true);
      expect(categoryQuerySchema.safeParse(validData2).success).toBe(true);
    });

    it('should accept valid sortOrder values', () => {
      const validData1 = { sortOrder: 'asc' };
      const validData2 = { sortOrder: 'desc' };

      expect(categoryQuerySchema.safeParse(validData1).success).toBe(true);
      expect(categoryQuerySchema.safeParse(validData2).success).toBe(true);
    });
  });

  describe('deleteCategorySchema', () => {
    it('should validate valid delete category data', () => {
      const validData = {
        id: 1,
      };

      const result = deleteCategorySchema.safeParse(validData);

      expect(result.success).toBe(true);
      expect(result.data).toEqual(validData);
    });

    it('should reject non-positive category ID', () => {
      const invalidData = {
        id: 0,
      };

      const result = deleteCategorySchema.safeParse(invalidData);

      expect(result.success).toBe(false);
      expect(result.error?.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            message: 'Category ID is required',
            path: ['id'],
          }),
        ])
      );
    });

    it('should reject negative category ID', () => {
      const invalidData = {
        id: -1,
      };

      const result = deleteCategorySchema.safeParse(invalidData);

      expect(result.success).toBe(false);
      expect(result.error?.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            message: 'Category ID is required',
            path: ['id'],
          }),
        ])
      );
    });
  });
});
