import { NewRefreshToken, NewUser, NewUserSession, RefreshToken, User, UserSession } from '../src/models/schema';

export const getUserSingleStub: User = {
  id: 1,
  email: 'user@example.com',
  password: 'hashedpassword',
  firstName: 'John',
  lastName: 'Doe',
  createdAt: new Date(),
  updatedAt: new Date(),
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
  expires: new Date('2025-01-01T00:00:00Z'),
  createdAt: new Date(),
  revokedAt: new Date(),
  replacedByToken: null,
};

export const createRefreshTokenStub: NewRefreshToken = {
  userId: 1,
  token: 'valid-refresh-token',
  expires: new Date('2025-01-01T00:00:00Z'),
};

export const getUserSessionSingleStub: UserSession = {
  id: 1,
  userId: 1,
  userAgent: 'Mozilla/5.0',
  ipAddress: '127.0.0.1',
  lastActive: new Date(),
  createdAt: new Date(),
  expiresAt: new Date('2025-01-01T00:00:00Z'),
};

export const createUserSessionSingleStub: NewUserSession = {
  userId: 1,
  userAgent: 'Mozilla/5.0',
  ipAddress: '127.0.0.1',
  lastActive: new Date(),
  expiresAt: new Date(),
};
