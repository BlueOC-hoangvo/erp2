import type { Request, Response, NextFunction } from "express";
import { ok } from "../../common/response";
import { BomsService } from "./boms.service";

export class BomsController {
  static async list(req: Request, res: Response, next: NextFunction) {
    try { return ok(res, await BomsService.list(req.validated!.query)); }
    catch (e) { return next(e); }
  }

  static async get(req: Request, res: Response, next: NextFunction) {
    try { return ok(res, await BomsService.get(req.validated!.params.id)); }
    catch (e) { return next(e); }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try { return ok(res, await BomsService.create(req.validated!.body)); }
    catch (e) { return next(e); }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try { return ok(res, await BomsService.update(req.validated!.params.id, req.validated!.body)); }
    catch (e) { return next(e); }
  }

  static async remove(req: Request, res: Response, next: NextFunction) {
    try { return ok(res, await BomsService.remove(req.validated!.params.id)); }
    catch (e) { return next(e); }
  }
}
