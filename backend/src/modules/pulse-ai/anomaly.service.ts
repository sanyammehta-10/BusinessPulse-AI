import { metricsService } from '../metrics/metrics.service.js';
import { env } from '../../config/env.js';
import axios from 'axios';
import prisma from '../../config/database.js';

export class AnomalyService {
  /**
   * Detects anomalies in revenue for the last 12 months
   */
  async detectRevenueAnomalies(businessId: string) {
    const historicalSeries = await metricsService.getMonthlyTimeSeries(businessId, 12);
    
    // Format for AI service
    const historicalData = historicalSeries.map(s => ({
      date: `${s.month}-01`,
      value: s.revenue
    }));

    if (historicalData.length < 5) {
      return []; // Not enough data for anomaly detection
    }

    try {
      // Native Anomaly Detection using Z-Score (replaces Python IsolationForest for lightweight local dev)
      const values = historicalData.map(d => Number(d.value));
      const mean = values.reduce((a, b) => a + b, 0) / values.length;
      const stdDev = Math.sqrt(values.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / values.length);
      
      // If a value is more than 2 standard deviations from the mean, it's considered an anomaly
      const zScoreThreshold = 2.0;
      
      const anomalies = historicalData.map((data, index) => {
        const val = Number(data.value);
        const zScore = Math.abs((val - mean) / stdDev);
        const isAnomaly = stdDev > 0 && zScore > zScoreThreshold;
        return {
          date: data.date,
          value: val,
          is_anomaly: isAnomaly,
          score: zScore
        };
      }).filter(a => a.is_anomaly);
      
      // Save anomalies as insights/alerts
      for (const anomaly of anomalies) {
        // Check if an alert already exists for this anomaly
        const title = `Revenue Anomaly Detected: ${anomaly.date}`;
        
        const existing = await prisma.alert.findFirst({
          where: { businessId, title }
        });

        if (!existing) {
          await prisma.alert.create({
            data: {
              businessId,
              type: 'ANOMALY',
              title,
              message: `An unexpected revenue value of ${anomaly.value} was detected for ${anomaly.date}. This deviates significantly from your historical trend.`,
              severity: 'WARNING',
            }
          });
        }
      }

      return anomalies;
    } catch (error) {
      console.error('Failed to detect anomalies:', error);
      return [];
    }
  }
}

export const anomalyService = new AnomalyService();
