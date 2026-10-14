import { z } from 'zod';

export const createBusinessSchema = z.object({
  name: z.string().min(2, 'Business name must be at least 2 characters').max(200),
  industry: z.string().min(1, 'Industry is required'),
  businessType: z.string().min(1, 'Business type is required'),
  businessSize: z.enum(['MICRO', 'SMALL', 'MEDIUM']).default('SMALL'),
  employeeCount: z.coerce.number().int().min(0).default(0),
  branchCount: z.coerce.number().int().min(0).default(0),
  currency: z.string().default('INR'),
  financialYearStart: z.coerce.number().int().min(1).max(12).default(4),
});

export const updateBusinessSchema = createBusinessSchema.partial();

export const inviteMemberSchema = z.object({
  email: z.string().email('Invalid email address').optional(),
  phone: z.string().optional(),
  role: z.enum(['MANAGER', 'ACCOUNTANT', 'VIEWER']),
}).refine(
  (data) => data.email || data.phone,
  { message: 'Either email or phone is required' },
);

export const updateMemberRoleSchema = z.object({
  role: z.enum(['MANAGER', 'ACCOUNTANT', 'VIEWER']),
});

export type CreateBusinessInput = z.infer<typeof createBusinessSchema>;
export type UpdateBusinessInput = z.infer<typeof updateBusinessSchema>;
export type InviteMemberInput = z.infer<typeof inviteMemberSchema>;
