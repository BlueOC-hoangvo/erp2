import type { Request, Response, NextFunction } from "express";
import { ok } from "../../common/response";
import { StockMovesService } from "./stockMoves.service";

export class StockMovesController {
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const userId: bigint | null = req.user?.id ?? null;
      const data = await StockMovesService.create(userId, req.validated!.body);
      return ok(res, data);
    } catch (e) {
      return next(e);
    }
  }

  static async post(req: Request, res: Response, next: NextFunction) {
    try {
      const id: bigint = req.validated!.params.id;
      const data = await StockMovesService.post(id);
      return ok(res, data);
    } catch (e) {
      return next(e);
    }
  }
  static async list(req: Request, res: Response, next: NextFunction) {
    try {
      return ok(res, await StockMovesService.list(req.validated!.query));
    } catch (e) {
      return next(e);
    }
  }

  static async get(req: Request, res: Response, next: NextFunction) {
    try {
      return ok(res, await StockMovesService.get(req.validated!.params.id));
    } catch (e) {
      return next(e);
    }
  }
}
