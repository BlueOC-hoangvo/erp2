import type { Request, Response, NextFunction } from "express";
import { ok } from "../../common/response";
import { ItemsService } from "./items.service";

type VReq = Request & { validated?: any };

export class ItemsController {
  static async list(req: VReq, res: Response, next: NextFunction) {
    try {
      return ok(res, await ItemsService.list(req.validated.query));
    } catch (e) {
      return next(e);
    }
  }

  static async get(req: VReq, res: Response, next: NextFunction) {
    try {
      const id: bigint = req.validated.params.id;
      return ok(res, await ItemsService.get(id));
    } catch (e) {
      return next(e);
    }
  }

  static async create(req: VReq, res: Response, next: NextFunction) {
    try {
      return ok(res, await ItemsService.create(req.validated.body));
    } catch (e) {
      return next(e);
    }
  }

  static async update(req: VReq, res: Response, next: NextFunction) {
    try {
      const id: bigint = req.validated.params.id;
      return ok(res, await ItemsService.update(id, req.validated.body));
    } catch (e) {
      return next(e);
    }
  }

  static async remove(req: VReq, res: Response, next: NextFunction) {
    try {
      const id: bigint = req.validated.params.id;
      return ok(res, await ItemsService.remove(id));
    } catch (e) {
      return next(e);
    }
  }
}
