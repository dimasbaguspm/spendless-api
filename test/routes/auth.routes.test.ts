import { getTestAgent } from '../utils.ts';

jest.mock('../../src/services/auth.service.ts', () => {
  return {
    AuthService: jest.fn().mockImplementation(() => {
      return {
        register: jest.fn().mockResolvedValue({
          user: {
            id: '1',
            name: 'Test User',
            email: 'newuser@example.com',
          },
          tokens: {
            token: 'mocked-access-token',
            refreshToken: 'mocked-refresh-token',
          },
        }),
        login: jest.fn().mockImplementation((email, password) => {
          if (email === 'test@example.com' && password === 'Password123!') {
            return Promise.resolve({
              user: {
                id: '1',
                name: 'Test User',
                email: 'test@example.com',
              },
              token: 'mocked-access-token',
              refreshToken: 'mocked-refresh-token',
            });
          }
          return Promise.resolve(null);
        }),
        refreshToken: jest.fn().mockImplementation((token) => {
          if (token === 'valid-refresh-token') {
            return Promise.resolve({
              tokens: {
                token: 'new-mocked-access-token',
                refreshToken: 'new-mocked-refresh-token',
              },
            });
          }
          return Promise.resolve(null);
        }),
        logout: jest.fn().mockImplementation((token) => {
          if (token === 'valid-refresh-token') {
            return Promise.resolve({ success: true });
          }
          return Promise.resolve(null);
        }),
      };
    }),
  };
});

describe('Auth Routes', () => {
  describe('POST /api/auth/register', () => {
    it('should register a new user with valid data', async () => {
      const userData = {
        name: 'Test User',
        email: 'newuser@example.com',
        password: 'Password123!',
        confirmPassword: 'Password123!',
      };

      const response = await getTestAgent().post('/api/auth/register').send(userData);

      expect(response.status).toBe(201);
      expect(response.body).toStrictEqual({
        tokens: { refreshToken: 'mocked-refresh-token', token: 'mocked-access-token' },
        user: { email: 'newuser@example.com', id: '1', name: 'Test User' },
      });
    });

    it('should return 400 with invalid data', async () => {
      const invalidUserData = {
        name: 'Test User',
        email: 'invalid-email',
        password: 'short',
        confirmPassword: 'not-matching',
      };

      const response = await getTestAgent().post('/api/auth/register').send(invalidUserData);

      expect(response.status).toBe(400);
      expect(response.body).toStrictEqual({
        message: 'Validation error',
        details: {
          errors: [
            { field: 'email', message: 'Invalid email format' },
            { field: 'password', message: 'Password must be at least 8 characters' },
          ],
        },
      });
    });
  });

  describe('POST /api/auth/login', () => {
    it('should log in a user with valid credentials', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'Password123!',
      };

      const response = await getTestAgent().post('/api/auth/login').send(loginData);

      expect(response.status).toBe(200);
      expect(response.body).toStrictEqual({
        refreshToken: 'mocked-refresh-token',
        token: 'mocked-access-token',
        user: { email: 'test@example.com', id: '1', name: 'Test User' },
      });
    });

    it('should return 401 with invalid credentials', async () => {
      const invalidLoginData = {
        email: 'test@example.com',
        password: 'WrongPassword123!',
      };

      const response = await getTestAgent().post('/api/auth/login').send(invalidLoginData);

      expect(response.status).toBe(401);
      expect(response.body).toStrictEqual({ message: 'Invalid email or password' });
    });
  });

  describe('POST /api/auth/refresh-token', () => {
    it('should refresh token with valid refresh token', async () => {
      const refreshData = {
        refreshToken: 'valid-refresh-token',
      };

      const response = await getTestAgent().post('/api/auth/refresh-token').send(refreshData);

      expect(response.status).toBe(200);
      expect(response.body).toStrictEqual({
        tokens: { refreshToken: 'new-mocked-refresh-token', token: 'new-mocked-access-token' },
      });
    });

    it('should return 401 with invalid refresh token', async () => {
      const invalidRefreshData = {
        refreshToken: 'invalid-refresh-token',
      };

      const response = await getTestAgent().post('/api/auth/refresh-token').send(invalidRefreshData);

      expect(response.status).toBe(401);
      expect(response.body).toStrictEqual({
        message: 'Invalid or expired refresh token',
      });
    });
  });

  describe('POST /api/auth/logout', () => {
    it('should log out a user with valid refresh token', async () => {
      const logoutData = {
        refreshToken: 'valid-refresh-token',
      };

      const response = await getTestAgent().post('/api/auth/logout').send(logoutData);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message');
    });

    it('should return 400 with missing refresh token', async () => {
      const response = await getTestAgent().post('/api/auth/logout').send({});

      expect(response.status).toBe(400);
      expect(response.body).toStrictEqual({
        message: 'Validation error',
        details: { errors: [{ field: 'refreshToken', message: 'Required' }] },
      });
    });
  });
});

describe('POST /api/auth/register', () => {
  it('should register a new user with valid data', async () => {
    const userData = {
      name: 'Test User',
      email: 'newuser@example.com',
      password: 'Password123!',
      confirmPassword: 'Password123!',
    };

    const response = await getTestAgent().post('/api/auth/register').send(userData);

    expect(response.status).toBe(201);
    expect(response.body).toStrictEqual({
      tokens: { refreshToken: 'mocked-refresh-token', token: 'mocked-access-token' },
      user: { email: 'newuser@example.com', id: '1', name: 'Test User' },
    });
  });

  it('should return 400 with invalid data', async () => {
    const invalidUserData = {
      name: 'Test User',
      email: 'invalid-email',
      password: 'short',
      confirmPassword: 'not-matching',
    };

    const response = await getTestAgent().post('/api/auth/register').send(invalidUserData);

    expect(response.status).toBe(400);
    expect(response.body).toStrictEqual({
      details: {
        errors: [
          { field: 'email', message: 'Invalid email format' },
          { field: 'password', message: 'Password must be at least 8 characters' },
        ],
      },
      message: 'Validation error',
    });
  });
});

describe('POST /api/auth/login', () => {
  it('should log in a user with valid credentials', async () => {
    const loginData = {
      email: 'test@example.com',
      password: 'Password123!',
    };

    const response = await getTestAgent().post('/api/auth/login').send(loginData);

    expect(response.status).toBe(200);
    expect(response.body).toStrictEqual({
      refreshToken: 'mocked-refresh-token',
      token: 'mocked-access-token',
      user: { email: 'test@example.com', id: '1', name: 'Test User' },
    });
  });

  it('should return 401 with invalid credentials', async () => {
    const invalidLoginData = {
      email: 'test@example.com',
      password: 'WrongPassword123!',
    };

    const response = await getTestAgent().post('/api/auth/login').send(invalidLoginData);

    expect(response.status).toBe(401);
  });
});

describe('POST /api/auth/refresh-token', () => {
  it('should refresh token with valid refresh token', async () => {
    const refreshData = {
      refreshToken: 'valid-refresh-token',
    };

    const response = await getTestAgent().post('/api/auth/refresh-token').send(refreshData);

    expect(response.status).toBe(200);
    expect(response.body).toStrictEqual({
      tokens: { refreshToken: 'new-mocked-refresh-token', token: 'new-mocked-access-token' },
    });
  });

  it('should return 401 with invalid refresh token', async () => {
    const invalidRefreshData = {
      refreshToken: 'invalid-refresh-token',
    };

    const response = await getTestAgent().post('/api/auth/refresh-token').send(invalidRefreshData);

    expect(response.status).toBe(401);
  });
});

describe('POST /api/auth/logout', () => {
  it('should log out a user with valid refresh token', async () => {
    const logoutData = {
      refreshToken: 'valid-refresh-token',
    };

    const response = await getTestAgent().post('/api/auth/logout').send(logoutData);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message');
  });

  it('should return 400 with missing refresh token', async () => {
    const response = await getTestAgent().post('/api/auth/logout').send({});

    expect(response.status).toBe(400);
    expect(response.body).toStrictEqual({
      details: { errors: [{ field: 'refreshToken', message: 'Required' }] },
      message: 'Validation error',
    });
  });
});
