import { Request, Response, NextFunction } from 'express';
import { metricsService, MetricPeriod } from './metrics.service.js';
import { sendSuccess } from '../../utils/response.js';

export class MetricsController {

  async getSnapshot(req: Request, res: Response, next: NextFunction) {
    try {
      const businessId = req.params.businessId as string;
      const { startDate, endDate } = req.query;

      let period: MetricPeriod | undefined;
      if (startDate && endDate) {
        period = {
          startDate: new Date(startDate as string),
          endDate: new Date(endDate as string),
        };
      }

      const snapshot = await metricsService.getSnapshot(businessId, period);
      sendSuccess(res, snapshot, 'Business metrics calculated successfully');
    } catch (error) {
      next(error);
    }
  }

  async getExpenseBreakdown(req: Request, res: Response, next: NextFunction) {
    try {
      const businessId = req.params.businessId as string;
      const { startDate, endDate } = req.query;

      let period: MetricPeriod | undefined;
      if (startDate && endDate) {
        period = {
          startDate: new Date(startDate as string),
          endDate: new Date(endDate as string),
        };
      }

      const breakdown = await metricsService.getExpenseBreakdown(businessId, period);
      sendSuccess(res, breakdown, 'Expense breakdown calculated');
    } catch (error) {
      next(error);
    }
  }

  async getRevenueByProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const businessId = req.params.businessId as string;
      const { startDate, endDate } = req.query;

      let period: MetricPeriod | undefined;
      if (startDate && endDate) {
        period = {
          startDate: new Date(startDate as string),
          endDate: new Date(endDate as string),
        };
      }

      const breakdown = await metricsService.getRevenueByProduct(businessId, period);
      sendSuccess(res, breakdown, 'Revenue by product calculated');
    } catch (error) {
      next(error);
    }
  }

  async getTimeSeries(req: Request, res: Response, next: NextFunction) {
    try {
      const businessId = req.params.businessId as string;
      const months = parseInt(req.query.months as string) || 12;

      const series = await metricsService.getMonthlyTimeSeries(businessId, months);
      sendSuccess(res, series, 'Monthly time series retrieved');
    } catch (error) {
      next(error);
    }
  }
}

export const metricsController = new MetricsController();
