import type { Request, Response, NextFunction } from "express";
import { ok } from "../../common/response";
import { SuppliersService } from "./suppliers.service";

type VReq = Request & { validated?: any };

export class SuppliersController {
  static async list(req: VReq, res: Response, next: NextFunction) {
    try {
      return ok(res, await SuppliersService.list(req.validated.query));
    } catch (e) {
      return next(e);
    }
  }

  static async get(req: VReq, res: Response, next: NextFunction) {
    try {
      const id: bigint = req.validated.params.id;
      return ok(res, await SuppliersService.get(id));
    } catch (e) {
      return next(e);
    }
  }

  static async create(req: VReq, res: Response, next: NextFunction) {
    try {
      return ok(res, await SuppliersService.create(req.validated.body));
    } catch (e) {
      return next(e);
    }
  }

  static async update(req: VReq, res: Response, next: NextFunction) {
    try {
      const id: bigint = req.validated.params.id;
      return ok(res, await SuppliersService.update(id, req.validated.body));
    } catch (e) {
      return next(e);
    }
  }

  static async remove(req: VReq, res: Response, next: NextFunction) {
    try {
      const id: bigint = req.validated.params.id;
      return ok(res, await SuppliersService.remove(id));
    } catch (e) {
      return next(e);
    }
  }
}
