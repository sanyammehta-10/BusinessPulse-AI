import { Router } from 'express';
import { dataQualityController } from './data-quality.controller.js';
import { authenticate } from '../../middleware/auth.js';
import { authorize } from '../../middleware/rbac.js';

const router = Router({ mergeParams: true });

router.use(authenticate);

router.get('/score', authorize('OWNER', 'MANAGER', 'ACCOUNTANT', 'VIEWER'), dataQualityController.evaluate);

export default router;
