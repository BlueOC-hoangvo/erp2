import type { Request, Response, NextFunction } from "express";
import { ok } from "../../common/response";
import { ColorsService } from "./colors.service";

type VReq = Request & { validated?: any };

export class ColorsController {
  static async list(req: VReq, res: Response, next: NextFunction) {
    try {
      return ok(res, await ColorsService.list(req.validated.query));
    } catch (e) {
      return next(e);
    }
  }
  static async get(req: VReq, res: Response, next: NextFunction) {
    try {
      return ok(res, await ColorsService.get(req.validated.params.id));
    } catch (e) {
      return next(e);
    }
  }
  static async create(req: VReq, res: Response, next: NextFunction) {
    try {
      return ok(res, await ColorsService.create(req.validated.body));
    } catch (e) {
      return next(e);
    }
  }
  static async update(req: VReq, res: Response, next: NextFunction) {
    try {
      return ok(res, await ColorsService.update(req.validated.params.id, req.validated.body));
    } catch (e) {
      return next(e);
    }
  }
  static async remove(req: VReq, res: Response, next: NextFunction) {
    try {
      return ok(res, await ColorsService.remove(req.validated.params.id));
    } catch (e) {
      return next(e);
    }
  }
}
