import { Request, Response, NextFunction } from 'express';
import { dataQualityService } from './data-quality.service.js';
import { sendSuccess } from '../../utils/response.js';

export class DataQualityController {

  async evaluate(req: Request, res: Response, next: NextFunction) {
    try {
      const businessId = req.params.businessId as string;
      const report = await dataQualityService.evaluate(businessId);
      sendSuccess(res, report, 'Data quality evaluated');
    } catch (error) {
      next(error);
    }
  }
}

export const dataQualityController = new DataQualityController();
