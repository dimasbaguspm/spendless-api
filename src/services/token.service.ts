import crypto from 'crypto';

import { eq, gt, and, isNull } from 'drizzle-orm';

import { db } from '../core/db/config.ts';
import { refreshTokens, NewRefreshToken, RefreshToken } from '../models/schema.ts';

export class TokenService {
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
      expires,
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
    const now = new Date();

    const [refreshToken] = await db
      .select()
      .from(refreshTokens)
      .where(and(eq(refreshTokens.token, token), gt(refreshTokens.expires, now), isNull(refreshTokens.revokedAt)));

    return !!refreshToken;
  }

  /**
   * Revoke a refresh token
   */
  async revokeRefreshToken(token: string, replacedByToken?: string): Promise<void> {
    const now = new Date();

    await db
      .update(refreshTokens)
      .set({
        revokedAt: now,
        replacedByToken: replacedByToken,
      })
      .where(eq(refreshTokens.token, token));
  }

  /**
   * Revoke all refresh tokens for a user
   */
  async revokeAllUserRefreshTokens(userId: number): Promise<void> {
    const now = new Date();

    await db
      .update(refreshTokens)
      .set({
        revokedAt: now,
      })
      .where(and(eq(refreshTokens.userId, userId), isNull(refreshTokens.revokedAt)));
  }
}
