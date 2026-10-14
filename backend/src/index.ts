import app from './app.js';
import { env } from './config/env.js';
import { logger } from './middleware/logger.js';
import redis, { bullmqConnection } from './config/redis.js';
import prisma from './config/database.js';
import './modules/forecasting/forecasting.service.js';

async function main() {
  try {
    // Connect to Redis (non-fatal — server can start without it)
    try {
      await Promise.race([
        redis.connect(),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Redis connect timeout')), 5000))
      ]);
      logger.info('✅ Redis connected');
    } catch (redisErr: any) {
      logger.warn(`⚠️  Redis connection failed (${redisErr.message}). Server will start without Redis — some features may be unavailable.`);
    }

    // Connect BullMQ Redis (non-fatal)
    try {
      if (bullmqConnection.status === 'wait') {
        await Promise.race([
          bullmqConnection.connect(),
          new Promise((_, reject) => setTimeout(() => reject(new Error('BullMQ Redis connect timeout')), 5000))
        ]);
      }
      logger.info('✅ BullMQ Redis connected');
    } catch (bmqErr: any) {
      logger.warn(`⚠️  BullMQ Redis connection failed (${bmqErr.message}). Forecasting jobs will be unavailable.`);
    }

    // Test database connection
    await prisma.$connect();
    logger.info('✅ Database connected');

    // Start server
    app.listen(env.PORT, () => {
      logger.info(`🚀 BusinessPulse API running on port ${env.PORT}`);
      logger.info(`📍 Environment: ${env.NODE_ENV}`);
      logger.info(`🔗 Health check: http://localhost:${env.PORT}/health`);
    });
  } catch (error) {
    logger.error(error, 'Failed to start server');
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  logger.info('Shutting down gracefully...');
  await prisma.$disconnect();
  redis.disconnect();
  bullmqConnection.disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  logger.info('Shutting down gracefully...');
  await prisma.$disconnect();
  redis.disconnect();
  process.exit(0);
});

main();
