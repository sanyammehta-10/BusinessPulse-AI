import OpenAI from 'openai';
import { env } from '../../config/env.js';
import prisma from '../../config/database.js';
import { NotFoundError, BadRequestError } from '../../utils/errors.js';
import { DecisionType, DecisionStatus, RiskLevel, ScenarioType, Prisma } from '@prisma/client';
import { metricsService } from '../metrics/metrics.service.js';
import axios from 'axios';

export interface ExtractedDecision {
  type: DecisionType;
  title: string;
  parameters: Record<string, any>;
  confidence: number;
}

export class SimulationsService {
  private openai: OpenAI | null = null;

  constructor() {
    if (env.OPENAI_API_KEY) {
      this.openai = new OpenAI({ apiKey: env.OPENAI_API_KEY });
    }
  }

  /**
   * Parse natural language input into a structured Decision object
   */
  async extractDecision(businessId: string, text: string): Promise<ExtractedDecision> {
    if (!this.openai) {
      throw new BadRequestError('OpenAI API key is not configured.');
    }

    const systemPrompt = `You are an expert business analyst AI for BusinessPulse AI.
Your job is to parse natural language queries from a business owner into a structured decision format.

Supported Decision Types:
- HIRING: User wants to hire staff. Parameters: { count: number, role: string, monthlyCostPerHire: number, startMonthOffset: number (default 1) }
- NEW_STORE: User wants to open a new location. Parameters: { location: string, upfrontCapex: number, monthlyOpex: number, expectedMonthlyRevenue: number, startMonthOffset: number }
- PRICE_CHANGE: User wants to change prices. Parameters: { productCategory: string, percentageChange: number, expectedVolumeChangePercentage: number }
- MARKETING: User wants to run a marketing campaign. Parameters: { campaignName: string, upfrontCost: number, durationMonths: number, expectedRoas: number }
- NEW_PRODUCT: User wants to launch a new product. Parameters: { productName: string, rdCost: number, launchMonthOffset: number, expectedMonthlyRevenue: number }

Return a JSON object EXACTLY in this format:
{
  "type": "HIRING" | "NEW_STORE" | "PRICE_CHANGE" | "MARKETING" | "NEW_PRODUCT",
  "title": "A short, concise title for the decision",
  "parameters": { ... },
  "confidence": 0.0 to 1.0
}

If the user query is vague, make reasonable assumptions for the parameters (e.g., if salary is missing for a hire, assume $5000/mo, or if upfront cost for marketing is missing, assume $10000). Always return valid JSON.`;

    const response = await this.openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: text },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.1,
    });

    const content = response.choices[0]?.message.content;
    if (!content) {
      throw new BadRequestError('Failed to extract decision. Model returned empty response.');
    }

    try {
      const parsed = JSON.parse(content) as ExtractedDecision;
      return parsed;
    } catch (error) {
      throw new BadRequestError('Failed to parse AI response into structured decision.');
    }
  }

  /**
   * Save the extracted decision as a DRAFT
   */
  async createDecision(businessId: string, data: ExtractedDecision) {
    return prisma.decision.create({
      data: {
        businessId,
        title: data.title,
        type: data.type,
        parameters: data.parameters,
        status: DecisionStatus.DRAFT,
      },
    });
  }

  /**
   * Run the simulation by calling the AI Service for Best/Expected/Worst cases.
   */
  async runSimulation(decisionId: string) {
    const decision = await prisma.decision.findUnique({ where: { id: decisionId } });
    if (!decision) throw new NotFoundError('Decision not found');

    const businessId = decision.businessId;
    const metrics = await metricsService.getSnapshot(businessId);
    const currentRev = metrics.totalRevenue.value;
    const currentExp = metrics.totalExpenses.value;

    const baseParams = decision.parameters as Record<string, any>;
    
    // Helper to call AI Service
    const callAi = async (params: Record<string, any>) => {
      const res = await axios.post(`${env.AI_SERVICE_URL || 'http://localhost:8000'}/simulate/decision`, {
        decision_type: decision.type,
        parameters: params,
        current_monthly_revenue: currentRev,
        current_monthly_expense: currentExp,
      });
      return res.data;
    };

    // 1. Expected Case (Baseline parameters)
    const expectedData = await callAi(baseParams);

    // 2. Best Case (Tweak parameters ~20% favorably)
    const bestParams = { ...baseParams };
    if (bestParams.expectedRoas) bestParams.expectedRoas *= 1.2;
    if (bestParams.expectedMonthlyRevenue) bestParams.expectedMonthlyRevenue *= 1.2;
    if (bestParams.monthlyCostPerHire) bestParams.monthlyCostPerHire *= 0.9;
    if (bestParams.upfrontCapex) bestParams.upfrontCapex *= 0.9;
    const bestData = await callAi(bestParams);

    // 3. Worst Case (Tweak parameters ~20% unfavorably)
    const worstParams = { ...baseParams };
    if (worstParams.expectedRoas) worstParams.expectedRoas *= 0.8;
    if (worstParams.expectedMonthlyRevenue) worstParams.expectedMonthlyRevenue *= 0.8;
    if (worstParams.monthlyCostPerHire) worstParams.monthlyCostPerHire *= 1.1;
    if (worstParams.upfrontCapex) worstParams.upfrontCapex *= 1.1;
    const worstData = await callAi(worstParams);

    // Save Simulation (using expected case for base numbers)
    let riskLevel = RiskLevel.LOW;
    if (worstData.risk_score >= 75) riskLevel = RiskLevel.HIGH;
    else if (worstData.risk_score >= 50) riskLevel = RiskLevel.MEDIUM;

    const simulation = await prisma.simulation.create({
      data: {
        decisionId,
        salesImpact: expectedData.impacts,
        expenseImpact: expectedData.impacts, // The python service currently bundles these in one array
        profitImpact: expectedData.impacts,
        revenueImpact: expectedData.impacts,
        breakEvenMonths: expectedData.break_even_month,
        riskScore: worstData.risk_score, // Use worst case risk score to be safe
        riskLevel,
        riskFactors: worstData.risk_factors,
        confidence: 0.85,
      }
    });

    // Helper to calculate totals from impacts array
    const calcTotals = (impacts: any[]) => {
      let rev = 0;
      let exp = 0;
      let prof = 0;
      impacts.forEach(i => {
        rev += i.revenue_change;
        exp += i.expense_change;
        prof += i.profit_change;
      });
      return { rev, exp, prof };
    };

    const expTotals = calcTotals(expectedData.impacts);
    const bestTotals = calcTotals(bestData.impacts);
    const worstTotals = calcTotals(worstData.impacts);

    // Save Scenarios
    await prisma.scenario.createMany({
      data: [
        {
          decisionId,
          type: ScenarioType.EXPECTED_CASE,
          salesGrowth: expTotals.rev,
          expenseGrowth: expTotals.exp,
          profitGrowth: expTotals.prof,
          revenueChange: expTotals.rev,
          assumptions: baseParams as Prisma.JsonObject,
          probability: 0.6,
        },
        {
          decisionId,
          type: ScenarioType.BEST_CASE,
          salesGrowth: bestTotals.rev,
          expenseGrowth: bestTotals.exp,
          profitGrowth: bestTotals.prof,
          revenueChange: bestTotals.rev,
          assumptions: bestParams as Prisma.JsonObject,
          probability: 0.2,
        },
        {
          decisionId,
          type: ScenarioType.WORST_CASE,
          salesGrowth: worstTotals.rev,
          expenseGrowth: worstTotals.exp,
          profitGrowth: worstTotals.prof,
          revenueChange: worstTotals.rev,
          assumptions: worstParams as Prisma.JsonObject,
          probability: 0.2,
        }
      ]
    });

    // Mark decision as completed
    await prisma.decision.update({
      where: { id: decisionId },
      data: { status: DecisionStatus.COMPLETED }
    });

    return { simulation, expectedData, bestData, worstData };
  }

}

export const simulationsService = new SimulationsService();
