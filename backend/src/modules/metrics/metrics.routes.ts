import { Router } from 'express';
import { metricsController } from './metrics.controller.js';
import { authenticate } from '../../middleware/auth.js';
import { authorize } from '../../middleware/rbac.js';

const router = Router({ mergeParams: true });

router.use(authenticate);

// All metrics endpoints require at least VIEWER access
router.get('/snapshot', authorize('OWNER', 'MANAGER', 'ACCOUNTANT', 'VIEWER'), metricsController.getSnapshot);
router.get('/expenses/breakdown', authorize('OWNER', 'MANAGER', 'ACCOUNTANT', 'VIEWER'), metricsController.getExpenseBreakdown);
router.get('/revenue/products', authorize('OWNER', 'MANAGER', 'ACCOUNTANT', 'VIEWER'), metricsController.getRevenueByProduct);
router.get('/time-series', authorize('OWNER', 'MANAGER', 'ACCOUNTANT', 'VIEWER'), metricsController.getTimeSeries);

export default router;
