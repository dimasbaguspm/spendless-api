import { NewTransaction } from '../../src/models/schema.ts';
import { getCategoryStub, getTransactionStub, getTransactionStub2, createTransactionStub } from '../stub.ts';
import { getTestAgent } from '../utils.ts';

jest.mock('../../src/services/transaction.service.ts', () => {
  return {
    TransactionService: jest.fn().mockImplementation(() => {
      return {
        createTransaction: jest.fn().mockImplementation((transactionData: NewTransaction) => {
          return Promise.resolve({
            id: 1,
            userId: transactionData.userId,
            categoryId: transactionData.categoryId,
            amount: transactionData.amount,
            note: transactionData.note ?? null,
            date: new Date(transactionData.date).toISOString(),
            createdAt: new Date('2025-05-18T10:00:00Z').toISOString(),
            updatedAt: new Date('2025-05-18T10:00:00Z').toISOString(),
          });
        }),
        getTransactions: jest.fn().mockImplementation((userId: number) => {
          if (userId === 1) {
            return Promise.resolve([getTransactionStub, getTransactionStub2]);
          }
          return Promise.resolve([]);
        }),
        getTransactionById: jest.fn().mockImplementation((id: number, userId: number) => {
          if (id === 1 && userId === 1) {
            return Promise.resolve(getTransactionStub);
          }
          return Promise.resolve(undefined);
        }),
        updateTransaction: jest.fn().mockImplementation((id: number, userId: number, data: Partial<NewTransaction>) => {
          if (id === 1 && userId === 1) {
            return Promise.resolve({
              ...getTransactionStub,
              amount: data?.amount ?? getTransactionStub.amount,
              categoryId: data?.categoryId ?? getTransactionStub.categoryId,
              date: data?.date ? new Date(data.date).toISOString() : getTransactionStub.date,
              note: data?.note ?? getTransactionStub.note,
            });
          }
          return Promise.resolve(undefined);
        }),
        deleteTransaction: jest.fn().mockImplementation((id: number, userId: number) => {
          return Promise.resolve(id === 1 && userId === 1);
        }),
      };
    }),
  };
});

// Mock the category service for validating category IDs
jest.mock('../../src/services/category.service.ts', () => {
  return {
    CategoryService: jest.fn().mockImplementation(() => {
      return {
        getCategoryById: jest.fn().mockImplementation((id: number, filters: { userId: number }) => {
          const { userId } = filters;
          if (id === 1 && userId === 1) {
            return Promise.resolve(getCategoryStub);
          }
          return Promise.resolve(null);
        }),
      };
    }),
  };
});

// Mock the token service for authentication
jest.mock('../../src/services/token.service.ts', () => {
  return {
    TokenService: jest.fn().mockImplementation(() => {
      return {
        getUserFromRequest: jest.fn().mockReturnValue({ id: 1, name: 'Test User', email: 'test@example.com' }),
      };
    }),
  };
});

// Mock the auth middleware
jest.mock('../../src/middleware/auth.middleware.ts', () => {
  return {
    authenticateJWT: jest.fn().mockImplementation((req, res, next) => {
      next();
    }),
  };
});

describe('Transaction Routes', () => {
  describe('GET /api/transactions', () => {
    it('should return all transactions for authenticated user', async () => {
      const response = await getTestAgent().get('/api/transactions');

      expect(response.status).toBe(200);
      expect(response.body).toStrictEqual([getTransactionStub, getTransactionStub2]);
    });

    it('should allow filtering transactions by category', async () => {
      const response = await getTestAgent().get('/api/transactions?categoryId=1');

      expect(response.status).toBe(200);
    });

    it('should allow filtering transactions by date range', async () => {
      const response = await getTestAgent().get(
        '/api/transactions?startDate=2025-05-01T00:00:00Z&endDate=2025-05-30T23:59:59Z'
      );

      expect(response.status).toBe(200);
    });

    it('should return 400 with invalid query parameters', async () => {
      const response = await getTestAgent().get('/api/transactions?categoryId=invalid');

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'Validation error');
    });
  });

  describe('POST /api/transactions', () => {
    it('should create a new transaction with valid data', async () => {
      const transactionData = createTransactionStub;

      const response = await getTestAgent().post('/api/transactions').send(transactionData);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('categoryId', transactionData.categoryId);
      expect(response.body).toHaveProperty('amount', transactionData.amount.toString());
      expect(response.body).toHaveProperty('note', transactionData.note);
      expect(response.body).toHaveProperty('id');
    });

    it('should return 400 with invalid data', async () => {
      const invalidTransactionData = {
        // Missing required categoryId
        amount: 'not-a-number',
        date: 'invalid-date',
      };

      const response = await getTestAgent().post('/api/transactions').send(invalidTransactionData);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'Validation error');
    });

    it('should return 404 when category does not exist', async () => {
      const transactionWithInvalidCategory = {
        categoryId: 999, // Non-existent category ID
        amount: '50.75',
        date: '2025-05-18T14:00:00Z',
        note: 'Shopping',
      };

      const response = await getTestAgent().post('/api/transactions').send(transactionWithInvalidCategory);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message', 'Category not found');
    });
  });

  describe('GET /api/transactions/:id', () => {
    it('should return a transaction by ID for authenticated user', async () => {
      const response = await getTestAgent().get('/api/transactions/1');

      expect(response.status).toBe(200);
      expect(response.body).toStrictEqual(getTransactionStub);
    });

    it('should return 404 for non-existent transaction', async () => {
      const response = await getTestAgent().get('/api/transactions/999');

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message', 'Transaction not found');
    });

    it('should return 400 for invalid transaction ID format', async () => {
      const response = await getTestAgent().get('/api/transactions/invalid-id');

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'Invalid transaction ID');
    });
  });

  describe('PUT /api/transactions/:id', () => {
    it('should update a transaction with valid data', async () => {
      const updateData = {
        amount: 125.5,
        note: 'Updated grocery shopping',
      };

      const response = await getTestAgent().put('/api/transactions/1').send(updateData);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('amount', updateData.amount.toString());
      expect(response.body).toHaveProperty('note', updateData.note);
    });

    it('should return 400 with invalid data', async () => {
      const invalidUpdateData = {
        amount: 'not-a-number',
        date: 'invalid-date',
      };

      const response = await getTestAgent().put('/api/transactions/1').send(invalidUpdateData);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'Validation error');
    });

    it('should return 404 for non-existent transaction', async () => {
      const updateData = {
        amount: 75.25,
        note: 'Updated note',
      };

      const response = await getTestAgent().put('/api/transactions/999').send(updateData);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message', 'Transaction not found');
    });

    it('should return 400 for invalid transaction ID format', async () => {
      const updateData = {
        amount: 75.25,
      };

      const response = await getTestAgent().put('/api/transactions/invalid-id').send(updateData);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'Invalid transaction ID');
    });

    it('should return 404 when updating with non-existent category', async () => {
      const updateWithInvalidCategory = {
        categoryId: 999, // Non-existent category ID
      };

      const response = await getTestAgent().put('/api/transactions/1').send(updateWithInvalidCategory);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message', 'Category not found');
    });
  });

  describe('DELETE /api/transactions/:id', () => {
    it('should delete a transaction', async () => {
      const response = await getTestAgent().delete('/api/transactions/1');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Transaction deleted successfully');
    });

    it('should return 404 for non-existent transaction', async () => {
      const response = await getTestAgent().delete('/api/transactions/999');

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message', 'Transaction not found');
    });

    it('should return 400 for invalid transaction ID format', async () => {
      const response = await getTestAgent().delete('/api/transactions/invalid-id');

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'Invalid transaction ID');
    });
  });
});
