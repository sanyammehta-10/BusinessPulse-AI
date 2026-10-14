import prisma from '../config/database.js';
import { NotFoundError } from '../utils/errors.js';
import type {
  CreateSaleInput,
  CreateExpenseInput,
  CreateProductInput,
  CreateEmployeeInput,
  CreateLocationInput,
  PaginationInput,
} from '../schemas/data.schema.js';

export class DataService {
  // ─── SALES ──────────────────────────────────────

  async listSales(
    businessId: string,
    pagination: PaginationInput,
    filters?: { startDate?: Date; endDate?: Date; productId?: string; locationId?: string },
  ) {
    const where: any = { businessId };
    if (filters?.startDate || filters?.endDate) {
      where.date = {};
      if (filters.startDate) where.date.gte = filters.startDate;
      if (filters.endDate) where.date.lte = filters.endDate;
    }
    if (filters?.productId) where.productId = filters.productId;
    if (filters?.locationId) where.locationId = filters.locationId;

    const [data, total] = await Promise.all([
      prisma.sale.findMany({
        where,
        include: {
          product: { select: { id: true, name: true, category: true } },
          location: { select: { id: true, name: true, city: true } },
        },
        orderBy: { date: pagination.sortOrder },
        skip: (pagination.page - 1) * pagination.limit,
        take: pagination.limit,
      }),
      prisma.sale.count({ where }),
    ]);

    return { data, total };
  }

  async createSale(businessId: string, input: CreateSaleInput) {
    return prisma.sale.create({
      data: { ...input, businessId },
      include: {
        product: { select: { id: true, name: true } },
        location: { select: { id: true, name: true } },
      },
    });
  }

  async updateSale(businessId: string, saleId: string, input: Partial<CreateSaleInput>) {
    const sale = await prisma.sale.findFirst({ where: { id: saleId, businessId } });
    if (!sale) throw new NotFoundError('Sale not found');

    return prisma.sale.update({ where: { id: saleId }, data: input });
  }

  async deleteSale(businessId: string, saleId: string) {
    const sale = await prisma.sale.findFirst({ where: { id: saleId, businessId } });
    if (!sale) throw new NotFoundError('Sale not found');

    await prisma.sale.delete({ where: { id: saleId } });
    return { message: 'Sale deleted' };
  }

  // ─── EXPENSES ───────────────────────────────────

  async listExpenses(
    businessId: string,
    pagination: PaginationInput,
    filters?: { startDate?: Date; endDate?: Date; category?: string; locationId?: string },
  ) {
    const where: any = { businessId };
    if (filters?.startDate || filters?.endDate) {
      where.date = {};
      if (filters.startDate) where.date.gte = filters.startDate;
      if (filters.endDate) where.date.lte = filters.endDate;
    }
    if (filters?.category) where.category = filters.category;
    if (filters?.locationId) where.locationId = filters.locationId;

    const [data, total] = await Promise.all([
      prisma.expense.findMany({
        where,
        include: {
          location: { select: { id: true, name: true, city: true } },
        },
        orderBy: { date: pagination.sortOrder },
        skip: (pagination.page - 1) * pagination.limit,
        take: pagination.limit,
      }),
      prisma.expense.count({ where }),
    ]);

    return { data, total };
  }

  async createExpense(businessId: string, input: CreateExpenseInput) {
    return prisma.expense.create({
      data: { ...input, businessId },
      include: {
        location: { select: { id: true, name: true } },
      },
    });
  }

  async updateExpense(businessId: string, expenseId: string, input: Partial<CreateExpenseInput>) {
    const expense = await prisma.expense.findFirst({ where: { id: expenseId, businessId } });
    if (!expense) throw new NotFoundError('Expense not found');

    return prisma.expense.update({ where: { id: expenseId }, data: input });
  }

  async deleteExpense(businessId: string, expenseId: string) {
    const expense = await prisma.expense.findFirst({ where: { id: expenseId, businessId } });
    if (!expense) throw new NotFoundError('Expense not found');

    await prisma.expense.delete({ where: { id: expenseId } });
    return { message: 'Expense deleted' };
  }

  // ─── PRODUCTS ───────────────────────────────────

  async listProducts(businessId: string, pagination: PaginationInput) {
    const [data, total] = await Promise.all([
      prisma.product.findMany({
        where: { businessId },
        orderBy: { name: 'asc' },
        skip: (pagination.page - 1) * pagination.limit,
        take: pagination.limit,
      }),
      prisma.product.count({ where: { businessId } }),
    ]);

    return { data, total };
  }

  async createProduct(businessId: string, input: CreateProductInput) {
    return prisma.product.create({
      data: { ...input, businessId },
    });
  }

  async updateProduct(businessId: string, productId: string, input: Partial<CreateProductInput>) {
    const product = await prisma.product.findFirst({ where: { id: productId, businessId } });
    if (!product) throw new NotFoundError('Product not found');

    return prisma.product.update({ where: { id: productId }, data: input });
  }

  async deleteProduct(businessId: string, productId: string) {
    const product = await prisma.product.findFirst({ where: { id: productId, businessId } });
    if (!product) throw new NotFoundError('Product not found');

    await prisma.product.update({ where: { id: productId }, data: { isActive: false } });
    return { message: 'Product archived' };
  }

  // ─── EMPLOYEES ──────────────────────────────────

  async listEmployees(businessId: string, pagination: PaginationInput) {
    const [data, total] = await Promise.all([
      prisma.employee.findMany({
        where: { businessId, isActive: true },
        include: {
          location: { select: { id: true, name: true, city: true } },
        },
        orderBy: { name: 'asc' },
        skip: (pagination.page - 1) * pagination.limit,
        take: pagination.limit,
      }),
      prisma.employee.count({ where: { businessId, isActive: true } }),
    ]);

    return { data, total };
  }

  async createEmployee(businessId: string, input: CreateEmployeeInput) {
    return prisma.employee.create({
      data: { ...input, businessId },
      include: {
        location: { select: { id: true, name: true } },
      },
    });
  }

  async updateEmployee(businessId: string, employeeId: string, input: Partial<CreateEmployeeInput>) {
    const employee = await prisma.employee.findFirst({ where: { id: employeeId, businessId } });
    if (!employee) throw new NotFoundError('Employee not found');

    return prisma.employee.update({ where: { id: employeeId }, data: input });
  }

  async deleteEmployee(businessId: string, employeeId: string) {
    const employee = await prisma.employee.findFirst({ where: { id: employeeId, businessId } });
    if (!employee) throw new NotFoundError('Employee not found');

    await prisma.employee.update({ where: { id: employeeId }, data: { isActive: false } });
    return { message: 'Employee deactivated' };
  }

  // ─── LOCATIONS ──────────────────────────────────

  async listLocations(businessId: string) {
    return prisma.location.findMany({
      where: { businessId, isActive: true },
      include: {
        _count: {
          select: { sales: true, expenses: true, employees: true },
        },
      },
      orderBy: { name: 'asc' },
    });
  }

  async createLocation(businessId: string, input: CreateLocationInput) {
    return prisma.location.create({
      data: { ...input, businessId },
    });
  }

  async updateLocation(businessId: string, locationId: string, input: Partial<CreateLocationInput>) {
    const location = await prisma.location.findFirst({ where: { id: locationId, businessId } });
    if (!location) throw new NotFoundError('Location not found');

    return prisma.location.update({ where: { id: locationId }, data: input });
  }

  async deleteLocation(businessId: string, locationId: string) {
    const location = await prisma.location.findFirst({ where: { id: locationId, businessId } });
    if (!location) throw new NotFoundError('Location not found');

    await prisma.location.update({ where: { id: locationId }, data: { isActive: false } });
    return { message: 'Location deactivated' };
  }
}

export const dataService = new DataService();
