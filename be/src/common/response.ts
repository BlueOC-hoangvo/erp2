import { Response } from "express";

export function ok(res: Response, data: any, meta?: any) {
  return res.json({ data, meta: meta ?? null, error: null });
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
