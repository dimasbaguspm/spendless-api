import { NewCategory } from '../../src/models/schema.ts';
import { getCategoryStub, getIncomesCategoryStub, createCategoryStub } from '../stub.ts';
import { getTestAgent } from '../utils.ts';

jest.mock('../../src/services/category.service.ts', () => {
  return {
    CategoryService: jest.fn().mockImplementation(() => {
      return {
        createCategory: jest.fn().mockImplementation((categoryData: NewCategory) => {
          return Promise.resolve({
            id: 1,
            name: categoryData.name,
            type: categoryData.type,
            color: categoryData.color ?? null,
            userId: categoryData.userId,
            createdAt: new Date('2025-05-18T10:00:00Z'),
            updatedAt: new Date('2025-05-18T10:00:00Z'),
          });
        }),
        getCategoriesByUserId: jest.fn().mockImplementation((userId: number) => {
          if (userId == 1) {
            return Promise.resolve([getCategoryStub, getIncomesCategoryStub]);
          }
          return Promise.resolve([]);
        }),
        getCategoryById: jest.fn().mockImplementation((id: number, filters: { userId: number }) => {
          const { userId } = filters;
          if (id === 1 && userId === 1) {
            return Promise.resolve(getCategoryStub);
          }
          return Promise.resolve(null);
        }),
        updateCategory: jest.fn().mockImplementation((id: number, userId: number, data: NewCategory) => {
          if (id === 1 && userId === 1) {
            return Promise.resolve({
              ...getCategoryStub,
              name: data?.name ?? getCategoryStub.name,
              type: data?.type ?? getCategoryStub.type,
              color: data?.color ?? getCategoryStub.color,
            });
          }
          return Promise.resolve(null);
        }),
        deleteCategory: jest.fn().mockImplementation((id: number, userId: number) => {
          if (id == 1 && userId == 1) {
            return Promise.resolve({ success: true });
          }
          return Promise.resolve(null);
        }),
      };
    }),
  };
});

jest.mock('../../src/services/token.service.ts', () => {
  return {
    TokenService: jest.fn().mockImplementation(() => {
      return {
        getUserFromRequest: jest.fn().mockReturnValue({ id: 1, name: 'Test User', email: 'test@example.com' }),
      };
    }),
  };
});

jest.mock('../../src/middleware/auth.middleware.ts', () => {
  return {
    authenticateJWT: jest.fn().mockImplementation((req, res, next) => {
      next();
    }),
  };
});

describe('Category Routes', () => {
  describe('GET /api/categories', () => {
    it('should return all categories for authenticated user', async () => {
      const response = await getTestAgent().get('/api/categories');

      expect(response.status).toBe(200);
      expect(response.body).toStrictEqual([getCategoryStub, getIncomesCategoryStub]);
    });

    it('should allow filtering categories by type', async () => {
      const response = await getTestAgent().get('/api/categories?type=expense');

      expect(response.status).toBe(200);
    });

    it('should return 400 with invalid query parameters', async () => {
      const response = await getTestAgent().get('/api/categories?type=invalid');

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'Validation error');
    });
  });

  describe('POST /api/categories', () => {
    it('should create a new category with valid data', async () => {
      const categoryData = createCategoryStub;

      const response = await getTestAgent().post('/api/categories').send(categoryData);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('name', categoryData.name);
      expect(response.body).toHaveProperty('type', categoryData.type);
      expect(response.body).toHaveProperty('color', categoryData.color);
      expect(response.body).toHaveProperty('id');
    });

    it('should return 400 with invalid data', async () => {
      const invalidCategoryData = {
        name: '',
        type: 'invalid-type',
      };

      const response = await getTestAgent().post('/api/categories').send(invalidCategoryData);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'Validation error');
    });
  });

  describe('GET /api/categories/:id', () => {
    it('should return a category by ID for authenticated user', async () => {
      const response = await getTestAgent().get('/api/categories/1');

      expect(response.status).toBe(200);
      expect(response.body).toStrictEqual(getCategoryStub);
    });

    it('should return 404 for non-existent category', async () => {
      const response = await getTestAgent().get('/api/categories/999');

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message', 'Category not found');
    });
  });

  describe('PUT /api/categories/:id', () => {
    it('should update a category with valid data', async () => {
      const updateData = {
        name: 'Updated Groceries',
        color: '#FF9900',
      };

      const response = await getTestAgent().put('/api/categories/1').send(updateData);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('name', updateData.name);
      expect(response.body).toHaveProperty('color', updateData.color);
    });

    it('should return 400 with invalid data', async () => {
      const invalidUpdateData = {
        name: '',
        type: 'invalid-type',
      };

      const response = await getTestAgent().put('/api/categories/1').send(invalidUpdateData);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'Validation error');
    });

    it('should return 404 for non-existent category', async () => {
      const updateData = {
        name: 'Updated Category',
      };

      const response = await getTestAgent().put('/api/categories/999').send(updateData);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message', 'Category not found');
    });
  });

  describe('DELETE /api/categories/:id', () => {
    it('should delete a category', async () => {
      const response = await getTestAgent().delete('/api/categories/1');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Category deleted successfully');
    });

    it('should return 404 for non-existent category', async () => {
      const response = await getTestAgent().delete('/api/categories/999');

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message', 'Category not found');
    });
  });
});
