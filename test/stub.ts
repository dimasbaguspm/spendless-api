import {
  NewRefreshToken,
  NewUser,
  NewUserSession,
  RefreshToken,
  User,
  UserSession,
  Category,
  NewCategory,
  Transaction,
  NewTransaction,
} from '../src/models/schema.ts';

export const getUserSingleStub: User = {
  id: 1,
  email: 'user@example.com',
  password: 'hashedpassword',
  firstName: 'John',
  lastName: 'Doe',
  createdAt: new Date('2025-01-01T00:00:00Z').toISOString(),
  updatedAt: new Date('2025-01-01T00:00:00Z').toISOString(),
  isActive: true,
};

export const createUserSingleStub: NewUser = {
  email: 'user@create.com',
  password: 'hashedpassword',
  firstName: 'Jane',
  lastName: 'Doe',
  isActive: true,
};

export const getRefreshTokenStub: RefreshToken = {
  id: 1,
  userId: 1,
  token: 'valid-refresh-token',
  expires: new Date('2025-01-01T00:00:00Z').toISOString(),
  createdAt: new Date('2025-01-01T00:00:00Z').toISOString(),
  revokedAt: new Date('2025-01-01T00:00:00Z').toISOString(),
  replacedByToken: null,
};

export const createRefreshTokenStub: NewRefreshToken = {
  userId: 1,
  token: 'valid-refresh-token',
  expires: new Date('2025-01-01T00:00:00Z').toISOString(),
};

export const getUserSessionSingleStub: UserSession = {
  id: 1,
  userId: 1,
  userAgent: 'Mozilla/5.0',
  ipAddress: '127.0.0.1',
  lastActive: new Date('2025-01-01T00:00:00Z').toISOString(),
  createdAt: new Date('2025-01-01T00:00:00Z').toISOString(),
  expiresAt: new Date('2025-01-01T00:00:00Z').toISOString(),
};

export const createUserSessionSingleStub: NewUserSession = {
  userId: 1,
  userAgent: 'Mozilla/5.0',
  ipAddress: '127.0.0.1',
  lastActive: new Date('2025-01-01T00:00:00Z').toISOString(),
  expiresAt: new Date('2025-01-01T00:00:00Z').toISOString(),
};

// Category stubs
export const getCategoryStub: Category = {
  id: 1,
  userId: 1,
  name: 'Groceries',
  type: 'expense',
  color: '#FF5733',
  createdAt: new Date('2025-01-01T00:00:00Z').toISOString(),
  updatedAt: new Date('2025-01-01T00:00:00Z').toISOString(),
};

export const getIncomesCategoryStub: Category = {
  id: 2,
  userId: 1,
  name: 'Salary',
  type: 'income',
  color: '#33FF57',
  createdAt: new Date('2025-01-01T00:00:00Z').toISOString(),
  updatedAt: new Date('2025-01-01T00:00:00Z').toISOString(),
};

export const createCategoryStub: NewCategory = {
  userId: 1,
  name: 'Entertainment',
  type: 'expense',
  color: '#3366FF',
};

// Transaction stubs
export const getTransactionStub: Transaction = {
  id: 1,
  userId: 1,
  categoryId: 1,
  amount: '100.50',
  note: 'Grocery shopping',
  date: new Date('2025-05-18T10:00:00Z').toISOString(),
  createdAt: new Date('2025-05-18T10:00:00Z').toISOString(),
  updatedAt: new Date('2025-05-18T10:00:00Z').toISOString(),
};

export const getTransactionStub2: Transaction = {
  id: 2,
  userId: 1,
  categoryId: 1,
  amount: '75.25',
  note: 'Restaurant bill',
  date: new Date('2025-05-17T18:30:00Z').toISOString(),
  createdAt: new Date('2025-05-17T18:30:00Z').toISOString(),
  updatedAt: new Date('2025-05-17T18:30:00Z').toISOString(),
};

export const createTransactionStub: NewTransaction = {
  categoryId: 1,
  userId: 1,
  amount: '50.75',
  date: '2025-05-18T14:00:00Z',
  note: 'Shopping',
};
