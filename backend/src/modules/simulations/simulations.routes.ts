import { Router } from 'express';
import { simulationsController } from './simulations.controller.js';
import { authenticate } from '../../middleware/auth.js';
import { requireMembership } from '../../middleware/rbac.js';

const router = Router({ mergeParams: true });

// all routes require authentication and business membership
router.use(authenticate, requireMembership());

// Extract a decision from text and create a draft
router.post('/extract', simulationsController.extractDecision);

// Run the simulation
router.post('/:decisionId/run', simulationsController.runSimulation);

export default router;
