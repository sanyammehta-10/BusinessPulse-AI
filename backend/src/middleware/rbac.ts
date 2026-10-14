import { Request, Response, NextFunction } from 'express';
import { UserRole } from '@prisma/client';
import { ForbiddenError, NotFoundError } from '../utils/errors.js';
import prisma from '../config/database.js';

// Extend Express Request for membership
declare global {
  namespace Express {
    interface Request {
      membership?: {
        id: string;
        role: UserRole;
        businessId: string;
      };
    }
  }
}

/**
 * Middleware: Checks that the authenticated user has one of the allowed roles
 * for the business identified by :businessId param.
 */
export function authorize(...allowedRoles: UserRole[]) {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw new ForbiddenError('Authentication required');
      }

      const businessId = req.params.businessId;
      if (!businessId) {
        throw new NotFoundError('Business ID is required');
      }

      const membership = await prisma.businessMember.findUnique({
        where: {
          userId_businessId: {
            userId: req.user.id,
            businessId,
          },
        },
        select: {
          id: true,
          role: true,
          businessId: true,
        },
      });

      if (!membership) {
        throw new ForbiddenError('You do not have access to this business');
      }

      if (!allowedRoles.includes(membership.role)) {
        throw new ForbiddenError(
          `Role '${membership.role}' does not have permission for this action`,
        );
      }

      req.membership = membership;
      next();
    } catch (error) {
      next(error);
    }
  };
}

/**
 * Middleware: Just verifies the user is a member of the business (any role).
 */
export function requireMembership() {
  return authorize('OWNER', 'MANAGER', 'ACCOUNTANT', 'VIEWER');
}
