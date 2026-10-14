import { Router } from 'express';
import { forecastingController } from './forecasting.controller.js';
import { authenticate } from '../../middleware/auth.js';
import { authorize } from '../../middleware/rbac.js';

const router = Router({ mergeParams: true });

router.use(authenticate);

router.post('/request', authorize('OWNER', 'MANAGER', 'ACCOUNTANT'), forecastingController.requestForecast);
router.get('/latest', authorize('OWNER', 'MANAGER', 'ACCOUNTANT', 'VIEWER'), forecastingController.getLatestForecast);

export default router;
