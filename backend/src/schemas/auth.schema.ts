import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email address').optional(),
  phone: z
    .string()
    .regex(/^\+?[1-9]\d{9,14}$/, 'Invalid phone number')
    .optional(),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .optional(),
}).refine(
  (data) => data.email || data.phone,
  { message: 'Either email or phone is required' },
).refine(
  (data) => {
    if (data.email && !data.password) return false;
    return true;
  },
  { message: 'Password is required when registering with email', path: ['password'] },
);

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const sendOtpSchema = z.object({
  phone: z
    .string()
    .regex(/^\+?[1-9]\d{9,14}$/, 'Invalid phone number')
    .optional(),
  email: z.string().email('Invalid email address').optional(),
  type: z.enum(['LOGIN', 'VERIFY_EMAIL', 'VERIFY_PHONE', 'RESET_PASSWORD']).default('LOGIN'),
}).refine(
  (data) => data.phone || data.email,
  { message: 'Either phone or email is required' },
);

export const verifyOtpSchema = z.object({
  phone: z.string().optional(),
  email: z.string().email().optional(),
  code: z.string().length(6, 'OTP must be 6 digits'),
  type: z.enum(['LOGIN', 'VERIFY_EMAIL', 'VERIFY_PHONE', 'RESET_PASSWORD']).default('LOGIN'),
}).refine(
  (data) => data.phone || data.email,
  { message: 'Either phone or email is required' },
);

export const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Reset token is required'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string().optional(), // Can also come from cookie
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type SendOtpInput = z.infer<typeof sendOtpSchema>;
export type VerifyOtpInput = z.infer<typeof verifyOtpSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
