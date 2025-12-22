import { Request, Response, NextFunction } from "express";
import { AppError } from "../common/errors";
import { fail } from "../common/response";

export function errorHandler(
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  if (err instanceof AppError)
    return fail(res, err.status, err.message, err.details);
  console.error(err);
  return fail(res, 500, "Internal server error");
}
