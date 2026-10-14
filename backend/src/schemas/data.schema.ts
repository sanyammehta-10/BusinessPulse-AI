import { z } from 'zod';

// ─── SALES ────────────────────────────────────────

export const createSaleSchema = z.object({
  productId: z.string().optional(),
  locationId: z.string().optional(),
  date: z.coerce.date(),
  quantity: z.coerce.number().positive('Quantity must be positive'),
  unitPrice: z.coerce.number().positive('Unit price must be positive'),
  totalAmount: z.coerce.number().positive('Total amount must be positive'),
  customerCategory: z.string().optional(),
});

export const updateSaleSchema = createSaleSchema.partial();

// ─── EXPENSES ─────────────────────────────────────

export const expenseCategories = [
  'SALARY',
  'RENT',
  'MARKETING',
  'UTILITIES',
  'TRANSPORTATION',
  'INVENTORY',
  'MAINTENANCE',
  'INSURANCE',
  'TAXES',
  'OTHER',
] as const;

export const createExpenseSchema = z.object({
  locationId: z.string().optional(),
  category: z.string().min(1, 'Category is required'),
  amount: z.coerce.number().positive('Amount must be positive'),
  date: z.coerce.date(),
  notes: z.string().optional(),
});

export const updateExpenseSchema = createExpenseSchema.partial();

// ─── PRODUCTS ─────────────────────────────────────

export const createProductSchema = z.object({
  name: z.string().min(1, 'Product name is required').max(200),
  category: z.string().optional(),
  costPrice: z.coerce.number().min(0, 'Cost price cannot be negative'),
  sellingPrice: z.coerce.number().min(0, 'Selling price cannot be negative'),
  stockQty: z.coerce.number().int().min(0).default(0),
  unit: z.string().optional(),
});

export const updateProductSchema = createProductSchema.partial();

// ─── EMPLOYEES ────────────────────────────────────

export const createEmployeeSchema = z.object({
  locationId: z.string().optional(),
  name: z.string().min(1, 'Employee name is required').max(200),
  department: z.string().min(1, 'Department is required'),
  designation: z.string().optional(),
  salary: z.coerce.number().positive('Salary must be positive'),
  joiningDate: z.coerce.date(),
});

export const updateEmployeeSchema = createEmployeeSchema.partial();

// ─── LOCATIONS ────────────────────────────────────

export const createLocationSchema = z.object({
  name: z.string().min(1, 'Location name is required').max(200),
  city: z.string().min(1, 'City is required'),
  state: z.string().optional(),
  country: z.string().default('India'),
  type: z.string().optional(),
});

export const updateLocationSchema = createLocationSchema.partial();

// ─── PAGINATION & FILTERS ─────────────────────────

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export const dateRangeSchema = z.object({
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
});

export type CreateSaleInput = z.infer<typeof createSaleSchema>;
export type CreateExpenseInput = z.infer<typeof createExpenseSchema>;
export type CreateProductInput = z.infer<typeof createProductSchema>;
export type CreateEmployeeInput = z.infer<typeof createEmployeeSchema>;
export type CreateLocationInput = z.infer<typeof createLocationSchema>;
export type PaginationInput = z.infer<typeof paginationSchema>;
