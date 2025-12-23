import { Response } from "express";

function safeStringify(obj: any): string {
  return JSON.stringify(obj, (key, value) => {
    // Convert BigInt to string
    if (typeof value === 'bigint') {
      return value.toString();
    }
    // Convert Date to ISO string
    if (value instanceof Date) {
      return value.toISOString();
    }
    // Handle Prisma Decimal objects
    if (value && typeof value === 'object' && value.constructor?.name === 'Decimal') {
      return value.toString();
    }
    return value;
  });
}

export function ok(res: Response, data: any, meta?: any) {
  try {
    const responseObj = { data, meta: meta ?? null, error: null };
    const jsonString = safeStringify(responseObj);
    return res.set('Content-Type', 'application/json').send(jsonString);
  } catch (error) {
    console.error('JSON serialization error:', error);
    return res.status(500).json({
      data: null,
      meta: null,
      error: { message: 'Internal server error during serialization' }
    });
  }
}

export function fail(
  res: Response,
  status: number,
  message: string,
  details?: any
) {
  return res.status(status).json({
    data: null,
    meta: null,
    error: { message, details: details ?? null },
  });
}
