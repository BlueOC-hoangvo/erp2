import type { Request, Response, NextFunction } from "express";
import { ok } from "../../common/response";
import { InventoryService } from "./inventory.service";

export class InventoryController {
  static async onhand(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await InventoryService.onhand(req.validated!.query);
      return ok(res, data);
    } catch (e) {
      return next(e);
    }
  }
  static async ledger(req: Request, res: Response, next: NextFunction) {
    try {
      return ok(res, await InventoryService.ledger(req.validated!.query));
    } catch (e) {
      return next(e);
    }
  }
}

