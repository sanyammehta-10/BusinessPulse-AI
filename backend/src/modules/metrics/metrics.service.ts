// ─────────────────────────────────────────────────────────────
// BusinessPulse AI — Canonical Business Metrics Service
// ─────────────────────────────────────────────────────────────
// This is the SINGLE SOURCE OF TRUTH for all business metric
// calculations. Dashboards, reports, forecasts, and the
// decision simulator MUST consume metrics from this service.
// No frontend page or AI module should calculate metrics
// independently.
// ─────────────────────────────────────────────────────────────

import prisma from '../../config/database.js';
import { Decimal } from '@prisma/client/runtime/library';

// ─── Types ────────────────────────────────────────────────

export interface MetricPeriod {
  startDate: Date;
  endDate: Date;
}

export interface MetricValue {
  value: number;
  /** Previous period value for comparison (null if not enough history) */
  previousValue: number | null;
  /** Percentage change from previous period */
  changePercent: number | null;
  /** Direction of change */
  trend: 'up' | 'down' | 'flat' | null;
  /** The period over which this metric was calculated */
  period: MetricPeriod;
  /** Currency code (e.g. INR) — only set for monetary metrics */
  currency?: string;
}

export interface BusinessMetricsSnapshot {
  // ─── Revenue & Sales ──────────────────────
  totalRevenue: MetricValue;
  totalSalesCount: MetricValue;
  averageOrderValue: MetricValue;

  // ─── Cost & Expenses ─────────────────────
  totalExpenses: MetricValue;
  costOfGoodsSold: MetricValue;
  operatingExpenses: MetricValue;

  // ─── Profitability ────────────────────────
  grossProfit: MetricValue;
  grossMargin: MetricValue;
  netProfit: MetricValue;
  netProfitMargin: MetricValue;

  // ─── Growth ───────────────────────────────
  revenueGrowth: MetricValue;
  expenseGrowth: MetricValue;
  profitGrowth: MetricValue;

  // ─── Employee Metrics ─────────────────────
  totalEmployeeCost: MetricValue;
  revenuePerEmployee: MetricValue;
  profitPerEmployee: MetricValue;
  employeeCount: MetricValue;

  // ─── Cash Flow (simplified) ───────────────
  cashInflow: MetricValue;
  cashOutflow: MetricValue;
  netCashFlow: MetricValue;
  burnRate: MetricValue;
  runway: MetricValue;

  // ─── Meta ─────────────────────────────────
  calculatedAt: string;
  businessId: string;
  period: MetricPeriod;
  previousPeriod: MetricPeriod;
}

// ─── Helpers ──────────────────────────────────────────────

function toNumber(val: Decimal | null | undefined): number {
  if (val === null || val === undefined) return 0;
  return typeof val === 'number' ? val : Number(val);
}

function calcChange(current: number, previous: number): { changePercent: number | null; trend: 'up' | 'down' | 'flat' | null } {
  if (previous === 0) {
    return { changePercent: current > 0 ? 100 : null, trend: current > 0 ? 'up' : null };
  }
  const pct = ((current - previous) / Math.abs(previous)) * 100;
  const rounded = Math.round(pct * 100) / 100; // 2 decimal places
  return {
    changePercent: rounded,
    trend: rounded > 0.5 ? 'up' : rounded < -0.5 ? 'down' : 'flat',
  };
}

function buildMetric(
  current: number,
  previous: number | null,
  period: MetricPeriod,
  currency?: string,
): MetricValue {
  const { changePercent, trend } = previous !== null
    ? calcChange(current, previous)
    : { changePercent: null, trend: null };

  return {
    value: Math.round(current * 100) / 100,
    previousValue: previous !== null ? Math.round(previous * 100) / 100 : null,
    changePercent,
    trend,
    period,
    ...(currency ? { currency } : {}),
  };
}

function getPreviousPeriod(period: MetricPeriod): MetricPeriod {
  const durationMs = period.endDate.getTime() - period.startDate.getTime();
  return {
    startDate: new Date(period.startDate.getTime() - durationMs),
    endDate: new Date(period.startDate.getTime() - 1), // 1ms before current period start
  };
}

// ─── Service ──────────────────────────────────────────────

export class MetricsService {

  /**
   * Compute the full canonical business metrics snapshot for a given period.
   *
   * @param businessId - The business to calculate metrics for
   * @param period     - The date range. Defaults to last 30 days.
   */
  async getSnapshot(
    businessId: string,
    period?: MetricPeriod,
  ): Promise<BusinessMetricsSnapshot> {
    const now = new Date();
    const currentPeriod: MetricPeriod = period ?? {
      startDate: new Date(now.getFullYear(), now.getMonth(), 1), // first of current month
      endDate: now,
    };
    const prevPeriod = getPreviousPeriod(currentPeriod);

    // Fetch business info
    const business = await prisma.business.findUnique({
      where: { id: businessId },
      select: { currency: true },
    });
    const currency = business?.currency ?? 'INR';

    // Parallel data fetching for current and previous periods
    const [
      currentSalesAgg,
      previousSalesAgg,
      currentSalesCount,
      previousSalesCount,
      currentExpensesAgg,
      previousExpensesAgg,
      currentCogsAgg,
      previousCogsAgg,
      currentOpexAgg,
      previousOpexAgg,
      currentSalaryAgg,
      previousSalaryAgg,
      activeEmployeeCount,
      previousEmployeeCount,
    ] = await Promise.all([
      // ─── Revenue (current) ─────────────────
      prisma.sale.aggregate({
        where: { businessId, date: { gte: currentPeriod.startDate, lte: currentPeriod.endDate } },
        _sum: { totalAmount: true },
      }),
      // ─── Revenue (previous) ────────────────
      prisma.sale.aggregate({
        where: { businessId, date: { gte: prevPeriod.startDate, lte: prevPeriod.endDate } },
        _sum: { totalAmount: true },
      }),
      // ─── Sales count (current) ─────────────
      prisma.sale.count({
        where: { businessId, date: { gte: currentPeriod.startDate, lte: currentPeriod.endDate } },
      }),
      // ─── Sales count (previous) ────────────
      prisma.sale.count({
        where: { businessId, date: { gte: prevPeriod.startDate, lte: prevPeriod.endDate } },
      }),
      // ─── Total Expenses (current) ──────────
      prisma.expense.aggregate({
        where: { businessId, date: { gte: currentPeriod.startDate, lte: currentPeriod.endDate } },
        _sum: { amount: true },
      }),
      // ─── Total Expenses (previous) ─────────
      prisma.expense.aggregate({
        where: { businessId, date: { gte: prevPeriod.startDate, lte: prevPeriod.endDate } },
        _sum: { amount: true },
      }),
      // ─── COGS = INVENTORY category expenses (current)
      prisma.expense.aggregate({
        where: { businessId, category: 'INVENTORY', date: { gte: currentPeriod.startDate, lte: currentPeriod.endDate } },
        _sum: { amount: true },
      }),
      // ─── COGS (previous) ──────────────────
      prisma.expense.aggregate({
        where: { businessId, category: 'INVENTORY', date: { gte: prevPeriod.startDate, lte: prevPeriod.endDate } },
        _sum: { amount: true },
      }),
      // ─── OPEX = all expenses except INVENTORY and SALARY (current)
      prisma.expense.aggregate({
        where: {
          businessId,
          category: { notIn: ['INVENTORY', 'SALARY'] },
          date: { gte: currentPeriod.startDate, lte: currentPeriod.endDate },
        },
        _sum: { amount: true },
      }),
      // ─── OPEX (previous) ──────────────────
      prisma.expense.aggregate({
        where: {
          businessId,
          category: { notIn: ['INVENTORY', 'SALARY'] },
          date: { gte: prevPeriod.startDate, lte: prevPeriod.endDate },
        },
        _sum: { amount: true },
      }),
      // ─── Salary expenses (current) ────────
      prisma.expense.aggregate({
        where: { businessId, category: 'SALARY', date: { gte: currentPeriod.startDate, lte: currentPeriod.endDate } },
        _sum: { amount: true },
      }),
      // ─── Salary expenses (previous) ───────
      prisma.expense.aggregate({
        where: { businessId, category: 'SALARY', date: { gte: prevPeriod.startDate, lte: prevPeriod.endDate } },
        _sum: { amount: true },
      }),
      // ─── Active employees (current) ───────
      prisma.employee.count({
        where: { businessId, isActive: true },
      }),
      // ─── Employees that were active at previous period end
      prisma.employee.count({
        where: { businessId, isActive: true, joiningDate: { lte: prevPeriod.endDate } },
      }),
    ]);

    // ─── Extract numbers ──────────────────────────────
    const curRevenue = toNumber(currentSalesAgg._sum.totalAmount);
    const prevRevenue = toNumber(previousSalesAgg._sum.totalAmount);
    const curSalesN = currentSalesCount;
    const prevSalesN = previousSalesCount;
    const curExpenses = toNumber(currentExpensesAgg._sum.amount);
    const prevExpenses = toNumber(previousExpensesAgg._sum.amount);
    const curCogs = toNumber(currentCogsAgg._sum.amount);
    const prevCogs = toNumber(previousCogsAgg._sum.amount);
    const curOpex = toNumber(currentOpexAgg._sum.amount);
    const prevOpex = toNumber(previousOpexAgg._sum.amount);
    const curSalary = toNumber(currentSalaryAgg._sum.amount);
    const prevSalary = toNumber(previousSalaryAgg._sum.amount);
    const curEmpCount = activeEmployeeCount;
    const prevEmpCount = previousEmployeeCount;

    // ─── Derived calculations ─────────────────────────
    const curGrossProfit = curRevenue - curCogs;
    const prevGrossProfit = prevRevenue - prevCogs;
    const curGrossMargin = curRevenue > 0 ? (curGrossProfit / curRevenue) * 100 : 0;
    const prevGrossMargin = prevRevenue > 0 ? (prevGrossProfit / prevRevenue) * 100 : 0;
    const curNetProfit = curRevenue - curExpenses;
    const prevNetProfit = prevRevenue - prevExpenses;
    const curNetMargin = curRevenue > 0 ? (curNetProfit / curRevenue) * 100 : 0;
    const prevNetMargin = prevRevenue > 0 ? (prevNetProfit / prevRevenue) * 100 : 0;
    const curAvgOrder = curSalesN > 0 ? curRevenue / curSalesN : 0;
    const prevAvgOrder = prevSalesN > 0 ? prevRevenue / prevSalesN : 0;
    const curRevenuePerEmp = curEmpCount > 0 ? curRevenue / curEmpCount : 0;
    const prevRevenuePerEmp = prevEmpCount > 0 ? prevRevenue / prevEmpCount : 0;
    const curProfitPerEmp = curEmpCount > 0 ? curNetProfit / curEmpCount : 0;
    const prevProfitPerEmp = prevEmpCount > 0 ? prevNetProfit / prevEmpCount : 0;

    // Burn rate = monthly expenses if net profit is negative
    const curBurnRate = curNetProfit < 0 ? curExpenses : 0;
    const prevBurnRate = prevNetProfit < 0 ? prevExpenses : 0;

    // Runway = if burning, how many months of cash remaining?
    // Simplified: we don't track actual cash balance, so estimate from net cash flow
    const curRunway = curBurnRate > 0 ? Math.max(0, curRevenue / curBurnRate) : Infinity;
    const prevRunway = prevBurnRate > 0 ? Math.max(0, prevRevenue / prevBurnRate) : Infinity;

    // ─── Build snapshot ───────────────────────────────
    return {
      totalRevenue: buildMetric(curRevenue, prevRevenue, currentPeriod, currency),
      totalSalesCount: buildMetric(curSalesN, prevSalesN, currentPeriod),
      averageOrderValue: buildMetric(curAvgOrder, prevAvgOrder, currentPeriod, currency),

      totalExpenses: buildMetric(curExpenses, prevExpenses, currentPeriod, currency),
      costOfGoodsSold: buildMetric(curCogs, prevCogs, currentPeriod, currency),
      operatingExpenses: buildMetric(curOpex, prevOpex, currentPeriod, currency),

      grossProfit: buildMetric(curGrossProfit, prevGrossProfit, currentPeriod, currency),
      grossMargin: buildMetric(curGrossMargin, prevGrossMargin, currentPeriod),
      netProfit: buildMetric(curNetProfit, prevNetProfit, currentPeriod, currency),
      netProfitMargin: buildMetric(curNetMargin, prevNetMargin, currentPeriod),

      revenueGrowth: buildMetric(
        calcChange(curRevenue, prevRevenue).changePercent ?? 0,
        null,
        currentPeriod,
      ),
      expenseGrowth: buildMetric(
        calcChange(curExpenses, prevExpenses).changePercent ?? 0,
        null,
        currentPeriod,
      ),
      profitGrowth: buildMetric(
        calcChange(curNetProfit, prevNetProfit).changePercent ?? 0,
        null,
        currentPeriod,
      ),

      totalEmployeeCost: buildMetric(curSalary, prevSalary, currentPeriod, currency),
      revenuePerEmployee: buildMetric(curRevenuePerEmp, prevRevenuePerEmp, currentPeriod, currency),
      profitPerEmployee: buildMetric(curProfitPerEmp, prevProfitPerEmp, currentPeriod, currency),
      employeeCount: buildMetric(curEmpCount, prevEmpCount, currentPeriod),

      cashInflow: buildMetric(curRevenue, prevRevenue, currentPeriod, currency),
      cashOutflow: buildMetric(curExpenses, prevExpenses, currentPeriod, currency),
      netCashFlow: buildMetric(curRevenue - curExpenses, prevRevenue - prevExpenses, currentPeriod, currency),
      burnRate: buildMetric(curBurnRate, prevBurnRate, currentPeriod, currency),
      runway: buildMetric(
        curRunway === Infinity ? -1 : curRunway,
        prevRunway === Infinity ? -1 : prevRunway,
        currentPeriod,
      ),

      calculatedAt: new Date().toISOString(),
      businessId,
      period: currentPeriod,
      previousPeriod: prevPeriod,
    };
  }

  /**
   * Get a single metric by key for a business.
   * Useful when AI or other services need just one number.
   */
  async getMetric(
    businessId: string,
    metricKey: keyof Omit<BusinessMetricsSnapshot, 'calculatedAt' | 'businessId' | 'period' | 'previousPeriod'>,
    period?: MetricPeriod,
  ): Promise<MetricValue> {
    const snapshot = await this.getSnapshot(businessId, period);
    return snapshot[metricKey] as MetricValue;
  }

  /**
   * Returns a breakdown of expenses by category for a given period.
   */
  async getExpenseBreakdown(businessId: string, period?: MetricPeriod) {
    const now = new Date();
    const p: MetricPeriod = period ?? {
      startDate: new Date(now.getFullYear(), now.getMonth(), 1),
      endDate: now,
    };

    const breakdown = await prisma.expense.groupBy({
      by: ['category'],
      where: { businessId, date: { gte: p.startDate, lte: p.endDate } },
      _sum: { amount: true },
      orderBy: { _sum: { amount: 'desc' } },
    });

    const total = breakdown.reduce((acc, b) => acc + toNumber(b._sum.amount), 0);

    return breakdown.map((b) => ({
      category: b.category,
      amount: toNumber(b._sum.amount),
      percentage: total > 0 ? Math.round((toNumber(b._sum.amount) / total) * 10000) / 100 : 0,
    }));
  }

  /**
   * Returns a breakdown of revenue by product for a given period.
   */
  async getRevenueByProduct(businessId: string, period?: MetricPeriod) {
    const now = new Date();
    const p: MetricPeriod = period ?? {
      startDate: new Date(now.getFullYear(), now.getMonth(), 1),
      endDate: now,
    };

    const breakdown = await prisma.sale.groupBy({
      by: ['productId'],
      where: { businessId, date: { gte: p.startDate, lte: p.endDate }, productId: { not: null } },
      _sum: { totalAmount: true },
      _count: true,
      orderBy: { _sum: { totalAmount: 'desc' } },
    });

    // Fetch product names
    const productIds = breakdown.map((b) => b.productId).filter(Boolean) as string[];
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
      select: { id: true, name: true, category: true },
    });
    const productMap = new Map(products.map((p) => [p.id, p]));

    const total = breakdown.reduce((acc, b) => acc + toNumber(b._sum.totalAmount), 0);

    return breakdown.map((b) => ({
      productId: b.productId,
      productName: productMap.get(b.productId!)?.name ?? 'Unknown',
      productCategory: productMap.get(b.productId!)?.category ?? null,
      revenue: toNumber(b._sum.totalAmount),
      salesCount: b._count,
      percentage: total > 0 ? Math.round((toNumber(b._sum.totalAmount) / total) * 10000) / 100 : 0,
    }));
  }

  /**
   * Returns monthly time-series data for revenue and expenses.
   * This is the primary data source for trend charts and forecasting input.
   *
   * @param months - Number of trailing months to include (default 12)
   */
  async getMonthlyTimeSeries(businessId: string, months: number = 12) {
    const now = new Date();
    const startDate = new Date(now.getFullYear(), now.getMonth() - months + 1, 1);

    const [salesByMonth, expensesByMonth] = await Promise.all([
      prisma.$queryRaw<{ month: string; total: number }[]>`
        SELECT to_char(date, 'YYYY-MM') AS month, SUM("totalAmount"::numeric) AS total
        FROM sales
        WHERE "businessId" = ${businessId} AND date >= ${startDate}
        GROUP BY month
        ORDER BY month ASC
      `,
      prisma.$queryRaw<{ month: string; total: number }[]>`
        SELECT to_char(date, 'YYYY-MM') AS month, SUM(amount::numeric) AS total
        FROM expenses
        WHERE "businessId" = ${businessId} AND date >= ${startDate}
        GROUP BY month
        ORDER BY month ASC
      `,
    ]);

    // Merge into a unified time-series
    const monthSet = new Set<string>();
    salesByMonth.forEach((r) => monthSet.add(r.month));
    expensesByMonth.forEach((r) => monthSet.add(r.month));

    const salesMap = new Map(salesByMonth.map((r) => [r.month, Number(r.total)]));
    const expensesMap = new Map(expensesByMonth.map((r) => [r.month, Number(r.total)]));

    const series = Array.from(monthSet)
      .sort()
      .map((month) => {
        const revenue = salesMap.get(month) ?? 0;
        const expenses = expensesMap.get(month) ?? 0;
        return {
          month,
          revenue: Math.round(revenue * 100) / 100,
          expenses: Math.round(expenses * 100) / 100,
          profit: Math.round((revenue - expenses) * 100) / 100,
          margin: revenue > 0 ? Math.round(((revenue - expenses) / revenue) * 10000) / 100 : 0,
        };
      });

    return series;
  }
}

export const metricsService = new MetricsService();
