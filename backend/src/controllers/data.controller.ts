import { Request, Response, NextFunction } from 'express';
import { dataService } from '../services/data.service.js';
import { sendSuccess, sendCreated, sendNoContent, sendPaginated } from '../utils/response.js';

export class DataController {
  // ─── SALES ──────────────────────────────────────

  async listSales(req: Request, res: Response, next: NextFunction) {
    try {
      const { page = 1, limit = 20, sortOrder = 'desc', startDate, endDate, productId, locationId } = req.query as any;
      const result = await dataService.listSales(
        req.params.businessId,
        { page: Number(page), limit: Number(limit), sortOrder },
        { startDate, endDate, productId, locationId },
      );
      sendPaginated(res, result.data, result.total, Number(page), Number(limit));
    } catch (error) {
      next(error);
    }
  }

  async createSale(req: Request, res: Response, next: NextFunction) {
    try {
      const sale = await dataService.createSale(req.params.businessId, req.body);
      sendCreated(res, sale);
    } catch (error) {
      next(error);
    }
  }

  async updateSale(req: Request, res: Response, next: NextFunction) {
    try {
      const sale = await dataService.updateSale(req.params.businessId, req.params.saleId, req.body);
      sendSuccess(res, sale);
    } catch (error) {
      next(error);
    }
  }

  async deleteSale(req: Request, res: Response, next: NextFunction) {
    try {
      await dataService.deleteSale(req.params.businessId, req.params.saleId);
      sendNoContent(res);
    } catch (error) {
      next(error);
    }
  }

  // ─── EXPENSES ───────────────────────────────────

  async listExpenses(req: Request, res: Response, next: NextFunction) {
    try {
      const { page = 1, limit = 20, sortOrder = 'desc', startDate, endDate, category, locationId } = req.query as any;
      const result = await dataService.listExpenses(
        req.params.businessId,
        { page: Number(page), limit: Number(limit), sortOrder },
        { startDate, endDate, category, locationId },
      );
      sendPaginated(res, result.data, result.total, Number(page), Number(limit));
    } catch (error) {
      next(error);
    }
  }

  async createExpense(req: Request, res: Response, next: NextFunction) {
    try {
      const expense = await dataService.createExpense(req.params.businessId, req.body);
      sendCreated(res, expense);
    } catch (error) {
      next(error);
    }
  }

  async updateExpense(req: Request, res: Response, next: NextFunction) {
    try {
      const expense = await dataService.updateExpense(req.params.businessId, req.params.expenseId, req.body);
      sendSuccess(res, expense);
    } catch (error) {
      next(error);
    }
  }

  async deleteExpense(req: Request, res: Response, next: NextFunction) {
    try {
      await dataService.deleteExpense(req.params.businessId, req.params.expenseId);
      sendNoContent(res);
    } catch (error) {
      next(error);
    }
  }

  // ─── PRODUCTS ───────────────────────────────────

  async listProducts(req: Request, res: Response, next: NextFunction) {
    try {
      const { page = 1, limit = 20 } = req.query as any;
      const result = await dataService.listProducts(req.params.businessId, { page: Number(page), limit: Number(limit) });
      sendPaginated(res, result.data, result.total, Number(page), Number(limit));
    } catch (error) {
      next(error);
    }
  }

  async createProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const product = await dataService.createProduct(req.params.businessId, req.body);
      sendCreated(res, product);
    } catch (error) {
      next(error);
    }
  }

  async updateProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const product = await dataService.updateProduct(req.params.businessId, req.params.productId, req.body);
      sendSuccess(res, product);
    } catch (error) {
      next(error);
    }
  }

  async deleteProduct(req: Request, res: Response, next: NextFunction) {
    try {
      await dataService.deleteProduct(req.params.businessId, req.params.productId);
      sendNoContent(res);
    } catch (error) {
      next(error);
    }
  }

  // ─── EMPLOYEES ──────────────────────────────────

  async listEmployees(req: Request, res: Response, next: NextFunction) {
    try {
      const { page = 1, limit = 20 } = req.query as any;
      const result = await dataService.listEmployees(req.params.businessId, { page: Number(page), limit: Number(limit) });
      sendPaginated(res, result.data, result.total, Number(page), Number(limit));
    } catch (error) {
      next(error);
    }
  }

  async createEmployee(req: Request, res: Response, next: NextFunction) {
    try {
      const employee = await dataService.createEmployee(req.params.businessId, req.body);
      sendCreated(res, employee);
    } catch (error) {
      next(error);
    }
  }

  async updateEmployee(req: Request, res: Response, next: NextFunction) {
    try {
      const employee = await dataService.updateEmployee(req.params.businessId, req.params.employeeId, req.body);
      sendSuccess(res, employee);
    } catch (error) {
      next(error);
    }
  }

  async deleteEmployee(req: Request, res: Response, next: NextFunction) {
    try {
      await dataService.deleteEmployee(req.params.businessId, req.params.employeeId);
      sendNoContent(res);
    } catch (error) {
      next(error);
    }
  }

  // ─── LOCATIONS ──────────────────────────────────

  async listLocations(req: Request, res: Response, next: NextFunction) {
    try {
      const locations = await dataService.listLocations(req.params.businessId);
      sendSuccess(res, locations);
    } catch (error) {
      next(error);
    }
  }

  async createLocation(req: Request, res: Response, next: NextFunction) {
    try {
      const location = await dataService.createLocation(req.params.businessId, req.body);
      sendCreated(res, location);
    } catch (error) {
      next(error);
    }
  }

  async updateLocation(req: Request, res: Response, next: NextFunction) {
    try {
      const location = await dataService.updateLocation(req.params.businessId, req.params.locationId, req.body);
      sendSuccess(res, location);
    } catch (error) {
      next(error);
    }
  }

  async deleteLocation(req: Request, res: Response, next: NextFunction) {
    try {
      await dataService.deleteLocation(req.params.businessId, req.params.locationId);
      sendNoContent(res);
    } catch (error) {
      next(error);
    }
  }
}

export const dataController = new DataController();
