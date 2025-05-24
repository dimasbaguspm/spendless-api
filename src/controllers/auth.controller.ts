import { Request, Response } from 'express';

import { UnauthorizedException, ConflictException, BadRequestException } from '../helpers/exceptions/index.ts';
import { getErrorResponse } from '../helpers/http-response/index.ts';
import { AccessTokenService } from '../services/authentication/access-token.service.ts';
import { PasswordService } from '../services/authentication/password.service.ts';
import { RefreshTokenService } from '../services/authentication/refresh-token.service.ts';
import { GroupService } from '../services/database/group.service.ts';
import { UserService } from '../services/database/user.service.ts';

const accessTokenService = new AccessTokenService();
const passwordService = new PasswordService();
const userService = new UserService();
const refreshTokenService = new RefreshTokenService();
const groupService = new GroupService();

export async function registerUser(req: Request, res: Response) {
  try {
    const { group, user } = req.body ?? {};

    if (!group || typeof group !== 'object') {
      throw new BadRequestException('Group information is required to register a user');
    }

    if (!user || typeof user !== 'object') {
      throw new BadRequestException('User information is required to register a user');
    }

    // Check if email is already used
    const existing = await userService.getSingle({ email: user.email });
    if (existing) {
      throw new ConflictException('User with this email already exists');
    }

    // Now create the group
    const createdGroup = await groupService.createSingle(group);

    // Create user with the real groupId
    const passwordHash = await passwordService.hashPassword(user.password);
    const createdUser = await userService.createSingle({ ...user, passwordHash, groupId: createdGroup.id });

    const token = accessTokenService.generateAccessToken(createdUser);
    const refreshToken = await refreshTokenService.generateRefreshToken(Number(createdUser.id));

    const { passwordHash: _, ...userWithoutPassword } = createdUser;

    res.status(201).json({ token, refreshToken, user: userWithoutPassword });
  } catch (err) {
    getErrorResponse(res, err);
  }
}

export async function loginUser(req: Request, res: Response) {
  try {
    const user = await userService.getSingle({ email: req.body.email });
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const valid = await passwordService.comparePassword(req.body.password, user.passwordHash);
    if (!valid) {
      throw new UnauthorizedException('Invalid email or password');
    }
    const token = accessTokenService.generateAccessToken(user);
    const refreshToken = await refreshTokenService.generateRefreshToken(Number(user.id));

    const { passwordHash: _, ...userWithoutPassword } = user;
    res.status(200).json({ token, refreshToken, user: userWithoutPassword });
  } catch (err) {
    getErrorResponse(res, err);
  }
}

export function forgotPassword(_req: Request, res: Response) {
  return res.status(501).json({ message: 'Not implemented' });
}

export function resetPassword(_req: Request, res: Response) {
  return res.status(501).json({ message: 'Not implemented' });
}
