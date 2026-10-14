import { Request, Response, NextFunction } from 'express';
import { businessService } from '../services/business.service.js';
import { sendSuccess, sendCreated, sendNoContent } from '../utils/response.js';

export class BusinessController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const business = await businessService.create(req.user!.id, req.body);
      sendCreated(res, business, 'Business created successfully');
    } catch (error) {
      next(error);
    }
  }

  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const businesses = await businessService.listByUser(req.user!.id);
      sendSuccess(res, businesses);
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const business = await businessService.getById(req.params.businessId);
      sendSuccess(res, business);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const business = await businessService.update(req.params.businessId, req.body);
      sendSuccess(res, business, 'Business updated successfully');
    } catch (error) {
      next(error);
    }
  }

  async completeOnboarding(req: Request, res: Response, next: NextFunction) {
    try {
      const business = await businessService.completeOnboarding(req.params.businessId);
      sendSuccess(res, business, 'Onboarding completed');
    } catch (error) {
      next(error);
    }
  }

  async inviteMember(req: Request, res: Response, next: NextFunction) {
    try {
      const member = await businessService.inviteMember(req.params.businessId, req.body);
      sendCreated(res, member, 'Member invited successfully');
    } catch (error) {
      next(error);
    }
  }

  async removeMember(req: Request, res: Response, next: NextFunction) {
    try {
      await businessService.removeMember(
        req.params.businessId,
        req.params.userId,
        req.user!.id,
      );
      sendNoContent(res);
    } catch (error) {
      next(error);
    }
  }

  async updateMemberRole(req: Request, res: Response, next: NextFunction) {
    try {
      const member = await businessService.updateMemberRole(
        req.params.businessId,
        req.params.userId,
        req.body.role,
      );
      sendSuccess(res, member, 'Role updated successfully');
    } catch (error) {
      next(error);
    }
  }
}

export const businessController = new BusinessController();
