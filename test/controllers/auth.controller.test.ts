import { Request, Response } from 'express';

import { AuthController } from '../../src/controllers/auth.controller.ts';
import { AuthService } from '../../src/services/auth.service.ts';
import { getUserSingleStub } from '../stub.ts';

jest.mock('../../src/services/auth.service.ts');

const mockedAuthService = AuthService as jest.Mock;

describe('AuthController', () => {
  const mockResponseJson = jest.fn();
  const mockResponseStatus = jest.fn().mockReturnValue({
    json: mockResponseJson,
  });

  let request: Request = {} as unknown as Request;
  let response: Response = {} as unknown as Response;

  const mockedAuthServiceMethods = {
    register: jest.fn(),
    login: jest.fn(),
    refreshToken: jest.fn(),
    logout: jest.fn(),
    verifyToken: jest.fn(),
  };

  beforeEach(() => {
    request = {
      body: {},
    } as unknown as Request;
    response = {
      status: mockResponseStatus,
      json: mockResponseJson,
    } as unknown as Response;

    mockedAuthService.mockReturnValue(mockedAuthServiceMethods);
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should register a user successfully', async () => {
      request.body = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'Password123!',
        confirmPassword: 'Password123!',
      };

      // Setup service to return successful registration
      const mockRegistrationResult = {
        token: 'mock-access-token',
        refreshToken: 'mock-refresh-token',
        user: getUserSingleStub,
      };

      mockedAuthServiceMethods.register.mockResolvedValue(mockRegistrationResult);

      // Call the register method
      await new AuthController().register(request, response);

      expect(mockedAuthServiceMethods.register).toHaveBeenCalled();

      // Assert response was sent with correct status and data
      expect(mockResponseJson).toHaveBeenCalledWith(mockRegistrationResult);
      expect(mockResponseStatus).toHaveBeenCalledWith(201);
    });

    it('should return 400 when validation fails', async () => {
      // Missing required fields
      request.body = {
        email: 'test@example.com',
        // Missing name and password
      };

      // Call the register method
      await new AuthController().register(request, response);

      // Verify that the service was not called
      expect(mockedAuthServiceMethods.register).not.toHaveBeenCalled();

      // Verify response status and error message
      expect(mockResponseStatus).toHaveBeenCalledWith(400);
      expect(mockResponseJson).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Validation error',
        })
      );
    });

    it('should return 401 when user email already exists', async () => {
      request.body = {
        name: 'Test User',
        email: 'existing@example.com',
        password: 'Password123!',
        confirmPassword: 'Password123!',
      };

      // Mock the service to return null (user already exists)
      mockedAuthServiceMethods.register.mockResolvedValue(null);

      // Call the register method
      await new AuthController().register(request, response);

      expect(mockedAuthServiceMethods.register).toHaveBeenCalled();

      // Verify response status and error message
      expect(mockResponseStatus).toHaveBeenCalledWith(409);
      expect(mockResponseJson).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'User with this email already exists',
        })
      );
    });
  });

  describe('login', () => {
    it('should login a user successfully', async () => {
      request.body = {
        email: 'test@example.com',
        password: 'Password123!',
      };

      // Setup service to return successful login
      const mockLoginResult = {
        token: 'mock-access-token',
        refreshToken: 'mock-refresh-token',
        user: getUserSingleStub,
      };

      mockedAuthServiceMethods.login.mockResolvedValue(mockLoginResult);

      // Call the login method
      await new AuthController().login(request, response);

      expect(mockedAuthServiceMethods.login).toHaveBeenCalledWith('test@example.com', 'Password123!');

      // Assert response was sent with correct status and data
      expect(mockResponseJson).toHaveBeenCalledWith(mockLoginResult);
      expect(mockResponseStatus).toHaveBeenCalledWith(200);
    });

    it('should return 400 when validation fails', async () => {
      // Missing password
      request.body = {
        email: 'test@example.com',
      };

      // Call the login method
      await new AuthController().login(request, response);

      // Verify that the service was not called
      expect(mockedAuthServiceMethods.login).not.toHaveBeenCalled();

      // Verify response status and error message
      expect(mockResponseStatus).toHaveBeenCalledWith(400);
      expect(mockResponseJson).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Validation error',
        })
      );
    });

    it('should return 401 when credentials are invalid', async () => {
      request.body = {
        email: 'test@example.com',
        password: 'WrongPassword',
      };

      // Mock the service to return null (invalid credentials)
      mockedAuthServiceMethods.login.mockResolvedValue(null);

      // Call the login method
      await new AuthController().login(request, response);

      expect(mockedAuthServiceMethods.login).toHaveBeenCalledWith('test@example.com', 'WrongPassword');

      // Verify response status and error message
      expect(mockResponseStatus).toHaveBeenCalledWith(401);
      expect(mockResponseJson).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Invalid email or password',
        })
      );
    });
  });

  describe('refreshToken', () => {
    it('should refresh token successfully', async () => {
      request.body = {
        refreshToken: 'valid-refresh-token',
      };

      // Setup service to return successful refresh
      const mockRefreshResult = {
        token: 'new-access-token',
        refreshToken: 'new-refresh-token',
      };

      mockedAuthServiceMethods.refreshToken.mockResolvedValue(mockRefreshResult);

      // Call the refreshToken method
      await new AuthController().refreshToken(request, response);

      expect(mockedAuthServiceMethods.refreshToken).toHaveBeenCalledWith('valid-refresh-token');

      // Assert response was sent with correct status and data
      expect(mockResponseJson).toHaveBeenCalledWith(mockRefreshResult);
      expect(mockResponseStatus).toHaveBeenCalledWith(200);
    });

    it('should return 400 when refresh token is missing', async () => {
      request.body = {};

      // Call the refreshToken method
      await new AuthController().refreshToken(request, response);

      // Verify that the service was not called
      expect(mockedAuthServiceMethods.refreshToken).not.toHaveBeenCalled();

      // Verify response status and error message
      expect(mockResponseStatus).toHaveBeenCalledWith(400);
      expect(mockResponseJson).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Validation error',
        })
      );
    });

    it('should return 401 when refresh token is invalid or expired', async () => {
      request.body = {
        refreshToken: 'invalid-refresh-token',
      };

      // Mock the service to return null (invalid token)
      mockedAuthServiceMethods.refreshToken.mockResolvedValue(null);

      // Call the refreshToken method
      await new AuthController().refreshToken(request, response);

      expect(mockedAuthServiceMethods.refreshToken).toHaveBeenCalledWith('invalid-refresh-token');

      // Verify response status and error message
      expect(mockResponseStatus).toHaveBeenCalledWith(401);
      expect(mockResponseJson).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Invalid or expired refresh token',
        })
      );
    });
  });

  describe('logout', () => {
    it('should logout successfully', async () => {
      request.body = {
        refreshToken: 'valid-refresh-token',
      };

      // Setup service to return successful logout
      mockedAuthServiceMethods.logout.mockResolvedValue(true);

      // Call the logout method
      await new AuthController().logout(request, response);

      expect(mockedAuthServiceMethods.logout).toHaveBeenCalledWith('valid-refresh-token');

      // Assert response was sent with correct status and data
      expect(mockResponseJson).toHaveBeenCalledWith({ message: 'Logged out successfully' });
      expect(mockResponseStatus).toHaveBeenCalledWith(200);
    });

    it('should return 400 when refresh token is missing', async () => {
      request.body = {};

      // Call the logout method
      await new AuthController().logout(request, response);

      // Verify that the service was not called
      expect(mockedAuthServiceMethods.logout).not.toHaveBeenCalled();

      // Verify response status and error message
      expect(mockResponseStatus).toHaveBeenCalledWith(400);
      expect(mockResponseJson).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Validation error',
        })
      );
    });

    it('should return 400 when logout fails', async () => {
      request.body = {
        refreshToken: 'invalid-refresh-token',
      };

      // Mock the service to return false (logout failed)
      mockedAuthServiceMethods.logout.mockResolvedValue(false);

      // Call the logout method
      await new AuthController().logout(request, response);

      expect(mockedAuthServiceMethods.logout).toHaveBeenCalledWith('invalid-refresh-token');

      // Verify response status and error message
      expect(mockResponseStatus).toHaveBeenCalledWith(400);
      expect(mockResponseJson).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Logout failed',
        })
      );
    });
  });
});
