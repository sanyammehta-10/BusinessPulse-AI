import { Router } from 'express';
import { businessController } from '../controllers/business.controller.js';
import { validate } from '../middleware/validate.js';
import { authenticate } from '../middleware/auth.js';
import { authorize } from '../middleware/rbac.js';
import {
  createBusinessSchema,
  updateBusinessSchema,
  inviteMemberSchema,
  updateMemberRoleSchema,
} from '../schemas/business.schema.js';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Business CRUD
router.post('/', validate(createBusinessSchema), businessController.create);
router.get('/', businessController.list);

// Business-specific routes (require membership)
router.get('/:businessId', authorize('OWNER', 'MANAGER', 'ACCOUNTANT', 'VIEWER'), businessController.getById);
router.patch('/:businessId', authorize('OWNER'), validate(updateBusinessSchema), businessController.update);
router.post('/:businessId/complete-onboarding', authorize('OWNER'), businessController.completeOnboarding);

// Member management (owner only)
router.post('/:businessId/members', authorize('OWNER'), validate(inviteMemberSchema), businessController.inviteMember);
router.delete('/:businessId/members/:userId', authorize('OWNER'), businessController.removeMember);
router.patch('/:businessId/members/:userId', authorize('OWNER'), validate(updateMemberRoleSchema), businessController.updateMemberRole);

export default router;
