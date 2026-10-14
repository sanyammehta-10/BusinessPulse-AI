import fs from 'fs';
import * as fastCsv from 'fast-csv';
import prisma from '../../config/database.js';
import { BadRequestError, NotFoundError } from '../../utils/errors.js';
import { ImportStatus } from '@prisma/client';

export class ImportService {
  /**
   * Initializes an import record in the database
   */
  async initializeImport(businessId: string, fileName: string, fileType: string, dataType: string) {
    return prisma.dataImport.create({
      data: {
        businessId,
        fileName,
        fileType,
        dataType,
        status: ImportStatus.PENDING,
      },
    });
  }

  /**
   * Parses and validates a CSV file for Sales data
   * In a production scenario, this should be moved to a BullMQ worker
   */
  async processSalesCSV(importId: string, filePath: string) {
    const importRecord = await prisma.dataImport.findUnique({ where: { id: importId } });
    if (!importRecord) throw new NotFoundError('Import record not found');

    await prisma.dataImport.update({
      where: { id: importId },
      data: { status: ImportStatus.PROCESSING },
    });

    const validRows: any[] = [];
    const errorLog: any[] = [];
    let rowCount = 0;

    return new Promise((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(fastCsv.parse({ headers: true, ignoreEmpty: true, trim: true }))
        .on('data', (row) => {
          rowCount++;
          // Basic Validation for Sales
          const date = new Date(row.date || row.Date);
          const quantity = parseFloat(row.quantity || row.Quantity);
          const unitPrice = parseFloat(row.unitPrice || row.UnitPrice || row.price || row.Price);
          const totalAmount = parseFloat(row.totalAmount || row.TotalAmount || row.total || row.Total);

          if (isNaN(date.getTime()) || isNaN(quantity) || isNaN(unitPrice)) {
            errorLog.push({ row: rowCount, data: row, error: 'Invalid data format (date, quantity, or unitPrice)' });
            return;
          }

          validRows.push({
            businessId: importRecord.businessId,
            date,
            quantity,
            unitPrice,
            totalAmount: isNaN(totalAmount) ? quantity * unitPrice : totalAmount,
            customerCategory: row.customerCategory || row.CustomerCategory || null,
          });
        })
        .on('error', async (error) => {
          await prisma.dataImport.update({
            where: { id: importId },
            data: { status: ImportStatus.FAILED, errorLog: [{ error: error.message }] },
          });
          reject(error);
        })
        .on('end', async () => {
          try {
            // Bulk insert valid rows
            if (validRows.length > 0) {
              // Note: Prisma createMany doesn't return inserted IDs, but it's fast
              await prisma.sale.createMany({
                data: validRows,
                skipDuplicates: true,
              });
            }

            await prisma.dataImport.update({
              where: { id: importId },
              data: {
                status: ImportStatus.COMPLETED,
                rowCount: validRows.length,
                errorCount: errorLog.length,
                errorLog: errorLog.length > 0 ? errorLog : [],
                completedAt: new Date(),
              },
            });

            resolve({ success: true, processed: rowCount, inserted: validRows.length, errors: errorLog.length });
          } catch (err: any) {
            await prisma.dataImport.update({
              where: { id: importId },
              data: { status: ImportStatus.FAILED, errorLog: [{ error: err.message }] },
            });
            reject(err);
          } finally {
            // Cleanup uploaded file
            if (fs.existsSync(filePath)) {
              fs.unlinkSync(filePath);
            }
          }
        });
    });
  }
}

export const importService = new ImportService();
