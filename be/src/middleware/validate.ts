import type { Request, Response, NextFunction } from "express";
import type { ZodTypeAny } from "zod";
import { E } from "../common/errors";

export const validate =
  (schema: ZodTypeAny, target: "body" | "query" | "params" = "body") =>
  (req: Request & { validated?: any }, _res: Response, next: NextFunction) => {
    const result = schema.safeParse((req as any)[target]);

    if (!result.success) {
      return next(E.badRequest("Validation error", result.error.flatten()));
    }

    req.validated ??= {};
    req.validated[target] = result.data; // ✅ an toàn

    next();
  };
