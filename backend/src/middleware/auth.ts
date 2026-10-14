import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { UnauthorizedError } from '../utils/errors.js';
import prisma from '../config/database.js';

export interface JwtPayload {
  userId: string;
  email?: string;
  iat?: number;
  exp?: number;
}

// Extend Express Request
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string | null;
        phone: string | null;
        name: string;
      };
    }
  }
}

export async function authenticate(req: Request, _res: Response, next: NextFunction) {
  try {
    // Get token from Authorization header or cookie
    let token: string | undefined;

    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith('Bearer ')) {
      token = authHeader.slice(7);
    } else if (req.cookies?.accessToken) {
      token = req.cookies.accessToken;
    }

    if (!token) {
      throw new UnauthorizedError('No authentication token provided');
    }

    // Verify JWT
    const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;

    // Fetch user from DB
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        phone: true,
        name: true,
      },
    });

    if (!user) {
      throw new UnauthorizedError('User not found');
    }

    req.user = user;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      next(new UnauthorizedError('Invalid or expired token'));
      return;
    }
    next(error);
  }
}

// Optional auth — sets user if token exists, but doesn't fail if not
export async function optionalAuth(req: Request, _res: Response, next: NextFunction) {
  try {
    let token: string | undefined;

    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith('Bearer ')) {
      token = authHeader.slice(7);
    } else if (req.cookies?.accessToken) {
      token = req.cookies.accessToken;
    }

    if (token) {
      const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: { id: true, email: true, phone: true, name: true },
      });
      if (user) {
        req.user = user;
      }
    }

    next();
  } catch {
    // Silently continue without auth
    next();
  }
}
