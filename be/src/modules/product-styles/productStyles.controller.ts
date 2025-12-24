import type { Request, Response, NextFunction } from "express";
import { ok } from "../../common/response";
import { ProductStylesService } from "./productStyles.service";

type VReq = Request & { validated?: any };

export class ProductStylesController {
  static async list(req: VReq, res: Response, next: NextFunction) {
    try {
      return ok(res, await ProductStylesService.list(req.validated.query));
    } catch (e) {
      return next(e);
    }
  }
  static async get(req: VReq, res: Response, next: NextFunction) {
    try {
      return ok(res, await ProductStylesService.get(req.validated.params.id));
    } catch (e) {
      return next(e);
    }
  }
  static async create(req: VReq, res: Response, next: NextFunction) {
    try {
      return ok(res, await ProductStylesService.create(req.validated.body));
    } catch (e) {
      return next(e);
    }
  }
  static async update(req: VReq, res: Response, next: NextFunction) {
    try {
      return ok(res, await ProductStylesService.update(req.validated.params.id, req.validated.body));
    } catch (e) {
      return next(e);
    }
  }
  static async remove(req: VReq, res: Response, next: NextFunction) {
    try {
      return ok(res, await ProductStylesService.remove(req.validated.params.id));
    } catch (e) {
      return next(e);
    }
  }
}
