import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import prisma from '../config/database.js';
import redis from '../config/redis.js';
import { env } from '../config/env.js';
import {
  BadRequestError,
  ConflictError,
  NotFoundError,
  UnauthorizedError,
} from '../utils/errors.js';
import type {
  RegisterInput,
  LoginInput,
  SendOtpInput,
  VerifyOtpInput,
  ResetPasswordInput,
} from '../schemas/auth.schema.js';
import type { JwtPayload } from '../middleware/auth.js';

const SALT_ROUNDS = 12;
const OTP_EXPIRY_MINUTES = 5;
const OTP_MAX_ATTEMPTS = 3;

export class AuthService {
  // ─── REGISTER ────────────────────────────────────

  async register(input: RegisterInput) {
    // Check for existing user
    if (input.email) {
      const existing = await prisma.user.findUnique({
        where: { email: input.email },
      });
      if (existing) {
        throw new ConflictError('An account with this email already exists');
      }
    }

    if (input.phone) {
      const existing = await prisma.user.findUnique({
        where: { phone: input.phone },
      });
      if (existing) {
        throw new ConflictError('An account with this phone number already exists');
      }
    }

    // Hash password
    let passwordHash: string | undefined;
    if (input.password) {
      passwordHash = await bcrypt.hash(input.password, SALT_ROUNDS);
    }

    // Create user
    const user = await prisma.user.create({
      data: {
        name: input.name,
        email: input.email ?? null,
        phone: input.phone ?? null,
        passwordHash: passwordHash ?? null,
      },
      select: {
        id: true,
        email: true,
        phone: true,
        name: true,
        emailVerified: true,
        phoneVerified: true,
        createdAt: true,
      },
    });

    // Generate tokens
    const tokens = this.generateTokens(user.id);
    try {
      await this.storeRefreshToken(user.id, tokens.refreshToken);
    } catch {
      // Redis may be down — tokens still work, refresh will fail gracefully
    }

    return { user, ...tokens };
  }

  // ─── EMAIL LOGIN ─────────────────────────────────

  async login(input: LoginInput) {
    const user = await prisma.user.findUnique({
      where: { email: input.email },
    });

    if (!user || !user.passwordHash) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const isValid = await bcrypt.compare(input.password, user.passwordHash);
    if (!isValid) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const tokens = this.generateTokens(user.id);
    try {
      await this.storeRefreshToken(user.id, tokens.refreshToken);
    } catch {
      // Redis may be down — tokens still work, refresh will fail gracefully
    }

    return {
      user: {
        id: user.id,
        email: user.email,
        phone: user.phone,
        name: user.name,
        emailVerified: user.emailVerified,
        phoneVerified: user.phoneVerified,
      },
      ...tokens,
    };
  }

  // ─── OTP ────────────────────────────────────────

  async sendOtp(input: SendOtpInput) {
    // Generate 6-digit OTP
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedCode = await bcrypt.hash(code, 6);

    // Find or create user for phone login
    let userId: string | undefined;

    if (input.phone) {
      const user = await prisma.user.findUnique({
        where: { phone: input.phone },
      });
      userId = user?.id;

      // For login OTP, user must exist
      if (input.type === 'LOGIN' && !user) {
        throw new NotFoundError('No account found with this phone number');
      }
    }

    if (input.email) {
      const user = await prisma.user.findUnique({
        where: { email: input.email },
      });
      userId = user?.id;
    }

    // Invalidate previous unused OTPs
    await prisma.otpCode.updateMany({
      where: {
        OR: [
          { phone: input.phone ?? undefined },
          { email: input.email ?? undefined },
        ],
        type: input.type as any,
        used: false,
      },
      data: { used: true },
    });

    // Store OTP
    await prisma.otpCode.create({
      data: {
        userId: userId ?? null,
        phone: input.phone ?? null,
        email: input.email ?? null,
        code: hashedCode,
        type: input.type as any,
        expiresAt: new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000),
      },
    });

    // TODO: Send OTP via Twilio (phone) or SendGrid (email)
    // For development, log the OTP
    if (env.NODE_ENV === 'development') {
      console.log(`🔐 OTP for ${input.phone || input.email}: ${code}`);
    }

    return { message: 'OTP sent successfully' };
  }

  async verifyOtp(input: VerifyOtpInput) {
    // Find the latest unused OTP
    const otpRecord = await prisma.otpCode.findFirst({
      where: {
        OR: [
          { phone: input.phone ?? undefined },
          { email: input.email ?? undefined },
        ],
        type: input.type as any,
        used: false,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!otpRecord) {
      throw new BadRequestError('OTP expired or not found. Please request a new one.');
    }

    if (otpRecord.attempts >= OTP_MAX_ATTEMPTS) {
      await prisma.otpCode.update({
        where: { id: otpRecord.id },
        data: { used: true },
      });
      throw new BadRequestError('Maximum OTP attempts exceeded. Please request a new one.');
    }

    // Verify OTP
    const isValid = await bcrypt.compare(input.code, otpRecord.code);

    if (!isValid) {
      await prisma.otpCode.update({
        where: { id: otpRecord.id },
        data: { attempts: { increment: 1 } },
      });
      throw new BadRequestError('Invalid OTP');
    }

    // Mark as used
    await prisma.otpCode.update({
      where: { id: otpRecord.id },
      data: { used: true },
    });

    // Handle different OTP types
    if (input.type === 'LOGIN') {
      // Get or create user
      let user = input.phone
        ? await prisma.user.findUnique({ where: { phone: input.phone } })
        : await prisma.user.findUnique({ where: { email: input.email! } });

      if (!user) {
        throw new NotFoundError('User not found');
      }

      // Update verification status
      if (input.phone && !user.phoneVerified) {
        await prisma.user.update({
          where: { id: user.id },
          data: { phoneVerified: true },
        });
      }

      const tokens = this.generateTokens(user.id);
      await this.storeRefreshToken(user.id, tokens.refreshToken);

      return {
        user: {
          id: user.id,
          email: user.email,
          phone: user.phone,
          name: user.name,
          emailVerified: user.emailVerified,
          phoneVerified: true,
        },
        ...tokens,
      };
    }

    if (input.type === 'VERIFY_EMAIL' && input.email) {
      await prisma.user.updateMany({
        where: { email: input.email },
        data: { emailVerified: true },
      });
      return { message: 'Email verified successfully' };
    }

    if (input.type === 'VERIFY_PHONE' && input.phone) {
      await prisma.user.updateMany({
        where: { phone: input.phone },
        data: { phoneVerified: true },
      });
      return { message: 'Phone verified successfully' };
    }

    if (input.type === 'RESET_PASSWORD') {
      // Return a short-lived reset token
      const resetToken = crypto.randomBytes(32).toString('hex');
      const identifier = input.email || input.phone!;
      await redis.set(`reset:${resetToken}`, identifier, 'EX', 600); // 10 min
      return { resetToken };
    }

    return { message: 'OTP verified' };
  }

  // ─── PASSWORD RESET ──────────────────────────────

  async forgotPassword(email: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    // Don't reveal if user exists
    if (!user) {
      return { message: 'If an account exists, a reset link has been sent.' };
    }

    // Send OTP for reset
    await this.sendOtp({ email, type: 'RESET_PASSWORD' });
    return { message: 'If an account exists, a reset OTP has been sent.' };
  }

  async resetPassword(input: ResetPasswordInput) {
    const identifier = await redis.get(`reset:${input.token}`);
    if (!identifier) {
      throw new BadRequestError('Invalid or expired reset token');
    }

    const passwordHash = await bcrypt.hash(input.password, SALT_ROUNDS);

    // Try email first, then phone
    const user = await prisma.user.findFirst({
      where: {
        OR: [{ email: identifier }, { phone: identifier }],
      },
    });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash },
    });

    // Invalidate reset token
    await redis.del(`reset:${input.token}`);

    // Invalidate all existing sessions
    await this.invalidateAllSessions(user.id);

    return { message: 'Password reset successfully' };
  }

  // ─── TOKEN MANAGEMENT ───────────────────────────

  async refreshToken(token: string) {
    try {
      const decoded = jwt.verify(token, env.JWT_REFRESH_SECRET) as JwtPayload;

      // Check if refresh token is still valid in Redis
      const stored = await redis.get(`refresh:${decoded.userId}:${token}`);
      if (!stored) {
        throw new UnauthorizedError('Invalid refresh token');
      }

      // Generate new tokens
      const tokens = this.generateTokens(decoded.userId);

      // Rotate refresh token
      await redis.del(`refresh:${decoded.userId}:${token}`);
      await this.storeRefreshToken(decoded.userId, tokens.refreshToken);

      return tokens;
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        throw new UnauthorizedError('Invalid refresh token');
      }
      throw error;
    }
  }

  async logout(userId: string, refreshToken?: string) {
    if (refreshToken) {
      await redis.del(`refresh:${userId}:${refreshToken}`);
    } else {
      await this.invalidateAllSessions(userId);
    }
    return { message: 'Logged out successfully' };
  }

  // ─── GET CURRENT USER ───────────────────────────

  async getCurrentUser(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        phone: true,
        name: true,
        avatar: true,
        emailVerified: true,
        phoneVerified: true,
        createdAt: true,
        memberships: {
          select: {
            role: true,
            business: {
              select: {
                id: true,
                name: true,
                industry: true,
                onboardingComplete: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    return user;
  }

  // ─── PRIVATE HELPERS ────────────────────────────

  private generateTokens(userId: string) {
    const accessToken = jwt.sign({ userId }, env.JWT_SECRET, {
      expiresIn: env.JWT_ACCESS_EXPIRY,
    } as jwt.SignOptions);

    const refreshToken = jwt.sign({ userId }, env.JWT_REFRESH_SECRET, {
      expiresIn: env.JWT_REFRESH_EXPIRY,
    } as jwt.SignOptions);

    return { accessToken, refreshToken };
  }

  private async storeRefreshToken(userId: string, token: string) {
    // Store in Redis with 7-day expiry
    await redis.set(`refresh:${userId}:${token}`, '1', 'EX', 7 * 24 * 60 * 60);
  }

  private async invalidateAllSessions(userId: string) {
    const keys = await redis.keys(`refresh:${userId}:*`);
    if (keys.length > 0) {
      await redis.del(...keys);
    }
  }
}

export const authService = new AuthService();
