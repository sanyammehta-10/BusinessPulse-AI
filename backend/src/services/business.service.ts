import prisma from '../config/database.js';
import {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
} from '../utils/errors.js';
import type {
  CreateBusinessInput,
  UpdateBusinessInput,
  InviteMemberInput,
} from '../schemas/business.schema.js';

export class BusinessService {
  async create(userId: string, input: CreateBusinessInput) {
    const business = await prisma.business.create({
      data: {
        ...input,
        members: {
          create: {
            userId,
            role: 'OWNER',
          },
        },
      },
      include: {
        members: {
          include: {
            user: {
              select: { id: true, name: true, email: true },
            },
          },
        },
      },
    });

    return business;
  }

  async listByUser(userId: string) {
    const memberships = await prisma.businessMember.findMany({
      where: { userId },
      include: {
        business: {
          select: {
            id: true,
            name: true,
            industry: true,
            businessType: true,
            businessSize: true,
            employeeCount: true,
            branchCount: true,
            currency: true,
            onboardingComplete: true,
            createdAt: true,
          },
        },
      },
      orderBy: { joinedAt: 'desc' },
    });

    return memberships.map((m) => ({
      ...m.business,
      role: m.role,
    }));
  }

  async getById(businessId: string) {
    const business = await prisma.business.findUnique({
      where: { id: businessId },
      include: {
        members: {
          include: {
            user: {
              select: { id: true, name: true, email: true, phone: true },
            },
          },
        },
        locations: { where: { isActive: true } },
        _count: {
          select: {
            products: true,
            employees: true,
            sales: true,
            expenses: true,
          },
        },
      },
    });

    if (!business) {
      throw new NotFoundError('Business not found');
    }

    return business;
  }

  async update(businessId: string, input: UpdateBusinessInput) {
    const business = await prisma.business.update({
      where: { id: businessId },
      data: input,
    });

    return business;
  }

  async completeOnboarding(businessId: string) {
    return prisma.business.update({
      where: { id: businessId },
      data: { onboardingComplete: true },
    });
  }

  async inviteMember(businessId: string, input: InviteMemberInput) {
    // Find user by email or phone
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          ...(input.email ? [{ email: input.email }] : []),
          ...(input.phone ? [{ phone: input.phone }] : []),
        ],
      },
    });

    if (!user) {
      throw new NotFoundError(
        'No user found with this email/phone. They need to register first.',
      );
    }

    // Check if already a member
    const existing = await prisma.businessMember.findUnique({
      where: {
        userId_businessId: {
          userId: user.id,
          businessId,
        },
      },
    });

    if (existing) {
      throw new BadRequestError('This user is already a member of this business');
    }

    const member = await prisma.businessMember.create({
      data: {
        userId: user.id,
        businessId,
        role: input.role,
      },
      include: {
        user: {
          select: { id: true, name: true, email: true, phone: true },
        },
      },
    });

    return member;
  }

  async removeMember(businessId: string, targetUserId: string, requestingUserId: string) {
    if (targetUserId === requestingUserId) {
      throw new BadRequestError('You cannot remove yourself');
    }

    // Check target is not the owner
    const targetMember = await prisma.businessMember.findUnique({
      where: {
        userId_businessId: {
          userId: targetUserId,
          businessId,
        },
      },
    });

    if (!targetMember) {
      throw new NotFoundError('Member not found');
    }

    if (targetMember.role === 'OWNER') {
      throw new ForbiddenError('Cannot remove the business owner');
    }

    await prisma.businessMember.delete({
      where: { id: targetMember.id },
    });

    return { message: 'Member removed successfully' };
  }

  async updateMemberRole(businessId: string, targetUserId: string, role: string) {
    const member = await prisma.businessMember.findUnique({
      where: {
        userId_businessId: {
          userId: targetUserId,
          businessId,
        },
      },
    });

    if (!member) {
      throw new NotFoundError('Member not found');
    }

    if (member.role === 'OWNER') {
      throw new ForbiddenError('Cannot change the owner\'s role');
    }

    return prisma.businessMember.update({
      where: { id: member.id },
      data: { role: role as any },
    });
  }
}

export const businessService = new BusinessService();
