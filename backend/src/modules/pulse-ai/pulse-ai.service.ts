import OpenAI from 'openai';
import { env } from '../../config/env.js';
import prisma from '../../config/database.js';
import { metricsService } from '../metrics/metrics.service.js';
import { dataQualityService } from '../data-quality/data-quality.service.js';
import { NotFoundError, BadRequestError } from '../../utils/errors.js';

// ─── Types ────────────────────────────────────────────────

export interface PulseAiResponse {
  answer: string;
  metricsContext: {
    revenue: number;
    expenses: number;
    netProfit: number;
    grossMargin: number;
    netProfitMargin: number;
    employeeCount: number;
    revenuePerEmployee: number;
  };
  dataQuality: {
    score: number;
    grade: string;
    reliabilityNote: string;
  };
  confidence: 'HIGH' | 'MEDIUM' | 'LOW';
}

// ─── Service ──────────────────────────────────────────────

export class PulseAiService {
  private openai: OpenAI | null = null;

  constructor() {
    if (env.OPENAI_API_KEY) {
      this.openai = new OpenAI({ apiKey: env.OPENAI_API_KEY });
    }
  }

  /**
   * Ask a business-related question.
   * Pulls canonical metrics + data quality and provides grounded context to the LLM.
   */
  async askQuestion(businessId: string, question: string): Promise<PulseAiResponse> {
    if (!this.openai) {
      throw new BadRequestError('OpenAI API key is not configured. Set OPENAI_API_KEY in your environment.');
    }

    // 1. Fetch business info
    const business = await prisma.business.findUnique({
      where: { id: businessId },
      select: { name: true, industry: true, currency: true },
    });
    if (!business) throw new NotFoundError('Business not found');

    // 2. Pull canonical metrics (single source of truth)
    const [metrics, dataQuality, expenseBreakdown, topProducts] = await Promise.all([
      metricsService.getSnapshot(businessId),
      dataQualityService.evaluate(businessId),
      metricsService.getExpenseBreakdown(businessId),
      metricsService.getRevenueByProduct(businessId),
    ]);

    // 3. Determine confidence based on data quality
    let confidence: 'HIGH' | 'MEDIUM' | 'LOW';
    if (dataQuality.score >= 75) confidence = 'HIGH';
    else if (dataQuality.score >= 50) confidence = 'MEDIUM';
    else confidence = 'LOW';

    // 4. Build grounded system prompt
    const systemPrompt = `You are Pulse AI, an expert business analyst and financial advisor for BusinessPulse AI.
You are analyzing "${business.name}" in the ${business.industry} industry.

═══ CANONICAL BUSINESS METRICS (Current Period) ═══
Currency: ${business.currency}
Revenue: ${business.currency} ${metrics.totalRevenue.value.toLocaleString()} (${metrics.totalRevenue.trend === 'up' ? '↑' : metrics.totalRevenue.trend === 'down' ? '↓' : '→'} ${metrics.totalRevenue.changePercent ?? 0}% vs previous period)
Total Expenses: ${business.currency} ${metrics.totalExpenses.value.toLocaleString()} (${metrics.totalExpenses.trend === 'up' ? '↑' : metrics.totalExpenses.trend === 'down' ? '↓' : '→'} ${metrics.totalExpenses.changePercent ?? 0}%)
Gross Profit: ${business.currency} ${metrics.grossProfit.value.toLocaleString()} | Margin: ${metrics.grossMargin.value}%
Net Profit: ${business.currency} ${metrics.netProfit.value.toLocaleString()} | Margin: ${metrics.netProfitMargin.value}%
Sales Count: ${metrics.totalSalesCount.value} | Avg Order Value: ${business.currency} ${metrics.averageOrderValue.value.toLocaleString()}
Employees: ${metrics.employeeCount.value} | Revenue/Employee: ${business.currency} ${metrics.revenuePerEmployee.value.toLocaleString()}
Employee Cost: ${business.currency} ${metrics.totalEmployeeCost.value.toLocaleString()}
Net Cash Flow: ${business.currency} ${metrics.netCashFlow.value.toLocaleString()}

═══ EXPENSE BREAKDOWN ═══
${expenseBreakdown.slice(0, 5).map((e) => `${e.category}: ${business.currency} ${e.amount.toLocaleString()} (${e.percentage}%)`).join('\n')}

═══ TOP PRODUCTS BY REVENUE ═══
${topProducts.slice(0, 5).map((p) => `${p.productName}: ${business.currency} ${p.revenue.toLocaleString()} (${p.percentage}% of total)`).join('\n')}

═══ DATA QUALITY ═══
Score: ${dataQuality.score}/100 (${dataQuality.grade})
${dataQuality.forecastReliabilityNote}
${dataQuality.issues.length > 0 ? `Issues: ${dataQuality.issues.slice(0, 3).map((i) => i.message).join('; ')}` : 'No issues detected.'}

═══ RULES ═══
1. Your response must be grounded in the metrics above. NEVER invent financial numbers.
2. When asked for predictions or forecasts, clearly state they are estimates and recommend using the Decision Simulator for precise scenario analysis.
3. Always include a confidence assessment based on data quality.
4. Structure your response with: Direct Answer → Key Metrics → Explanation → Risks → Suggested Action.
5. Keep responses concise and actionable. Use bullet points where appropriate.
6. If the data quality is below 60, proactively warn that insights may be less reliable.`;

    // 5. Call OpenAI
    const response = await this.openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: question },
      ],
      temperature: 0.2,
      max_tokens: 1000,
    });

    return {
      answer: response.choices[0]?.message.content ?? 'Unable to generate a response.',
      metricsContext: {
        revenue: metrics.totalRevenue.value,
        expenses: metrics.totalExpenses.value,
        netProfit: metrics.netProfit.value,
        grossMargin: metrics.grossMargin.value,
        netProfitMargin: metrics.netProfitMargin.value,
        employeeCount: metrics.employeeCount.value,
        revenuePerEmployee: metrics.revenuePerEmployee.value,
      },
      dataQuality: {
        score: dataQuality.score,
        grade: dataQuality.grade,
        reliabilityNote: dataQuality.forecastReliabilityNote,
      },
      confidence,
    };
  }
}

export const pulseAiService = new PulseAiService();
