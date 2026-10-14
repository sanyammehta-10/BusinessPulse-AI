import { Request, Response, NextFunction } from 'express';
import { forecastingService } from './forecasting.service.js';
import { sendSuccess } from '../../utils/response.js';

export class ForecastingController {

  async requestForecast(req: Request, res: Response, next: NextFunction) {
    try {
      const businessId = req.params.businessId as string;
      const userId = req.user!.id;
      const months = parseInt(req.body.months) || 12;

      const prediction = await forecastingService.requestForecast(businessId, userId, months);
      sendSuccess(res, prediction, 'Forecast request queued successfully', 202);
    } catch (error) {
      next(error);
    }
  }

  async getLatestForecast(req: Request, res: Response, next: NextFunction) {
    try {
      const businessId = req.params.businessId as string;
      const forecast = await forecastingService.getLatestForecast(businessId);
      
      if (!forecast) {
        // Return null data if no forecast exists, allowing frontend to prompt generation
        return sendSuccess(res, null, 'No forecast found');
      }

      sendSuccess(res, forecast, 'Latest forecast retrieved successfully');
    } catch (error) {
      next(error);
    }
  }
}

export const forecastingController = new ForecastingController();
