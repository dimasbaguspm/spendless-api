import { Request, Response, NextFunction } from 'express';

import { UnauthorizedException } from '../helpers/exceptions/index.ts';
import { getErrorResponse } from '../helpers/http-response/index.ts';
import { TokenService } from '../services/token.service.ts';

/**
 * Middleware to authenticate JWT tokens from the Authorization header
 */
export const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
  try {
    const tokenService = new TokenService();

    // Extract token from request
    const token = tokenService.extractTokenFromRequest(req);

    // Verify token
    const decoded = tokenService.verifyAccessToken(token);

    if (!decoded?.sub) throw new UnauthorizedException('Invalid token');

    next();
  } catch (error) {
    getErrorResponse(res, error);
  }
};
