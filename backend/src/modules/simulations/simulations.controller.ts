import { Request, Response, NextFunction } from 'express';
import { simulationsService } from './simulations.service.js';
import { SuccessResponse } from '../../utils/response.js';

export class SimulationsController {
  
  /**
   * Extract a decision from natural language
   */
  async extractDecision(req: Request, res: Response, next: NextFunction) {
    try {
      const { text } = req.body;
      const businessId = req.params.businessId;

      const extracted = await simulationsService.extractDecision(businessId, text);
      
      // Save it as a draft automatically
      const decision = await simulationsService.createDecision(businessId, extracted);

      return res.status(200).json(
        new SuccessResponse('Decision extracted successfully', { decision })
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Run the simulation (Best/Expected/Worst scenarios)
   */
  async runSimulation(req: Request, res: Response, next: NextFunction) {
    try {
      const decisionId = req.params.decisionId;
      const result = await simulationsService.runSimulation(decisionId);

      return res.status(200).json(
        new SuccessResponse('Simulation completed successfully', result)
      );
    } catch (error) {
      next(error);
    }
  }

}

export const simulationsController = new SimulationsController();
