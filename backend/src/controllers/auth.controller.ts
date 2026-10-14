import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/auth.service.js';
import { sendSuccess, sendCreated } from '../utils/response.js';

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  path: '/',
};

export class AuthController {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.register(req.body);

      res.cookie('refreshToken', result.refreshToken, COOKIE_OPTIONS);
      res.cookie('accessToken', result.accessToken, {
        ...COOKIE_OPTIONS,
        maxAge: 15 * 60 * 1000, // 15 min
      });

      sendCreated(res, {
        user: result.user,
        accessToken: result.accessToken,
      }, 'Account created successfully');
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.login(req.body);

      res.cookie('refreshToken', result.refreshToken, COOKIE_OPTIONS);
      res.cookie('accessToken', result.accessToken, {
        ...COOKIE_OPTIONS,
        maxAge: 15 * 60 * 1000,
      });

      sendSuccess(res, {
        user: result.user,
        accessToken: result.accessToken,
      }, 'Login successful');
    } catch (error) {
      next(error);
    }
  }

  async sendOtp(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.sendOtp(req.body);
      sendSuccess(res, result);
    } catch (error) {
      next(error);
    }
  }

  async verifyOtp(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.verifyOtp(req.body);

      // If login OTP, set cookies
      if ('accessToken' in result) {
        res.cookie('refreshToken', result.refreshToken, COOKIE_OPTIONS);
        res.cookie('accessToken', result.accessToken, {
          ...COOKIE_OPTIONS,
          maxAge: 15 * 60 * 1000,
        });
      }

      sendSuccess(res, result);
    } catch (error) {
      next(error);
    }
  }

  async forgotPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.forgotPassword(req.body.email);
      sendSuccess(res, result);
    } catch (error) {
      next(error);
    }
  }

  async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.resetPassword(req.body);
      sendSuccess(res, result);
    } catch (error) {
      next(error);
    }
  }

  async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.cookies?.refreshToken || req.body.refreshToken;
      if (!token) {
        res.status(401).json({ success: false, message: 'No refresh token' });
        return;
      }

      const tokens = await authService.refreshToken(token);

      res.cookie('refreshToken', tokens.refreshToken, COOKIE_OPTIONS);
      res.cookie('accessToken', tokens.accessToken, {
        ...COOKIE_OPTIONS,
        maxAge: 15 * 60 * 1000,
      });

      sendSuccess(res, { accessToken: tokens.accessToken }, 'Token refreshed');
    } catch (error) {
      next(error);
    }
  }

  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      if (req.user) {
        const refreshToken = req.cookies?.refreshToken;
        await authService.logout(req.user.id, refreshToken);
      }

      res.clearCookie('accessToken');
      res.clearCookie('refreshToken');

      sendSuccess(res, null, 'Logged out successfully');
    } catch (error) {
      next(error);
    }
  }

  async me(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Not authenticated' });
        return;
      }
      const user = await authService.getCurrentUser(req.user.id);
      sendSuccess(res, user);
    } catch (error) {
      next(error);
    }
  }
}

export const authController = new AuthController();
