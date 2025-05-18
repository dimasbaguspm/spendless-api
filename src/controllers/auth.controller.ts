import { Request, Response } from 'express';

import { BadRequestException, ConflictException, UnauthorizedException } from '../helpers/exceptions/index.ts';
import { getErrorResponse } from '../helpers/http-response/index.ts';
import { loginSchema, logoutSchema, refreshTokenSchema, registerSchema } from '../helpers/validation/auth.schema.ts';
import { getZodErrorDetails, validate } from '../helpers/validation/index.ts';
import { AuthService } from '../services/auth.service.ts';

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  /**
   * Register a new user
   */
  async register(req: Request, res: Response) {
    try {
      const { data, error, success } = await validate(registerSchema, req?.body);

      if (!success) {
        throw new BadRequestException('Validation error', {
          errors: getZodErrorDetails(error),
        });
      }

      // Register user
      const result = await this.authService.register(data);

      if (!result) {
        throw new ConflictException('User with this email already exists');
      }

      res.status(201).json(result);
    } catch (error) {
      getErrorResponse(res, error);
    }
  }

  /**
   * Login a user
   */
  async login(req: Request, res: Response) {
    try {
      const { data, error, success } = await validate(loginSchema, req?.body);

      if (!success) {
        throw new BadRequestException('Validation error', {
          errors: getZodErrorDetails(error),
        });
      }

      // Login user
      const result = await this.authService.login(data.email, data.password);

      if (!result) {
        throw new UnauthorizedException('Invalid email or password');
      }

      res.status(200).json(result);
    } catch (error) {
      getErrorResponse(res, error);
    }
  }

  /**
   * Refresh the access token using a refresh token
   */
  async refreshToken(req: Request, res: Response) {
    try {
      const { data, error, success } = await validate(refreshTokenSchema, req?.body);

      if (!success) {
        throw new BadRequestException('Validation error', {
          errors: getZodErrorDetails(error),
        });
      }

      const { refreshToken } = data;

      if (!refreshToken) {
        throw new BadRequestException('Refresh token is required');
      }

      const result = await this.authService.refreshToken(refreshToken);

      if (!result) {
        throw new UnauthorizedException('Invalid or expired refresh token');
      }

      res.status(200).json(result);
    } catch (error) {
      getErrorResponse(res, error);
    }
  }

  /**
   * Logout a user by revoking their refresh token
   */
  async logout(req: Request, res: Response) {
    try {
      const { data, error, success } = await validate(logoutSchema, req?.body);

      if (!success) {
        throw new BadRequestException('Validation error', {
          errors: getZodErrorDetails(error),
        });
      }

      const { refreshToken } = data;

      if (!refreshToken) {
        throw new BadRequestException('Refresh token is required');
      }

      const isSuccessToLogout = await this.authService.logout(refreshToken);

      if (!isSuccessToLogout) {
        throw new BadRequestException('Logout failed');
      }

      res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
      getErrorResponse(res, error);
    }
  }
}
