// ─────────────────────────────────────────────────────────────
// BusinessPulse AI — Data Quality Engine
// ─────────────────────────────────────────────────────────────
// Evaluates the quality & completeness of business data.
// The resulting score (0–100) is used to:
//   1. Communicate forecast reliability to the user
//   2. Adjust AI confidence levels
//   3. Prompt the user to improve their data
// ─────────────────────────────────────────────────────────────

import prisma from '../../config/database.js';

// ─── Types ────────────────────────────────────────────────

export interface DataQualityIssue {
  type: 'MISSING_DATA' | 'DUPLICATE' | 'OUTDATED' | 'INCOMPLETE' | 'INCONSISTENT';
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
  message: string;
  /** How many points this issue deducts from the score */
  deduction: number;
}

export interface DataQualityReport {
  score: number; // 0–100
  grade: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR' | 'CRITICAL';
  issues: DataQualityIssue[];
  summary: {
    totalSalesRecords: number;
    totalExpenseRecords: number;
    totalProducts: number;
    totalEmployees: number;
    totalLocations: number;
    monthsOfSalesHistory: number;
    monthsOfExpenseHistory: number;
    dataStartDate: Date | null;
    dataEndDate: Date | null;
  };
  /** A human-readable explanation of the score for the AI to use */
  forecastReliabilityNote: string;
  calculatedAt: string;
  businessId: string;
}

// ─── Helpers ──────────────────────────────────────────────

function getGrade(score: number): DataQualityReport['grade'] {
  if (score >= 90) return 'EXCELLENT';
  if (score >= 75) return 'GOOD';
  if (score >= 55) return 'FAIR';
  if (score >= 30) return 'POOR';
  return 'CRITICAL';
}

function monthsBetween(start: Date, end: Date): number {
  return (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
}

// ─── Service ──────────────────────────────────────────────

export class DataQualityService {

  async evaluate(businessId: string): Promise<DataQualityReport> {
    const issues: DataQualityIssue[] = [];
    let score = 100;
    const now = new Date();

    // ─── Fetch counts and date ranges ───────────────────
    const [
      salesCount,
      expenseCount,
      productCount,
      employeeCount,
      locationCount,
      oldestSale,
      newestSale,
      oldestExpense,
      newestExpense,
      salesWithoutProduct,
      salesWithoutLocation,
      expensesWithoutCategory,
      duplicateSalesCheck,
    ] = await Promise.all([
      prisma.sale.count({ where: { businessId } }),
      prisma.expense.count({ where: { businessId } }),
      prisma.product.count({ where: { businessId, isActive: true } }),
      prisma.employee.count({ where: { businessId, isActive: true } }),
      prisma.location.count({ where: { businessId, isActive: true } }),
      prisma.sale.findFirst({ where: { businessId }, orderBy: { date: 'asc' }, select: { date: true } }),
      prisma.sale.findFirst({ where: { businessId }, orderBy: { date: 'desc' }, select: { date: true } }),
      prisma.expense.findFirst({ where: { businessId }, orderBy: { date: 'asc' }, select: { date: true } }),
      prisma.expense.findFirst({ where: { businessId }, orderBy: { date: 'desc' }, select: { date: true } }),
      prisma.sale.count({ where: { businessId, productId: null } }),
      prisma.sale.count({ where: { businessId, locationId: null } }),
      prisma.expense.count({ where: { businessId, category: '' } }),
      // Check for potential duplicate sales (same date, product, quantity, amount)
      prisma.$queryRaw<{ duplicate_count: bigint }[]>`
        SELECT COUNT(*) as duplicate_count FROM (
          SELECT date, "productId", quantity, "totalAmount", COUNT(*) as cnt
          FROM sales
          WHERE "businessId" = ${businessId}
          GROUP BY date, "productId", quantity, "totalAmount"
          HAVING COUNT(*) > 1
        ) AS dupes
      `,
    ]);

    const duplicateCount = Number(duplicateSalesCheck[0]?.duplicate_count ?? 0);
    const salesMonths = oldestSale && newestSale
      ? monthsBetween(oldestSale.date, newestSale.date) + 1
      : 0;
    const expenseMonths = oldestExpense && newestExpense
      ? monthsBetween(oldestExpense.date, newestExpense.date) + 1
      : 0;

    // ─── Check: No sales data ───────────────────────────
    if (salesCount === 0) {
      issues.push({
        type: 'MISSING_DATA',
        severity: 'HIGH',
        message: 'No sales data available. Upload or enter your sales records to get started.',
        deduction: 30,
      });
      score -= 30;
    }

    // ─── Check: No expense data ─────────────────────────
    if (expenseCount === 0) {
      issues.push({
        type: 'MISSING_DATA',
        severity: 'HIGH',
        message: 'No expense data available. Upload or enter your expense records.',
        deduction: 25,
      });
      score -= 25;
    }

    // ─── Check: Insufficient history ────────────────────
    if (salesCount > 0 && salesMonths < 3) {
      issues.push({
        type: 'INCOMPLETE',
        severity: 'MEDIUM',
        message: `Only ${salesMonths} month(s) of sales history available. At least 3 months needed for reliable trends. 6+ months recommended for forecasting.`,
        deduction: 15,
      });
      score -= 15;
    } else if (salesCount > 0 && salesMonths < 6) {
      issues.push({
        type: 'INCOMPLETE',
        severity: 'LOW',
        message: `${salesMonths} months of sales history available. 6+ months recommended for accurate forecasting.`,
        deduction: 5,
      });
      score -= 5;
    }

    // ─── Check: No products ─────────────────────────────
    if (productCount === 0) {
      issues.push({
        type: 'MISSING_DATA',
        severity: 'MEDIUM',
        message: 'No products registered. Add your products for product-level analytics.',
        deduction: 5,
      });
      score -= 5;
    }

    // ─── Check: No employees ────────────────────────────
    if (employeeCount === 0) {
      issues.push({
        type: 'MISSING_DATA',
        severity: 'LOW',
        message: 'No employee records. Add employees for workforce-related metrics and simulations.',
        deduction: 3,
      });
      score -= 3;
    }

    // ─── Check: No locations ────────────────────────────
    if (locationCount === 0) {
      issues.push({
        type: 'MISSING_DATA',
        severity: 'LOW',
        message: 'No locations registered. Add business locations for location-level analytics.',
        deduction: 2,
      });
      score -= 2;
    }

    // ─── Check: Sales without product linkage ───────────
    if (salesCount > 0 && salesWithoutProduct > 0) {
      const pct = Math.round((salesWithoutProduct / salesCount) * 100);
      issues.push({
        type: 'INCOMPLETE',
        severity: pct > 50 ? 'HIGH' : 'MEDIUM',
        message: `${salesWithoutProduct} sales record(s) (${pct}%) are not linked to any product.`,
        deduction: Math.min(10, Math.ceil(pct / 10)),
      });
      score -= Math.min(10, Math.ceil(pct / 10));
    }

    // ─── Check: Sales without location linkage ──────────
    if (salesCount > 0 && salesWithoutLocation > 0) {
      const pct = Math.round((salesWithoutLocation / salesCount) * 100);
      if (pct > 30) {
        issues.push({
          type: 'INCOMPLETE',
          severity: 'LOW',
          message: `${salesWithoutLocation} sales record(s) (${pct}%) are not linked to any location.`,
          deduction: Math.min(5, Math.ceil(pct / 20)),
        });
        score -= Math.min(5, Math.ceil(pct / 20));
      }
    }

    // ─── Check: Duplicate sales ─────────────────────────
    if (duplicateCount > 0) {
      issues.push({
        type: 'DUPLICATE',
        severity: duplicateCount > 20 ? 'HIGH' : 'MEDIUM',
        message: `${duplicateCount} potential duplicate sales transaction(s) detected.`,
        deduction: Math.min(10, duplicateCount),
      });
      score -= Math.min(10, duplicateCount);
    }

    // ─── Check: Stale data ──────────────────────────────
    if (newestSale) {
      const daysSinceLastSale = Math.floor((now.getTime() - newestSale.date.getTime()) / (1000 * 60 * 60 * 24));
      if (daysSinceLastSale > 30) {
        issues.push({
          type: 'OUTDATED',
          severity: daysSinceLastSale > 90 ? 'HIGH' : 'MEDIUM',
          message: `Sales data is ${daysSinceLastSale} days old. Import recent sales for accurate analytics.`,
          deduction: daysSinceLastSale > 90 ? 15 : 8,
        });
        score -= daysSinceLastSale > 90 ? 15 : 8;
      }
    }

    // Clamp score
    score = Math.max(0, Math.min(100, score));
    const grade = getGrade(score);

    // Generate reliability note for AI consumption
    let forecastReliabilityNote: string;
    if (score >= 80) {
      forecastReliabilityNote = `Data quality is ${grade.toLowerCase()} (${score}/100). Forecasts and simulations should be reasonably reliable.`;
    } else if (score >= 55) {
      forecastReliabilityNote = `Data quality is ${grade.toLowerCase()} (${score}/100). Forecasts may have reduced accuracy. Key issues: ${issues.slice(0, 2).map((i) => i.message).join(' ')}`;
    } else {
      forecastReliabilityNote = `Data quality is ${grade.toLowerCase()} (${score}/100). Forecast confidence is significantly reduced due to data gaps. ${issues.slice(0, 3).map((i) => i.message).join(' ')}`;
    }

    const dataStartDate = oldestSale?.date ?? oldestExpense?.date ?? null;
    const dataEndDate = newestSale?.date ?? newestExpense?.date ?? null;

    return {
      score,
      grade,
      issues,
      summary: {
        totalSalesRecords: salesCount,
        totalExpenseRecords: expenseCount,
        totalProducts: productCount,
        totalEmployees: employeeCount,
        totalLocations: locationCount,
        monthsOfSalesHistory: salesMonths,
        monthsOfExpenseHistory: expenseMonths,
        dataStartDate,
        dataEndDate,
      },
      forecastReliabilityNote,
      calculatedAt: new Date().toISOString(),
      businessId,
    };
  }
}

export const dataQualityService = new DataQualityService();
