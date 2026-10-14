import { Request, Response, NextFunction } from 'express';
import { importService } from './import.service.js';
import { BadRequestError } from '../../utils/errors.js';
import { sendSuccess } from '../../utils/response.js';
import path from 'path';

export class ImportController {

  async uploadSalesData(req: Request, res: Response, next: NextFunction) {
    try {
      const file = req.file;
      const businessId = req.params.businessId as string;

      if (!file) {
        throw new BadRequestError('No file uploaded');
      }

      if (!businessId) {
        throw new BadRequestError('Business ID is missing from request');
      }

      const fileExt = path.extname(file.originalname).toLowerCase();
      if (fileExt !== '.csv') {
        throw new BadRequestError('Only CSV files are supported currently. XLSX support coming soon.');
      }

      // Initialize import record
      const importRecord = await importService.initializeImport(
        businessId,
        file.originalname,
        'CSV',
        'SALES',
      );

      // Start background processing (fire-and-forget; later will be moved to BullMQ)
      importService.processSalesCSV(importRecord.id, file.path)
        .then((result) => {
          console.log(`[Import] ${importRecord.id} finished successfully`, result);
        })
        .catch((err) => {
          console.error(`[Import] ${importRecord.id} failed`, err);
        });

      sendSuccess(res, { importId: importRecord.id }, 'File uploaded successfully and is being processed.');
    } catch (error) {
      next(error);
    }
  }
}

export const importController = new ImportController();
