import crypto from 'crypto';

import { eq, gt, and, isNull } from 'drizzle-orm';
import { Request } from 'express';
import jwt from 'jsonwebtoken';

import { db } from '../core/db/config.ts';
import { UnauthorizedException } from '../helpers/exceptions/index.ts';
import { refreshTokens, NewRefreshToken, RefreshToken } from '../models/schema.ts';

interface JwtPayload {
  sub: string | number;
  email: string;
  [key: string]: unknown;
}

export class TokenService {
  private jwtSecret: string;

  constructor() {
    this.jwtSecret = process.env.JWT_SECRET ?? 'your_super_secret_key_change_in_production';
  }

  /**
   * Generate a new refresh token
   */
  async generateRefreshToken(userId: number, expiresDays = 7): Promise<string> {
    // Create token expiration date
    const expires = new Date();
    expires.setDate(expires.getDate() + expiresDays);

    // Create a random token
    const token = crypto.randomBytes(40).toString('hex');

    // Save token to database
    const newToken: NewRefreshToken = {
      userId,
      token,
      expires: expires.toISOString(),
    };

    await db.insert(refreshTokens).values(newToken);

    return token;
  }

  /**
   * Get refresh token by token value
   */
  async getRefreshToken(token: string): Promise<RefreshToken | undefined> {
    const [refreshToken] = await db.select().from(refreshTokens).where(eq(refreshTokens.token, token));

    return refreshToken;
  }

  /**
   * Check if a refresh token is active and valid
   */
  async isRefreshTokenActive(token: string): Promise<boolean> {
    const [refreshToken] = await db
      .select()
      .from(refreshTokens)
      .where(
        and(
          eq(refreshTokens.token, token),
          gt(refreshTokens.expires, new Date().toISOString()),
          isNull(refreshTokens.revokedAt)
        )
      );

    return !!refreshToken;
  }

  /**
   * Revoke a refresh token
   */
  async revokeRefreshToken(token: string, replacedByToken?: string): Promise<void> {
    await db
      .update(refreshTokens)
      .set({
        revokedAt: new Date().toISOString(),
        replacedByToken: replacedByToken,
      })
      .where(eq(refreshTokens.token, token));
  }

  /**
   * Revoke all refresh tokens for a user
   */
  async revokeAllUserRefreshTokens(userId: number): Promise<void> {
    await db
      .update(refreshTokens)
      .set({
        revokedAt: new Date().toISOString(),
      })
      .where(and(eq(refreshTokens.userId, userId), isNull(refreshTokens.revokedAt)));
  }

  /**
   * Extract token from request authorization header
   * @throws {UnauthorizedException} If the token is missing or invalid
   */
  extractTokenFromRequest(req: Request): string {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException('Authorization header is missing');
    }

    const tokenParts = authHeader.split(' ');

    if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
      throw new UnauthorizedException('Invalid authorization format');
    }

    return tokenParts[1];
  }

  /**
   * Verify JWT access token
   */
  verifyAccessToken(token: string): JwtPayload {
    try {
      const decoded = jwt.verify(token, this.jwtSecret) as JwtPayload;

      if (!decoded || typeof decoded !== 'object' || !decoded.sub) {
        throw new Error('Invalid token payload');
      }

      return decoded;
    } catch {
      throw new Error('Invalid or expired token');
    }
  }

  /**
   * Extract user data from token
   */
  getUserFromToken(token: string): { id: number; email: string } {
    try {
      const decoded = this.verifyAccessToken(token);

      return {
        id: Number(decoded.sub),
        email: decoded.email,
      };
    } catch {
      throw new Error('Failed to extract user data from token');
    }
  }

  /**
   * Get user data from request
   * @throws {UnauthorizedException} If token is missing or invalid
   */
  getUserFromRequest(req: Request): { id: number; email: string } {
    const token = this.extractTokenFromRequest(req);
    return this.getUserFromToken(token);
  }

  /**
   * Try to get user data from request without throwing exceptions
   * @returns User data if token is valid, null otherwise
   */
  tryGetUserFromRequest(req: Request): { id: number; email: string } | null {
    try {
      const token = this.extractTokenFromRequest(req);
      return this.getUserFromToken(token);
    } catch {
      return null;
    }
  }

  /**
   * Generate JWT access token
   */
  generateAccessToken(user: { id: number; email: string }): string {
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

      if (typeof decoded === 'object' && decoded !== null) {
        return {
          sub: Number(decoded?.sub),
          email: decoded?.email,
        };
      }

      return null;
    } catch {
      return null;
    }
  }
}
