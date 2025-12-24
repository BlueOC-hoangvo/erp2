import type { Request, Response, NextFunction } from "express";
import { ok } from "../../common/response";
import { SalesOrdersService } from "./salesOrders.service";

export class SalesOrdersController {
  static async list(req: Request, res: Response, next: NextFunction) {
    try {
      return ok(res, await SalesOrdersService.list(req.validated!.query));
    } catch (e) {
      return next(e);
    }
  }

  static async get(req: Request, res: Response, next: NextFunction) {
    try {
      return ok(res, await SalesOrdersService.get(req.validated!.params.id));
    } catch (e) {
      return next(e);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const userId: bigint | null = req.user?.id ?? null;
      return ok(res, await SalesOrdersService.create(userId, req.validated!.body));
    } catch (e) {
      return next(e);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const userId: bigint | null = req.user?.id ?? null;
      return ok(res, await SalesOrdersService.update(req.validated!.params.id, userId, req.validated!.body));
    } catch (e) {
      return next(e);
    }
  }

  static async remove(req: Request, res: Response, next: NextFunction) {
    try {
      return ok(res, await SalesOrdersService.remove(req.validated!.params.id));
    } catch (e) {
      return next(e);
    }
  }
  static async confirm(req: Request, res: Response, next: NextFunction) {
    try { return ok(res, await SalesOrdersService.confirm(req.validated!.params.id)); }
    catch (e) { return next(e); }
  }
  
  static async cancel(req: Request, res: Response, next: NextFunction) {
    try { return ok(res, await SalesOrdersService.cancel(req.validated!.params.id)); }
    catch (e) { return next(e); }
  }
  
}
