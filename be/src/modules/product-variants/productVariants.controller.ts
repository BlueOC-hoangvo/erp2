import type { Request, Response, NextFunction } from "express";
import { ok } from "../../common/response";
import { ProductVariantsService } from "./productVariants.service";

type VReq = Request & { validated?: any };

export class ProductVariantsController {
  static async list(req: VReq, res: Response, next: NextFunction) {
    try {
      return ok(res, await ProductVariantsService.list(req.validated.query));
    } catch (e) {
      return next(e);
    }
  }
  static async get(req: VReq, res: Response, next: NextFunction) {
    try {
      return ok(res, await ProductVariantsService.get(req.validated.params.id));
    } catch (e) {
      return next(e);
    }
  }
  static async create(req: VReq, res: Response, next: NextFunction) {
    try {
      return ok(res, await ProductVariantsService.create(req.validated.body));
    } catch (e) {
      return next(e);
    }
  }
  static async update(req: VReq, res: Response, next: NextFunction) {
    try {
      return ok(res, await ProductVariantsService.update(req.validated.params.id, req.validated.body));
    } catch (e) {
      return next(e);
    }
  }
  static async remove(req: VReq, res: Response, next: NextFunction) {
    try {
      return ok(res, await ProductVariantsService.remove(req.validated.params.id));
    } catch (e) {
      return next(e);
    }
  }
}
