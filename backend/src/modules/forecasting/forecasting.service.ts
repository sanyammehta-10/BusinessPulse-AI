import { Queue, Worker, Job } from 'bullmq';
import { bullmqConnection } from '../../config/redis.js';
import prisma from '../../config/database.js';
import { env } from '../../config/env.js';
import { metricsService } from '../metrics/metrics.service.js';
import { PredictionType } from '@prisma/client';
import axios from 'axios';

// ─── Queue Setup ───────────────────────────────────────────

export const forecastingQueue = new Queue('forecasting', { connection: bullmqConnection });

interface ForecastJobData {
  businessId: string;
  userId: string;
  months: number;
}

// ─── Service ───────────────────────────────────────────────

export class ForecastingService {
  /**
   * Triggers a new forecast prediction job
   */
  async requestForecast(businessId: string, userId: string, months: number = 12) {
    // Add job to queue
    const job = await forecastingQueue.add('generate-forecast', {
      businessId,
      userId,
      months,
    } as ForecastJobData);

    return { jobId: job.id, status: 'PROCESSING' };
  }

  /**
   * Retrieves the latest completed forecast
   */
  async getLatestForecast(businessId: string) {
    return prisma.prediction.findMany({
      where: {
        businessId,
        type: PredictionType.SALES,
      },
      orderBy: {
        period: 'asc' // period is YYYY-MM-DD string
      }
    });
  }
}

export const forecastingService = new ForecastingService();

// ─── Worker ────────────────────────────────────────────────

export const forecastingWorker = new Worker('forecasting', async (job: Job) => {
  const { businessId, months } = job.data as ForecastJobData;
  
  try {
    // 1. Get historical data from Canonical Metrics Service
    // We get more months of history than requested to predict better
    const historicalSeries = await metricsService.getMonthlyTimeSeries(businessId, 24);
    
    // Format for AI service
    const historicalData = historicalSeries.map(s => ({
      date: `${s.month}-01`,
      value: s.revenue
    }));

    if (historicalData.length < 3) {
      throw new Error('Not enough historical data to generate forecast');
    }

    // 2. Native TypeScript Forecasting (Simple Exponential Smoothing with Trend)
    // Replaces Python Prophet for lightweight local dev without C++ compilers
    const forecastResult = [];
    const values = historicalData.map(d => Number(d.value));
    
    // Simple Holt's Linear Trend method
    let level = values[0];
    let trend = values[1] - values[0];
    const alpha = 0.4; // Data smoothing factor
    const beta = 0.3; // Trend smoothing factor
    
    // Fit historical
    for (let i = 1; i < values.length; i++) {
      const lastLevel = level;
      level = alpha * values[i] + (1 - alpha) * (level + trend);
      trend = beta * (level - lastLevel) + (1 - beta) * trend;
    }
    
    // Project future periods
    const lastDateStr = historicalData[historicalData.length - 1].date;
    const lastDate = new Date(lastDateStr);
    
    for (let i = 1; i <= months; i++) {
      const forecastValue = level + (i * trend);
      
      const nextDate = new Date(lastDate);
      nextDate.setMonth(nextDate.getMonth() + i);
      const year = nextDate.getFullYear();
      const month = String(nextDate.getMonth() + 1).padStart(2, '0');
      
      forecastResult.push({
        date: `${year}-${month}-01`,
        predicted_value: Math.max(0, forecastValue),
        lower_bound: Math.max(0, forecastValue * 0.9), // 10% margin
        upper_bound: forecastValue * 1.1
      });
    }

    // 3. Save result (delete old predictions of this type first to keep it clean)
    await prisma.prediction.deleteMany({
      where: {
        businessId,
        type: PredictionType.SALES
      }
    });

    // Create new predictions
    const predictionsData = forecastResult.map((p: any) => ({
      businessId,
      type: PredictionType.SALES,
      period: p.date,
      predictedValue: p.predicted_value,
      confidence: 80, // Statistical confidence
      modelUsed: 'Native_Holt_Linear',
      metadata: { lower_bound: p.lower_bound, upper_bound: p.upper_bound }
    }));

    await prisma.prediction.createMany({
      data: predictionsData
    });

    return forecastResult;
  } catch (error: any) {
    throw error;
  }
}, { connection: bullmqConnection });

forecastingWorker.on('completed', job => {
  console.log(`[Forecasting] Job ${job.id} completed successfully`);
});

forecastingWorker.on('failed', (job, err) => {
  console.error(`[Forecasting] Job ${job?.id} failed with ${err.message}`);
});
