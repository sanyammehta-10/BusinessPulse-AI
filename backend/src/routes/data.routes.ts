import { Router } from 'express';
import { dataController } from '../controllers/data.controller.js';
import { validate } from '../middleware/validate.js';
import { authenticate } from '../middleware/auth.js';
import { authorize } from '../middleware/rbac.js';
import {
  createSaleSchema,
  updateSaleSchema,
  createExpenseSchema,
  updateExpenseSchema,
  createProductSchema,
  updateProductSchema,
  createEmployeeSchema,
  updateEmployeeSchema,
  createLocationSchema,
  updateLocationSchema,
} from '../schemas/data.schema.js';

const router = Router({ mergeParams: true });

// All routes require authentication
router.use(authenticate);

// ─── SALES ────────────────────────────────────────
router.get('/sales', authorize('OWNER', 'MANAGER', 'VIEWER'), dataController.listSales);
router.post('/sales', authorize('OWNER', 'ACCOUNTANT'), validate(createSaleSchema), dataController.createSale);
router.patch('/sales/:saleId', authorize('OWNER', 'ACCOUNTANT'), validate(updateSaleSchema), dataController.updateSale);
router.delete('/sales/:saleId', authorize('OWNER', 'ACCOUNTANT'), dataController.deleteSale);

// ─── EXPENSES ─────────────────────────────────────
router.get('/expenses', authorize('OWNER', 'MANAGER', 'VIEWER'), dataController.listExpenses);
router.post('/expenses', authorize('OWNER', 'ACCOUNTANT'), validate(createExpenseSchema), dataController.createExpense);
router.patch('/expenses/:expenseId', authorize('OWNER', 'ACCOUNTANT'), validate(updateExpenseSchema), dataController.updateExpense);
router.delete('/expenses/:expenseId', authorize('OWNER', 'ACCOUNTANT'), dataController.deleteExpense);

// ─── PRODUCTS ─────────────────────────────────────
router.get('/products', authorize('OWNER', 'MANAGER', 'VIEWER'), dataController.listProducts);
router.post('/products', authorize('OWNER', 'ACCOUNTANT'), validate(createProductSchema), dataController.createProduct);
router.patch('/products/:productId', authorize('OWNER', 'ACCOUNTANT'), validate(updateProductSchema), dataController.updateProduct);
router.delete('/products/:productId', authorize('OWNER'), dataController.deleteProduct);

// ─── EMPLOYEES ────────────────────────────────────
router.get('/employees', authorize('OWNER', 'MANAGER', 'VIEWER'), dataController.listEmployees);
router.post('/employees', authorize('OWNER', 'ACCOUNTANT'), validate(createEmployeeSchema), dataController.createEmployee);
router.patch('/employees/:employeeId', authorize('OWNER', 'ACCOUNTANT'), validate(updateEmployeeSchema), dataController.updateEmployee);
router.delete('/employees/:employeeId', authorize('OWNER'), dataController.deleteEmployee);

// ─── LOCATIONS ────────────────────────────────────
router.get('/locations', authorize('OWNER', 'MANAGER', 'VIEWER'), dataController.listLocations);
router.post('/locations', authorize('OWNER'), validate(createLocationSchema), dataController.createLocation);
router.patch('/locations/:locationId', authorize('OWNER'), validate(updateLocationSchema), dataController.updateLocation);
router.delete('/locations/:locationId', authorize('OWNER'), dataController.deleteLocation);

export default router;
