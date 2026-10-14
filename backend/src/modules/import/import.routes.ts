import { Router } from 'express';
import multer from 'multer';
import { importController } from './import.controller.js';
import { authenticate } from '../../middleware/auth.js';
import { authorize } from '../../middleware/rbac.js';

const router = Router({ mergeParams: true });

// Configure multer for file uploads
const upload = multer({
  dest: 'uploads/', // Temporary storage — cleaned up after processing
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
  fileFilter: (_req, file, cb) => {
    const allowedMimes = ['text/csv', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
    if (allowedMimes.includes(file.mimetype) || file.originalname.match(/\.(csv|xlsx)$/i)) {
      cb(null, true);
    } else {
      cb(new Error('Only CSV and XLSX files are allowed'));
    }
  },
});

// All routes require authentication
router.use(authenticate);

router.post(
  '/:businessId/sales',
  authorize('OWNER', 'ACCOUNTANT'),
  upload.single('file'),
  importController.uploadSalesData,
);

export default router;
