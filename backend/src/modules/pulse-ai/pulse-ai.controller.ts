import { Request, Response, NextFunction } from 'express';
import { pulseAiService } from './pulse-ai.service.js';
import { anomalyService } from './anomaly.service.js';
import { sendSuccess } from '../../utils/response.js';
import { BadRequestError } from '../../utils/errors.js';

export class PulseAiController {
  
  async askQuestion(req: Request, res: Response, next: NextFunction) {
    try {
      const { question } = req.body;
      const businessId = req.params.businessId as string;

      if (!question) {
        throw new BadRequestError('Question is required');
      }

      const result = await pulseAiService.askQuestion(businessId, question);
      sendSuccess(res, result);
    } catch (error) {
      next(error);
    }
  }

  async detectAnomalies(req: Request, res: Response, next: NextFunction) {
    try {
      const businessId = req.params.businessId as string;
      const anomalies = await anomalyService.detectRevenueAnomalies(businessId);
      sendSuccess(res, anomalies, 'Anomaly detection completed');
    } catch (error) {
      next(error);
    }
  }
}

export const pulseAiController = new PulseAiController();
