// filepath: /home/kyrielle/development/spendless-api/src/services/auth.service.ts
import jwt from 'jsonwebtoken';

import { RegisterInput } from '../helpers/validation/auth.schema.ts';
import { User } from '../models/schema.ts';

import { TokenService } from './token.service.ts';
import { UserService } from './user.service.ts';

export class AuthService {
  private userService: UserService;
  private tokenService: TokenService;
  private jwtSecret: string;

  constructor() {
    this.userService = new UserService();
    this.tokenService = new TokenService();
    this.jwtSecret = process.env.JWT_SECRET ?? 'your_super_secret_key_change_in_production';
  }

  /**
   * Login a user with email and password
   */
  async login(
    email: string,
    password: string
  ): Promise<{
    token: string;
    refreshToken: string;
    user: Omit<User, 'password'>;
  } | null> {
    const user = await this.userService.findByEmail(email);

    if (!user) {
      return null;
    }

    const isPasswordValid = await this.userService.validatePassword(password, user.password);

    if (!isPasswordValid) {
      return null;
    }

    // Generate JWT access token
    const token = this.generateToken(user);

    // Generate refresh token
    const refreshToken = await this.tokenService.generateRefreshToken(user.id);

    // Remove password from user object
    const { password: _, ...userWithoutPassword } = user;

    return {
      token,
      refreshToken,
      user: userWithoutPassword,
    };
  }

  /**
   * Register a new user
   */
  async register(userData: RegisterInput): Promise<{
    token: string;
    refreshToken: string;
    user: Omit<User, 'password'>;
  } | null> {
    try {
      // Check if user already exists
      const existingUser = await this.userService.findByEmail(userData.email);

      if (existingUser) {
        return null;
      }

      // Create new user
      const user = await this.userService.createUser(userData);

      // Generate JWT access token
      const token = this.generateToken(user);

      // Generate refresh token
      const refreshToken = await this.tokenService.generateRefreshToken(user.id);

      // Remove password from user object
      const { password: _, ...userWithoutPassword } = user;

      return {
        token,
        refreshToken,
        user: userWithoutPassword,
      };
    } catch {
      return null;
    }
  }

  /**
   * Refresh access token using refresh token
   */
  async refreshToken(token: string): Promise<{
    token: string;
    refreshToken: string;
  } | null> {
    try {
      // Validate refresh token
      const isValid = await this.tokenService.isRefreshTokenActive(token);

      if (!isValid) {
        return null;
      }

      // Get the refresh token from database
      const refreshTokenData = await this.tokenService.getRefreshToken(token);

      if (!refreshTokenData) {
        return null;
      }

      // Get user
      const user = await this.userService.findById(refreshTokenData.userId);

      if (!user) {
        return null;
      }

      // Generate new tokens
      const newToken = this.generateToken(user);

      // Generate new refresh token and revoke the old one
      const newRefreshToken = await this.tokenService.generateRefreshToken(user.id);
      await this.tokenService.revokeRefreshToken(token, newRefreshToken);

      return {
        token: newToken,
        refreshToken: newRefreshToken,
      };
    } catch {
      return null;
    }
  }

  /**
   * Logout a user by revoking their refresh token
   */
  async logout(token: string): Promise<boolean> {
    try {
      // Revoke the refresh token
      await this.tokenService.revokeRefreshToken(token);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Generate JWT token
   */
  private generateToken(user: User): string {
    const payload = {
      sub: user.id,
      email: user.email,
    };

    return jwt.sign(payload, this.jwtSecret, { expiresIn: '24h' });
  }

  /**
   * Verify JWT token
   */
  verifyToken(token: string): { sub: number; email: string } | null {
    try {
      const decoded = jwt.verify(token, this.jwtSecret);

      if (
        typeof decoded === 'object' &&
        decoded !== null &&
        'sub' in decoded &&
        'email' in decoded &&
        typeof decoded.sub !== 'undefined' &&
        typeof decoded.email === 'string'
      ) {
        return {
          sub: Number(decoded.sub),
          email: decoded.email,
        };
      }

      return null;
    } catch {
      return null;
    }
  }
}
