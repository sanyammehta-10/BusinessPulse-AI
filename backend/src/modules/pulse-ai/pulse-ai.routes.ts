import { Router } from 'express';
import { pulseAiController } from './pulse-ai.controller.js';
import { authenticate } from '../../middleware/auth.js';
import { authorize } from '../../middleware/rbac.js';

const router = Router({ mergeParams: true });

// All routes require authentication
router.use(authenticate);

router.post('/ask', authorize('OWNER', 'MANAGER', 'ACCOUNTANT'), pulseAiController.askQuestion);
router.post('/anomalies/detect', authorize('OWNER', 'MANAGER', 'ACCOUNTANT'), pulseAiController.detectAnomalies);

export default router;
