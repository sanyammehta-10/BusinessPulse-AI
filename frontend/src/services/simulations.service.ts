import api from '@/lib/api-client';

export interface ExtractedDecision {
  type: string;
  title: string;
  parameters: Record<string, any>;
  confidence: number;
}

export interface SimulationImpact {
  month: number;
  revenue_change: number;
  expense_change: number;
  profit_change: number;
}

export interface SimulationResult {
  simulation: {
    id: string;
    riskScore: number;
    riskLevel: string;
    riskFactors: string[];
    breakEvenMonths: number;
  };
  expectedData: {
    impacts: SimulationImpact[];
  };
  bestData: {
    impacts: SimulationImpact[];
  };
  worstData: {
    impacts: SimulationImpact[];
  };
}

export const simulationsService = {
  extractDecision: async (businessId: string, text: string) => {
    const { data } = await api.post(`/businesses/${businessId}/simulations/extract`, { text });
    return data.data; // { decision: { id, type, parameters, ... } }
  },

  runSimulation: async (decisionId: string): Promise<SimulationResult> => {
    const { data } = await api.post(`/simulations/${decisionId}/run`);
    return data.data;
  },
};
