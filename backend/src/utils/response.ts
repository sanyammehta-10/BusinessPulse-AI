import { Response } from 'express';

export function sendSuccess<T>(
  res: Response,
  data: T,
  message: string = 'Success',
  statusCode: number = 200,
) {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
}

export function sendCreated<T>(res: Response, data: T, message: string = 'Created') {
  return sendSuccess(res, data, message, 201);
}

export function sendPaginated<T>(
  res: Response,
  data: T[],
  total: number,
  page: number,
  limit: number,
  message: string = 'Success',
) {
  return res.status(200).json({
    success: true,
    message,
    data,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasMore: page * limit < total,
    },
  });
}

export function sendNoContent(res: Response) {
  return res.status(204).send();
}
